import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";
import { WA_REF_RE } from "@/lib/wa-ref";

export const dynamic = "force-dynamic";

const Click = z.object({
  ref: z.string().regex(WA_REF_RE),
  page: z.string().max(300).optional(),
  location: z.string().max(80).optional(),
  locale: z.enum(["en", "ar"]).optional(),
  referrer: z.string().max(300).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
});

/** Logs a WhatsApp click (sent with navigator.sendBeacon) so sales can match the chat's ref code to its source. */
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
    const d = parsed.data;
    const row = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v === "" ? null : v]));
    const { error } = await sb.from("whatsapp_clicks").upsert(row, { onConflict: "ref", ignoreDuplicates: true });
    if (error) console.error("[wa-click] insert failed", error.message);
  }
  return new NextResponse(null, { status: 204 });
}
