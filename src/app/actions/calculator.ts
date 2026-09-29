"use server";

import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";

const CalcSchema = z.object({
  mode: z.enum(["known_load", "site_builder"]),
  load_type: z.string().max(40).nullable(),
  input_kw: z.number().nonnegative().max(1e6).nullable(),
  input_amps: z.number().nonnegative().max(1e6).nullable(),
  voltage: z.number().nonnegative().max(1e5).nullable(),
  phases: z.number().int().min(1).max(3).nullable(),
  power_factor: z.number().min(0.5).max(1),
  safety_margin: z.number().min(0).max(100),
  running_kva: z.number().nonnegative().max(1e6),
  recommended_kva: z.number().nonnegative().max(1e6),
  recommended_ats_amps: z.number().nonnegative().max(1e6),
  matched_product_slug: z.string().max(120).nullable(),
  locale: z.enum(["en", "ar"]),
  source_page: z.string().max(300),
});

export type CalcLog = z.infer<typeof CalcSchema>;

/** Logs every completed calculation (intent data), returns the row id so a later lead can be linked. */
export async function logCalculation(input: CalcLog): Promise<{ id: string | null }> {
  const parsed = CalcSchema.safeParse(input);
  if (!parsed.success) return { id: null };
  const sb = getAdminClient();
  if (!sb) {
    console.info("[calculator] (no Supabase) ", parsed.data.recommended_kva, "kVA");
    return { id: null };
  }
  const { data, error } = await sb.from("calculator_submissions").insert(parsed.data).select("id").single();
  if (error) {
    console.error("[calculator] insert failed", error.message);
    return { id: null };
  }
  return { id: data.id as string };
}
