import { NextResponse, type NextRequest } from "next/server";
import sitemap from "@/app/sitemap";
import { submitIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

/**
 * Re-submits every sitemap URL to IndexNow. Called weekly by Vercel Cron (vercel.json); can also be
 * opened once by hand after a big content update. When CRON_SECRET is set, Vercel sends it as a bearer
 * token and anything else is rejected.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const entries = await sitemap();
  const result = await submitIndexNow(entries.map((e) => e.url));
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
