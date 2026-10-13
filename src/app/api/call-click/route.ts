import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Click = z.object({
  page: z.string().max(300).optional(),
  page_title: z.string().max(160).optional(),
  location: z.string().max(80).optional(),
  locale: z.enum(["en", "ar"]).optional(),
  referrer: z.string().max(300).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
});

/** Logs a tap on a call (tel:) button, sent with navigator.sendBeacon, for the sales report. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 4000) return new NextResponse(null, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = Click.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  const sb = getAdminClient();
  if (sb) {
    const row = Object.fromEntries(Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v]));
    const { error } = await sb.from("call_clicks").insert(row);
    if (error) console.error("[call-click] insert failed", error.message);
  }
  return new NextResponse(null, { status: 204 });
}
