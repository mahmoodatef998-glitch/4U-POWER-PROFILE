import "server-only";

import { googlePost, gscSite } from "./google-core";

export { gaConfigured, googleConfigured, gscRows, gscSite } from "./google-core";

// ---------------------------------------------------------------- GA4

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaReport = { rows?: GaRow[]; totals?: GaRow[] };

const ga = (method: "runReport" | "runRealtimeReport", body: object) =>
  googlePost<GaReport>(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:${method}`, body);

const num = (r: GaRow | undefined, i = 0) => Number(r?.metricValues?.[i]?.value ?? 0);

/** Visitors (active users), sessions and page views for a GA date range, e.g. ("today","today"). */
export async function gaTotals(startDate: string, endDate = "today") {
  const r = await ga("runReport", {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
  });
  const row = r.rows?.[0];
  return { users: num(row, 0), sessions: num(row, 1), views: num(row, 2) };
}

export async function gaActiveNow() {
  const r = await ga("runRealtimeReport", { metrics: [{ name: "activeUsers" }] });
  return num(r.rows?.[0]);
}

/** Visitors per day for the last `days` days (oldest first). */
export async function gaDaily(days = 14) {
  const r = await ga("runReport", {
    dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });
  return (r.rows ?? []).map((row) => ({ date: row.dimensionValues![0]!.value, users: num(row) }));
}

/** Top values of one dimension over the last 30 days, by visitors. */
export async function gaTop(dimension: "pagePath" | "sessionDefaultChannelGroup" | "country" | "deviceCategory", limit = 10) {
  const r = await ga("runReport", {
    dateRanges: [{ startDate: "29daysAgo", endDate: "today" }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit,
  });
  return (r.rows ?? []).map((row) => ({ key: row.dimensionValues![0]!.value, users: num(row, 0), views: num(row, 1) }));
}

// ---------------------------------------------------------------- Search Console

type GscRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

const isoDay = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

/** Search Console performance for the last `days` (default 28; data lags ~2 days). No dimension = totals. */
export async function gscQuery(dimension?: "query" | "page", limit = 25, days = 28) {
  const r = await googlePost<{ rows?: GscRow[] }>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite())}/searchAnalytics/query`, {
    startDate: isoDay(days + 1),
    endDate: isoDay(1),
    ...(dimension ? { dimensions: [dimension], rowLimit: limit } : {}),
  });
  return (r.rows ?? []).map((row) => ({ key: row.keys?.[0] ?? "", clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
}

/** Runs a dashboard query, returning null instead of throwing so one failing source never breaks the page. */
export async function safe<T>(p: Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await p, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}
