"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { newsPosts as bundledNews } from "@/content/news";
import { submitIndexNow } from "@/lib/indexnow";
import { localeUrl } from "@/lib/seo";
import { LOST_REASON_KEYS, MANUAL_SOURCE_KEYS, STATUSES, type LostReason, type ManualSource, type SalesTable } from "@/lib/sales";
import { getAdminClient } from "@/lib/supabase/server";

// All admin routes sit behind Basic Auth in middleware; these actions also require the service role.
function db() {
  const sb = getAdminClient();
  if (!sb) throw new Error("Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY).");
  return sb;
}

const money = z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().min(0).max(1e9).nullable());
const text = (max: number) => z.preprocess((v) => (typeof v === "string" && v.trim() ? v.trim() : null), z.string().max(max).nullable());
const PATHS: Record<SalesTable, string> = { leads: "/admin", whatsapp_clicks: "/admin/whatsapp", call_clicks: "/admin/calls" };

/** Status, deal value, owner, lost reason and notes — the same sales fields on leads, WhatsApp clicks and call clicks. */
const SalesUpdate = z.object({
  table: z.enum(["leads", "whatsapp_clicks", "call_clicks"]),
  id: z.string().uuid(),
  status: z.enum(STATUSES),
  deal_value: money,
  owner: text(60),
  lost_reason: z.preprocess((v) => v || null, z.enum(LOST_REASON_KEYS as [LostReason, ...LostReason[]]).nullable()),
  notes: text(1000),
});

export async function updateSales(formData: FormData) {
  const { table, id, ...fields } = SalesUpdate.parse(Object.fromEntries(formData));
  // contacted_at / closed_at are stamped by the sales_stamps trigger
  let { error } = await db().from(table).update(fields).eq("id", id);
  // PGRST204 = unknown column: the sales_report migration is not applied yet — keep status/value saving working
  if (error?.code === "PGRST204") ({ error } = await db().from(table).update({ status: fields.status, deal_value: fields.deal_value }).eq("id", id));
  if (error) throw new Error(error.message);
  revalidatePath(PATHS[table]);
  revalidatePath("/admin/report");
}

/** An enquiry that reached sales outside the website buttons (direct call, WhatsApp without a ref, walk-in, referral). */
const ManualLead = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  source: z.enum(MANUAL_SOURCE_KEYS as [ManualSource, ...ManualSource[]]),
  message: text(2000),
  owner: text(60),
  status: z.enum(STATUSES),
  deal_value: money,
});

export async function addLead(formData: FormData) {
  const d = ManualLead.parse(Object.fromEntries(formData));
  const { error } = await db().from("leads").insert({ ...d, source_page: "admin" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/report");
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
  revalidateNews(d.slug);
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
  const { error } = await db().from("news_posts").update({ is_published: next }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateNews(z.string().optional().parse(formData.get("slug") ?? undefined));
}

/**
 * Hide an article that ships with the site's content calendar (src/content/news-*.ts). Database rows win
 * over bundled ones, so a hidden copy in news_posts takes it off the site; "Show" then uses togglePost.
 */
export async function hideBundledPost(formData: FormData) {
  const slug = z.string().parse(formData.get("slug"));
  const post = bundledNews.find((p) => p.slug === slug);
  if (!post) throw new Error(`No calendar article with slug ${slug}`);
  const { error } = await db()
    .from("news_posts")
    .upsert({ ...post, meta_title_en: post.meta_title_en ?? null, meta_title_ar: post.meta_title_ar ?? null, is_published: false }, { onConflict: "slug" });
  if (error) throw new Error(error.message);
  revalidateNews(slug);
}

/**
 * Refresh the pages that list or show articles, in both languages. The home page is left to its hourly
 * refresh: it is static-only (dynamicParams = false), and on-demand revalidation of such a route 404s.
 */
function revalidateNews(slug?: string) {
  for (const l of ["en", "ar"]) {
    revalidatePath(`/${l}/news`);
    if (slug) revalidatePath(`/${l}/news/${slug}`);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/news");
}
