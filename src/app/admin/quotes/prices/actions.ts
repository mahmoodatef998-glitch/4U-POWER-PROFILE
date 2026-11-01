"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";

/** Fallback GBP / EUR → AED rates, used only when no live or daily rate can be fetched (src/lib/fx.ts). */
export async function setFallbackRates(formData: FormData) {
  const rate = z.coerce.number().min(1).max(20);
  const gbp = rate.safeParse(formData.get("gbp"));
  const eur = rate.safeParse(formData.get("eur"));
  if (!gbp.success || !eur.success) redirect("/admin/quotes/prices?msg=Enter+rates+between+1+and+20");
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured.");
  const at = new Date().toISOString();
  const { error } = await sb.from("app_settings").upsert([
    { key: "gbp_aed_rate", value: gbp.data, updated_at: at },
    { key: "eur_aed_rate", value: eur.data, updated_at: at },
  ]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes/prices");
  redirect(`/admin/quotes/prices?msg=Saved+fallback+rates:+1+GBP+=+${gbp.data}+AED,+1+EUR+=+${eur.data}+AED`);
}
