import { ArrowRight, BadgeCheck, CheckCircle2, FlaskConical, ShieldCheck, Wrench } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
import { HeroAssembly } from "@/components/hero-assembly";
import { FaqBlock } from "@/components/faq-block";
import { Magnetic, Parallax, RotatingWords, SplitText, StackCards, Tilt3D } from "@/components/fx";
import { Counter, Reveal } from "@/components/motion";
import { ProductLines } from "@/components/product-lines";
import { IndustryIcon } from "@/components/industry-icon";
import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialsCarousel } from "@/components/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { homeFaq } from "@/content/faq";
import { industries } from "@/content/industries";
import { home } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { categoryHref, categoryLabels, engineBrands, engineBrandLabels, marketFlags, marketNames, primaryMarkets, secondaryMarkets } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { getNews, getProducts, getTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/types";
import { pick, stripMarks, type Locale } from "@/lib/utils";

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
        strings={{
          scroll: locale === "ar" ? "مرّر لتجميع المولد" : "Scroll to assemble",
          label: stripMarks(L(home.hero.h1)),
          badge: locale === "ar" ? "متوفر في الشارقة · من 10 إلى 2500 ك.ف.أ" : "In stock in Sharjah · 10–2500 kVA",
        }}
      />

      {/* Rest of the page sits on the site-wide night-sky canvas (see layout) */}
      <div className="on-dark relative text-white">

        {/* ---------------------------------------------- INTRO: pinned headline + cards that stack as you scroll */}
        <section className="relative pb-20 pt-16 sm:pt-24 lg:pb-32" aria-labelledby="hero-title">
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
                  className="mt-5 text-[2.5rem] text-white sm:text-6xl lg:text-[4.1rem] rtl:text-[2.1rem] rtl:sm:text-5xl rtl:lg:text-[3.3rem]"
                />
                <Reveal delay={0.25}>
                  <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">{L(home.hero.lead)}</p>
                  <div className="mt-8 flex flex-col items-start gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 ps-5 backdrop-blur">
                      <span className="text-sm text-white/70 sm:text-base">{locale === "ar" ? "تحتاج عرض سعر اليوم؟" : "Need a price today?"}</span>
                      <Magnetic>
                        <WhatsAppButton location="hero" />
                      </Magnetic>
                    </div>
                    <Magnetic>
                      <Link href="/calculator" className={buttonVariants({ variant: "ring", size: "lg" })}>
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
                  <div aria-hidden className="absolute -end-20 -top-20 size-72 rounded-full opacity-50 blur-3xl" style={{ backgroundColor: "var(--glow)" }} />
                  <span aria-hidden className="absolute -bottom-10 end-4 font-display text-[11rem] leading-none font-extrabold text-white/[0.04] sm:text-[14rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex items-center gap-3">
                    <span className="inline-flex h-1.5 w-12 rounded-full" style={{ background: "var(--grad)" }} aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/55 rtl:text-sm rtl:tracking-normal">{L(c.kicker)}</span>
                  </div>
                  <p className="grad-text relative mt-8 font-display text-4xl font-extrabold uppercase sm:text-5xl rtl:font-[family-name:var(--font-arabic-display)] rtl:text-3xl rtl:sm:text-4xl">{L(c.stat)}</p>
                  <h2 className="relative mt-4 max-w-md text-2xl leading-tight text-white sm:text-3xl rtl:text-xl rtl:sm:text-2xl">{L(c.title)}</h2>
                  <p className="relative mt-4 max-w-lg text-sm leading-7 text-white/60 sm:text-base">{L(c.body)}</p>
                </article>
              ))}
            </StackCards>
          </div>
        </section>

        {/* ---------------------------------------------- BUILT FOR: giant drifting wordmark + rotating sector */}
        <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="built-title">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 select-none overflow-hidden" dir="ltr">
            <div className="flex w-max animate-marquee-slow">
              {[0, 1].map((k) => (
                // decorative: drawn as pseudo-content so it is not read as page text
                <span
                  key={k}
                  data-text="4U Power Generation · "
                  className="whitespace-pre pe-[4vw] font-display text-[17vw] leading-[0.85] font-extrabold uppercase text-white/[0.035] [-webkit-text-stroke:1px_rgb(255_255_255/0.06)] before:content-[attr(data-text)]"
                />
              ))}
            </div>
          </div>
          <div className="container-x relative pt-[9vw] text-center">
            <h2 id="built-title" className="flex flex-col items-center">
              <span className="text-xl font-medium tracking-normal text-white/60 sm:text-3xl">
                {locale === "ar" ? "طاقة احتياطية وأساسية مصمَّمة من أجل" : "Standby & prime power built for"}
              </span>
              <RotatingWords
                className="mt-3 text-5xl text-white sm:text-7xl lg:text-8xl rtl:text-4xl rtl:sm:text-6xl rtl:lg:text-7xl"
                words={
                  locale === "ar"
                    ? ["المستشفيات", "مراكز البيانات", "المصانع", "مواقع البناء", "الفنادق والمولات", "المزارع والمضخات"]
                    : ["Hospitals", "Data centres", "Factories", "Construction", "Hotels & malls", "Farms & pumps"]
                }
              />
            </h2>
          </div>

          <ul className="container-x relative mt-10 flex flex-wrap justify-center gap-2">
            {industries.map((ind) => (
              <li key={ind.slug}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:border-brand-500/50 hover:text-white"
                >
                  <IndustryIcon icon={ind.icon} className="size-4 text-brand-400" />
                  {L(ind.name)}
                </Link>
              </li>
            ))}
          </ul>

          {/* engine platforms marquee */}
          <div className="container-x relative mt-16 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 id="brands-title" className="text-sm font-semibold uppercase tracking-widest text-white/60 rtl:tracking-normal">
              {L(home.brands.title)}
            </h3>
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

        {/* ---------------------------------------------- WHY 4U: bento panel */}
        <section className="relative px-2 py-10 sm:px-4 sm:py-16" aria-labelledby="why-title">
          <div className="mx-auto max-w-[88rem] rounded-[2.5rem] border border-white/10 bg-white/[0.025] p-4 backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="grid gap-4 lg:grid-cols-6 lg:grid-rows-[auto_auto]">
              <Reveal className="spotlight rounded-[1.75rem] border border-white/10 bg-navy-900/70 p-7 sm:p-10 lg:col-span-3 lg:row-span-2" from="start">
                <SectionHeading id="why-title" dark eyebrow={L(home.who.eyebrow)} title={L(home.who.title)} intro={L(home.who.body)} />
                <ul className="mt-8 grid gap-3">
                  {home.who.points.map((p) => (
                    <li key={p.en} className="flex gap-3 text-white/80">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
                      <span>{L(p)}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-semibold text-white">
                  {locale === "ar" ? "تعرّف على فور يو باور جينيريشن" : "About 4U Power Generation"}
                  <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
              </Reveal>

              <Reveal className="spotlight group relative min-h-72 overflow-hidden rounded-[1.75rem] border border-white/10 bg-navy-900 lg:col-span-3" from="end">
                <Image
                  src="/images/hero/layers/assembled.webp"
                  alt={locale === "ar" ? "مولد ديزل مجمّع على قاعدته" : "Assembled diesel generator set on its base frame"}
                  fill
                  unoptimized
                  sizes="(min-width:1024px) 45vw, 100vw"
                  className="object-contain object-right p-6 opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{L(home.story[3]!.title)}</p>
                  <p className="mt-2 max-w-md text-sm text-white/60">{L(home.hero.eyebrow)}</p>
                </div>
              </Reveal>

              <dl className="grid grid-cols-2 gap-4 lg:col-span-3">
                {home.stats.map((s, i) => (
                  <Reveal
                    key={s.label.en}
                    delay={i * 0.08}
                    from="scale"
                    className="spotlight flex h-full flex-col-reverse rounded-[1.5rem] border border-white/10 bg-navy-900/70 p-6 transition-[translate] duration-500 hover:-translate-y-1 sm:p-7"
                  >
                    <dt className="mt-2 text-sm text-white/60">{L(s.label)}</dt>
                    <dd className="grad-text whitespace-nowrap font-display text-5xl font-extrabold sm:text-6xl rtl:text-right" dir="ltr">
                      <Counter to={s.value} suffix={s.suffix} locale={locale} />
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- PRODUCT LINES: stacked gradient tabs */}
        <section className="section relative" aria-labelledby="cat-title">
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
                labels={{ tablist: stripMarks(L(home.categories.title)), explore: t("cta.learnMore"), quote: t("cta.quote") }}
              />
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------- AFTER-SALES: warranty + service band */}
        <section className="relative px-2 sm:px-4" aria-labelledby="svc-band-title">
          <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8 lg:grid-cols-4 lg:items-center">
            <div>
              <SplitText as="h2" id="svc-band-title" className="text-2xl leading-tight text-white sm:text-3xl" text={locale === "ar" ? "بعد البيع، **نحن معك**" : "After the sale, **we stay**"} />
              <Link href="/services" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:underline">
                {t("nav.services")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </div>
            {[
              { I: ShieldCheck, c: "text-emerald-400 bg-emerald-500/15", t: t("common.warrantyLong"), b: locale === "ar" ? "على كل مولد ولوحة ونظام شمسي وملحق." : "On every generator, panel, solar system and accessory." },
              { I: Wrench, c: "text-brand-400 bg-brand-500/15", t: locale === "ar" ? "صيانة وعقود سنوية" : "Maintenance & AMC", b: locale === "ar" ? "زيارات مجدولة وتقرير مكتوب في كل زيارة." : "Scheduled visits with a written report every time." },
              { I: FlaskConical, c: "text-sky-400 bg-sky-500/15", t: locale === "ar" ? "اختبار وتشغيل" : "Testing & commissioning", b: locale === "ar" ? "اختبار بأحمال حقيقية وتسليم بالمستندات." : "Load-bank tests and documented handover." },
            ].map(({ I, c, t: title, b }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-navy-900/60 p-5">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${c}`}>
                  <I className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">{b}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------- CALCULATOR: screen tilts up into view */}
        <section className="section relative" aria-labelledby="calc-title">
          <div className="container-x relative text-center">
            <SectionHeading id="calc-title" dark center eyebrow={t("nav.calculator")} title={t("calc.teaserTitle")} intro={t("calc.teaserBody")} />
            <Magnetic className="mt-8">
              <Link href="/calculator" className={buttonVariants({ variant: "ring", size: "lg" })}>
                {t("calc.fullCalc")}
                <ArrowRight className="flip-rtl" aria-hidden />
              </Link>
            </Magnetic>
          </div>
          <Tilt3D className="container-x relative mt-14">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-2 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.9)] backdrop-blur sm:p-3">
              <div className="flex items-center gap-1.5 px-3 pb-2.5 pt-1" aria-hidden>
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] text-start">
                <Calculator products={calcProducts} variant="widget" />
              </div>
            </div>
          </Tilt3D>
        </section>

        {/* ---------------------------------------------- COVERAGE */}
        <section className="section relative" aria-labelledby="cov-title">
          <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading id="cov-title" dark eyebrow={L(home.coverage.eyebrow)} title={L(home.coverage.title)} intro={L(home.coverage.body)} />
              <h3 className="mt-10 text-sm font-semibold uppercase tracking-widest text-brand-400 rtl:tracking-normal">{L(home.coverage.primary)}</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {primaryMarkets.map((m) => (
                  <li key={m}>
                    <Link
                      href={`/markets/${m}`}
                      className="spotlight flex h-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-semibold backdrop-blur transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <span className="text-2xl" aria-hidden>{marketFlags[m]}</span>
                      {marketNames[m][locale]}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-white/60 rtl:tracking-normal">{L(home.coverage.secondary)}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {secondaryMarkets.map((m) => (
                  <li key={m}>
                    <Link href={`/markets/${m}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 hover:bg-white/10">
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

        {/* ---------------------------------------------- TESTIMONIALS (renders only with published quotes) */}
        {testimonials.length > 0 && (
          <section className="section relative" aria-labelledby="t-title">
            <div className="container-x">
              <SectionHeading id="t-title" dark eyebrow={L(home.testimonials.eyebrow)} title={L(home.testimonials.title)} />
              <div className="mt-10">
                <TestimonialsCarousel items={testimonials} labels={{ prev: t("calc.back"), next: t("calc.next") }} />
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------- NEWS */}
        <section className="section relative" aria-labelledby="news-title">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading id="news-title" dark eyebrow={L(home.news.eyebrow)} title={L(home.news.title)} />
              <Link href="/news" className={buttonVariants({ variant: "ghostDark", size: "md" })}>
                {t("cta.viewAll")}
                <ArrowRight className="flip-rtl" aria-hidden />
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
      </div>
    </>
  );
}
