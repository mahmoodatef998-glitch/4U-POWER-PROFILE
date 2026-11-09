/**
 * Fill a new quotation from a ready PDF quotation (owner, 9 Nov 2026): no AI, two paths.
 * 1. Embedded data: quotations made by the admin (quote-pdf.ts) or prepared for 4U carry their lines as JSON in
 *    the PDF's info dictionary (/FourUQuote), or in Keywords as "4U-QUOTE:<base64 JSON>". Read exactly.
 * 2. Text: any other PDF. Its text lines (with x positions) are read, the line-items table is found from its
 *    header (Description · Qty · Unit price · Total) and the customer, date, validity, delivery, discount and VAT
 *    from their labels. The editor shows the result for checking before anything is saved.
 * Prices come back in the PDF's own currency; the editor converts them to AED at today's rate.
 */
import { z } from "zod";
import type { Currency, QuoteCustomer } from "./quote";

export const QUOTE_DATA_KEY = "FourUQuote";
export const QUOTE_KEYWORD_PREFIX = "4U-QUOTE:";

export type ImportedItem = { code: string; title: string; description: string; qty: number; unit: string; unit_price: number };
export type ImportedQuote = {
  source: "embedded" | "text";
  customer: Partial<QuoteCustomer>;
  items: ImportedItem[];
  currency: Currency | null;
  vat_rate: number | null;
  discount_pct: number | null;
  quote_date: string | null;
  validity: string | null;
  delivery: string | null;
  notes: string | null;
  /** grand total printed on the PDF, to check the import against */
  printed_total: number | null;
  warnings: string[];
};

/* ------------------------------------------------------------------ embedded JSON */

const CURRENCIES = ["AED", "USD", "EUR", "SAR", "GBP"] as const;
const Embedded = z.object({
  v: z.literal(1),
  customer: z.object({ name: z.string(), address: z.string(), trn: z.string(), project: z.string(), attention: z.string(), contact: z.string(), email: z.string(), ref: z.string() }).partial().default({}),
  items: z
    .array(
      z.object({
        code: z.string().max(40).default(""),
        title: z.string().max(300),
        description: z.string().max(4000).default(""),
        qty: z.coerce.number().positive().max(100000),
        unit: z.string().max(20).default("Units"),
        unit_price: z.coerce.number().min(0).max(1e9),
      }),
    )
    .max(100),
  currency: z.enum(CURRENCIES).nullable().default(null),
  vat_rate: z.coerce.number().min(0).max(100).nullable().default(null),
  discount_pct: z.coerce.number().min(0).max(100).nullable().default(null),
  quote_date: z.string().max(20).nullable().default(null),
  validity: z.string().max(100).nullable().default(null),
  delivery: z.string().max(200).nullable().default(null),
  notes: z.string().max(4000).nullable().default(null),
  total: z.coerce.number().nullable().default(null),
});
export type EmbeddedQuote = z.input<typeof Embedded>;

export function parseEmbedded(json: string): ImportedQuote | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  const r = Embedded.safeParse(raw);
  if (!r.success) return null;
  const d = r.data;
  return {
    source: "embedded",
    customer: d.customer,
    items: d.items.map((i) => ({ ...i, code: i.code ?? "", description: i.description ?? "", unit: i.unit || "Units" })),
    currency: (d.currency as Currency | null) ?? null,
    vat_rate: d.vat_rate,
    discount_pct: d.discount_pct,
    quote_date: d.quote_date,
    validity: d.validity,
    delivery: d.delivery,
    notes: d.notes,
    printed_total: d.total,
    warnings: [],
  };
}

/* ------------------------------------------------------------------ text lines */

export type Seg = { x: number; x2: number; str: string };
export type Line = { page: number; y: number; segs: Seg[] };

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const lineText = (l: Line) => clean(l.segs.map((s) => s.str).join(" "));

/** Words that sit close together are one cell ("Unit" "Price" → "Unit Price"). */
export function mergeSegs(segs: Seg[], gap = 4): Seg[] {
  const out: Seg[] = [];
  for (const s of [...segs].sort((a, b) => a.x - b.x)) {
    const last = out[out.length - 1];
    if (last && s.x - last.x2 < gap) {
      last.str = `${last.str}${s.x - last.x2 > 1 ? " " : ""}${s.str}`;
      last.x2 = Math.max(last.x2, s.x2);
    } else out.push({ ...s });
  }
  return out.filter((s) => clean(s.str));
}

