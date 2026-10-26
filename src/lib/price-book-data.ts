import "server-only";
import { optionKey, toAed, type PriceBook, type PriceListId } from "./price-book";
import { getAdminClient } from "./supabase/server";

export const DEFAULT_GBP_RATE = 4.91;

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

export async function gbpRate(): Promise<number> {
  const sb = getAdminClient();
  if (!sb) return DEFAULT_GBP_RATE;
  const { data } = await sb.from("app_settings").select("value").eq("key", "gbp_aed_rate").maybeSingle();
  const n = Number(data?.value);
  return n > 0 ? n : DEFAULT_GBP_RATE;
}

/** Price options per 4U model for the quotation editor, or null when no price list is loaded. */
export async function loadPriceBook(): Promise<PriceBook | null> {
  const [rows, rate] = await Promise.all([priceRows(), gbpRate()]);
  if (!rows.length) return null;
  const models: PriceBook["models"] = {};
  for (const r of rows) {
    for (const code of r.model_codes) {
      const lists = (models[code] ??= {});
      (lists[r.list] ??= []).push({ key: optionKey(r.alternator, r.origin), alternator: r.alternator, origin: r.origin, currency: r.currency, price: r.price, aed: toAed(r.price, r.currency, rate) });
    }
  }
  return { edition: rows[0]!.edition, gbpRate: rate, models };
}
