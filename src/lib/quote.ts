import { gensetModels, type GensetModel } from "./genset-models";
import { frameName, isLeroySomer, type PriceListId } from "./price-book";

/**
 * Quotations made in /admin/quotes. Pure helpers shared by the editor (client) and the PDF route (server):
 * the standard description of a generator from its datasheet, totals with VAT, and text checks for the PDF fonts.
 */

/** price_key: the price-list option the unit price came from (alternator|origin); dropped when the price is typed in. */
export type QuoteItem = { code: string; title: string; description: string; qty: number; unit: string; unit_price: number; price_key?: string };
export type QuoteCustomer = { name: string; address: string; trn: string; project: string; attention: string; contact: string; email: string; ref: string };
export type QuoteSales = { person: string; contact: string; email: string };
export type QuoteStatus = "draft" | "sent" | "won" | "lost";
export type Quote = {
  id: string;
  number: number;
  quote_date: string;
  customer: QuoteCustomer;
  sales: QuoteSales;
  items: QuoteItem[];
  validity: string | null;
  delivery: string | null;
  notes: string | null;
  price_list: PriceListId;
  discount_pct: number;
  discount: number;
  vat_rate: number;
  subtotal: number;
  vat: number;
  total: number;
  status: QuoteStatus;
  lead_id: string | null;
  created_at: string;
};

export const COMPANY = { name: "4U POWER GENERATION (FZC)", trn: "104156009300003" };
/** Sales block on new quotations; the contact is always the company number (src/lib/site.ts), editable per quote. */
export const DEFAULT_SALES: QuoteSales = { person: "SHAMSA", contact: "+971 50 229 6962", email: "sales@4upowers.com" };
export const VAT_RATE = 5;
/** VAT a quotation can carry: standard 5%, or 0% (zero-rated, e.g. exports). */
export const VAT_RATES = [5, 0];
export const DEFAULT_VALIDITY = "30 days";
/** Quick picks for the delivery period on a quotation. */
export const DELIVERY_OPTIONS = ["1 week", "10 days", "10-12 working days", "15 days", "3-4 weeks", "Ex-stock, subject to prior sale"];
export const STATUSES: QuoteStatus[] = ["draft", "sent", "won", "lost"];
export const EMPTY_CUSTOMER: QuoteCustomer = { name: "", address: "", trn: "", project: "", attention: "", contact: "", email: "", ref: "" };
/** Printed under the totals on every quotation. */
export const SPEC_NOTE =
  "In line with continuous product development, we reserve the right to modify specifications without prior notice, ensuring an equal or superior level of quality and efficiency.";
/** Quick titles for lines that are not a generator. */
export const EXTRA_ITEMS = [
  "Automatic Transfer Switch (ATS) Panel",
  "Synchronising Panel",
  "Delivery to Site",
  "Installation & Commissioning",
  "Offloading & Positioning",
  "Annual Maintenance Contract (AMC)",
];

export const quoteNumber = (n: number) => `QT ${n}`;

/**
 * The delivery term printed on page 1 (it is not on the Terms & Conditions sheet): a period ("10 days", "one week")
 * goes into the standard sentence, anything else ("Ex-stock, subject to prior sale") prints as typed.
 */
export function deliveryText(period: string | null | undefined): string {
  const p = period?.trim();
  if (!p) return "";
  return /\d|day|week|month/i.test(p) ? `Delivery within ${p} from receipt of the confirmed LPO and the advance payment, subject to prior booking.` : p;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** 1234.5 → "1,234.50" (plain ASCII, safe for the PDF fonts). */
export function money(n: number) {
  const [int, dec] = round2(Math.abs(n)).toFixed(2).split(".");
  return `${n < 0 ? "-" : ""}${int!.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${dec}`;
}

/** "2026-10-15" → "15/10/2026" */
export const ukDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

/** Subtotal of the lines, the discount on it, then VAT on what is left (the taxable amount). */
export function totals(items: Pick<QuoteItem, "qty" | "unit_price">[], vatRate = VAT_RATE, discountPct = 0) {
  const subtotal = round2(items.reduce((s, i) => s + round2(i.qty * i.unit_price), 0));
  const discount = round2((subtotal * discountPct) / 100);
  const vat = round2(((subtotal - discount) * vatRate) / 100);
  return { subtotal, discount, vat, total: round2(subtotal - discount + vat) };
}

/* ------------------------------------------------------------------ generator description */

export type Enclosure = "open" | "enclosed";

/** The builds a model is offered in, from its datasheet: closed (silent canopy) or container, and open. */
export function enclosureOptions(m: GensetModel): { value: Enclosure; label: string }[] {
  const out: { value: Enclosure; label: string }[] = [];
  if (m.enclosed) out.push({ value: "enclosed", label: m.enclosed.container ? `Container (${m.enclosed.container})` : "Closed type (canopy)" });
  if (m.open) out.push({ value: "open", label: "Open type" });
  // models listed by rating only: both builds are offered, without datasheet figures
  return out.length ? out : [{ value: "enclosed", label: "Closed type (canopy)" }, { value: "open", label: "Open type" }];
}

const n0 = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 1 });

