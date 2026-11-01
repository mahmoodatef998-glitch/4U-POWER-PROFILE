import "server-only";
import { getAdminClient } from "./supabase/server";

/**
 * Exchange rates for quotations, as AED per one unit of each currency.
 * - USD and SAR are pegged by their central banks (1 USD = 3.6725 AED; 1 USD = 3.75 SAR), so they are exact constants.
 * - GBP (the Perkins list) and EUR float: live market quotes from Yahoo Finance (the same feed Google shows, updated
 *   through the trading day), refreshed every 10 minutes; if that fails, the daily rates of open.er-api.com; if both
 *   fail, the rate last saved on /admin/quotes/prices.
 * A quotation keeps the rate it was saved with (quotations.fx_rate), so a later move never changes an issued price.
 */

export const USD_AED = 3.6725;
export const SAR_AED = USD_AED / 3.75;

export type FxRates = {
  /** AED per 1 GBP / EUR / USD / SAR; EUR is null when no source answered and nothing is saved */
  GBP: number;
  EUR: number | null;
  USD: number;
  SAR: number;
  source: "live" | "daily" | "saved";
  /** ISO time of the quote */
  at: string;
};

const ok = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

async function yahoo(pair: "GBPAED" | "EURAED"): Promise<{ rate: number; at: string } | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${pair}=X?range=1d&interval=15m`, {
      headers: { "User-Agent": "Mozilla/5.0 (4U Power quotations)", Accept: "application/json" },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const meta = (await res.json())?.chart?.result?.[0]?.meta;
    const rate = meta?.regularMarketPrice;
    if (!ok(rate)) return null;
    return { rate, at: new Date((meta.regularMarketTime ?? Date.now() / 1000) * 1000).toISOString() };
  } catch {
    return null;
  }
}

async function daily(): Promise<{ GBP: number; EUR: number; at: string } | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/AED", { next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const j = await res.json();
    const gbp = j?.rates?.GBP;
    const eur = j?.rates?.EUR;
    if (!ok(gbp) || !ok(eur)) return null;
    return { GBP: 1 / gbp, EUR: 1 / eur, at: new Date((j.time_last_update_unix ?? Date.now() / 1000) * 1000).toISOString() };
  } catch {
    return null;
  }
}

async function saved(): Promise<{ GBP: number | null; EUR: number | null }> {
  const sb = getAdminClient();
  if (!sb) return { GBP: null, EUR: null };
  const { data } = await sb.from("app_settings").select("key,value").in("key", ["gbp_aed_rate", "eur_aed_rate"]);
  const get = (k: string) => {
    const n = Number(data?.find((r) => r.key === k)?.value);
    return ok(n) ? n : null;
  };
  return { GBP: get("gbp_aed_rate"), EUR: get("eur_aed_rate") };
}

/** Saved fallback when no source answers and nothing was ever saved (the rate of the 2026 Perkins list). */
export const DEFAULT_GBP_AED = 4.91;

const round4 = (n: number) => Math.round(n * 10000) / 10000;

export async function fxRates(): Promise<FxRates> {
  const [g, e] = await Promise.all([yahoo("GBPAED"), yahoo("EURAED")]);
  if (g && e) return { GBP: round4(g.rate), EUR: round4(e.rate), USD: USD_AED, SAR: round4(SAR_AED), source: "live", at: g.at };
  const d = await daily();
  if (d) return { GBP: round4(d.GBP), EUR: round4(d.EUR), USD: USD_AED, SAR: round4(SAR_AED), source: "daily", at: d.at };
  const s = await saved();
  return { GBP: s.GBP ?? DEFAULT_GBP_AED, EUR: s.EUR, USD: USD_AED, SAR: round4(SAR_AED), source: "saved", at: new Date().toISOString() };
}
