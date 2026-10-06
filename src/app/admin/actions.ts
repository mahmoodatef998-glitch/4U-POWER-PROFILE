"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { submitIndexNow } from "@/lib/indexnow";
import { localeUrl } from "@/lib/seo";
import { getAdminClient } from "@/lib/supabase/server";

// All admin routes sit behind Basic Auth in middleware; these actions also require the service role.
function db() {
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  return sb;
}

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
const money = z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().min(0).max(1e9).nullable());

export async function updateLeadStatus(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(STATUSES).parse(formData.get("status"));
  const deal_value = money.parse(formData.get("deal_value"));
  await db().from("leads").update({ status, deal_value }).eq("id", id);
  revalidatePath("/admin");
}

export async function updateWaClick(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(STATUSES).parse(formData.get("status"));
  const deal_value = money.parse(formData.get("deal_value"));
  const notes = z.string().trim().max(1000).parse(formData.get("notes") ?? "") || null;
  await db().from("whatsapp_clicks").update({ status, deal_value, notes }).eq("id", id);
  revalidatePath("/admin/whatsapp");
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
  // tell Bing & co. about the new article straight away (runs after the response is sent)
  after(() =>
    submitIndexNow(
      (["en", "ar"] as const).flatMap((l) => [localeUrl(l, `/news/${d.slug}`), localeUrl(l, "/news")]),
    ),
  );
  redirect("/admin/news?created=1");
}

export async function togglePost(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const next = formData.get("next") === "true";
  await db().from("news_posts").update({ is_published: next }).eq("id", id);
  revalidatePath("/[locale]/news", "page");
  revalidatePath("/admin/news");
}
