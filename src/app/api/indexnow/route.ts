import { NextResponse, type NextRequest } from "next/server";
import sitemap from "@/app/sitemap";
import { getNews } from "@/lib/data";
import { submitIndexNow } from "@/lib/indexnow";
import { localeUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** a daily run looks back this far, so one missed run still catches the article */
const RECENT_MS = 2 * 864e5;

/**
 * Tells IndexNow engines (Bing, Yandex…) about our URLs. Called by Vercel Cron (vercel.json):
 * - weekly, no params: every sitemap URL;
 * - daily, `?scope=recent`: articles that went live in the last 48 h (calendar articles publish themselves
 *   on their date, so nothing else announces them) plus the news index pages.
 * Can also be opened by hand after a big content update. When CRON_SECRET is set, Vercel sends it as a
 * bearer token and anything else is rejected.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (req.nextUrl.searchParams.get("scope") === "recent") {
    const since = Date.now() - RECENT_MS;
    const fresh = (await getNews()).filter((n) => Date.parse(n.published_at) >= since);
    if (!fresh.length) return NextResponse.json({ ok: true, count: 0, note: "no new articles" });
    const urls = (["en", "ar"] as const).flatMap((l) => [localeUrl(l, "/news"), ...fresh.map((n) => localeUrl(l, `/news/${n.slug}`))]);
    const result = await submitIndexNow(urls);
    return NextResponse.json({ ...result, articles: fresh.map((n) => n.slug) }, { status: result.ok ? 200 : 502 });
  }
  const entries = await sitemap();
  const result = await submitIndexNow(entries.map((e) => e.url));
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
