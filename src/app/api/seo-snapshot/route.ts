import { NextResponse, type NextRequest } from "next/server";
import { googleConfigured, gscRows, gscSite } from "@/lib/google-core";
import { snapshot } from "@/lib/seo-opportunities";
import { getAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAYS = 28;
/** without the cron secret, a call only runs when the last snapshot is older than this (no spamming Google) */
const STALE_MS = 20 * 36e5;
const KEEP = 60;

/**
 * Daily snapshot of real Google searches into Supabase (seo_snapshots), for the weekly article run.
 * Called by Vercel Cron (vercel.json). The response only has counts, never the searches themselves.
 */
export async function GET(req: NextRequest) {
  const sb = getAdminClient();
  if (!sb) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  if (!googleConfigured()) return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_JSON is not set" }, { status: 503 });

  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    const { data: last } = await sb.from("seo_snapshots").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (last && Date.now() - Date.parse(last.created_at) < STALE_MS) return NextResponse.json({ ok: true, skipped: "fresh snapshot already taken", at: last.created_at });
  }

  const rows = await gscRows(DAYS, 5000);
  const snap = snapshot(rows, gscSite(), DAYS);
  const { error } = await sb.from("seo_snapshots").insert({ site: snap.site, days: DAYS, rows: rows.length, data: snap });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // keep the last two months
  const { data: old } = await sb.from("seo_snapshots").select("id").order("created_at", { ascending: false }).range(KEEP, KEEP + 100);
  if (old?.length) await sb.from("seo_snapshots").delete().in("id", old.map((r) => r.id));

  return NextResponse.json({ ok: true, rows: rows.length, top: snap.top.length, gaps: snap.gaps.length, quick_wins: snap.quick_wins.length, push: snap.push.length, winners: snap.winners.length });
}
