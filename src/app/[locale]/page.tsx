import { ArrowRight, BadgeCheck, CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
import { HeroAssembly } from "@/components/hero-assembly";
import { FaqBlock } from "@/components/faq-block";
import { Magnetic, Parallax, SplitText, StackCards } from "@/components/fx";
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

      {/* ------------------------------------------------ INTRO: pinned headline + cards that stack as you scroll */}
      <section className="on-dark relative bg-navy-950 pb-20 pt-16 text-white sm:pt-24 lg:pb-32" aria-labelledby="hero-title">
        <div className="aurora pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="eyebrow">
                  <BadgeCheck className="size-4" aria-hidden />
                  {L(home.hero.eyebrow)}
                </p>
              </Reveal>
              <SplitText
                as="h1"
                id="hero-title"
                text={L(home.hero.h1)}
                className="mt-5 text-[2.4rem] text-white sm:text-6xl lg:text-[4.25rem] rtl:text-[2rem] rtl:sm:text-5xl rtl:lg:text-[3.4rem]"
              />
              <Reveal delay={0.25}>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">{L(home.hero.lead)}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Magnetic>
                    <WhatsAppButton location="hero" size="lg" />
                  </Magnetic>
                  <Magnetic>
                    <Link href="/calculator" className={buttonVariants({ variant: "ghostDark", size: "lg" })}>
                      {t("cta.tryCalculator")}
                      <ArrowRight className="flip-rtl" aria-hidden />
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </div>

          <StackCards className="lg:col-span-7" top={120}>
            {home.story.map((c, i) => (
              <article
                key={c.kicker.en}
                className={`${STORY_LINES[i]} spotlight relative flex min-h-[20rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-navy-900 p-7 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.9)] sm:min-h-[22rem] sm:p-10`}
              >
                <div aria-hidden className="absolute -end-20 -top-20 size-72 rounded-full opacity-60 blur-3xl" style={{ backgroundColor: "var(--glow)" }} />
                <span aria-hidden className="absolute -bottom-10 end-4 font-display text-[11rem] leading-none font-extrabold text-white/[0.04] sm:text-[14rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative flex items-center gap-3">
                  <span className="inline-flex h-1.5 w-12 rounded-full" style={{ background: "var(--grad)" }} aria-hidden />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/55 rtl:text-sm rtl:tracking-normal">{L(c.kicker)}</span>
                </div>
                <p className="grad-text relative mt-8 font-display text-4xl font-extrabold uppercase sm:text-5xl rtl:font-[family-name:var(--font-arabic)] rtl:text-3xl rtl:sm:text-4xl">{L(c.stat)}</p>
                <h2 className="relative mt-4 max-w-md text-2xl leading-tight text-white sm:text-3xl rtl:text-xl rtl:sm:text-2xl">{L(c.title)}</h2>
                <p className="relative mt-4 max-w-lg text-sm leading-7 text-white/65 sm:text-base">{L(c.body)}</p>
              </article>
            ))}
          </StackCards>
        </div>
      </section>

      {/* ------------------------------------------------ BRAND MARQUEE */}
      <section aria-labelledby="brands-title" className="on-dark relative border-y border-white/10 bg-navy-900 py-8 text-white">
        <div className="container-x flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 id="brands-title" className="text-sm font-bold uppercase tracking-widest text-white/60 rtl:tracking-normal">
            {L(home.brands.title)}
          </h2>
          <p className="text-xs text-white/60">{L(home.brands.note)}</p>
        </div>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" dir="ltr">
          <div className="flex w-max animate-marquee gap-16 pe-16 hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-16" aria-hidden={copy === 1 || undefined}>
                {engineBrands.map((b) => (
                  <li key={b}>
                    <Link
                      href={{ pathname: "/products", query: { engine: b } }}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="font-display text-3xl font-extrabold uppercase tracking-tight whitespace-nowrap text-white/40 transition-colors duration-300 hover:text-brand-400 sm:text-4xl"
                    >
                      {engineBrandLabels[b]?.[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ WHO WE ARE + STATS */}
      <section className="section on-dark relative overflow-x-clip bg-navy-950 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6" from="start">
            <SectionHeading dark eyebrow={L(home.who.eyebrow)} title={L(home.who.title)} intro={L(home.who.body)} />
            <ul className="mt-8 grid gap-3">
              {home.who.points.map((p) => (
                <li key={p.en} className="flex gap-3 text-white/85">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
                  <span>{L(p)}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-bold text-brand-400">
              {locale === "ar" ? "تعرّف على فوريو باور جينيريشن" : "About 4U Power Generation"}
              <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
          </Reveal>
          <div className="lg:col-span-6">
            <dl className="grid grid-cols-2 gap-4">
              {home.stats.map((s, i) => (
                <Reveal
                  key={s.label.en}
                  delay={i * 0.08}
                  from="scale"
                  className="glass spotlight flex h-full flex-col-reverse rounded-3xl p-6 transition-[translate] duration-500 hover:-translate-y-1 sm:p-7"
                >
                  <dt className="mt-2 text-sm font-semibold text-white/60">{L(s.label)}</dt>
                  <dd className="grad-text whitespace-nowrap font-display text-5xl font-extrabold sm:text-6xl rtl:text-right" dir="ltr">
                    <Counter to={s.value} suffix={s.suffix} locale={locale} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ PRODUCT LINES: stacked gradient tabs */}
      <section className="section on-dark relative overflow-hidden border-t border-white/5 bg-navy-950 text-white" aria-labelledby="cat-title">
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
      <section className="section on-dark relative overflow-hidden border-t border-white/5 bg-navy-900 text-white" aria-labelledby="calc-title">
        <div className="aurora pointer-events-none absolute inset-0 -scale-x-100" aria-hidden />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <SectionHeading id="calc-title" dark eyebrow={t("nav.calculator")} title={t("calc.teaserTitle")} intro={t("calc.teaserBody")} />
            <Magnetic className="mt-8">
              <Link href="/calculator" className={buttonVariants({ variant: "primary", size: "lg" })}>
                {t("calc.fullCalc")}
                <ArrowRight className="flip-rtl" aria-hidden />
              </Link>
            </Magnetic>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1} from="scale">
            <div className="rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
              <Calculator products={calcProducts} variant="widget" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ COVERAGE */}
      <section className="section on-dark relative overflow-hidden border-t border-white/5 bg-navy-950 text-white" aria-labelledby="cov-title">
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
          <Parallax className="mx-auto w-full max-w-md lg:col-span-6" offset={40}>
            <CoverageMap locale={locale} primary={primaryMarkets} />
          </Parallax>
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
      <section className="section on-dark border-t border-white/5 bg-navy-900 text-white" aria-labelledby="news-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="news-title" dark eyebrow={L(home.news.eyebrow)} title={L(home.news.title)} />
            <Link href="/news" className="inline-flex items-center gap-2 font-bold text-brand-400 hover:underline">
              {t("cta.viewAll")}
              <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08} from="scale">
                <NewsCard post={p} locale={locale} dark />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FaqBlock locale={locale} items={homeFaq} eyebrow={L(home.faq.eyebrow)} title={L(home.faq.title)} dark />
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="home_cta" dark />
    </>
  );
}
