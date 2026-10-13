// Shared by the /admin dashboard (src/lib/google.ts) and scripts/seo-snapshot.ts (GitHub Action), so no "server-only" here.
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

export async function googlePost<T>(url: string, body: object): Promise<T> {
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

export type GscRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
export type SearchRow = { query: string; page: string; clicks: number; impressions: number; position: number };

const isoDay = (offset: number) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

/** Search Console rows by query and page for the last `days` (data lags ~2 days), most impressions first. */
export async function gscRows(days = 28, limit = 2000): Promise<SearchRow[]> {
  const r = await googlePost<{ rows?: GscRow[] }>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite())}/searchAnalytics/query`, {
    startDate: isoDay(days + 1),
    endDate: isoDay(1),
    dimensions: ["query", "page"],
    rowLimit: limit,
  });
  return (r.rows ?? []).map((row) => ({ query: row.keys?.[0] ?? "", page: row.keys?.[1] ?? "", clicks: row.clicks, impressions: row.impressions, position: row.position }));
}
