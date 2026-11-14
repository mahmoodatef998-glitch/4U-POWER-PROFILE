import { Fuel, Gauge, PlugZap, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { generatorImageForKva, withSizeImage } from "@/lib/generator-image";
import { BuySteps } from "@/components/buy-steps";
import { ModelTable } from "@/components/model-table";
import { brandName, dimText, fiftyHzModels, nearestModels } from "@/lib/genset-models";
import type { Faq } from "@/content/faq";
import { SectionHeading } from "@/components/section-heading";
import { GENERATOR_SIZES, sizeCopy, sizeFromSlug, sizeSlug } from "@/content/generator-sizes";
import { engineBrandLabels } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { matchAts, matchProducts } from "@/lib/calculator";
import { getNews, getProducts } from "@/lib/data";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { cn, type Locale } from "@/lib/utils";

export const revalidate = 86400;

/** In-depth article per size; shown only once it is published. */
const SIZE_GUIDES: Record<number, string> = {
  30: "30-kva-generator-guide",
  80: "80-kva-generator-guide",
  100: "100-kva-generator-load-capacity",
  250: "250-kva-generator-guide",
  300: "300-kva-generator-guide",
  1000: "1000-kva-generator-specifications",
  1250: "1250-kva-generator-guide",
};

const n0 = (v: number, ar: boolean) => new Intl.NumberFormat(ar ? "ar-AE-u-nu-latn" : "en-AE").format(v);
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => GENERATOR_SIZES.map((k) => ({ locale, size: sizeSlug(k) })));
}

type Props = { params: Promise<{ locale: Locale; size: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, size } = await params;
  const kva = sizeFromSlug(size);
  if (!kva) return {};
  const c = sizeCopy(kva, locale);
  return buildMetadata({ locale, path: `/generators/${size}`, title: c.seoTitle, description: c.seoDesc });
}

