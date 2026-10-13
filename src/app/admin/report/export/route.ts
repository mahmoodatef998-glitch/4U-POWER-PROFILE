import type { NextRequest } from "next/server";
import { ownerKey, periodRange, toCsv } from "@/lib/sales";
import { loadEnquiries } from "@/lib/sales-data";
import { getAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Every enquiry of the report's period as a CSV that opens in Excel (behind the /admin Basic Auth). */
export async function GET(req: NextRequest) {
  const sb = getAdminClient();
  if (!sb) return new Response("Supabase is not configured.", { status: 503 });
  const q = req.nextUrl.searchParams;
  const period = periodRange(q.get("p") ?? undefined, q.get("from") ?? undefined, q.get("to") ?? undefined);
  const owner = q.get("owner")?.trim() ?? "";
  const list = (await loadEnquiries(sb, period.start, period.end)).filter((e) => !owner || ownerKey(e.owner) === ownerKey(owner));
  return new Response(toCsv(list), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="4u-enquiries-${period.from}_to_${period.to}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
