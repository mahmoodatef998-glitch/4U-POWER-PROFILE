import type { NextRequest } from "next/server";
import { googleConfigured, gscRows } from "@/lib/google";
import { csvCell } from "@/lib/sales";
import { classify, KIND_LABEL } from "@/lib/seo-opportunities";

export const dynamic = "force-dynamic";

/** SEO opportunities as CSV for Excel (behind the /admin Basic Auth). */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) return new Response("Search Console is not connected.", { status: 503 });
  const days = req.nextUrl.searchParams.get("days") === "90" ? 90 : 28;
  const ops = classify(await gscRows(days, 5000));
  const rows = [
    ["Type", "Search", "Language", "Page Google shows", "Position", "Shown", "Clicks", "What to do"],
    ...ops.map((o) => [KIND_LABEL[o.kind], o.query, o.locale, o.page, o.position, o.impressions, o.clicks, o.action]),
  ];
  return new Response("﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="4u-seo-opportunities-${days}d.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
