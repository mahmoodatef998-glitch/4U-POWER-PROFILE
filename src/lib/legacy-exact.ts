/**
 * Addresses from the domain's previous website that Google still has. Exact matches are applied in
 * next.config redirects (one hop, before the locale middleware); everything else that ends up as an
 * unknown page goes through legacyRedirect() in legacy-redirects.ts — a permanent redirect to the closest
 * page by keyword. Relative imports only: next.config.ts loads this file and does not know the "@/" alias.
 */
import { MODEL_RENAMES } from "./model-renames";

export const LEGACY_EXACT: [string, string][] = [
  ["/team", "/en/about"],
  ["/about-us", "/en/about"],
  ["/our_services", "/en/services"],
  ["/our-services", "/en/services"],
  ["/safety-policy", "/en/about"],
  ["/quality-policy", "/en/about"],
  ["/quality-policy-2", "/en/about"],
  ["/contact-us", "/en/contact"],
  ["/project/:slug*", "/en/projects"],
  ["/our_projects", "/en/projects"],
  ["/shop", "/en/products"],
  // Volvo Penta range dropped (owner, 8 Nov 2026)
  ["/:locale(en|ar)/products/volvo-penta-generator-80-700kva/:rest*", "/:locale/generators"],
  ["/feed", "/en/news"],
  ["/blog", "/en/news"],
  // model codes renamed to the prime kVA (1 Nov 2026) and models dropped earlier → the same set's page
  ...MODEL_RENAMES.flatMap(([from, to]): [string, string][] => [
    [`/:locale(en|ar)/models/${from}`, `/:locale/models/${to}`],
    [`/:locale(en|ar)/models/${from}/datasheet`, `/:locale/models/${to}/datasheet`],
  ]),
  // WordPress / Yoast / Rank Math sitemaps that Google may still request
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/page-sitemap.xml", "/sitemap.xml"],
  ["/post-sitemap.xml", "/sitemap.xml"],
  ["/product-sitemap.xml", "/sitemap.xml"],
  ["/product_cat-sitemap.xml", "/sitemap.xml"],
  ["/category-sitemap.xml", "/sitemap.xml"],
];
