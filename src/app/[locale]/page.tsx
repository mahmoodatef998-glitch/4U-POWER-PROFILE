import { ArrowRight, BadgeCheck, CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
import { HeroAssembly } from "@/components/hero-assembly";
import { FaqBlock } from "@/components/faq-block";
import { Counter, Reveal } from "@/components/motion";
import { ProductLines } from "@/components/product-lines";
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

/** gradient family per story card: engine, cooling, control, delivery */
const STORY_LINES = ["line-generator", "line-sync_panel", "line-ats_panel", "line-switchgear"];

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

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.story.map((c, i) => (
              <Reveal as="li" key={c.kicker.en} delay={i * 0.08} from="scale" className={`${STORY_LINES[i]} group`}>
                <div className="grad-border relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(10_10_11/0.35)] sm:p-7">
                  <div aria-hidden className="absolute -end-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundColor: "var(--glow)" }} />
                  <span className="relative inline-flex h-1.5 w-10 rounded-full" style={{ background: "var(--grad)" }} aria-hidden />
                  <span className="relative mt-5 font-display text-sm font-extrabold tracking-widest text-muted rtl:tracking-normal">{String(i + 1).padStart(2, "0")}</span>
                  <p className="grad-text relative mt-2 font-display text-3xl font-extrabold uppercase [--grad:var(--grad-ink)] rtl:font-[family-name:var(--font-arabic)] rtl:text-2xl">{L(c.stat)}</p>
                  <h2 className="relative mt-3 text-xl leading-tight text-ink rtl:text-lg">{L(c.title)}</h2>
                  <p className="relative mt-3 text-sm leading-6 text-muted">{L(c.body)}</p>
                </div>
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
          <Reveal className="lg:col-span-6" from="start">
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
          <Reveal className="lg:col-span-6" delay={0.1} from="end">
            <dl className="grid grid-cols-2 gap-4">
              {home.stats.map((s) => (
                <div key={s.label.en} className="grad-border flex flex-col-reverse rounded-3xl border border-line bg-surface p-6 transition-[translate] duration-500 hover:-translate-y-1">
                  <dt className="mt-2 text-sm font-semibold text-muted">{L(s.label)}</dt>
                  <dd className="grad-text whitespace-nowrap font-display text-4xl font-extrabold [--grad:linear-gradient(120deg,var(--color-ink-950),var(--color-ink-600))] sm:text-6xl rtl:text-right" dir="ltr">
                    <Counter to={s.value} suffix={s.suffix} locale={locale} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ PRODUCT LINES: stacked gradient tabs */}
      <section className="section on-dark relative overflow-hidden bg-navy-950 text-white" aria-labelledby="cat-title">
        <div className="aurora pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading id="cat-title" dark eyebrow={L(home.categories.eyebrow)} title={L(home.categories.title)} />
          </Reveal>
          <Reveal className="mt-12" delay={0.1}>
            <ProductLines
              items={CATEGORIES.map((c) => ({
                id: c,
                title: L(categoryLabels[c]),
                body: L(home.categories.items[c].body),
                image: home.categories.items[c].image,
                href: categoryHref[c],
              }))}
              labels={{ tablist: L(home.categories.title), explore: t("cta.learnMore"), quote: t("cta.quote") }}
            />
          </Reveal>
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
      <section className="section on-dark relative overflow-hidden bg-navy-950 text-white" aria-labelledby="cov-title">
        <div className="aurora pointer-events-none absolute inset-0 rotate-180" aria-hidden />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="cov-title" dark eyebrow={L(home.coverage.eyebrow)} title={L(home.coverage.title)} intro={L(home.coverage.body)} />
            <h3 className="mt-10 text-sm font-bold uppercase tracking-widest text-brand-400 rtl:tracking-normal">{L(home.coverage.primary)}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {primaryMarkets.map((m) => (
                <li key={m}>
                  <Link href={`/markets/${m}`} className="glass flex h-full items-center gap-3 rounded-2xl p-4 font-bold transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10">
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
            {news.slice(0, 3).map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08} from="scale">
                <NewsCard post={p} locale={locale} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FaqBlock locale={locale} items={homeFaq} eyebrow={L(home.faq.eyebrow)} title={L(home.faq.title)} />
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="home_cta" />
    </>
  );
}
