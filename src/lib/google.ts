import "server-only";
import { createSign } from "node:crypto";

/**
 * Read-only access to Google Analytics 4 and Search Console for the /admin dashboard, via a Google
 * Cloud service account (no extra SDK — a signed JWT is exchanged for an access token).
 *
 * Env:
 *  GOOGLE_SERVICE_ACCOUNT_JSON  the service account key file contents (Secret)
 *  GA4_PROPERTY_ID              numeric GA4 property id, e.g. 512345678
 *  GSC_SITE                     Search Console property, default "sc-domain:4ugenerators.com"
 */
type ServiceAccount = { client_email: string; private_key: string };

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly"];

function account(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as ServiceAccount;
    return j.client_email && j.private_key ? { client_email: j.client_email, private_key: j.private_key.replace(/\\n/g, "\n") } : null;
  } catch {
    return null;
  }
}

export const googleConfigured = () => !!account();
export const gaConfigured = () => googleConfigured() && !!process.env.GA4_PROPERTY_ID;
export const gscSite = () => process.env.GSC_SITE || "sc-domain:4ugenerators.com";

let token: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && token.exp > Date.now() + 60_000) return token.value;
  const sa = account();
  if (!sa) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set or invalid");
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: SCOPES.join(" "), aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google auth failed (${res.status})`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return token.value;
}

async function googlePost<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${await accessToken()}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`${new URL(url).hostname} ${res.status}: ${msg.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

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

/** Search Console performance for the last 28 days (data lags ~2 days). No dimension = totals. */
export async function gscQuery(dimension?: "query" | "page", limit = 25) {
  const r = await googlePost<{ rows?: GscRow[] }>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite())}/searchAnalytics/query`, {
    startDate: isoDay(29),
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
