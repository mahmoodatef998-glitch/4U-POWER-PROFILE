import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { GENERATOR_SIZES, sizeData, sizeSlug } from "@/content/generator-sizes";
import { home } from "@/content/pages";
import { Link } from "@/i18n/navigation";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

const COPY = {
  title: { en: "Standard generator sizes in kVA: chart with kW, amps, ATS & fuel", ar: "أحجام المولدات القياسية بالكيلو فولت أمبير: الكيلوواط والأمبير والوقود" },
  intro: {
    en: "Every standard diesel generator size from 10 to 2500 kVA with its running kW, full-load current at 400 V, matching ATS panel and fuel consumption — click a size for specs, typical uses and a same-day price.",
    ar: "كل أحجام مولدات الديزل القياسية من 10 إلى 2500 ك.ف.أ مع القدرة بالكيلوواط وتيار الحمل الكامل عند 400 فولت ولوحة ATS المناسبة واستهلاك الوقود. اختر الحجم لترى المواصفات والاستخدامات وتحصل على السعر في نفس اليوم.",
  },
  faqTitle: { en: "What are the standard generator sizes?", ar: "ما هي أحجام المولدات القياسية؟" },
  seoTitle: { en: "Standard Generator Sizes in kVA: Chart, kW & Amps | 4U", ar: "أحجام المولدات القياسية ك.ف.أ: جدول كيلوواط وأمبير | فور يو" },
  seoDesc: {
    en: "Standard diesel generator sizes from 10 to 2500 kVA in one chart: kW, full-load amps at 400 V, ATS rating and fuel per hour. Pick a size for a UAE quote.",
    ar: "جدول أحجام مولدات الديزل من 10 إلى 2500 ك.ف.أ: الكيلوواط والأمبير عند 400 فولت وسعة ATS واستهلاك الديزل بالساعة. اختر الحجم واحصل على السعر في الإمارات اليوم.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/generators/sizes", title: COPY.seoTitle[locale], description: COPY.seoDesc[locale] });
}

export default async function SizesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: L(COPY.title),
    itemListElement: GENERATOR_SIZES.map((k, i) => ({ "@type": "ListItem", position: i + 1, name: `${k} kVA`, url: localeUrl(locale, `/generators/${sizeSlug(k)}`) })),
  };

  return (
    <>
      <JsonLd data={list} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.generators"), path: "/generators" },
          { name: ar ? "أحجام المولدات" : "Generator sizes", path: "/generators/sizes" },
        ]}
        eyebrow={ar ? "10 – 2500 ك.ف.أ" : "10 – 2500 kVA"}
        title={L(COPY.title)}
        intro={L(COPY.intro)}
      />
      <section className="section">
        <div className="container-x">
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[40rem] text-start text-sm sm:text-base">
              <caption className="sr-only">{L(COPY.title)}</caption>
              <thead className="bg-surface text-muted">
                <tr>
                  {(ar ? ["الحجم", "الكيلوواط", "التيار عند 400 فولت", "لوحة ATS", "ديزل عند 75% حمل"] : ["Size", "kW", "Current @ 400 V", "ATS panel", "Diesel @ 75% load"]).map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {GENERATOR_SIZES.map((k) => {
                  const d = sizeData(k);
                  return (
                    <tr key={k} className="hover:bg-surface">
                      <th scope="row" className="px-4 py-3 text-start">
                        <Link href={`/generators/${sizeSlug(k)}`} className="font-bold text-brand-400 hover:underline">
                          {ar ? `مولد ${k} ك.ف.أ` : `${k} kVA generator`}
                        </Link>
                      </th>
                      <td className="px-4 py-3 text-ink">{d.kw}</td>
                      <td className="px-4 py-3 text-ink">{Math.round(d.amps)} A</td>
                      <td className="px-4 py-3 text-ink">{d.ats} A</td>
                      <td className="px-4 py-3 text-ink">{Math.round(d.fuel75)} {ar ? "لتر/س" : "L/h"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">{ar ? "قيم تقريبية عند معامل قدرة 0.8؛ تُؤكَّد حسب موديل المحرك." : "Approximate values at 0.8 pf; confirmed per engine model."}</p>
        </div>
      </section>
      <section className="section bg-surface" aria-labelledby="standard-sizes">
        <div className="container-x max-w-3xl">
          <h2 id="standard-sizes" className="text-2xl sm:text-3xl">{L(COPY.faqTitle)}</h2>
          <p className="mt-4 leading-8 text-muted">
            {ar
              ? `أحجام مولدات الديزل القياسية المتوفرة لدينا: ${GENERATOR_SIZES.join("، ")} ك.ف.أ. هذه هي القدرات الاحتياطية الشائعة التي يصنّعها كل مُجمّعي المولدات، ولكل حجم محرك ومولّد تيار ولوحة ATS مناسبة.`
              : `The standard diesel generator sizes we supply are ${GENERATOR_SIZES.join(", ")} kVA. These are the standby ratings built by every major genset assembler, each with a matching engine, alternator and ATS panel.`}
          </p>
          <p className="mt-4 leading-8 text-muted">
            {ar
              ? "kVA هي القدرة الظاهرية، والكيلوواط = kVA × 0.8 تقريباً. اختر الحجم بحيث يعمل المولد بين 50% و80% من قدرته مع هامش لبدء المحركات والتوسعات المستقبلية. "
              : "kVA is the apparent power; kW is about kVA × 0.8. Choose the size so the generator runs at 50–80% of its rating, with headroom for motor starting and future loads. "}
            <Link href="/calculator" className="font-semibold text-brand-700 underline">{ar ? "احسب الحجم المناسب بالحاسبة" : "Work out your size with the kVA calculator"}</Link>
            {ar ? " أو " : " or "}
            <Link href="/models" className="font-semibold text-brand-700 underline">{ar ? "تصفّح كل الموديلات" : "browse every model"}</Link>.
          </p>
        </div>
      </section>
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="sizes_cta" />
    </>
  );
}
