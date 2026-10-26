"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { STATUSES, totals, type QuoteStatus } from "@/lib/quote";
import { parseQuotePayload } from "@/lib/quote-form";
import { MIGRATION_HINT, missingTable } from "@/lib/quote-data";
import { getAdminClient } from "@/lib/supabase/server";

export type SaveState = { error?: string } | null;

export async function saveQuote(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const parsed = parseQuotePayload(formData.get("payload"), true);
  if (parsed.error !== undefined) return { error: parsed.error };
  const d = parsed.data;

  const sb = getAdminClient();
  if (!sb) return { error: "Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY)." };
  const row = {
    quote_date: d.quote_date,
    status: d.status,
    customer: d.customer,
    sales: d.sales,
    items: d.items,
    validity: d.validity || null,
    delivery: d.delivery || null,
    notes: d.notes || null,
    price_list: d.price_list,
    discount_pct: d.discount_pct,
    vat_rate: d.vat_rate,
    ...totals(d.items, d.vat_rate, d.discount_pct),
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
