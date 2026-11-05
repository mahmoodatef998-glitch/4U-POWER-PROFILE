import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { validAdminAuth } from "./lib/admin-auth";

const intl = createMiddleware(routing);

function adminGuard(req: NextRequest) {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) return new NextResponse("Admin disabled: set ADMIN_USER and ADMIN_PASSWORD.", { status: 503 });
  if (validAdminAuth(req.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="4U Admin", charset="UTF-8"' },
  });
}

export default function middleware(req: NextRequest) {
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
