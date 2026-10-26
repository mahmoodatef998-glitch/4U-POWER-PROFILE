"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";

/** GBP → AED rate for the Perkins list. Saved quotations keep the prices they were saved with. */
export async function setGbpRate(formData: FormData) {
  const rate = z.coerce.number().min(1).max(20).safeParse(formData.get("rate"));
  if (!rate.success) redirect("/admin/quotes/prices?msg=Enter+a+rate+between+1+and+20");
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured.");
  const { error } = await sb.from("app_settings").upsert({ key: "gbp_aed_rate", value: rate.data, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes/prices");
  redirect(`/admin/quotes/prices?msg=Saved:+1+GBP+=+${rate.data}+AED`);
}
