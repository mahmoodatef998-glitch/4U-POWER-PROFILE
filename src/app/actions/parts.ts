import "server-only";

import { headers } from "next/headers";
import { z } from "zod";
import { notifyLead } from "@/lib/notify";
import { getAdminClient } from "@/lib/supabase/server";

export type PartsState = { status: "idle" | "success" | "error"; errors?: Partial<Record<"name" | "phone" | "part", string>> };

const MAX_PHOTOS = 3;
const MAX_BYTES = 1.5 * 1024 * 1024; // photos are downscaled in the browser before upload
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const PartsSchema = z.object({
  name: z.string().trim().min(2, "errName").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/[^\d]/g, "").length >= 7, "errPhone"),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional().default(""),
  country: z.string().trim().max(60).optional().default(""),
  brand: z.string().trim().max(60).optional().default(""),
  model: z.string().trim().max(160).optional().default(""),
  parts: z.string().trim().max(2000).optional().default(""),
  quantity: z.string().trim().max(40).optional().default(""),
  locale: z.enum(["en", "ar"]).default("en"),
  source_page: z.string().max(300).optional().default(""),
  utm_source: z.string().max(120).optional().default(""),
  utm_medium: z.string().max(120).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  gclid: z.string().max(300).optional().default(""),
});

/** Spare-parts request: details + up to 3 photos (stored in the private `lead-files` bucket) saved as a `parts` lead. */
export async function submitPartsRequest(formData: FormData): Promise<PartsState> {
  if (formData.get("company_website")) return { status: "success" }; // honeypot

  const fields = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string"));
  const parsed = PartsSchema.safeParse(fields);
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0).slice(0, MAX_PHOTOS);

  const errors: PartsState["errors"] = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (k === "name" || k === "phone") errors[k] = issue.message;
    }
  }
  if (parsed.success && !parsed.data.parts && !parsed.data.model && !photos.length) errors.part = "errPart";
  if (!parsed.success || Object.keys(errors).length) return { status: "error", errors };
  if (photos.some((f) => !TYPES[f.type] || f.size > MAX_BYTES)) return { status: "error" };

  const d = parsed.data;
  const sb = getAdminClient();
  const attachments: string[] = [];
  if (sb) {
    const month = new Date().toISOString().slice(0, 7);
    for (const f of photos) {
      const path = `parts/${month}/${crypto.randomUUID()}.${TYPES[f.type]}`;
      const { error } = await sb.storage.from("lead-files").upload(path, f, { contentType: f.type, upsert: false });
      if (error) console.error("[parts] upload failed", error.message);
      else attachments.push(path);
    }
  }

  const message = [
    d.brand && `Brand: ${d.brand}`,
    d.model && `Model / serial: ${d.model}`,
    d.parts && `Parts: ${d.parts}`,
    d.quantity && `Quantity: ${d.quantity}`,
    photos.length ? `Photos: ${attachments.length}/${photos.length}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const row = {
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    country: d.country || null,
    message,
    source: "parts",
    source_page: d.source_page || (await headers()).get("referer"),
    locale: d.locale,
    utm_source: d.utm_source || null,
    utm_medium: d.utm_medium || null,
    utm_campaign: d.utm_campaign || null,
    gclid: d.gclid || null,
    attachments: attachments.length ? attachments : null,
  };

  if (!sb) {
    console.warn("[parts] Supabase not configured — request logged only:", row);
  } else {
    const { error } = await sb.from("leads").insert(row);
    if (error) {
      console.error("[parts] insert failed", error.message);
      return { status: "error" };
    }
  }
  await notifyLead({ ...row, attachments: attachments.length || null });
  return { status: "success" };
}
