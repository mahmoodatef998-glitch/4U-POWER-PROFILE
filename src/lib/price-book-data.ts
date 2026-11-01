import "server-only";
import { fxRates, type FxRates } from "./fx";
import { optionKey, toAed, type PriceBook, type PriceListId } from "./price-book";
import { getAdminClient } from "./supabase/server";

export type PriceRow = {
  edition: string;
  list: PriceListId;
  brand: string;
  section: string;
  label: string;
  engine: string;
  alternator: string;
  origin: string;
  currency: "AED" | "GBP";
  price: number;
  model_codes: string[];
};

/** The rows of the latest price-list edition, in list order. Empty when the table is missing or not loaded yet. */
export async function priceRows(): Promise<PriceRow[]> {
  const sb = getAdminClient();
  if (!sb) return [];
  const { data, error } = await sb.from("price_list_items").select("edition,list,brand,section,label,engine,alternator,origin,currency,price,model_codes").order("edition", { ascending: false }).order("sort").limit(2000);
  if (error || !data?.length) return [];
  const edition = data[0]!.edition;
  return data.filter((r) => r.edition === edition).map((r) => ({ ...r, price: Number(r.price), model_codes: r.model_codes ?? [] }) as PriceRow);
}

/** Price options per 4U model for the quotation editor, or null when no price list is loaded. GBP prices (Perkins) are
 *  converted at the live rate (src/lib/fx.ts); `fx` can be passed when the caller already has the rates. */
export async function loadPriceBook(fx?: FxRates): Promise<PriceBook | null> {
  const [rows, rates] = await Promise.all([priceRows(), fx ?? fxRates()]);
  const rate = rates.GBP;
  if (!rows.length) return null;
  const models: PriceBook["models"] = {};
  for (const r of rows) {
    for (const code of r.model_codes) {
      const lists = (models[code] ??= {});
      (lists[r.list] ??= []).push({
        key: optionKey(r.alternator, r.origin),
        alternator: r.alternator,
        origin: r.origin,
        currency: r.currency,
        price: r.price,
        aed: toAed(r.price, r.currency, rate),
        listLabel: r.label,
        listEngine: r.engine,
      });
    }
  }
  return { edition: rows[0]!.edition, gbpRate: rate, gbpSource: rates.source, gbpAt: rates.at, models };
}
