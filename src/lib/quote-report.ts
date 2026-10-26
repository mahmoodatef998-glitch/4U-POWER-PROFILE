import { STATUSES, type Quote, type QuoteStatus } from "./quote";

/**
 * Filters and the per-salesperson report for /admin/quotes and its Excel export. Pure, so the page and the export
 * route read the same URL the same way.
 */

export type QuoteFilters = { q: string; sales: string; status: QuoteStatus | ""; min: number | null; max: number | null; from: string; to: string };

type Params = Record<string, string | string[] | undefined>;

const num = (v: string) => {
  const n = Number(v.replace(/,/g, ""));
  return v.trim() !== "" && Number.isFinite(n) ? n : null;
};
const day = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");

export function parseFilters(sp: Params): QuoteFilters {
  const one = (k: string) => {
    const v = sp[k];
    return ((Array.isArray(v) ? v[0] : v) ?? "").trim();
  };
  const status = one("status");
  return {
    q: one("q"),
    sales: one("sales"),
    status: (STATUSES as string[]).includes(status) ? (status as QuoteStatus) : "",
    min: num(one("min")),
    max: num(one("max")),
    from: day(one("from")),
    to: day(one("to")),
  };
}

/** The same filters as a query string ("" when none), for links and the Excel download. */
export function filterQuery(f: QuoteFilters, override: Partial<QuoteFilters> = {}): string {
  const all = { ...f, ...override };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(all)) if (v !== "" && v !== null) p.set(k, String(v));
  return p.toString();
}

export const hasFilters = (f: QuoteFilters) => filterQuery(f) !== "";

/** "Shamsa " and "SHAMSA" are one person. */
export const salesKey = (person: string) => person.trim().toUpperCase();

export function filterQuotes(quotes: Quote[], f: QuoteFilters): Quote[] {
  const q = f.q.toLowerCase();
  return quotes.filter((x) => {
    if (q) {
      const c = x.customer;
      const hay = [c.name, c.attention, c.contact, c.email, c.project, c.ref, `qt ${x.number}`].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.sales && salesKey(x.sales.person) !== salesKey(f.sales)) return false;
    if (f.status && x.status !== f.status) return false;
    if (f.min !== null && x.total < f.min) return false;
    if (f.max !== null && x.total > f.max) return false;
    if (f.from && x.quote_date < f.from) return false;
    if (f.to && x.quote_date > f.to) return false;
    return true;
  });
}

/** Sales people found on the quotations, first spelling kept, A–Z. */
export function salesPeople(quotes: Quote[]): string[] {
  const m = new Map<string, string>();
  for (const x of quotes) if (x.sales.person.trim() && !m.has(salesKey(x.sales.person))) m.set(salesKey(x.sales.person), x.sales.person.trim());
  return [...m.values()].sort((a, b) => a.localeCompare(b));
}

export type SalesRow = { person: string; quotes: number; draft: number; sent: number; won: number; lost: number; winRate: number | null; quoted: number; wonValue: number };

const round2 = (n: number) => Math.round(n * 100) / 100;
/** The value a quotation is worth to sales: after discount, before VAT. */
export const netValue = (x: Pick<Quote, "subtotal" | "discount">) => round2(x.subtotal - x.discount);

/** Per sales person: how many quotations, how they ended (win rate = won of won + lost), and their value excl. VAT. */
export function salesSummary(quotes: Quote[]): SalesRow[] {
  const m = new Map<string, SalesRow>();
  for (const x of quotes) {
    const k = salesKey(x.sales.person);
    const r = m.get(k) ?? { person: x.sales.person.trim() || "(no name)", quotes: 0, draft: 0, sent: 0, won: 0, lost: 0, winRate: null, quoted: 0, wonValue: 0 };
    r.quotes++;
    r[x.status]++;
    r.quoted += netValue(x);
    if (x.status === "won") r.wonValue += netValue(x);
    m.set(k, r);
  }
  return [...m.values()]
    .map((r) => ({ ...r, winRate: r.won + r.lost ? r.won / (r.won + r.lost) : null, quoted: round2(r.quoted), wonValue: round2(r.wonValue) }))
    .sort((a, b) => b.quotes - a.quotes || a.person.localeCompare(b.person));
}

/** "1 × 4U-P550 — Perkins …; 2 × ATS Panel" — what was offered, on one line. */
export const itemsSummary = (x: Pick<Quote, "items">) => x.items.map((i) => `${i.qty} × ${i.title}`).join("; ");

/** Human description of the active filters, for the report header. */
export function describeFilters(f: QuoteFilters): string {
  const parts = [
    f.sales && `Sales: ${f.sales}`,
    f.status && `Status: ${f.status}`,
    f.q && `Customer: "${f.q}"`,
    (f.min !== null || f.max !== null) && `Total AED ${f.min ?? 0} – ${f.max ?? "any"}`,
    (f.from || f.to) && `Dates ${f.from || "start"} → ${f.to || "today"}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "All quotations";
}
