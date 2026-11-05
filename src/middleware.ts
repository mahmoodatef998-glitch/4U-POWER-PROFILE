import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { validAdminAuth } from "./lib/admin-auth";

const intl = createMiddleware(routing);

/** Supabase RPC with the service role (form_hits counters). Null on any failure: never locks the owner out by error. */
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

/** 10 wrong passwords from one IP lock the admin for that IP for 15 minutes (even with the right password). */
const LOCK_WINDOW = 900;
const LOCK_AFTER = 10;

async function adminGuard(req: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) return new NextResponse("Admin disabled: set ADMIN_USER and ADMIN_PASSWORD.", { status: 503 });

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
    const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
    const key = `adminfail:${ip}`;
    const fails = await rpc("form_hits_count", { p_key: key, p_window_seconds: LOCK_WINDOW });
    if (typeof fails === "number" && fails >= LOCK_AFTER) {
      return new NextResponse("Too many failed logins from this address. Try again in 15 minutes.", { status: 429, headers: { "Retry-After": String(LOCK_WINDOW) } });
    }
    if (validAdminAuth(header)) return NextResponse.next();
    await rpc("form_rate_ok", { p_key: key, p_window_seconds: LOCK_WINDOW, p_max: 100_000 });
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="4U Admin", charset="UTF-8"' },
  });
}

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) return adminGuard(req);
  const res = intl(req);
  // next-intl adds the missing locale with a temporary (307) redirect, so Google kept ranking addresses like
  // /generators/sizes instead of /en/generators/sizes. Deep URLs get a permanent redirect so the ranking moves
  // to the real page; "/" stays temporary because it picks the language per visitor.
  if (res.status === 307 && req.nextUrl.pathname !== "/" && res.headers.get("location")) {
    return new NextResponse(null, { status: 308, headers: res.headers });
  }
  return res;
}

export const config = {
  // /admin is listed on its own: the general pattern skips any path with a dot, which let /admin/quotes/x.y through.
  matcher: ["/admin", "/admin/:path*", "/((?!api|_next|_vercel|images|datasheets|.*\\..*).*)"],
};