/** Cells of one line split where there is a wide gap, e.g. "Customer: X" on the left and "Date: Y" on the right. */
function groups(l: Line, gap = 28): string[] {
  const out: string[][] = [];
  let lastX2 = -1e9;
  for (const s of l.segs) {
    if (s.x - lastX2 > gap || !out.length) out.push([]);
    out[out.length - 1]!.push(s.str);
    lastX2 = s.x2;
  }
  return out.map((g) => clean(g.join(" "))).filter(Boolean);
}

/* ------------------------------------------------------------------ numbers, dates, currency */

export function num(s: string): number | null {
  const t = s.replace(/\b(AED|USD|EUR|SAR|GBP|DHS?|US\$)\b|[$€£]/gi, "").replace(/[\s ]/g, "");
  if (!/^-?\(?[\d,]*\.?\d+\)?$/.test(t)) return null;
  const neg = t.startsWith("-") || t.startsWith("(");
  const n = Number(t.replace(/[(),-]/g, ""));
  return Number.isFinite(n) ? (neg ? -n : n) : null;
}

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
export function isoDate(s: string): string | null {
  const p = (y: number, m: number, d: number) =>
    y > 2000 && y < 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31 ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null;
  let m = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (m) return p(+m[1]!, +m[2]!, +m[3]!);
  m = s.match(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/); // UAE style: day first
  if (m) return p(+m[3]!, +m[2]!, +m[1]!);
  m = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?[\s-]+([A-Za-z]{3})[a-z]*\.?[\s,-]+(\d{4})\b/);
  if (m && MONTHS[m[2]!.toLowerCase()]) return p(+m[3]!, MONTHS[m[2]!.toLowerCase()]!, +m[1]!);
  m = s.match(/\b([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/);
  if (m && MONTHS[m[1]!.toLowerCase()]) return p(+m[3]!, MONTHS[m[1]!.toLowerCase()]!, +m[2]!);
  return null;
}

function currencyOf(text: string): Currency | null {
  const count = (re: RegExp) => (text.match(re) ?? []).length;
  const c: [Currency, number][] = [
    ["AED", count(/\bAED\b|\bDhs?\b|درهم/gi)],
    ["USD", count(/\bUSD\b|US\$/gi)],
    ["EUR", count(/\bEUR\b|€/gi)],
    ["SAR", count(/\bSAR\b|ريال/gi)],
  ];
  const best = c.sort((a, b) => b[1] - a[1])[0]!;
  return best[1] > 0 ? best[0] : null;
}

/* ------------------------------------------------------------------ labelled fields */

const OUR_TRN = "104156009300003";
const LABELS: { key: keyof QuoteCustomer | "date" | "validity" | "delivery"; re: RegExp }[] = [
  { key: "name", re: /^(?:customer(?: name)?|client(?: name)?|company(?: name)?|bill to|to|m\/s\.?|messrs\.?)\s*[:\-–]?\s*(.+)$/i },
  { key: "attention", re: /^(?:attn\.?|attention|kind attn\.?|contact person)\s*[:\-–]?\s*(.+)$/i },
  { key: "contact", re: /^(?:tel(?:ephone)?|phone|mobile|mob\.?|contact(?: no\.?| number)?)\s*[:\-–]?\s*(\+?[\d\s()-]{7,})$/i },
  { key: "email", re: /^(?:e-?mail)\s*[:\-–]?\s*(\S+@\S+)$/i },
  { key: "project", re: /^(?:project(?: name)?|site|subject)\s*[:\-–]?\s*(.+)$/i },
  { key: "ref", re: /^(?:your ref(?:erence)?\.?|customer ref\.?|ref(?:erence)?\.?|rfq(?: no\.?)?|enquiry(?: no\.?)?|inquiry(?: no\.?)?)\s*[:\-–#]?\s*(.+)$/i },
  { key: "trn", re: /^(?:trn|vat (?:no|reg(?:istration)?)\.?)\s*[:\-–]?\s*(\d{15})$/i },
  { key: "address", re: /^(?:address|location)\s*[:\-–]?\s*(.+)$/i },
  { key: "date", re: /^(?:date|quotation date|quote date|issue date)\s*[:\-–]?\s*(.+)$/i },
  { key: "validity", re: /^(?:validity|offer validity|quotation validity|valid for|valid until)\s*[:\-–]?\s*(.+)$/i },
  { key: "delivery", re: /^(?:delivery(?: time| period| lead time)?|lead time)\s*[:\-–]?\s*(.+)$/i },
];

/* ------------------------------------------------------------------ table */

type Col = "no" | "desc" | "qty" | "unit" | "price" | "total";
const HEADER: { col: Col; re: RegExp }[] = [
  { col: "price", re: /^(?:unit\s*price|u\.?\s*price|rate|unit\s*rate|price|unit\s*cost)(?:\s*[(\[]?\s*(?:AED|USD|EUR|SAR|GBP)\s*[)\]]?)?$/i },
  { col: "total", re: /^(?:total(?:\s*price|\s*amount)?|amount|line\s*total|net\s*amount|ext\.?\s*price)(?:\s*[(\[]?\s*(?:AED|USD|EUR|SAR|GBP)\s*[)\]]?)?$/i },
  { col: "qty", re: /^(?:qty\.?|quantity|q'ty|qnty)$/i },
  { col: "unit", re: /^(?:unit|uom|u\/m)$/i },
  { col: "no", re: /^(?:no\.?|s\.?\s*no\.?|sr\.?(?:\s*no\.?)?|#|item(?:\s*no\.?)?|sl\.?)$/i },
  { col: "desc", re: /^(?:(?:item\s*)?description|particulars|details|product(?:\s*description)?|items?\s*&\s*description|model\s*\/\s*description)$/i },
];
const STOP = /^(?:sub[\s-]*total|total|grand total|net total|vat|tax|discount|amount in words|terms|notes?|remarks|payment|bank|warranty)\b/i;

function findHeader(lines: Line[]): { at: number; cols: { col: Col; x: number }[] } | null {
  for (let i = 0; i < lines.length; i++) {
    const segs = mergeSegs(lines[i]!.segs);
    const cols: { col: Col; x: number }[] = [];
    for (const s of segs) {
      const h = HEADER.find((h) => h.re.test(clean(s.str)));
      if (h && !cols.some((c) => c.col === h.col)) cols.push({ col: h.col, x: (s.x + s.x2) / 2 });
    }
    const has = (c: Col) => cols.some((k) => k.col === c);
    if (has("desc") && has("qty") && (has("price") || has("total"))) return { at: i, cols };
  }
  return null;
}

function column(cols: { col: Col; x: number }[], s: Seg): Col {
  const xc = (s.x + s.x2) / 2;
  // text that starts left of the quantity column belongs to the description (wrapped lines run wide)
  const qty = cols.find((c) => c.col === "qty")!;
  const desc = cols.find((c) => c.col === "desc")!;
  if (num(s.str) === null && s.x < qty.x - 10 && s.x >= desc.x - 200) {
    const no = cols.find((c) => c.col === "no");
    if (!(no && Math.abs(xc - no.x) < Math.abs(xc - desc.x) && /^\d{1,3}\.?$/.test(clean(s.str)))) return "desc";
  }
  return cols.reduce((best, c) => (Math.abs(c.x - xc) < Math.abs(best.x - xc) ? c : best)).col;
}

const CODE = /\b4U-[A-Z]{1,2}\d+(?:\.\d+)?[A-Z]?\b/;

/* ------------------------------------------------------------------ main */

export function parseQuoteLines(lines: Line[]): ImportedQuote {
  const warnings: string[] = [];
  const all = lines.map(lineText).join("\n");
  const out: ImportedQuote = {
    source: "text",
    customer: {},
    items: [],
    currency: currencyOf(all),
    vat_rate: null,
    discount_pct: null,
    quote_date: null,
    validity: null,
    delivery: null,
    notes: null,
    printed_total: null,
    warnings,
  };

  // labelled fields (everything outside the table)
  for (const l of lines) {
    for (const g of groups(l)) {
      for (const { key, re } of LABELS) {
        const m = g.match(re);
        if (!m) continue;
        const v = clean(m[1]!);
        if (!v) continue;
        if (key === "date") out.quote_date ??= isoDate(v);
        else if (key === "validity") out.validity ??= v.slice(0, 100);
        else if (key === "delivery") out.delivery ??= v.slice(0, 200);
        else if (key === "trn" && v === OUR_TRN) continue;
        else if (key === "email" && /4upowers?\.com$/i.test(v)) continue;
        else if (key === "name" && /^4u\b|4u power/i.test(v)) continue;
        else if (!out.customer[key]) out.customer[key] = v.slice(0, 200);
        break;
      }
    }
  }
  if (!out.customer.email) {
    const e = all.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g)?.find((x) => !/4upowers?\.com$/i.test(x));
    if (e) out.customer.email = e;
  }

  // the items table
  const head = findHeader(lines);
  if (!head) {
    warnings.push("No line-items table found (looked for a header with Description, Qty and Unit price / Total).");
    return out;
  }
  // each item keeps its text lines with their y, so a price row centred between two text lines can claim the
  // line just above it from the previous item
  type Row = { item: ImportedItem; text: { t: string; y: number }[]; y: number };
  const rows: Row[] = [];
  let pending: { t: string; y: number }[] = [];
  let endAt = lines.length;
  let lineH = 12;
  for (let i = head.at + 1; i < lines.length; i++) {
    const l = lines[i]!;
    const prev = lines[i - 1]!;
    if (prev.page === l.page && prev.y - l.y > 4) lineH = Math.min(lineH, prev.y - l.y);
    const segs = mergeSegs(l.segs);
    const text = lineText(l);
    if (STOP.test(text) || (segs[0] && STOP.test(clean(segs[0].str)) && num(segs[segs.length - 1]!.str) !== null)) {
      endAt = i;
      break;
    }
    if (findHeader([l])) continue; // the header repeated on a new page
    const cell: Partial<Record<Col, string[]>> = {};
    for (const s of segs) (cell[column(head.cols, s)] ??= []).push(clean(s.str));
    const n = (c: Col) => (cell[c] ?? []).map(num).find((v) => v !== null) ?? null;
    const qty = n("qty");
    const price = n("price");
    const total = n("total");
    const desc = clean((cell.desc ?? []).join(" "));
    const y = l.y - l.page * 10000; // y down the whole document
    if (qty !== null && qty > 0 && (price !== null || total !== null)) {
      let own: { t: string; y: number }[] = [...pending];
      pending = [];
      if (!desc) {
        // numbers centred on the row: text just above belongs to this item, not the previous one
        const last = rows[rows.length - 1];
        if (last) {
          const mine = last.text.filter((x) => x.y - y > 0 && x.y - y <= lineH * 1.6);
          last.text = last.text.filter((x) => !mine.includes(x));
          own = [...mine, ...own];
        }
      } else own.push({ t: desc, y });
      own.sort((a, b) => b.y - a.y);
      const title = own.shift()?.t ?? "";
      const unitPrice = price ?? (total !== null ? total / qty : 0);
      rows.push({
        y,
        text: own,
        item: { code: title.match(CODE)?.[0] ?? "", title, description: "", qty, unit: clean((cell.unit ?? []).join(" ")) || "Units", unit_price: Math.round(unitPrice * 100) / 100 },
      });
      if (price !== null && total !== null && Math.abs(price * qty - total) > Math.max(1, total * 0.005)) {
        warnings.push(`Line "${title.slice(0, 40)}": ${qty} × ${price} does not equal ${total} — check the quantity and price.`);
      }
    } else if (desc) {
      const last = rows[rows.length - 1];
      if (last) last.text.push({ t: desc, y });
      else pending.push({ t: desc, y });
    }
  }
  for (const r of rows) {
    r.item.description = r.text.sort((a, b) => b.y - a.y).map((x) => x.t).join("\n");
    out.items.push(r.item);
  }
  for (const it of out.items) if (!it.code) it.code = it.description.match(CODE)?.[0] ?? "";

  // totals, discount and VAT below the table
  let subtotal: number | null = null;
  let discountAmt: number | null = null;
  for (const l of lines.slice(endAt, endAt + 25)) {
    const text = lineText(l);
    const segs = mergeSegs(l.segs);
    const last = segs.length ? num(segs[segs.length - 1]!.str) : null;
    const pct = text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (/^sub[\s-]*total/i.test(text) && last !== null) subtotal ??= last;
    else if (/^discount/i.test(text)) {
      if (pct) out.discount_pct ??= Number(pct[1]);
      else if (last !== null) discountAmt ??= Math.abs(last);
    } else if (/^(?:vat|tax)\b/i.test(text)) {
      if (pct) out.vat_rate ??= Number(pct[1]);
      else if (last === 0) out.vat_rate ??= 0;
    } else if (/^(?:grand total|total(?: amount)?(?: incl|\b))/i.test(text) && last !== null) out.printed_total = last;
  }
  const lineSum = out.items.reduce((a, i) => a + i.qty * i.unit_price, 0);
  if (out.discount_pct === null && discountAmt && (subtotal ?? lineSum) > 0) out.discount_pct = Math.round((discountAmt / (subtotal ?? lineSum)) * 10000) / 100;
  if (subtotal !== null && Math.abs(subtotal - lineSum) > Math.max(1, subtotal * 0.005)) {
    warnings.push(`The lines add up to ${lineSum.toFixed(2)} but the PDF subtotal is ${subtotal.toFixed(2)} — a line may be missing or misread.`);
  }
  if (!out.items.length) warnings.push("The table header was found but no priced lines were read.");
  return out;
}
