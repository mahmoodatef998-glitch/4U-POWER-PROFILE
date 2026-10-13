import type { NextRequest } from "next/server";
import { ownerKey, periodRange, toCsv, type SalesTable } from "@/lib/sales";
import { loadEnquiries } from "@/lib/sales-data";
import { getAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TABLES: SalesTable[] = ["leads", "whatsapp_clicks", "call_clicks"];

/**
 * Enquiries as a CSV that opens in Excel (behind the /admin Basic Auth). Same period as the report;
 * `p=all` for everything, `only=leads` for form/logged leads, plus optional owner / source / status / q filters.
 */
export async function GET(req: NextRequest) {
  const sb = getAdminClient();
  if (!sb) return new Response("Supabase is not configured.", { status: 503 });
  const q = req.nextUrl.searchParams;
  const all = q.get("p") === "all";
  const period = all ? null : periodRange(q.get("p") ?? undefined, q.get("from") ?? undefined, q.get("to") ?? undefined);
  const start = period?.start ?? new Date(0);
  const end = period?.end ?? new Date(Date.now() + 864e5);
  const only = TABLES.find((t) => t === q.get("only"));
  const owner = q.get("owner")?.trim() ?? "";
  const source = q.get("source") ?? "";
  const status = q.get("status") ?? "";
  const term = q.get("q")?.trim().toLowerCase() ?? "";

  let rows;
  try {
    rows = await loadEnquiries(sb, start, end);
  } catch (e) {
    const hint = "If this mentions a missing table or column, apply supabase/migrations/20261014000000_sales_report.sql in Supabase.";
    return new Response(`Could not export: ${(e as Error).message}\n${hint}`, { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const list = rows.filter(
    (e) =>
      (!only || e.table === only) &&
      (!owner || ownerKey(e.owner) === ownerKey(owner)) &&
      (!source || e.source === source) &&
      (!status || e.status === status) &&
      (!term || [e.name, e.phone, e.email, e.message, e.ref].some((v) => v?.toLowerCase().includes(term))),
  );
  const name = `4u-${only === "leads" ? "leads" : "enquiries"}-${period ? `${period.from}_to_${period.to}` : "all"}.csv`;
  return new Response(toCsv(list), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
