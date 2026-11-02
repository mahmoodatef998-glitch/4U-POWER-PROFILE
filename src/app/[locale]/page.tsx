import { ArrowRight, BadgeCheck, Building2, CalendarCheck, CheckCircle2, Factory, FlaskConical, Gauge, Globe2, Headset, Layers, ShieldCheck, Sun, ToggleRight, TowerControl, Wrench, Zap } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { gensetModels, sizingModels } from "@/lib/genset-models";
import { CoverageMap } from "@/components/coverage-map";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
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
import { cn, pick, stripMarks, type Locale } from "@/lib/utils";
import type { ReactNode } from "react";

export const revalidate = 3600;
// Only /en and /ar: junk single-segment URLs (/wp-login.php, /.env …) skip the middleware and would otherwise
// render the home page with a bogus locale. Safe here because nothing revalidates the home page on demand.
export const dynamicParams = false;

/** Hero feature bar: what every order includes (facts already stated across the site). */
const FEATURES = [
  { I: ShieldCheck, en: "12-month / 1,000 h warranty", ar: "ضمان 12 شهراً / 1,000 ساعة" },
  { I: Layers, en: "Generator, ATS & MDB from one supplier", ar: "المولد ولوحة ATS والتوزيع من مورد واحد" },
  { I: FlaskConical, en: "Testing & commissioning", ar: "اختبار وتشغيل" },
  { I: Headset, en: "After-sales & maintenance", ar: "خدمة ما بعد البيع والصيانة" },
  { I: Globe2, en: "SAIF Zone, Sharjah · UAE, KSA, Iraq", ar: "سيف زون، الشارقة · الإمارات والسعودية والعراق" },
];

const PRODUCT_CARDS = [
  {
    href: "/generators",
    I: Factory,
    image: "/images/products/perkins-diesel-generator-250-1000kva-4u.webp",
    alt: { en: "4U silent canopy diesel generator", ar: "مولد ديزل بكابينة عازلة للصوت من فور يو" },
    title: { en: "Generators", ar: "المولدات" },
    body: { en: "Diesel generator sets from 10 to 2500 kVA for prime and standby power.", ar: "مولدات ديزل من 10 إلى 2500 ك.ف.أ للتشغيل الأساسي والاحتياطي." },
  },
  {
    href: "/ats-panels",
    I: ToggleRight,
    image: "/images/products/ats-panel-630-4000a-4u.webp",
    alt: { en: "ATS panel line-up", ar: "لوحات تحويل أوتوماتيكي ATS" },
    title: { en: "ATS & Switchgear", ar: "لوحات ATS والكهرباء" },
    body: { en: "ATS panels, switchgear, MDB and synchronising panels from 63 A to 4000 A.", ar: "لوحات ATS ولوحات جهد منخفض وتوزيع وتزامن من 63 إلى 4000 أمبير." },
  },
  {
    href: "/products?category=solar",
    I: Sun,
    image: "/images/products/solar-pv-panels-4u.webp",
    alt: { en: "Solar PV panels", ar: "ألواح طاقة شمسية" },
    title: { en: "Solar Solutions", ar: "حلول الطاقة الشمسية" },
    body: { en: "Solar panels, stations, hybrid systems and battery storage.", ar: "ألواح ومحطات شمسية وأنظمة هجينة وتخزين بالبطاريات." },
  },
  {
    href: "/products?category=accessories",
    I: TowerControl,
    image: "/images/products/solar-light-tower-real-1-4u.webp",
    alt: { en: "Solar light tower on a trailer", ar: "برج إنارة شمسي على مقطورة" },
    title: { en: "Light Towers & Accessories", ar: "أبراج الإنارة والملحقات" },
    body: { en: "Solar and diesel light towers, fuel tanks, canopies and load banks.", ar: "أبراج إنارة شمسية وديزل وخزانات وقود وكبائن وأحمال اختبار." },
  },
];

/** `**marked**` words in gold (the H1 keeps its exact text for search). */
const gold = (s: string): ReactNode[] => s.split("**").map((part, i) => (i % 2 ? <span key={i} className="text-gold">{part}</span> : part));

