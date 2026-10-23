import "server-only";
import { DEFAULT_SALES, EMPTY_CUSTOMER, type Quote, type QuoteCustomer, type QuoteSales } from "./quote";
import { getAdminClient } from "./supabase/server";

/** Shown when the quotations migration has not been run in Supabase yet. */
export const MIGRATION_HINT = "Run supabase/migrations/20261015000000_quotations.sql in the Supabase SQL editor first.";
export const missingTable = (code?: string) => code === "PGRST205" || code === "42P01";

type Result<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

export async function listQuotes(): Promise<Result<Quote[]>> {
  const sb = getAdminClient();
  if (!sb) return { error: "Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY)." };
  const { data, error } = await sb.from("quotations").select("*").order("number", { ascending: false }).limit(500);
  if (error) return { error: missingTable(error.code) ? MIGRATION_HINT : error.message };
  return { data: (data ?? []).map(normalize) };
}

export async function loadQuote(id: string): Promise<Quote | null> {
  const sb = getAdminClient();
  if (!sb || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await sb.from("quotations").select("*").eq("id", id).maybeSingle();
  return data ? normalize(data) : null;
}

/** Sales person and e-mail of the last quotation, so the form starts with whoever quoted last; the contact number is always the company's. */
export async function lastSales(): Promise<QuoteSales> {
  const sb = getAdminClient();
  if (!sb) return DEFAULT_SALES;
  const { data } = await sb.from("quotations").select("sales").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const s = data?.sales as Partial<QuoteSales> | undefined;
  return s?.person || s?.email ? { ...DEFAULT_SALES, person: s.person || DEFAULT_SALES.person, email: s.email || DEFAULT_SALES.email } : DEFAULT_SALES;
}

/** Customer details from a website lead, to start a quotation from the Leads tab. */
export async function leadCustomer(leadId: string): Promise<{ customer: QuoteCustomer; kva: number | null } | null> {
  const sb = getAdminClient();
  if (!sb || !/^[0-9a-f-]{36}$/i.test(leadId)) return null;
  const { data } = await sb.from("leads").select("name,phone,email,country,calculated_kva").eq("id", leadId).maybeSingle();
  if (!data) return null;
  return {
    customer: { ...EMPTY_CUSTOMER, name: data.name ?? "", attention: data.name ?? "", contact: data.phone ?? "", email: data.email ?? "", address: data.country ?? "" },
    kva: data.calculated_kva ? Number(data.calculated_kva) : null,
  };
}

function normalize(r: Record<string, unknown>): Quote {
  return {
    ...(r as unknown as Quote),
    customer: { ...EMPTY_CUSTOMER, ...((r.customer as object) ?? {}) },
    sales: { ...DEFAULT_SALES, ...((r.sales as object) ?? {}) },
    items: Array.isArray(r.items) ? (r.items as Quote["items"]).map((i) => ({ ...i, qty: Number(i.qty), unit_price: Number(i.unit_price) })) : [],
    delivery: (r.delivery as string | null) ?? null,
    vat_rate: Number(r.vat_rate ?? 5),
    subtotal: Number(r.subtotal ?? 0),
    vat: Number(r.vat ?? 0),
    total: Number(r.total ?? 0),
  };
}
