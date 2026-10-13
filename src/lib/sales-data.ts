import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ownerKey, trafficSource, type Channel, type Enquiry, type LostReason, type Status } from "./sales";

const SALES_COLS = "id, created_at, status, deal_value, owner, lost_reason, notes, contacted_at, closed_at, utm_source, utm_medium, utm_campaign, gclid";
const MAX_ROWS = 20000;

type Base = {
  id: string;
  created_at: string;
  status: Status;
  deal_value: number | string | null;
  owner: string | null;
  lost_reason: LostReason | null;
  notes: string | null;
  contacted_at: string | null;
  closed_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
};
type LeadRow = Base & {
  name: string;
  phone: string;
  email: string | null;
  country: string | null;
  message: string | null;
  product_slug: string | null;
  calculated_kva: number | string | null;
  source: string;
  source_page: string | null;
};
type ClickRow = Base & { page: string | null; referrer: string | null; ref?: string | null };

const MANUAL_CHANNEL: Record<string, Channel> = { phone: "call", whatsapp: "whatsapp", walk_in: "offline", referral: "offline", other: "offline" };

const common = (r: Base) => ({
  id: r.id,
  created_at: r.created_at,
  status: r.status,
  deal_value: r.deal_value == null ? null : Number(r.deal_value),
  owner: r.owner,
  lost_reason: r.lost_reason,
  notes: r.notes,
  contacted_at: r.contacted_at,
  closed_at: r.closed_at,
  campaign: r.utm_campaign,
});

const fromLead = (r: LeadRow): Enquiry => ({
  ...common(r),
  table: "leads",
  channel: MANUAL_CHANNEL[r.source] ?? "form",
  source: r.source,
  traffic: MANUAL_CHANNEL[r.source] ? "logged by sales" : trafficSource(r),
  page: r.source_page,
  ref: null,
  name: r.name,
  phone: r.phone,
  email: r.email,
  country: r.country,
  message: r.message,
  product: r.product_slug,
  kva: r.calculated_kva == null ? null : Number(r.calculated_kva),
});

const fromClick = (table: "whatsapp_clicks" | "call_clicks") => (r: ClickRow): Enquiry => ({
  ...common(r),
  table,
  channel: table === "whatsapp_clicks" ? "whatsapp" : "call",
  source: table === "whatsapp_clicks" ? "whatsapp_click" : "call_click",
  traffic: trafficSource(r),
  page: r.page,
  ref: r.ref ?? null,
  name: null,
  phone: null,
  email: null,
  country: null,
  message: null,
  product: null,
  kva: null,
});

function check<T>(res: { data: T[] | null; error: { message: string } | null }, table: string): T[] {
  if (res.error) throw new Error(`${table}: ${res.error.message}`);
  return res.data ?? [];
}

/** Every enquiry created in [start, end), newest first. */
export async function loadEnquiries(sb: SupabaseClient, start: Date, end: Date): Promise<Enquiry[]> {
  const [from, to] = [start.toISOString(), end.toISOString()];
  const [leads, wa, calls] = await Promise.all([
    sb.from("leads").select(`${SALES_COLS}, name, phone, email, country, message, product_slug, calculated_kva, source, source_page`).gte("created_at", from).lt("created_at", to).order("created_at", { ascending: false }).limit(MAX_ROWS),
    sb.from("whatsapp_clicks").select(`${SALES_COLS}, ref, page, referrer`).gte("created_at", from).lt("created_at", to).order("created_at", { ascending: false }).limit(MAX_ROWS),
    sb.from("call_clicks").select(`${SALES_COLS}, page, referrer`).gte("created_at", from).lt("created_at", to).order("created_at", { ascending: false }).limit(MAX_ROWS),
  ]);
  return [
    ...check<LeadRow>(leads, "leads").map(fromLead),
    ...check<ClickRow>(wa, "whatsapp_clicks").map(fromClick("whatsapp_clicks")),
    ...check<ClickRow>(calls, "call_clicks").map(fromClick("call_clicks")),
  ].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

/** Orders marked won inside [start, end), whenever the enquiry first came in — what sales closed this period. */
export async function loadWonClosed(sb: SupabaseClient, start: Date, end: Date, owner = "") {
  const tables = ["leads", "whatsapp_clicks", "call_clicks"] as const;
  const res = await Promise.all(
    tables.map((t) =>
      sb.from(t).select("deal_value, owner").eq("status", "won").gte("closed_at", start.toISOString()).lt("closed_at", end.toISOString()).limit(MAX_ROWS),
    ),
  );
  const rows = res
    .flatMap((r, i) => check<{ deal_value: number | string | null; owner: string | null }>(r, tables[i]!))
    .filter((r) => !owner || ownerKey(r.owner) === ownerKey(owner));
  return { count: rows.length, value: rows.reduce((s, r) => s + (Number(r.deal_value) || 0), 0) };
}

/** Distinct sales owners seen in the last year, for the owner pickers. */
export async function loadOwners(sb: SupabaseClient): Promise<string[]> {
  const since = new Date(Date.now() - 365 * 864e5).toISOString();
  const res = await Promise.all(
    (["leads", "whatsapp_clicks", "call_clicks"] as const).map((t) => sb.from(t).select("owner").not("owner", "is", null).gte("created_at", since).limit(MAX_ROWS)),
  );
  const seen = new Map<string, string>();
  for (const r of res) for (const { owner } of (r.data ?? []) as { owner: string }[]) if (owner?.trim()) seen.set(owner.trim().toLowerCase(), owner.trim());
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
