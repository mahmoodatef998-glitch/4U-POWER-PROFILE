import { unstable_cache } from "next/cache";
import Link from "next/link";
import { googleConfigured, gscRows } from "@/lib/google";
import { popularSearches } from "@/lib/seo-opportunities";

/** Search Console query × page rows, fetched at most once a day for the whole site. */
const dailyRows = unstable_cache(async () => (googleConfigured() ? gscRows(28, 5000) : []), ["gsc-query-page-28d"], { revalidate: 86400 });

/**
 * "Popular searches": real Google searches that already find a specific page of ours, linked to that page.
 * Updates itself from Search Console; hidden until there are at least three good ones.
 */
export async function PopularSearches({ locale }: { locale: "en" | "ar" }) {
  let items: { label: string; href: string }[] = [];
  try {
    items = popularSearches(await dailyRows(), locale, 12);
  } catch (e) {
    console.error("[popular-searches]", e instanceof Error ? e.message : e);
    return null;
  }
  if (items.length < 3) return null;
  const ar = locale === "ar";
  return (
    <section className="section bg-surface" aria-labelledby="popular-searches">
      <div className="container-x">
        <h2 id="popular-searches" className="text-xl sm:text-2xl">{ar ? "عمليات بحث شائعة" : "Popular searches"}</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {items.map((p) => (
            <li key={p.href + p.label}>
              <Link href={p.href} className="inline-flex rounded-full border border-line bg-navy-900 px-4 py-2 text-sm font-semibold hover:border-brand-400 hover:text-brand-700">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
