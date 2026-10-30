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

/** A Leroy-Somer frame in the datasheet style: "TAL044H" → "TAL-A44-H", "TAL0473C" → "TAL-A473-C", "LSA50.2M6" → "LSA50.2 M6". Null when there is no frame (the Perkins list just says "TAL"). */
export function frameName(a: string): string | null {
  const s = a.trim().toUpperCase();
  let m = s.match(/^TAL-?A?0?(\d{2,3})-?([A-Z])(?:\s*\/\s*([A-Z]))?$/);
  if (m) return `TAL-A${m[1]}-${m[2]}${m[3] ? `/${m[3]}` : ""}`;
  m = s.match(/^LSA\s?(\d{2}\.\d)\s?([A-Z]\d?)$/);
  return m ? `LSA${m[1]} ${m[2]}` : null;
}

/**
 * Naming rule (owner, 26 Oct 2026): a TAL / LSA alternator is Leroy-Somer; any other alternator on the lists is
 * a "4U Power alternator" — never described as Chinese, by its supplier's brand, or as a generic "brushless" one.
 */
export const isLeroySomer = (a: string | null | undefined) => !!a && /^(TAL|LSA)/i.test(a.trim());
export function alternatorName(a: string): string {
  if (!isLeroySomer(a)) return "4U Power alternator";
  const f = frameName(a);
  return f ? `Leroy-Somer ${f}` : "Leroy-Somer alternator";
}

/** "List: CP455/500 · QSZ13G5" — the price-list line an option comes from, for the editor (never printed on the quotation). */
export const listRef = (o: Pick<PriceOption, "listLabel" | "listEngine">) => `List: ${o.listLabel} · ${o.listEngine}`;

/**
 * Where the list says the alternator comes from: Kubota's origin column adds it after a slash ("JAPAN / EU"),
 * the others name it in the alternator column ("KWISE (CHINA)", "CHINA"). Null when the list does not say.
 */
export function alternatorOrigin(o: Pick<PriceOption, "alternator" | "origin">): string | null {
  const after = o.origin.split("/")[1]?.trim();
  if (after) return titleCase(after);
  const inBrackets = o.alternator.match(/\(([^)]+)\)/)?.[1]?.trim();
  if (inBrackets) return titleCase(inBrackets);
  return /^china$/i.test(o.alternator.trim()) ? "China" : null;
}

/**
 * "Engine India · 4U Power alternator (China)", "Engine China · Leroy-Somer TAL-A44-H" — for the sales team in the
 * editor, so a price can be chosen by where engine and alternator come from. Never printed on the quotation, which
 * only names the alternator (`alternatorName`). An alternator with no stated origin shows its list code instead.
 */
export const optionLabel = (o: Pick<PriceOption, "alternator" | "origin">) => {
  const engine = o.origin.split("/")[0]!.trim();
  const from = alternatorOrigin(o) ?? (isLeroySomer(o.alternator) || !o.alternator.trim() ? null : o.alternator.trim());
  return [engine && `Engine ${titleCase(engine)}`, `${alternatorName(o.alternator)}${from ? ` (${from})` : ""}`].filter(Boolean).join(" · ");
};

/** The option a new line starts with: the Leroy-Somer (TAL / LSA) alternator, as on the 4U datasheets, else the first. */
export const defaultOption = (opts: PriceOption[] | undefined) => opts?.find((o) => isLeroySomer(o.alternator)) ?? opts?.[0];
