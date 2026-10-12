import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { DatasheetGate } from "@/components/datasheet-gate";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { ModelTable } from "@/components/model-table";
import { PageHero } from "@/components/page-hero";
import { products as seedProducts } from "@/content/products";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { brandModels, brandName, gensetModels, getModel, modelImage, modelName, modelPath, modelSpecSections, productForModel, ratingNotes } from "@/lib/genset-models";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => gensetModels.map((m) => ({ locale, slug: m.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const m = getModel(slug);
  if (!m) return {};
  const ar = locale === "ar";
  const brand = brandName(m.brand, locale);
  return buildMetadata({
    locale,
    path: modelPath(m),
    title: ar ? `مولد ${brand} ${m.standbyKva} ك.ف.أ ${m.code} | المواصفات والداتا شيت` : `${m.code} ${brand} ${m.standbyKva} kVA Generator | Specs & Datasheet`,
    description: ar
      ? `مولد ديزل ${m.standbyKva} ك.ف.أ احتياطي / ${m.primeKva} ك.ف.أ أساسي بمحرك ${brand} ${m.engine}. المواصفات واستهلاك الوقود والمقاسات وتحميل الداتا شيت من فور يو باور الإمارات.`
      : `${m.standbyKva} kVA standby / ${m.primeKva} kVA prime diesel generator with ${brand} ${m.engine} engine. Specs, fuel consumption, dimensions and PDF datasheet from 4U Power, UAE.`,
    image: modelImage(m),
  });
}

export default async function ModelPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const m = getModel(slug);
  if (!m) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const name = modelName(m, locale);
  const sections = modelSpecSections(m, locale);
  const parent = seedProducts.find((p) => p.slug === productForModel(m));
  const brand = brandName(m.brand, locale);
  const range = brandModels(m.brand);
  const idx = range.indexOf(m);
  const neighbours = range.slice(Math.max(0, idx - 2), idx + 3);
  const wa = ar
    ? `مرحباً، أرغب في عرض سعر للمولد ${m.code} (${brand} ${m.standbyKva} ك.ف.أ). مدينة التسليم: `
    : `Hi, I need a price for the ${m.code} (${m.standbyKva} kVA ${brand}). Delivery city: `;
  const intro = ar
    ? `قدرة احتياطية ${m.standbyKva} ك.ف.أ وأساسية ${m.primeKva} ك.ف.أ بمحرك ${brand} ${m.engine} ودينامو ليروي سومر أو ستامفورد ووحدة تحكم ديب سي. متوفر مفتوحاً أو بكابينة عازلة للصوت${m.enclosed?.container ? " أو داخل حاوية" : ""}، مع التوريد والتركيب والتشغيل في الإمارات.`
    : `${m.standbyKva} kVA standby / ${m.primeKva} kVA prime, powered by a ${brand} ${m.engine} engine with a Leroy-Somer or Stamford alternator and Deep Sea controller. Supplied open or in a silent canopy${m.enclosed?.container ? " or container" : ""}, with delivery, installation and commissioning across the UAE.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: m.code,
    mpn: m.code,
    description: intro,
    category: ar ? "مولدات الديزل" : "Diesel generators",
    url: localeUrl(locale, modelPath(m)),
    image: `${SITE_URL}${modelImage(m)}`,
    brand: { "@type": "Brand", name: "4U Power Generation" },
    additionalProperty: sections.flatMap((s) => s.rows.map((r) => ({ "@type": "PropertyValue", name: r.k, value: r.v }))),
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
          ...(parent ? [{ name: ar ? parent.name_ar : parent.name_en, path: `/products/${parent.slug}` }] : []),
          { name: m.code, path: modelPath(m) },
        ]}
        eyebrow={ar ? `مولدات ${brand} · 50 هرتز` : `${brand} generating set · 50 Hz`}
        title={name}
        intro={intro}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-950 ring-1 ring-white/10">
            <Image src={modelImage(m)} alt={name} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        }
      >
        <ul className="mb-8 flex flex-wrap gap-2 text-sm font-bold" dir="ltr">
          <li className="rounded-full bg-brand-500 px-3 py-1.5 text-ink-950">{`${m.standbyKva} kVA standby`}</li>
          <li className="rounded-full bg-white/10 px-3 py-1.5">{`${m.primeKva} kVA prime`}</li>
          <li className="rounded-full bg-white/10 px-3 py-1.5">{`${m.brand} ${m.engine}`}</li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-emerald-400">
            <ShieldCheck className="size-4" aria-hidden />
            {t("common.warranty")}
          </li>
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`model_${m.slug}`} message={wa} size="lg" label={ar ? `سعر ${m.code}` : `Get ${m.code} price`} />
          <CallButton location={`model_${m.slug}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section bg-navy-900">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl sm:text-2xl">{s.title}</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                  <table className="w-full text-start text-sm sm:text-base">
                    <caption className="sr-only">{`${s.title} — ${m.code}`}</caption>
                    <tbody className="divide-y divide-line">
                      {s.rows.map((r) => (
                        <tr key={r.k} className="even:bg-surface">
                          <th scope="row" className="w-2/5 px-4 py-3 text-start font-semibold text-muted">{r.k}</th>
                          <td className="px-4 py-3 font-semibold text-ink">{r.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <ul className="space-y-2 text-sm leading-6 text-muted">
              {ratingNotes(locale).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>

          <div id="request" className="scroll-mt-24 lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-28">
              <DatasheetGate slug={m.slug} productName={name} href={`${modelPath(m)}/datasheet`} />
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <h2 className="text-2xl">{t("cta.requestSpec")}</h2>
                <p className="mt-2 text-sm text-muted">{t("common.responseTime")}</p>
                <div className="mt-6">
                  <LeadForm source="product" productSlug={m.slug} productName={name} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="range-title">
        <div className="container-x">
          <h2 id="range-title" className="text-2xl sm:text-3xl">{ar ? "موديلات قريبة" : "Nearby models"}</h2>
          <div className="mt-6">
            <ModelTable models={neighbours} locale={locale} highlight={m.slug} />
          </div>
          <Link href={`/models#${m.brand.toLowerCase()}`} className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:underline">
            {ar ? `كل موديلات ${brand} (${range.length}) ←` : `All ${range.length} ${brand} models →`}
          </Link>
        </div>
      </section>
    </>
  );
}
