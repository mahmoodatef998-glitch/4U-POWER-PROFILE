/**
 * 4U price lists (UAE and Export) as the quotation editor uses them. The prices themselves live in the private
 * database (table price_list_items, loaded from the PDF price lists, never in this public repository); this file
 * only holds the shapes and the rules, so it is safe for the client editor.
 */

export type PriceListId = "uae" | "export";
export const PRICE_LISTS: { id: PriceListId; label: string; vat: number }[] = [
  { id: "uae", label: "UAE price list", vat: 5 },
  { id: "export", label: "Export price list", vat: 0 },
];

/** One way a model is priced on a list: alternator and origin, the list price and that price in AED, and the list's own model code and engine (to check against the datasheet). */
export type PriceOption = { key: string; alternator: string; origin: string; currency: "AED" | "GBP"; price: number; aed: number; listLabel: string; listEngine: string };
/** Options per 4U model code and list, in price-list order. */
export type PriceBook = { edition: string; gbpRate: number; models: Record<string, Partial<Record<PriceListId, PriceOption[]>>> };

export const optionKey = (alternator: string, origin: string) => `${alternator}|${origin}`;

/** The Perkins list is in pounds: converted at the rate set on /admin/quotes/prices, to the whole dirham. */
export const toAed = (price: number, currency: "AED" | "GBP", gbpRate: number) => (currency === "GBP" ? Math.round(price * gbpRate) : price);

const titleCase = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\b(Usa|Uk|Eu)\b/g, (m) => m.toUpperCase());

export function alternatorName(a: string): string {
  if (/^KWISE/i.test(a)) return "Kwise alternator (China)";
  if (/^CHINA$/i.test(a)) return "China alternator";
  if (a === "TAL") return "Leroy-Somer TAL alternator";
  if (/^(TAL|LSA)/i.test(a)) return `Leroy-Somer ${a}`;
  if (/^LP/i.test(a)) return `LP ${a} alternator`;
  return a;
}

/** "List: CP455/500 · QSZ13G5" — the price-list line an option comes from, for the editor (never printed on the quotation). */
export const listRef = (o: Pick<PriceOption, "listLabel" | "listEngine">) => `List: ${o.listLabel} · ${o.listEngine}`;

export const optionLabel = (o: Pick<PriceOption, "alternator" | "origin">) => [alternatorName(o.alternator), o.origin && titleCase(o.origin)].filter(Boolean).join(" · ");

/** The option a new line starts with: the Leroy-Somer (TAL / LSA) alternator, as on the 4U datasheets, else the first. */
export const defaultOption = (opts: PriceOption[] | undefined) => opts?.find((o) => /^(TAL|LSA)/.test(o.alternator)) ?? opts?.[0];