/** gradient family per story card: engine, cooling, control, delivery */
const STORY_LINES = ["line-generator", "line-generator", "line-generator", "line-generator"];

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
  const ar = locale === "ar";
  const facts = [
    { I: CalendarCheck, value: "2023", label: ar ? "تأسست في المنطقة الحرة بالشارقة" : "Founded in SAIF Zone, Sharjah" },
    { I: Zap, value: ar ? "10 – 2500 ك.ف.أ" : "10 – 2500 kVA", label: ar ? "نطاق قدرات المولدات" : "Generator range" },
    { I: Gauge, value: String(gensetModels.length), label: ar ? "موديل مولد بنشرة فنية" : "Generator models with datasheets" },
    { I: Building2, value: ar ? "الإمارات" : "UAE", label: ar ? "المقر والمستودع في الشارقة" : "Head office & warehouse, Sharjah" },
  ];

  return (
    <>
      {/* ------------------------------------------------ HERO: night render, gold headline, feature bar (always dark) */}
      <section className="stage-dark relative isolate overflow-hidden bg-navy-950 text-white" aria-labelledby="hero-title">
        {/* phones: the render is a photo band above the text; md+: full-bleed backdrop behind it.
            The canopy carries the 4U label (md+) or, on phones where the label would be too small to read,
            the 4U logo alone; Arabic uses its own mirrored render so both still read correctly. */}
        <picture className="relative -z-10 block aspect-[4/3] sm:aspect-[16/9] md:absolute md:inset-0 md:aspect-auto">
          <source media="(min-width: 768px)" srcSet={`/images/hero/hero-night-genset${ar ? "-ar" : ""}.webp`} />
          {/* decorative backdrop: the headline carries the meaning */}
          <img
            src={`/images/hero/hero-night-genset${ar ? "-ar" : ""}-sm.webp`}
            alt=""
            fetchPriority="high"
            className="size-full object-cover object-center"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950 to-transparent md:hidden" />
        </picture>
        <div aria-hidden className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(11_12_15/0.96)_0%,rgb(11_12_15/0.82)_32%,rgb(11_12_15/0.2)_62%,transparent_80%)] md:block rtl:bg-[linear-gradient(270deg,rgb(11_12_15/0.96)_0%,rgb(11_12_15/0.82)_32%,rgb(11_12_15/0.2)_62%,transparent_80%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-56 bg-gradient-to-t from-navy-950 to-transparent md:block" />

        <div className="container-x relative -mt-12 pb-8 sm:-mt-16 md:mt-0 md:pb-10 md:pt-20 lg:pb-14 lg:pt-28">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow text-[0.66rem] tracking-[0.16em] sm:text-xs sm:tracking-[0.22em]">
                <BadgeCheck className="size-4" aria-hidden />
                {L(home.hero.eyebrow)}
              </p>
            </Reveal>
            <h1
              id="hero-title"
              className="mt-4 font-[family-name:var(--font-heading)] text-[1.8rem] leading-[1.1] font-extrabold uppercase tracking-[-0.01em] text-white min-[400px]:text-[2rem] sm:mt-5 sm:text-5xl lg:text-[3.6rem] rtl:font-[family-name:var(--font-arabic-display)] rtl:text-[1.9rem] rtl:normal-case rtl:sm:text-5xl"
            >
              {gold(L(home.hero.h1))}
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-4 text-[0.8rem] font-semibold tracking-wide text-brand-300 sm:mt-6 sm:text-base">
                {locale === "ar" ? "مولدات ديزل | لوحات ATS ولوحات كهرباء | حلول الطاقة الشمسية" : "Diesel Generators | ATS & Switchgear | Solar Solutions"}
              </p>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-7 text-white/75 sm:text-base">{L(home.hero.lead)}</p>
              <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:items-center">
                <Link href="/products" className={buttonVariants({ variant: "primary", size: "lg" })}>
                  {t("cta.browseProducts")}
                  <ArrowRight className="flip-rtl" aria-hidden />
                </Link>
                <WhatsAppButton location="hero" variant="outline" size="lg" label={locale === "ar" ? "سعر اليوم على واتساب" : "Get a price on WhatsApp"} />
              </div>
            </Reveal>
          </div>

          {/* feature bar: a swipeable row on phones, a 3- then 5-column bar on larger screens */}
          <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-px sm:overflow-hidden sm:rounded-xl sm:border sm:border-white/10 sm:bg-white/10 sm:p-0 sm:backdrop-blur-md lg:mt-20 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
            {FEATURES.map(({ I, en, ar }, i) => (
              <li
                key={en}
                className={cn(
                  "flex w-[13.5rem] shrink-0 snap-start items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 sm:w-auto sm:rounded-none sm:border-0 sm:bg-navy-950/75 sm:px-5 sm:py-4",
                  i === 4 && "sm:col-span-2 lg:col-span-1",
                )}
              >
                <I className="size-7 shrink-0 text-brand-400" strokeWidth={1.5} aria-hidden />
                <span className="text-[0.82rem] leading-snug font-medium text-white/85 sm:text-sm">{locale === "ar" ? ar : en}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ PRODUCTS & SOLUTIONS: four photo cards */}
      <section className="relative bg-navy-950 py-16 sm:py-20" aria-labelledby="ps-title">
        <div className="container-x">
          <div className="flex items-center gap-5">
            <span aria-hidden className="gold-rule h-px flex-1" />
            <h2 id="ps-title" className="text-center text-2xl font-extrabold uppercase text-ink sm:text-3xl rtl:normal-case">
              {locale === "ar" ? "منتجاتنا وحلولنا" : "Our products & solutions"}
            </h2>
            <span aria-hidden className="gold-rule h-px flex-1" />
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            {locale === "ar"
              ? "مجموعة متكاملة من حلول توليد الطاقة وتوزيعها لتلبية احتياجات مشروعك."
              : "A complete range of power generation and distribution equipment to meet your project needs."}
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_CARDS.map((c, i) => (
              <Reveal as="li" key={c.href} delay={i * 0.06} from="scale">
                <Link
                  href={c.href}
                  className="stage-dark group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900 text-white shadow-[0_24px_50px_-28px_rgb(0_0_0/0.75)] transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-brand-500/60"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image src={c.image} alt={L(c.alt)} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
                  </span>
                  <span className="relative -mt-6 flex flex-1 items-start gap-3 px-5 pb-5">
                    <c.I className="mt-0.5 size-7 shrink-0 text-brand-400" strokeWidth={1.5} aria-hidden />
                    <span className="flex-1">
                      <span className="block text-lg font-bold">{L(c.title)}</span>
                      <span className="mt-1.5 block text-sm leading-6 text-white/65">{L(c.body)}</span>
                    </span>
                    <span className="mt-auto grid size-8 shrink-0 place-items-center rounded-md border border-brand-500/60 text-brand-300 transition group-hover:bg-brand-500 group-hover:text-ink-950">
                      <ArrowRight className="flip-rtl size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ FACTS BAR (real figures only) */}
      <section className="stage-dark relative overflow-hidden bg-navy-900 text-white" aria-label={locale === "ar" ? "حقائق عن الشركة" : "Company facts"}>
        <div aria-hidden className="gold-rule absolute inset-x-0 top-0 h-px" />
        <div aria-hidden className="gold-rule absolute inset-x-0 bottom-0 h-px opacity-50" />
        <dl className="container-x grid grid-cols-2 gap-y-6 py-8 lg:grid-cols-4">
          {facts.map(({ I, value, label }, i) => (
            <div key={label} className={cn("flex items-center gap-4 px-2 sm:px-6", i > 0 && "lg:border-s lg:border-white/10")}>
              <I className="size-9 shrink-0 text-brand-400" strokeWidth={1.25} aria-hidden />
              <div className="flex flex-col-reverse">
                <dt className="text-xs text-white/65 sm:text-sm">{label}</dt>
                <dd className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-white sm:text-2xl" dir="ltr">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Rest of the page sits on the site-wide canvas (see layout) */}
      <div className="on-dark relative text-white">

        {/* ---------------------------------------------- STORY: pinned intro + cards that stack as you scroll */}
        <section className="relative pb-20 pt-16 sm:pt-24 lg:pb-32" aria-labelledby="story-title">
          <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-40">
                <SplitText
                  as="h2"
                  id="story-title"
                  text={locale === "ar" ? "من **المحرك** حتى **التسليم**" : "From the **engine** to **delivery**"}
                  className="text-[2.3rem] text-white sm:text-5xl lg:text-[3.4rem] rtl:text-[2rem] rtl:sm:text-5xl"
                />
                <Reveal delay={0.25}>
                  <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                    {locale === "ar"
                      ? "كل مولد نوفّره محسوب لحرارة الخليج، ومتوافق مع لوحة ATS ولوحات التوزيع، ويصل بنشراته الفنية ومستندات التصدير."
                      : "Every set we supply is specified for Gulf heat, matched to its ATS and distribution panels, and delivered with its datasheet and export paperwork."}
                  </p>
                  <div className="mt-8">
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
                        className="font-display text-3xl font-extrabold uppercase tracking-tight whitespace-nowrap text-white/60 transition-colors duration-300 hover:text-brand-400 sm:text-4xl"
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
        <section className="relative overflow-x-clip px-2 py-10 sm:px-4 sm:py-16" aria-labelledby="why-title">
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
                labels={{ tablist: stripMarks(L(home.categories.title)), explore: t("cta.learnMore"), quote: t("cta.quote"), prev: t("calc.back"), next: t("calc.next") }}
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
                <Calculator products={calcProducts} models={sizingModels()} variant="widget" />
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
