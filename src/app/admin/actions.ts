"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/server";

// All admin routes sit behind Basic Auth in middleware; these actions also require the service role.
function db() {
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  return sb;
}

export async function updateLeadStatus(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["new", "contacted", "won", "lost"]).parse(formData.get("status"));
  await db().from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

const PostSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: lowercase-words-with-dashes"),
  title_en: z.string().trim().min(10),
  title_ar: z.string().trim().min(5),
  meta_title_en: z.string().trim().max(70).optional().default(""),
  meta_title_ar: z.string().trim().max(70).optional().default(""),
  excerpt_en: z.string().trim().min(40).max(170),
  excerpt_ar: z.string().trim().min(30).max(170),
  body_en: z.string().trim().min(200),
  body_ar: z.string().trim().min(150),
  cover_image: z.string().trim().optional().default(""),
  published_at: z.string().trim().optional().default(""),
});

export async function createPost(_prev: { error?: string } | null, formData: FormData) {
  const parsed = PostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ") };
  const d = parsed.data;
  const { error } = await db()
    .from("news_posts")
    .insert({
      ...d,
      meta_title_en: d.meta_title_en || null,
      meta_title_ar: d.meta_title_ar || null,
      cover_image: d.cover_image || null,
      published_at: d.published_at ? new Date(d.published_at).toISOString() : new Date().toISOString(),
      is_published: true,
    });
  if (error) return { error: error.message };
  revalidatePath("/[locale]/news", "page");
  revalidatePath("/[locale]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/news?created=1");
}

export async function togglePost(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const next = formData.get("next") === "true";
  await db().from("news_posts").update({ is_published: next }).eq("id", id);
  revalidatePath("/[locale]/news", "page");
  revalidatePath("/admin/news");
}
