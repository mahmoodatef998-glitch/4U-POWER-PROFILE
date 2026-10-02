import { Fuel, Gauge, PlugZap, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { GENERATOR_SIZES, sizeCopy, sizeFromSlug, sizeSlug } from "@/content/generator-sizes";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { matchAts, matchProducts } from "@/lib/calculator";
import { getProducts } from "@/lib/data";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { cn, type Locale } from "@/lib/utils";

export const revalidate = 86400;
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
  const wa = ar ? `مرحباً، أرغب في عرض سعر لمولد ${kva} ك.ف.أ — مدينة التسليم: ` : `Hi, I need a price for a ${kva} kVA generator — delivery city: `;
  const idx = (GENERATOR_SIZES as readonly number[]).indexOf(kva);
  const near = GENERATOR_SIZES.filter((_, i) => Math.abs(i - idx) <= 3 && i !== idx);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ar ? `مولد ديزل ${kva} ك.ف.أ` : `${kva} kVA Diesel Generator`,
    description: c.seoDesc,
    url: localeUrl(locale, `/generators/${size}`),
    image: `${SITE_URL}${kva <= 500 ? "/images/products/cummins-diesel-generator-4u.webp" : "/images/products/cummins-containerized-generator-4u.webp"}`,
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

      {(matches.length > 0 || ats) && (
        <section className="section pt-0" aria-labelledby="fit-title">
          <div className="container-x">
            <SectionHeading id="fit-title" eyebrow={ar ? "من الكتالوج" : "From the catalog"} title={ar ? `منتجات تغطي ${kva} ك.ف.أ` : `Products that cover ${kva} kVA`} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...matches, ...(ats ? [ats] : [])].slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
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

      <FaqBlock locale={locale} items={c.faq} eyebrow={ar ? `مولد ${kva} ك.ف.أ` : `${kva} kVA generator`} title={ar ? "أسئلة شائعة" : "Frequently asked questions"} dark />
      <CtaBanner
        title={ar ? `سعر مولد ${kva} ك.ف.أ اليوم` : `Get a ${kva} kVA generator price today`}
        body={ar ? "أرسل مدينة التسليم ونوع التشغيل (احتياطي أو أساسي) ونرد بخيارات المحركات والسعر ومدة التسليم." : "Send the delivery city and duty (standby or prime) — we reply with engine options, price and lead time."}
        message={wa}
        location={`size_cta_${kva}`}
      />
    </>
  );
}
