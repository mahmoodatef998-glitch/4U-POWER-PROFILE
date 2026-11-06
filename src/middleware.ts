import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { validAdminAuth } from "./lib/admin-auth";
import { isBlockedIp } from "./lib/blocklist";

const intl = createMiddleware(routing);

/** Supabase RPC with the service role (bans, failed-login counter). Null on any failure: never locks the owner out by error. */
async function rpc(fn: string, args: Record<string, unknown>): Promise<unknown> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/** Banned IPs from Supabase (blocked_ips), refreshed at most once a minute per edge instance. */
let banned: { at: number; ips: Set<string> } = { at: 0, ips: new Set() };
async function isBanned(ip: string) {
  if (isBlockedIp(ip)) return true;
  if (Date.now() - banned.at > 60_000) {
    const list = await rpc("blocked_ip_list", {});
    banned = { at: Date.now(), ips: Array.isArray(list) ? new Set(list.map(String)) : banned.ips };
  }
  return banned.ips.has(ip);
}

const clientIp = (req: NextRequest) => (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "").trim();

/**
 * Countries the admin can be opened from (Vercel's geo header). Both attacks on 5–6 Nov 2026 came from abroad
 * (Hong Kong, Japan). ADMIN_COUNTRIES="AE,SA" widens it; "*" turns it off.
 */
function adminCountryAllowed(req: NextRequest) {
  const allowed = (process.env.ADMIN_COUNTRIES || "AE").split(",").map((c) => c.trim().toUpperCase());
  if (allowed.includes("*")) return true;
  const country = req.headers.get("x-vercel-ip-country");
  if (!country) return process.env.VERCEL !== "1"; // no geo header only off Vercel (local dev)
  return allowed.includes(country.toUpperCase());
}

async function adminGuard(req: NextRequest, ip: string) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) return new NextResponse("Admin disabled: set ADMIN_USER and ADMIN_PASSWORD.", { status: 503 });
  if (!adminCountryAllowed(req)) return new NextResponse("Not Found", { status: 404 });

  // CSRF: the browser re-sends Basic Auth on any request, so writes must come from the admin's own pages.
  if (req.method !== "GET" && req.method !== "HEAD") {
    const site = req.headers.get("sec-fetch-site");
    const origin = req.headers.get("origin");
    let sameOrigin = !origin;
    try {
      sameOrigin = !origin || new URL(origin).host === req.nextUrl.host;
    } catch {
      sameOrigin = false;
    }
    if ((site && site !== "same-origin" && site !== "none") || !sameOrigin) return new NextResponse("Forbidden", { status: 403 });
  }

  const header = req.headers.get("authorization");
  if (header) {
    if (validAdminAuth(header)) return NextResponse.next();
    // more than 5 wrong passwords in 24 h: the IP is banned from the whole site (owner's rule, 6 Nov 2026)
    if ((await rpc("admin_login_failed", { p_ip: ip || "unknown" })) === true) {
      banned.ips.add(ip);
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="4U Admin", charset="UTF-8"' },
  });
}

export default async function middleware(req: NextRequest) {
  const ip = clientIp(req);
  if (ip && (await isBanned(ip))) return new NextResponse("Forbidden", { status: 403 });
  const path = req.nextUrl.pathname;
  if (path.startsWith("/api")) return NextResponse.next();
  if (path === "/admin" || path.startsWith("/admin/")) return adminGuard(req, ip);
  const res = intl(req);
  // next-intl adds the missing locale with a temporary (307) redirect, so Google kept ranking addresses like
  // /generators/sizes instead of /en/generators/sizes. Deep URLs get a permanent redirect so the ranking moves
  // to the real page; "/" stays temporary because it picks the language per visitor.
  if (res.status === 307 && path !== "/" && res.headers.get("location")) {
    return new NextResponse(null, { status: 308, headers: res.headers });
  }
  return res;
}

export const config = {
  // /admin is listed on its own: the general pattern skips any path with a dot, which let /admin/quotes/x.y through.
  // /api is matched only for the IP ban (it returns before the locale handling).
  matcher: ["/admin", "/admin/:path*", "/api/:path*", "/((?!api|_next|_vercel|images|datasheets|.*\\..*).*)"],
};
