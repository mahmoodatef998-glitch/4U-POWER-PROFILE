import { aspirationText, gensetModels, type GensetModel } from "./genset-models";

/**
 * Quotations made in /admin/quotes. Pure helpers shared by the editor (client) and the PDF route (server):
 * the standard description of a generator from its datasheet, totals with VAT, and text checks for the PDF fonts.
 */

export type QuoteItem = { code: string; title: string; description: string; qty: number; unit: string; unit_price: number };
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
  notes: string | null;
  vat_rate: number;
  subtotal: number;
  vat: number;
  total: number;
  status: QuoteStatus;
  lead_id: string | null;
  created_at: string;
};

export const COMPANY = { name: "4U POWER GENERATION (FZC)", trn: "104156009300003" };
export const DEFAULT_SALES: QuoteSales = { person: "SHAMSA", contact: "+971502403818", email: "sales@4upowergenerations.com" };
export const VAT_RATE = 5;
export const DEFAULT_VALIDITY = "30 days";
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

export function totals(items: Pick<QuoteItem, "qty" | "unit_price">[], vatRate = VAT_RATE) {
  const subtotal = round2(items.reduce((s, i) => s + round2(i.qty * i.unit_price), 0));
  const vat = round2((subtotal * vatRate) / 100);
  return { subtotal, vat, total: round2(subtotal + vat) };
}

/* ------------------------------------------------------------------ generator description */

export type Enclosure = "open" | "enclosed";

/** The builds a model is offered in, from its datasheet: open set, and silent canopy or container. */
export function enclosureOptions(m: GensetModel): { value: Enclosure; label: string }[] {
  const out: { value: Enclosure; label: string }[] = [];
  if (m.enclosed) out.push({ value: "enclosed", label: m.enclosed.container ? `Container (${m.enclosed.container})` : "Silent canopy" });
  if (m.open) out.push({ value: "open", label: "Open type" });
  return out;
}

const n0 = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** Quotation line for a generator: a short title and the standard description, concise but complete. */
export function generatorItem(m: GensetModel, enclosure: Enclosure): QuoteItem {
  const dim = enclosure === "enclosed" ? m.enclosed : m.open;
  const container = enclosure === "enclosed" ? m.enclosed?.container : undefined;
  const build = enclosure === "open" ? "Open Type" : container ? "Containerised" : "Silent Canopy";
  const ambient = m.ambientC === undefined ? 50 : m.ambientC;
  const aspiration = aspirationText(m, "en");
  const breaker =
    m.breaker === "schneider-acb" ? "Schneider ACB main breaker" : m.breaker === "ls" ? "3-pole LS Electric main breaker" : "3-pole LS MCCB main breaker";
  const alternatorFrames = [m.alternator.leroySomer && `Leroy-Somer ${m.alternator.leroySomer}`, m.alternator.stamford && `Stamford ${m.alternator.stamford}`]
    .filter(Boolean)
    .join(" or ");
  const tank = dim?.tankL;

  const lines = [
    `Brand new heavy-duty industrial diesel generator set, ${build.toUpperCase()}, ready to run: ${n0(m.standbyKva)} kVA / ${n0(m.standbyKw)} kW standby, ${n0(m.primeKva)} kVA / ${n0(m.primeKw)} kW prime | 400/230 V, 3-phase | 50 Hz | 1500 rpm | 0.8 pf.`,
    `Engine: ${m.brand} ${m.engine}, ${m.cylinders}-cylinder ${m.layout === "V" ? "V" : "in-line"}, ${n0(m.displacementL)} L, ${aspiration.charAt(0).toLowerCase()}${aspiration.slice(1)}, ${m.governing} governing, water cooled${ambient ? ` with radiator for ${ambient} °C ambient` : ""}.`,
    `Alternator: 4U · Leroy-Somer | Stamford, brushless, self-excited, Class H insulation, IP23${alternatorFrames ? ` (${alternatorFrames})` : ""}.`,
    `Control: Deep Sea ${m.controller} auto-start control module with full engine and alternator monitoring and protection; ${breaker}.`,
    enclosure === "open"
      ? `Build: open skid-mounted set${tank ? ` with ${n0(tank)} L base fuel tank` : ""}.`
      : container
        ? `Build: ${container}${tank ? ` with ${n0(tank)} L fuel tank` : ""}${m.noiseDb ? `; ${m.noiseDb} dB(A) ± 3 @ 7 m` : ""}.`
        : `Build: sound-attenuated, weatherproof silent canopy${tank ? ` with ${n0(tank)} L base fuel tank` : ""}${m.noiseDb ? `; ${m.noiseDb} dB(A) ± 3 @ 7 m` : ""}.`,
    m.fuelLph ? `Fuel consumption: ${n0(m.fuelLph.p75)} L/h at 75% and ${n0(m.fuelLph.p100)} L/h at 100% prime load.` : null,
    dim?.l && dim.w && dim.h
      ? `Dimensions (L × W × H): ${n0(dim.l)} × ${n0(dim.w)} × ${n0(dim.h)} mm${dim.kg ? `; weight approx. ${n0(dim.kg)} kg` : ""}.`
      : dim?.kg
        ? `Weight: approx. ${n0(dim.kg)} kg.`
        : null,
    "Supplied as a complete ready-to-run package.",
  ];
  return {
    code: m.code,
    title: `${m.code} — ${m.brand} Diesel Generator Set ${n0(m.standbyKva)} kVA, ${build}`,
    description: lines.filter(Boolean).join("\n"),
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
