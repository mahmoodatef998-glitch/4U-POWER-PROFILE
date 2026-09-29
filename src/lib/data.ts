import "server-only";

import { cache } from "react";
import { getPublicClient } from "./supabase/server";
import type { NewsPost, Product, Project, Testimonial } from "./types";
import { products as seedProducts } from "@/content/products";
import { projects as seedProjects, testimonials as seedTestimonials } from "@/content/projects";
import { newsPosts as seedNews } from "@/content/news";

/**
 * Content access layer. Reads from Supabase when configured, otherwise falls back to the bundled
 * seed content (same data as supabase/seed/*.sql) so the site always renders.
 */
async function fromSupabase<T>(table: string, order: { column: string; ascending: boolean }): Promise<T[] | null> {
  const sb = getPublicClient();
  if (!sb) return null;
  const { data, error } = await sb.from(table).select("*").eq("is_published", true).order(order.column, order);
  if (error) {
    console.error(`[data] ${table}:`, error.message);
    return null;
  }
  // An empty content table (fresh project, seed not loaded yet) must never render an empty site.
  return data.length ? (data as T[]) : null;
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await fromSupabase<Product>("products", { column: "sort_order", ascending: true });
  return (rows ?? seedProducts.filter((p) => p.is_published)).map((p) => ({ ...p, specs: p.specs ?? [], images: p.images ?? [] }));
});

export const getProduct = cache(async (slug: string) => (await getProducts()).find((p) => p.slug === slug) ?? null);

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = await fromSupabase<Project>("projects", { column: "created_at", ascending: false });
  return rows ?? seedProjects.filter((p) => p.is_published);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const rows = await fromSupabase<Testimonial>("testimonials", { column: "created_at", ascending: false });
  if (rows && rows.length) return rows;
  // Placeholder quotes are for design preview only — never shown in production by default.
  return process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIALS === "true" ? seedTestimonials : [];
});

export const getNews = cache(async (): Promise<NewsPost[]> => {
  const rows = await fromSupabase<NewsPost>("news_posts", { column: "published_at", ascending: false });
  const list = rows ?? [...seedNews].sort((a, b) => b.published_at.localeCompare(a.published_at));
  const now = Date.now();
  return list.filter((p) => p.is_published && new Date(p.published_at).getTime() <= now);
});

export const getNewsPost = cache(async (slug: string) => (await getNews()).find((p) => p.slug === slug) ?? null);
