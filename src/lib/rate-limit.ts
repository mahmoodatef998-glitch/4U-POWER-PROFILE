import "server-only";

import { headers } from "next/headers";
import { getAdminClient } from "@/lib/supabase/server";

/** Visitor IP and user agent. On Vercel `x-real-ip` / `x-forwarded-for` are set by the edge, not the client. */
export async function clientInfo() {
  const h = await headers();
  const ip = (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "").trim().slice(0, 64) || null;
  const ua = h.get("user-agent")?.slice(0, 300) || null;
  return { ip, ua };
}

/** [window in seconds, max submissions] per IP and form. */
const LIMITS = {
  lead: [[600, 5], [86_400, 50]],
  parts: [[600, 4], [86_400, 10]],
  calc: [[600, 30], [86_400, 200]],
  click: [[600, 60], [86_400, 400]],
} satisfies Record<string, [number, number][]>;

/**
 * Per-IP rate limit for the public forms (a scanner flooded them on 5 Nov 2026). Records the hit and returns
 * false once the IP is over a limit. Fails open: a database problem never blocks a real customer.
 */
export async function allowSubmission(form: keyof typeof LIMITS): Promise<boolean> {
  const { ip } = await clientInfo();
  const sb = getAdminClient();
  if (!ip || !sb) return true;
  for (const [win, max] of LIMITS[form]) {
    const { data, error } = await sb.rpc("form_rate_ok", { p_key: `${form}:${win}:${ip}`, p_window_seconds: win, p_max: max });
    if (error) {
      console.error("[rate-limit]", error.message);
      return true;
    }
    if (data === false) {
      console.warn(`[rate-limit] ${form} blocked for ${ip}`);
      return false;
    }
  }
  return true;
}

/** One shared limit for everyone (e.g. jobs that call outside services). Fails open like allowSubmission. */
export async function allowGlobal(name: string, windowSeconds: number, max: number): Promise<boolean> {
  const sb = getAdminClient();
  if (!sb) return true;
  const { data, error } = await sb.rpc("form_rate_ok", { p_key: `global:${name}`, p_window_seconds: windowSeconds, p_max: max });
  if (error) {
    console.error("[rate-limit]", error.message);
    return true;
  }
  return data !== false;
}
