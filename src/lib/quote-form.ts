import { z } from "zod";
import { STATUSES, VAT_RATE, VAT_RATES, unprintable, type QuoteStatus } from "./quote";

/**
 * The quotation form as the editor sends it (one JSON field), checked the same way for saving and for the
 * unsaved PDF preview. Saving is strict; the preview lets an unfinished form through so it can be looked at.
 */

const str = (max: number) => z.string().trim().max(max).default("");
const payloadSchema = (strict: boolean) =>
  z.object({
    id: z.string().uuid().nullable(),
    lead_id: z.string().uuid().nullable(),
    quote_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date"),
    status: z.enum(STATUSES as [QuoteStatus, ...QuoteStatus[]]),
    customer: z.object({
      name: strict ? z.string().trim().min(1, "Customer name is required").max(200) : str(200),
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
    delivery: str(120),
    notes: str(2000),
    price_list: z.enum(["uae", "export"]).default("uae"),
    discount_pct: z.coerce.number().min(0, "Discount can't be negative").max(100, "Discount can't be above 100%").default(0),
    vat_rate: z.coerce.number().refine((r) => VAT_RATES.includes(r), "VAT must be 5% or 0%").default(VAT_RATE),
    items: z
      .array(
        z.object({
          code: str(40),
          title: strict ? z.string().trim().min(1, "Every line needs a title").max(300) : str(300),
          description: str(4000),
          qty: z.coerce.number().positive("Quantity must be above 0").max(100000),
          unit: str(20).transform((u) => u || "Units"),
          unit_price: z.coerce.number().min(0, "Price can't be negative").max(1e9),
          price_key: z.string().max(80).optional(),
        }),
      )
      .min(1, "Add at least one item")
      .max(40),
  });

export type QuotePayload = z.infer<ReturnType<typeof payloadSchema>>;

export function parseQuotePayload(json: unknown, strict: boolean): { data: QuotePayload; error?: undefined } | { data?: undefined; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(String(json ?? ""));
  } catch {
    return { error: "Could not read the form." };
  }
  const parsed = payloadSchema(strict).safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(" · ") };
  const d = parsed.data;
  if (!strict) return { data: d };
  // the PDF uses the standard fonts: anything they can't print (Arabic, emoji) is caught here, not on the PDF
  const fields: [string, string][] = [
    ...Object.entries(d.customer).map(([k, v]) => [`Customer ${k}`, v] as [string, string]),
    ...Object.entries(d.sales).map(([k, v]) => [`Sales ${k}`, v] as [string, string]),
    ["Validity", d.validity],
    ["Delivery", d.delivery],
    ["Notes", d.notes],
    ...d.items.flatMap((it, i) => [[`Item ${i + 1} title`, it.title], [`Item ${i + 1} description`, it.description], [`Item ${i + 1} unit`, it.unit]] as [string, string][]),
  ];
  const bad = fields.map(([k, v]) => [k, unprintable(v)] as const).filter(([, c]) => c.length);
  if (bad.length) return { error: `Quotations are printed in English: retype these fields in English letters: ${bad.map(([k, c]) => (c.length > 5 ? k : `${k} (${c.join(" ")})`)).join(", ")}.` };
  return { data: d };
}
