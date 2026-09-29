import { ArrowRight, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { Reveal } from "@/components/motion";
import { NewsCard } from "@/components/news-card";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import type { Faq } from "@/content/faq";
import type { Pillar } from "@/content/pages";
import { Link } from "@/i18n/navigation";
import { getNews, getProducts } from "@/lib/data";
import type { Category } from "@/lib/types";
import { pick, type Locale } from "@/lib/utils";

export async function PillarPage({
  locale,
  path,
  navLabel,
  pillar,
  categories,
  faq,
  faqTitle,
}: {
  locale: Locale;
  path: string;
  navLabel: string;
  pillar: Pillar;
  categories: Category[];
  faq: Faq[];
  faqTitle: string;
}) {
  const t = await getTranslations();
  const [products, news] = await Promise.all([getProducts(), getNews()]);
  const list = products.filter((p) => categories.includes(p.category));
  const calcProducts = products.filter((p) => p.category === "generator" || p.category === "ats_panel");
  const related = pillar.relatedPosts.map((s) => news.find((n) => n.slug === s)).filter((n) => n !== undefined);
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const waMessage = t("cta.whatsappPage", { topic: L(pillar.waTopic) });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: navLabel, path },
        ]}
        eyebrow={L(pillar.eyebrow)}
        title={L(pillar.h1)}
        intro={L(pillar.intro)}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`pillar_${path}`} message={waMessage} size="lg" />
          <CallButton location={`pillar_${path}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <dl className="container-x grid grid-cols-2 divide-line py-8 lg:grid-cols-4 lg:divide-x rtl:lg:divide-x-reverse">
          {pillar.highlights.map((h) => (
            <div key={h.title.en} className="flex flex-col-reverse px-2 py-3 lg:px-6">
              <dt className="mt-1 text-sm text-muted">{L(h.body)}</dt>
              <dd className="text-xl font-extrabold text-ink sm:text-2xl">{L(h.title)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            {pillar.sections.map((s) => (
              <Reveal key={s.title.en}>
                <section id={s.id} aria-labelledby={`${s.id ?? s.title.en.slice(0, 12).replace(/\W/g, "")}-h`}>
                  <h2 id={`${s.id ?? s.title.en.slice(0, 12).replace(/\W/g, "")}-h`} className="text-2xl leading-tight text-ink sm:text-3xl">
                    {L(s.title)}
                  </h2>
                  <p className="mt-4 text-[1.0625rem] leading-8 text-slate-700">{L(s.body)}</p>
                  {s.bullets && (
                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b.en} className="flex gap-3 text-slate-700">
                          <Zap className="mt-1 size-4 shrink-0 text-amber-600" aria-hidden />
                          {L(b)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="on-dark rounded-3xl bg-navy-900 p-6 text-white lg:sticky lg:top-28">
              <p className="text-lg font-extrabold">{L(pillar.cta.title)}</p>
              <p className="mt-2 text-sm leading-6 text-white/75">{L(pillar.cta.body)}</p>
              <div className="mt-5 grid gap-2">
                <WhatsAppButton location={`pillar_aside_${path}`} message={waMessage} />
                <CallButton location={`pillar_aside_${path}`} variant="ghostDark" />
              </div>
              <p className="mt-4 text-xs text-white/60">{t("common.responseTime")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="range-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="range-title" title={L(pillar.productsTitle)} />
            <Link href={{ pathname: "/products", query: { category: categories[0] } }} className="inline-flex items-center gap-2 font-bold text-amber-700 hover:underline">
              {t("cta.browseProducts")}
              <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="pcalc-title">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading id="pcalc-title" eyebrow={t("nav.calculator")} title={t("calc.teaserTitle")} intro={t("calc.teaserBody")} />
          </div>
          <div className="lg:col-span-7">
            <Calculator products={calcProducts} variant="widget" />
          </div>
        </div>
      </section>

      <FaqBlock locale={locale} items={faq} title={faqTitle} eyebrow="FAQ" />

      {related.length > 0 && (
        <section className="section bg-white" aria-labelledby="rel-title">
          <div className="container-x">
            <SectionHeading id="rel-title" eyebrow={t("nav.news")} title={locale === "ar" ? "مقالات ذات صلة" : "Related guides"} />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <NewsCard post={p} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner title={L(pillar.cta.title)} body={L(pillar.cta.body)} message={waMessage} location={`pillar_banner_${path}`} />
    </>
  );
}