export default async function GeneratorSizePage({ params }: Props) {
  const { locale, size } = await params;
  setRequestLocale(locale);
  const kva = sizeFromSlug(size);
  if (!kva) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const c = sizeCopy(kva, locale);
  const d = c.data;
  const products = await getProducts();
  const matches = matchProducts(products, kva);
  const ats = matchAts(products, kva);
  // model codes follow the prime rating (owner, 1 Nov 2026): the sets coded at this size come first,
  // then the nearest ones by standby rating
  const coded = fiftyHzModels().filter((m) => m.primeKva === kva);
  const models = [...coded, ...nearestModels(kva).filter((m) => !coded.includes(m))].sort(
    (x, y) => Number(y.primeKva === kva) - Number(x.primeKva === kva) || x.primeKva - y.primeKva || x.standbyKva - y.standbyKva,
  );
  const wa = ar ? `مرحباً، أرغب في عرض سعر لمولد ${kva} ك.ف.أ — مدينة التسليم: ` : `Hi, I need a price for a ${kva} kVA generator — delivery city: `;
  const guide = SIZE_GUIDES[kva] ? (await getNews()).find((p) => p.slug === SIZE_GUIDES[kva]) : undefined;
  // size-specific answers from the datasheets of the sets coded at this rating
  const extraFaq: Faq[] = [];
  if (coded.length) {
    extraFaq.push({
      q: { en: `Which engines are used in a ${kva} kVA generator?`, ar: `ما المحركات المستخدمة في مولد ${kva} ك.ف.أ؟` },
      a: {
        en: `Our ${kva} kVA (prime) sets: ${coded.map((m) => `${m.code} with a ${m.brand} ${m.engine}`).join("; ")}. All run at 1500 rpm with a 4U · Leroy-Somer | Stamford alternator and a Deep Sea controller.`,
        ar: `مولدات ${kva} ك.ف.أ (أساسي) لدينا: ${coded.map((m) => `${m.code} بمحرك ${brandName(m.brand, "ar")} ${m.engine}`).join("؛ ")}. كلها تعمل على 1500 لفة/دقيقة مع مولد تيار 4U · Leroy-Somer | Stamford ووحدة تحكم Deep Sea.`,
      },
    });
    const sized = coded.filter((m) => m.enclosed && dimText(m.enclosed, "en"));
    if (sized.length) {
      extraFaq.push({
        q: { en: `What are the dimensions and weight of a ${kva} kVA generator?`, ar: `ما أبعاد ووزن مولد ${kva} ك.ف.أ؟` },
        a: {
          en: `From the datasheets: ${sized.map((m) => `${m.code} ${m.enclosed!.container ? "in a" : "in a silent canopy,"} ${dimText(m.enclosed, "en")}${m.enclosed!.kg ? `, ${n0(m.enclosed!.kg, false)} kg` : ""}`).join("; ")}. Allow space around the set for airflow and service, and crane access for its weight.`,
          ar: `من الداتا شيت: ${sized.map((m) => `${m.code} ${m.enclosed!.container ? "داخل" : "بكابينة صامتة"} ${dimText(m.enclosed, "ar")}${m.enclosed!.kg ? `، ${n0(m.enclosed!.kg, true)} كجم` : ""}`).join("؛ ")}. اترك مساحة حول المولد للتهوية والصيانة، ومدخلاً لرافعة تناسب وزنه.`,
        },
      });
    }
  }
  const idx = (GENERATOR_SIZES as readonly number[]).indexOf(kva);
  const near = GENERATOR_SIZES.filter((_, i) => Math.abs(i - idx) <= 3 && i !== idx);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ar ? `مولد ديزل ${kva} ك.ف.أ` : `${kva} kVA Diesel Generator`,
    description: c.seoDesc,
    url: localeUrl(locale, `/generators/${size}`),
    image: `${SITE_URL}${generatorImageForKva(kva, "Cummins") ?? "/images/products/cummins-diesel-generator-4u.webp"}`,
    category: ar ? "مولدات ديزل" : "Diesel generators",
    brand: { "@type": "Brand", name: "4U Power Generation" },
    manufacturer: { "@id": ORG_ID },
    additionalProperty: c.specs.map((s) => ({ "@type": "PropertyValue", name: s.k, value: s.v })),
  };

  const stats = [
    { I: Gauge, k: ar ? "القدرة" : "Output", v: ar ? `${d.kw} كيلوواط` : `${d.kw} kW` },
    { I: PlugZap, k: ar ? "لوحة ATS" : "ATS panel", v: ar ? `${d.ats} أمبير` : `${d.ats} A` },
    { I: Fuel, k: ar ? "عند 75% حمل" : "At 75% load", v: ar ? `${Math.round(d.fuel75)} لتر/س` : `${Math.round(d.fuel75)} L/h` },
    { I: ShieldCheck, k: ar ? "الضمان" : "Warranty", v: ar ? "12 شهراً" : "12 months" },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.generators"), path: "/generators" },
          { name: ar ? "أحجام المولدات" : "Generator sizes", path: "/generators/sizes" },
          { name: `${kva} ${t("common.kva")}`, path: `/generators/${size}` },
        ]}
        eyebrow={ar ? `مولد ${kva} ك.ف.أ · الإمارات والسعودية والعراق` : `${kva} kVA generator · UAE, KSA & Iraq`}
        title={c.title}
        intro={c.intro}
        aside={
          <dl className="grid grid-cols-2 gap-3">
            {stats.map(({ I, k, v }) => (
              <div key={k} className="spotlight rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <I className="size-5 text-brand-400" aria-hidden />
                <dt className="mt-3 text-xs text-white/60">{k}</dt>
                <dd className="mt-1 text-xl font-bold text-white" dir="auto">{v}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`size_${kva}`} message={wa} size="lg" label={ar ? `سعر مولد ${kva} ك.ف.أ` : `Get ${kva} kVA price`} />
          <CallButton location={`size_${kva}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section" aria-labelledby="spec-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="spec-title" className="text-3xl text-ink sm:text-4xl">{ar ? `مواصفات مولد ${kva} ك.ف.أ` : `${kva} kVA generator specifications`}</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-start text-sm sm:text-base">
                <caption className="sr-only">{ar ? `مواصفات مولد ${kva} ك.ف.أ` : `${kva} kVA generator specifications`}</caption>
                <tbody className="divide-y divide-line">
                  {c.specs.map((s) => (
                    <tr key={s.k} className="even:bg-surface">
                      <th scope="row" className="w-1/2 px-4 py-3.5 text-start font-semibold text-muted">{s.k}</th>
                      <td className="px-4 py-3.5 font-semibold text-ink">{s.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">
              {ar ? "قيم تقريبية لمعامل قدرة 0.8 وجهد 400 فولت؛ تُؤكَّد الأرقام النهائية حسب موديل المحرك في عرض السعر." : "Approximate values at 0.8 pf and 400 V; final figures are confirmed for the chosen engine model in your quotation."}
            </p>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="text-2xl text-ink">{ar ? "لمن يناسب هذا الحجم؟" : "Who is this size for?"}</h2>
              <p className="mt-3 leading-7 text-muted">{ar ? `مولد ${kva} ك.ف.أ مناسب عادةً لـ${c.uses}.` : `A ${kva} kVA set typically powers ${c.uses}.`}</p>
              <p className="mt-3 leading-7 text-muted">{c.note}</p>
              <Link href="/calculator" className="mt-5 inline-flex font-semibold text-brand-400 hover:underline">
                {t("cta.tryCalculator")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="price-title">
        <div className="container-x rounded-[2rem] border border-line bg-surface p-7 sm:p-10">
          <h2 id="price-title" className="text-2xl text-ink sm:text-3xl">{ar ? `سعر مولد ${kva} ك.ف.أ في الإمارات` : `${kva} kVA generator price in UAE`}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted">
            {ar
              ? `لا يوجد سعر واحد لمولد ${kva} ك.ف.أ؛ السعر يتحدد حسب المواصفات التي تختارها، ونرسل لك عرض سعر مكتوباً خلال 24 ساعة بخيارين أو ثلاثة جنباً إلى جنب:`
              : `There is no single price for a ${kva} kVA generator — it depends on the specification you choose. We send a written quotation within 24 hours with two or three options side by side:`}
          </p>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-ink sm:grid-cols-2 lg:grid-cols-3">
            {(ar
              ? [
                  `ماركة المحرك (${d.engines.map((e) => engineBrandLabels[e]?.ar ?? e).join(" أو ")})`,
                  "نوع الهيكل: كابينة صامتة أو إطار مفتوح أو حاوية",
                  "وحدة التحكم وخيار AMF للتشغيل التلقائي",
                  `لوحة ATS (${d.ats} أمبير) وخزان وقود إضافي إن لزم`,
                  "القدرة الاحتياطية أو الأساسية حسب ساعات التشغيل",
                  "مدينة التسليم والتركيب والتشغيل",
                ]
              : [
                  `Engine brand (${d.engines.join(", ").replace(/, ([^,]*)$/, " or $1")})`,
                  "Enclosure: silent canopy, open frame or container",
                  "Controller and AMF auto-start option",
                  `ATS panel (${d.ats} A) and any extra fuel tank`,
                  "Standby or prime rating for your running hours",
                  "Delivery city, installation and commissioning",
                ]
            ).map((x) => (
              <li key={x} className="flex gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
                <span className="text-brand-400" aria-hidden>✓</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton location={`size_price_${kva}`} message={wa} label={ar ? `اطلب سعر مولد ${kva} ك.ف.أ خلال 24 ساعة` : `Get a ${kva} kVA quote in 24h`} />
            <Link href="/contact" className="font-semibold text-brand-400 hover:underline">{ar ? "أو أرسل طلبك من نموذج التواصل ←" : "or send your request through the contact form →"}</Link>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="model-title">
        <div className="container-x">
          <h2 id="model-title" className="text-2xl text-ink sm:text-3xl">
            {coded.length > 0 || models.every((m) => m.standbyKva === kva) ? (ar ? `موديلات ${kva} ك.ف.أ` : `${kva} kVA models`) : ar ? `أقرب الموديلات لـ ${kva} ك.ف.أ` : `Closest models to ${kva} kVA`}
          </h2>
          <p className="mt-2 text-muted">{ar ? "افتح الموديل لرؤية المواصفات الكاملة وتحميل الداتا شيت." : "Open a model for full specifications and its downloadable datasheet."}</p>
          <div className="mt-6">
            <ModelTable models={models} locale={locale} detailed />
          </div>
          <Link href={`/models?kva=${kva}`} className="mt-4 inline-flex font-semibold text-brand-700 underline">
            {ar ? `قارن موديلات ${kva} ك.ف.أ جنباً إلى جنب ←` : `Compare ${kva} kVA models side by side →`}
          </Link>
        </div>
      </section>

      {(matches.length > 0 || ats) && (
        <section className="section pt-0" aria-labelledby="fit-title">
          <div className="container-x">
            <SectionHeading id="fit-title" eyebrow={ar ? "من الكتالوج" : "From the catalog"} title={ar ? `منتجات تغطي ${kva} ك.ف.أ` : `Products that cover ${kva} kVA`} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...matches, ...(ats ? [ats] : [])].slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <ProductCard product={withSizeImage(p, kva)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section pt-0" aria-labelledby="near-title">
        <div className="container-x">
          <h2 id="near-title" className="text-2xl text-ink">{ar ? "أحجام قريبة" : "Nearby sizes"}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {near.map((k) => (
              <li key={k}>
                <Link href={`/generators/${sizeSlug(k)}`} className={cn("inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-brand-500/60 hover:bg-white/5")}>
                  {ar ? `مولد ${k} ك.ف.أ` : `${k} kVA generator`}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/generators/sizes" className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-brand-400 hover:underline">
                {ar ? "كل الأحجام ←" : "All sizes →"}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <BuySteps locale={locale} what={{ en: `a ${kva} kVA generator`, ar: `مولد ${kva} ك.ف.أ` }} />
      {guide && (
        <section className="section pt-0" aria-labelledby="guide-title">
          <div className="container-x">
            <Link href={`/news/${guide.slug}`} className="group flex flex-col gap-1 rounded-2xl border border-line p-6 hover:border-brand-500/60">
              <span id="guide-title" className="text-xs font-semibold tracking-wide text-brand-400 uppercase rtl:tracking-normal">{ar ? "الدليل الكامل" : "Full guide"}</span>
              <span className="text-lg font-bold text-ink group-hover:underline">{ar ? guide.title_ar : guide.title_en}</span>
            </Link>
          </div>
        </section>
      )}
      <FaqBlock locale={locale} items={[...c.faq, ...extraFaq]} eyebrow={ar ? `مولد ${kva} ك.ف.أ` : `${kva} kVA generator`} title={ar ? "أسئلة شائعة" : "Frequently asked questions"} dark />
      <CtaBanner
        title={ar ? `سعر مولد ${kva} ك.ف.أ اليوم` : `Get a ${kva} kVA generator price today`}
        body={ar ? "أرسل مدينة التسليم ونوع التشغيل (احتياطي أو أساسي) ونرد بخيارات المحركات والسعر ومدة التسليم." : "Send the delivery city and duty (standby or prime) — we reply with engine options, price and lead time."}
        message={wa}
        location={`size_cta_${kva}`}
      />
    </>
  );
}
