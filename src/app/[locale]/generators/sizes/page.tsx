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
  title: { en: "Generator size chart: kVA, kW, amps, ATS & fuel use", ar: "جدول أحجام المولدات: ك.ف.أ والكيلوواط والأمبير واستهلاك الوقود" },
  intro: {
    en: "Every standard diesel generator size from 10 to 2500 kVA with its running kW, full-load current at 400 V, matching ATS panel and fuel consumption — click a size for specs, typical uses and a same-day price.",
    ar: "كل أحجام مولدات الديزل القياسية من 10 إلى 2500 ك.ف.أ مع القدرة بالكيلوواط وتيار الحمل الكامل عند 400 فولت ولوحة ATS المناسبة واستهلاك الوقود. اختر الحجم لترى المواصفات والاستخدامات وتحصل على السعر في نفس اليوم.",
  },
  seoTitle: { en: "Generator Size Chart kVA to kW, Amps & Fuel | 4U Power UAE", ar: "جدول أحجام المولدات ك.ف.أ إلى كيلوواط وأمبير | فور يو باور" },
  seoDesc: {
    en: "Diesel generator size chart 10–2500 kVA: kW, full-load amps at 400 V, ATS rating and diesel consumption per hour. Pick a size and get a UAE price today.",
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
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="sizes_cta" />
    </>
  );
}
