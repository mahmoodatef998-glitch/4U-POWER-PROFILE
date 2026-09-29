import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { marketPages } from "@/content/markets";
import { home } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { marketFlags, marketNames, primaryMarkets } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { cn, pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/markets", title: pageSeo.markets.title[locale], description: pageSeo.markets.description[locale] });
}

export default async function MarketsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.markets"), path: "/markets" },
        ]}
        eyebrow={pick(home.coverage.eyebrow, locale)}
        title={ar ? "الأسواق التي نخدمها من الشارقة" : "Markets We Serve from Sharjah, UAE"}
        intro={pick(home.coverage.body, locale)}
        aside={
          <div className="mx-auto max-w-sm">
            <CoverageMap locale={locale} primary={primaryMarkets} />
          </div>
        }
      />
      <section className="section bg-white">
        <div className="container-x">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {marketPages.map((m) => {
              const primary = m.tier === "primary";
              return (
                <li key={m.code} className={cn(primary && "lg:row-span-1")}>
                  <Link
                    href={`/markets/${m.code}`}
                    className={cn(
                      "group flex h-full flex-col rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl",
                      primary ? "border-amber-500/40 bg-amber-50/60" : "border-line bg-white",
                    )}
                  >
                    <span className="text-4xl" aria-hidden>{marketFlags[m.code]}</span>
                    <span className="mt-3 text-xs font-bold uppercase tracking-widest text-amber-700 rtl:tracking-normal">
                      {pick(primary ? home.coverage.primary : home.coverage.secondary, locale)}
                    </span>
                    <h2 className="mt-1 text-xl text-ink">{marketNames[m.code][locale]}</h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted">{pick(m.focus, locale)}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-amber-700">
                      {t("cta.learnMore")}
                      <ArrowRight className="flip-rtl size-4" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <CtaBanner title={pick(home.cta.title, locale)} body={pick(home.cta.body, locale)} location="markets_cta" />
    </>
  );
}
