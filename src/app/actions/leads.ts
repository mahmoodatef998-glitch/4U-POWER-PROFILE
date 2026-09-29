"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";
import { notifyLead } from "@/lib/notify";

export type LeadState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "phone" | "email", string>>;
};

const LeadSchema = z.object({
  name: z.string().trim().min(2, "errName").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/[^\d]/g, "").length >= 7, "errPhone"),
  email: z.union([z.literal(""), z.string().trim().email("errEmail").max(200)]),
  country: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
  source: z.enum(["contact_form", "quote_form", "calculator", "product"]).default("contact_form"),
  source_page: z.string().max(300).optional().default(""),
  product_slug: z.string().max(120).optional().default(""),
  calculated_kva: z.coerce.number().positive().max(100000).optional().or(z.literal("").transform(() => undefined)),
  calc_submission_id: z.string().uuid().optional().or(z.literal("")),
  locale: z.enum(["en", "ar"]).default("en"),
  utm_source: z.string().max(120).optional().default(""),
  utm_medium: z.string().max(120).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  gclid: z.string().max(300).optional().default(""),
});

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("company_website")) return { status: "success" };

  const parsed = LeadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: LeadState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as "name" | "phone" | "email";
      if (["name", "phone", "email"].includes(field)) errors[field] = issue.message;
    }
    return { status: "error", errors };
  }

  const { calc_submission_id, ...d } = parsed.data;
  const row = {
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    country: d.country || null,
    message: d.message || null,
    source: d.source,
    source_page: d.source_page || (await headers()).get("referer"),
    product_slug: d.product_slug || null,
    calculated_kva: d.calculated_kva ?? null,
    locale: d.locale,
    utm_source: d.utm_source || null,
    utm_medium: d.utm_medium || null,
    utm_campaign: d.utm_campaign || null,
    gclid: d.gclid || null,
  };

  const sb = getAdminClient();
  if (!sb) {
    console.warn("[lead] Supabase not configured — lead logged only:", row);
  } else {
    const { error } = await sb.from("leads").insert(row);
    if (error) {
      console.error("[lead] insert failed", error.message);
      return { status: "error" };
    }
    if (calc_submission_id) {
      await sb.from("calculator_submissions").update({ converted_to_lead: true }).eq("id", calc_submission_id);
    }
  }

  await notifyLead(row);
  return { status: "success" };
}