/**
 * The alternator as a quotation names it: "a Leroy-Somer TAL-A44-H alternator" for TAL / LSA (the price-list frame
 * when the line came from the list, else the datasheet's), otherwise "a 4U Power alternator".
 */
export function alternatorPhrase(m: GensetModel, listAlternator?: string | null): string {
  const a = listAlternator ?? m.alternator?.leroySomer ?? null;
  if (!isLeroySomer(a)) return "a 4U Power alternator";
  const f = frameName(a!);
  return `a Leroy-Somer ${f ? `${f} ` : ""}alternator`;
}

/** Puts `phrase` in place of the alternator in a generator description (also fixes older "a brushless alternator" lines). */
export const withAlternator = (description: string, phrase: string) =>
  description.replace(/directly coupled to an? [^\n]*? alternator(?= and controlled)/, `directly coupled to ${phrase}`);

/**
 * Quotation line for a generator. The description covers what a buyer checks on a quotation and nothing more:
 * build type, ratings, frequency and speed, the engine, alternator and controller, phase and power factor, and how
 * it is supplied. Dimensions, weights and fuel stay on the datasheet.
 */
export function generatorItem(m: GensetModel, enclosure: Enclosure, listAlternator?: string | null): QuoteItem {
  const container = enclosure === "enclosed" ? m.enclosed?.container : undefined;
  const build = enclosure === "open" ? "Open Type" : container ? "Containerised" : "Closed Type";
  const housing =
    enclosure === "open"
      ? "Open type set, mounted on a steel base frame."
      : container
        ? `Housed in a sound-attenuated, weather-protective ${container} (Containerised).`
        : "Packaged inside a sound-attenuated, weather-protective industrial canopy (Closed Type).";
  const lines = [
    `Brand new, heavy-duty industrial grade ${m.brand} diesel generator set, ready to run.`,
    `${n0(m.standbyKva)} kVA Standby / ${n0(m.primeKva)} kVA Prime | 50 Hz | 1500 RPM | 3-Phase | 0.8 Power Factor.`,
    `Powered by an original ${m.brand} ${m.engine} engine${m.cylinders ? ` (${m.cylinders}-cylinder${m.layout ? ` ${m.layout === "V" ? "V" : "in-line"}` : ""})` : ""}, ${m.cooling === "air" ? "air-cooled" : "water-cooled"}, directly coupled to ${alternatorPhrase(m, listAlternator)} and controlled by a Deep Sea Electronics (DSE) digital control module with full monitoring and protection.`,
    housing,
    "Factory assembled, tested and supplied as a complete ready-to-run industrial package.",
  ];
  return {
    code: m.code,
    title: `${m.code} — ${m.brand} Diesel Generator Set ${n0(m.standbyKva)} kVA, ${build}`,
    description: lines.join("\n"),
    qty: 1,
    unit: "Units",
    unit_price: 0,
  };
}

/* ------------------------------------------------------------------ model search */

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]/g, "");

/** Models matching what the user typed: code ("4U-P550", "p550", "4up550"), kVA ("550") or engine/brand words. */
export function searchModels(q: string, models: GensetModel[] = gensetModels, max = 8): GensetModel[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const sq = squash(query);
  const kva = Number(query.replace(/kva/g, "").trim());
  const words = query.split(/\s+/).filter(Boolean);
  const score = (m: GensetModel) => {
    const code = squash(m.code);
    if (code === sq || code === `4u${sq}`) return 0;
    if (code.startsWith(sq) || code.startsWith(`4u${sq}`)) return 1;
    if (Number.isFinite(kva) && kva > 0 && (m.standbyKva === kva || m.primeKva === kva)) return 2;
    // a bare number is a rating: only exact kVA (above) counts, not digits inside engine codes
    if (/^\d+(\.\d+)?$/.test(query)) return -1;
    const hay = `${m.code} ${m.brand} ${m.engine} ${m.standbyKva} ${m.primeKva}`.toLowerCase();
    if (words.every((w) => hay.includes(w))) return 3;
    return -1;
  };
  return models
    .map((m) => ({ m, s: score(m) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s || a.m.standbyKva - b.m.standbyKva || a.m.code.localeCompare(b.m.code))
    .slice(0, max)
    .map((x) => x.m);
}

/* ------------------------------------------------------------------ PDF text */

/** Characters outside WinAnsi (the encoding of the standard PDF fonts), other than line breaks. */
const WIN_ANSI_EXTRA = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022,
  0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
]);
const isWinAnsi = (cp: number) => cp === 10 || (cp >= 0x20 && cp <= 0x7e) || (cp >= 0xa0 && cp <= 0xff) || WIN_ANSI_EXTRA.has(cp);

/** The characters a quotation field has that the PDF cannot print (Arabic, emoji…), for a clear error. */
export function unprintable(s: string): string[] {
  return [...new Set([...s].filter((c) => !isWinAnsi(c.codePointAt(0)!)))];
}

/** Last-resort cleanup at render time: tabs and odd spaces become spaces, anything else unprintable becomes "?". */
export function printable(s: string): string {
  return [...s.replace(/\r\n?/g, "\n").replace(/[\t -​  　]/g, " ")]
    .map((c) => (isWinAnsi(c.codePointAt(0)!) ? c : "?"))
    .join("");
}
