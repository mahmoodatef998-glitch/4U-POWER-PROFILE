import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { DatasheetGate } from "@/components/datasheet-gate";
import { JsonLd } from "@/components/json-ld";
import { AddToQuoteButton } from "@/components/quote-cart";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { FUEL_ICONS, kvaLabel } from "@/lib/product-meta";
import { SectionHeading } from "@/components/section-heading";
import { categoryHref, categoryLabels, engineBrandLabels, fuelLabels } from "@/content/taxonomy";
import { products as seedProducts } from "@/content/products";
import { getProduct, getProducts } from "@/lib/data";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => seedProducts.map((p) => ({ locale, slug: p.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

function metaFor(p: NonNullable<Awaited<ReturnType<typeof getProduct>>>, locale: Locale) {
  const name = locale === "ar" ? p.name_ar : p.name_en;
  const suffix = locale === "ar" ? " | فور يو باور الإمارات" : " | 4U Power UAE";
  const title = (name + suffix).length <= 62 ? name + suffix : name;
  const raw = locale === "ar" ? p.description_ar : p.description_en;
  const description = raw.length > 155 ? `${raw.slice(0, 152).replace(/\s+\S*$/, "")}…` : raw;
  return { name, title, description };
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const m = metaFor(p, locale);
  return buildMetadata({ locale, path: `/products/${slug}`, title: m.title, description: m.description, image: p.images[0] });
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getProduct(slug);
  if (!p) notFound();
  const t = await getTranslations();
  const all = await getProducts();
  const ar = locale === "ar";
  const { name } = metaFor(p, locale);
  const description = ar ? p.description_ar : p.description_en;
  const kva = kvaLabel(p, locale, t("common.kva"));
  const FuelIcon = p.fuel_type ? FUEL_ICONS[p.fuel_type] : null;
  const related = all.filter((o) => o.slug !== p.slug && o.category === p.category).slice(0, 3);
  const fill = related.length < 3 ? all.filter((o) => o.slug !== p.slug && o.category !== p.category).slice(0, 3 - related.length) : [];
  const waMessage = t("cta.whatsappProduct", { product: name });
  const catPath = categoryHref[p.category].split("#")[0] as string;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: p.slug,
    category: categoryLabels[p.category][locale],
    url: localeUrl(locale, `/products/${p.slug}`),
    image: p.images.map((i) => (i.startsWith("http") ? i : `${SITE_URL}${i}`)),
    brand: { "@type": "Brand", name: "4U Power Generation" },
    additionalProperty: [
      ...(p.engine_brand ? [{ "@type": "PropertyValue", name: "Engine", value: p.engine_brand }] : []),
      ...p.specs.map((s) => ({
      "@type": "PropertyValue",
      name: ar ? s.label_ar : s.label_en,
      value: ar ? s.value_ar : s.value_en,
      })),
    ],
    // Price is quotation-based; no Offer price is published to avoid misleading rich results.
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
          { name: categoryLabels[p.category][locale], path: catPath },
          { name, path: `/products/${p.slug}` },
        ]}
        eyebrow={categoryLabels[p.category][locale]}
        title={name}
        intro={description}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-950 ring-1 ring-white/10">
            {p.images[0] && <Image src={p.images[0]} alt={name} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />}
          </div>
        }
      >
        <ul className="mb-8 flex flex-wrap gap-2 text-sm font-bold">
          {kva && <li className="rounded-full bg-brand-500 px-3 py-1.5 text-ink-950" dir="ltr">{kva}</li>}
          {p.engine_brand && <li className="rounded-full bg-white/10 px-3 py-1.5">{engineBrandLabels[p.engine_brand]?.[locale] ?? p.engine_brand}</li>}
          {p.fuel_type && FuelIcon && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <FuelIcon className="size-4" aria-hidden />
              {fuelLabels[p.fuel_type][locale]}
            </li>
          )}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="product_hero" message={waMessage} size="lg" />
          <AddToQuoteButton product={p} variant="hero" />
        </div>
      </PageHero>

      <section className="section bg-navy-900">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl">{t("products.specs")}</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-start text-sm sm:text-base">
                <caption className="sr-only">{`${t("products.specs")} — ${name}`}</caption>
                <tbody className="divide-y divide-line">
                  {p.specs.map((s) => (
                    <tr key={s.label_en} className="even:bg-surface">
                      <th scope="row" className="w-2/5 px-4 py-3.5 text-start font-semibold text-muted">{ar ? s.label_ar : s.label_en}</th>
                      <td className="px-4 py-3.5 font-semibold text-ink">{ar ? s.value_ar : s.value_en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {p.images.length > 1 && (
              <ul className="mt-8 grid grid-cols-2 gap-4">
                {p.images.map((img, i) => (
                  <li key={img} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-950">
                    <Image src={img} alt={`${name} — ${i + 1}`} fill sizes="(min-width:1024px) 28vw, 50vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted">{t("common.placeholderImage")}</p>

            <div className="mt-8">
              <DatasheetGate
                slug={p.slug}
                productName={name}
                // a real per-model PDF when one is uploaded; otherwise the generated printable sheet
                href={p.spec_sheet_url && !p.spec_sheet_url.includes("placeholder") ? p.spec_sheet_url : `/products/${p.slug}/datasheet`}
              />
            </div>
          </div>

          <div id="request" className="scroll-mt-24 lg:col-span-5">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className="text-2xl">{t("cta.requestSpec")}</h2>
              <p className="mt-2 text-sm text-muted">{t("common.responseTime")}</p>
              <div className="mt-6">
                <LeadForm source="product" productSlug={p.slug} productName={name} compact />
              </div>
              <div className="mt-6 grid gap-2 border-t border-line pt-6 sm:grid-cols-2">
                <WhatsAppButton location="product_form" message={waMessage} />
                <CallButton location="product_form" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="related-title">
        <div className="container-x">
          <SectionHeading id="related-title" title={t("products.related")} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...related, ...fill].map((r) => (
              <li key={r.slug}>
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
