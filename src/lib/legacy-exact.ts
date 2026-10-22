/**
 * Addresses from the domain's previous website that Google still has. Exact matches are applied in
 * next.config redirects (one hop, before the locale middleware); everything else that ends up as an
 * unknown page goes through legacyRedirect() in legacy-redirects.ts — a permanent redirect to the closest
 * page by keyword. No imports here: next.config.ts loads this file and does not know the "@/" alias.
 */
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
  ["/feed", "/en/news"],
  ["/blog", "/en/news"],
  // Cummins models dropped in the 22 Oct 2026 datasheet update → the model that replaces them
  ...(["en", "ar"] as const).flatMap((l) =>
    ([["4u-c63", "4u-c60"], ["4u-c1109", "4u-c1110"], ["4u-c810", "4u-c900a"]] as const).flatMap(([from, to]): [string, string][] => [
      [`/${l}/models/${from}`, `/${l}/models/${to}`],
      [`/${l}/models/${from}/datasheet`, `/${l}/models/${to}/datasheet`],
    ]),
  ),
  // WordPress / Yoast / Rank Math sitemaps that Google may still request
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/page-sitemap.xml", "/sitemap.xml"],
  ["/post-sitemap.xml", "/sitemap.xml"],
  ["/product-sitemap.xml", "/sitemap.xml"],
  ["/product_cat-sitemap.xml", "/sitemap.xml"],
  ["/category-sitemap.xml", "/sitemap.xml"],
];
