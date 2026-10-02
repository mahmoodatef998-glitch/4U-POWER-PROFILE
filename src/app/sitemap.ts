import type { MetadataRoute } from "next";
import { GENERATOR_SIZES, sizeSlug } from "@/content/generator-sizes";
import { industries } from "@/content/industries";
import { cities } from "@/content/locations";
import { marketPages } from "@/content/markets";
import { getNews, getProducts } from "@/lib/data";
import { localeUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/generators", priority: 0.95, freq: "weekly" },
  { path: "/ats-panels", priority: 0.95, freq: "weekly" },
  { path: "/switchgear", priority: 0.95, freq: "weekly" },
  { path: "/products", priority: 0.9, freq: "weekly" },
  { path: "/generators/sizes", priority: 0.85, freq: "monthly" },
  { path: "/locations", priority: 0.8, freq: "monthly" },
  { path: "/calculator", priority: 0.85, freq: "monthly" },
  { path: "/industries", priority: 0.8, freq: "monthly" },
  { path: "/services", priority: 0.8, freq: "monthly" },
  { path: "/markets", priority: 0.7, freq: "monthly" },
  { path: "/projects", priority: 0.7, freq: "monthly" },
  { path: "/news", priority: 0.8, freq: "weekly" },
  { path: "/about", priority: 0.6, freq: "yearly" },
  { path: "/contact", priority: 0.8, freq: "yearly" },
  { path: "/privacy", priority: 0.2, freq: "yearly" },
  { path: "/terms", priority: 0.2, freq: "yearly" },
];

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], lastModified?: string, images?: string[]) {
  const languages = { en: localeUrl("en", path), ar: localeUrl("ar", path), "x-default": localeUrl("en", path) };
  return (["en", "ar"] as const).map((l) => ({
    url: localeUrl(l, path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
    ...(images?.length ? { images: images.map((i) => (i.startsWith("http") ? i : `${SITE_URL}${i}`)) } : {}),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news] = await Promise.all([getProducts(), getNews()]);
  return [
    ...STATIC.flatMap((s) => entry(s.path, s.priority, s.freq)),
    ...GENERATOR_SIZES.flatMap((k) => entry(`/generators/${sizeSlug(k)}`, 0.8, "monthly")),
    ...cities.flatMap((c) => entry(`/locations/${c.slug}`, 0.8, "monthly")),
    ...industries.flatMap((i) => entry(`/industries/${i.slug}`, 0.75, "monthly")),
    ...marketPages.flatMap((m) => entry(`/markets/${m.code}`, m.tier === "primary" ? 0.8 : 0.6, "monthly")),
    ...products.flatMap((p) => entry(`/products/${p.slug}`, 0.75, "monthly", undefined, p.images.filter((i) => !i.endsWith(".svg")))),
    ...news.flatMap((n) => entry(`/news/${n.slug}`, 0.7, "monthly", n.published_at)),
  ];
}
