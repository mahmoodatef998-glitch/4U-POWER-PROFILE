"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { STATUSES, VAT_RATE, totals, unprintable, type QuoteStatus } from "@/lib/quote";
import { MIGRATION_HINT, missingTable } from "@/lib/quote-data";
import { getAdminClient } from "@/lib/supabase/server";

const str = (max: number) => z.string().trim().max(max).default("");
const Payload = z.object({
  id: z.string().uuid().nullable(),
  lead_id: z.string().uuid().nullable(),
  quote_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date"),
  status: z.enum(STATUSES as [QuoteStatus, ...QuoteStatus[]]),
  customer: z.object({
    name: z.string().trim().min(1, "Customer name is required").max(200),
    address: str(300),
    trn: str(40),
    project: str(200),
    attention: str(120),
    contact: str(80),
    email: str(160),
    ref: str(120),
  }),
  sales: z.object({ person: str(80), contact: str(80), email: str(160) }),
  validity: str(80),
  notes: str(2000),
  items: z
    .array(
      z.object({
        code: str(40),
        title: z.string().trim().min(1, "Every line needs a title").max(300),
        description: str(4000),
        qty: z.coerce.number().positive("Quantity must be above 0").max(100000),
        unit: str(20).transform((u) => u || "Units"),
        unit_price: z.coerce.number().min(0, "Price can't be negative").max(1e9),
      }),
    )
    .min(1, "Add at least one item")
    .max(40),
});

export type SaveState = { error?: string } | null;

export async function saveQuote(_prev: SaveState, formData: FormData): Promise<SaveState> {
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { error: "Could not read the form." };
  }
  const parsed = Payload.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(" · ") };
  const d = parsed.data;

  // the PDF uses the standard fonts: anything they can't print (Arabic, emoji) is caught here, not on the PDF
  const fields: [string, string][] = [
    ...Object.entries(d.customer).map(([k, v]) => [`Customer ${k}`, v] as [string, string]),
    ...Object.entries(d.sales).map(([k, v]) => [`Sales ${k}`, v] as [string, string]),
    ["Validity", d.validity],
    ["Notes", d.notes],
    ...d.items.flatMap((it, i) => [[`Item ${i + 1} title`, it.title], [`Item ${i + 1} description`, it.description], [`Item ${i + 1} unit`, it.unit]] as [string, string][]),
  ];
  const bad = fields.map(([k, v]) => [k, unprintable(v)] as const).filter(([, c]) => c.length);
  if (bad.length) return { error: `Quotations are printed in English: retype these fields in English letters: ${bad.map(([k, c]) => (c.length > 5 ? k : `${k} (${c.join(" ")})`)).join(", ")}.` };

  const sb = getAdminClient();
  if (!sb) return { error: "Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY)." };
  const row = {
    quote_date: d.quote_date,
    status: d.status,
    customer: d.customer,
    sales: d.sales,
    items: d.items,
    validity: d.validity || null,
    notes: d.notes || null,
    vat_rate: VAT_RATE,
    ...totals(d.items, VAT_RATE),
    lead_id: d.lead_id,
  };
  const { data, error } = d.id
    ? await sb.from("quotations").update(row).eq("id", d.id).select("id").single()
    : await sb.from("quotations").insert(row).select("id").single();
  if (error) return { error: missingTable(error.code) ? MIGRATION_HINT : error.message };
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${data.id}?saved=1`);
}

export async function deleteQuote(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured.");
  const { error } = await sb.from("quotations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}

export async function setQuoteStatus(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(STATUSES as [QuoteStatus, ...QuoteStatus[]]).parse(formData.get("status"));
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured.");
  const { error } = await sb.from("quotations").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}
