import { ArrowRight, BadgeCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
import { HeroAssembly } from "@/components/hero-assembly";
import { FaqBlock } from "@/components/faq-block";
import { Counter, Reveal } from "@/components/motion";
import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialsCarousel } from "@/components/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { homeFaq } from "@/content/faq";
import { home } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { categoryHref, categoryLabels, engineBrands, engineBrandLabels, marketFlags, marketNames, primaryMarkets, secondaryMarkets } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { getNews, getProducts, getTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/types";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/", title: pageSeo.home.title[locale], description: pageSeo.home.description[locale] });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [products, news, testimonials] = await Promise.all([getProducts(), getNews(), getTestimonials()]);
  const calcProducts = products.filter((p) => p.category === "generator" || p.category === "ats_panel");
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);

  return (
    <>
      {/* ------------------------------------------------ HERO: full-frame generator assembles on scroll */}
      <HeroAssembly
        words={[locale === "ar" ? "طاقة" : "POWER", ...home.story.map((c) => L(c.word))]}
        strings={{ scroll: locale === "ar" ? "مرّر لتجميع المولد" : "Scroll to assemble", label: L(home.hero.h1) }}
      />

      {/* ------------------------------------------------ INTRO: headline + the four things behind every set */}
      <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20" aria-labelledby="hero-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-8">
              <p className="eyebrow">
                <BadgeCheck className="size-4" aria-hidden />
                {L(home.hero.eyebrow)}
              </p>
              <h1 id="hero-title" className="mt-4 text-[2.25rem] text-ink sm:text-6xl lg:text-7xl rtl:text-[1.9rem] rtl:sm:text-5xl rtl:lg:text-6xl">
                {L(home.hero.h1)}
              </h1>
            </Reveal>
            <Reveal className="lg:col-span-4" delay={0.1}>
              <p className="text-base leading-7 text-muted sm:text-lg">{L(home.hero.lead)}</p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <WhatsAppButton location="hero" size="lg" />
                <Link href="/calculator" className={buttonVariants({ variant: "dark", size: "lg" })}>
                  {t("cta.tryCalculator")}
                  <ArrowRight className="flip-rtl" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {home.story.map((c, i) => (
              <Reveal as="li" key={c.kicker.en} delay={i * 0.06} className="group relative flex flex-col bg-white p-6 transition-colors hover:bg-surface sm:p-7">
                <span className="font-display text-sm font-extrabold tracking-widest text-brand-700 rtl:tracking-normal">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 font-display text-3xl font-extrabold uppercase text-ink rtl:font-[family-name:var(--font-arabic)] rtl:text-2xl">{L(c.stat)}</p>
                <h2 className="mt-3 text-xl leading-tight text-ink rtl:text-lg">{L(c.title)}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{L(c.body)}</p>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-400 transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" aria-hidden />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ BRAND STRIP */}
      <section aria-labelledby="brands-title" className="border-b border-line bg-white">
        <div className="container-x flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-10">
          <h2 id="brands-title" className="shrink-0 text-sm font-bold uppercase tracking-widest text-muted rtl:tracking-normal">
            {L(home.brands.title)}
          </h2>
          <ul className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3 lg:justify-between">
            {engineBrands.map((b) => (
              <li key={b}>
                <Link
                  href={{ pathname: "/products", query: { engine: b } }}
                  className="text-xl font-extrabold tracking-tight text-zinc-500 transition hover:text-ink-900 sm:text-2xl"
                >
                  {engineBrandLabels[b]?.[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="container-x pb-4 text-xs text-muted">{L(home.brands.note)}</p>
      </section>

      {/* ------------------------------------------------ WHO WE ARE + STATS */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <SectionHeading eyebrow={L(home.who.eyebrow)} title={L(home.who.title)} intro={L(home.who.body)} />
            <ul className="mt-8 grid gap-3">
              {home.who.points.map((p) => (
                <li key={p.en} className="flex gap-3 text-ink">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                  <span>{L(p)}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-brand-700 hover:underline">
              {locale === "ar" ? "تعرّف على فوريو باور جينيريشن" : "About 4U Power Generation"}
              <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <dl className="grid grid-cols-2 gap-4">
              {home.stats.map((s) => (
                <div key={s.label.en} className="flex flex-col-reverse rounded-2xl border border-line bg-surface p-6">
                  <dt className="mt-2 text-sm font-semibold text-muted">{L(s.label)}</dt>
                  <dd className="whitespace-nowrap text-3xl font-extrabold text-ink sm:text-5xl rtl:text-right" dir="ltr">
                    <Counter to={s.value} suffix={s.suffix} locale={locale} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ CATEGORIES */}
      <section className="section bg-surface" aria-labelledby="cat-title">
        <div className="container-x">
          <SectionHeading id="cat-title" eyebrow={L(home.categories.eyebrow)} title={L(home.categories.title)} />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((c, i) => {
              const item = home.categories.items[c];
              return (
                <Reveal as="li" key={c} delay={i * 0.05} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                  <Link
                    href={categoryHref[c]}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-tranzinc-y-1 hover:border-brand-500/50 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] bg-ink-900">
                      <Image src={item.image} alt={L(categoryLabels[c])} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg text-ink group-hover:text-brand-700">{L(categoryLabels[c])}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{L(item.body)}</p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-brand-700">
                        {t("cta.learnMore")}
                        <ArrowRight className="flip-rtl size-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ CALCULATOR */}
      <section className="section bg-white" aria-labelledby="calc-title">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeading id="calc-title" eyebrow={t("nav.calculator")} title={t("calc.teaserTitle")} intro={t("calc.teaserBody")} />
            <Link href="/calculator" className={`${buttonVariants({ variant: "dark", size: "lg" })} mt-8`}>
              {t("calc.fullCalc")}
              <ArrowRight className="flip-rtl" aria-hidden />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <Calculator products={calcProducts} variant="widget" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ COVERAGE */}
      <section className="section on-dark bg-ink-950 text-white" aria-labelledby="cov-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="cov-title" dark eyebrow={L(home.coverage.eyebrow)} title={L(home.coverage.title)} intro={L(home.coverage.body)} />
            <h3 className="mt-10 text-sm font-bold uppercase tracking-widest text-brand-400 rtl:tracking-normal">{L(home.coverage.primary)}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {primaryMarkets.map((m) => (
                <li key={m}>
                  <Link href={`/markets/${m}`} className="flex h-full items-center gap-3 rounded-2xl border border-brand-500/40 bg-brand-500/10 p-4 font-bold hover:bg-brand-500/20">
                    <span className="text-2xl" aria-hidden>{marketFlags[m]}</span>
                    {marketNames[m][locale]}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-white/60 rtl:tracking-normal">{L(home.coverage.secondary)}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {secondaryMarkets.map((m) => (
                <li key={m}>
                  <Link href={`/markets/${m}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10">
                    <span aria-hidden>{marketFlags[m]}</span>
                    {marketNames[m][locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md lg:col-span-6">
            <CoverageMap locale={locale} primary={primaryMarkets} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ TESTIMONIALS (renders only with published quotes) */}
      {testimonials.length > 0 && (
        <section className="section on-dark border-t border-white/10 bg-ink-900 text-white" aria-labelledby="t-title">
          <div className="container-x">
            <SectionHeading id="t-title" dark eyebrow={L(home.testimonials.eyebrow)} title={L(home.testimonials.title)} />
            <div className="mt-10">
              <TestimonialsCarousel items={testimonials} labels={{ prev: t("calc.back"), next: t("calc.next") }} />
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ NEWS */}
      <section className="section bg-white" aria-labelledby="news-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="news-title" eyebrow={L(home.news.eyebrow)} title={L(home.news.title)} />
            <Link href="/news" className="inline-flex items-center gap-2 font-bold text-brand-700 hover:underline">
              {t("cta.viewAll")}
              <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <NewsCard post={p} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqBlock locale={locale} items={homeFaq} eyebrow={L(home.faq.eyebrow)} title={L(home.faq.title)} />
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="home_cta" />
    </>
  );
}
