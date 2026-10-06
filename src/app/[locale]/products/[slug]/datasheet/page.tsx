import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrintButton } from "@/components/print-button";
import { products as seedProducts } from "@/content/products";
import { categoryLabels, engineBrandLabels, fuelLabels } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProduct } from "@/lib/data";
import { kvaLabel } from "@/lib/product-meta";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";
import { formatDate, type Locale } from "@/lib/utils";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => seedProducts.map((p) => ({ locale, slug: p.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const name = locale === "ar" ? p.name_ar : p.name_en;
  const t = await getTranslations({ locale, namespace: "datasheet" });
  // gated asset: kept out of search results
  return buildMetadata({ locale, path: `/products/${slug}/datasheet`, title: `${name} — ${t("docTitle")}`, description: name, noindex: true });
}

/**
 * Printable A4 datasheet. Always rendered light (fixed colours, not theme tokens) so "Save as PDF"
 * gives a clean white document in either site theme; site chrome is hidden in print (see globals.css).
 */
export default async function DatasheetPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getProduct(slug);
  if (!p) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const name = ar ? p.name_ar : p.name_en;
  const kva = kvaLabel(p, locale, t("common.kva"));
  const facts = [
    { k: t("common.category"), v: categoryLabels[p.category][locale] },
    ...(kva ? [{ k: t("products.kvaRange"), v: kva }] : []),
    ...(p.engine_brand ? [{ k: t("common.engine"), v: engineBrandLabels[p.engine_brand]?.[locale] ?? p.engine_brand }] : []),
    ...(p.fuel_type ? [{ k: t("common.fuel"), v: fuelLabels[p.fuel_type][locale] }] : []),
    { k: ar ? "الضمان" : "Warranty", v: t("common.warrantyLong") },
  ];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="px-2 py-8 sm:px-4 print:p-0">
      <div className="no-print mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
        <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="flip-rtl size-4" aria-hidden />
          {t("datasheet.back")}
        </Link>
        <PrintButton label={t("datasheet.print")} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-bold text-ink-950 hover:bg-brand-400" />
      </div>

      <article className="sheet mx-auto max-w-[210mm] overflow-hidden rounded-2xl bg-[#fff] text-[#111827] shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
        <header className="flex items-center justify-between gap-6 bg-[#0b1022] px-8 py-6 text-[#fff]">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-mark-gray.png" alt="" width={275} height={375} className="h-12 w-auto" />
            <div className="leading-tight">
              <p className="text-lg font-extrabold">{ar ? company.brandAr : company.brand}</p>
              <p className="text-xs text-[#ffdf58]">{t("datasheet.docTitle")}</p>
            </div>
          </div>
          <div className="text-end text-xs text-[#c9cfdc]" dir="ltr">
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>4ugenerators.com</p>
          </div>
        </header>
        <div className="h-1.5 bg-[repeating-linear-gradient(-45deg,#ffdf58_0_12px,#0b1022_12px_24px)]" />

        <div className="grid gap-8 px-8 py-8 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a5900]">{categoryLabels[p.category][locale]}</p>
            <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight text-[#0b1022]">{name}</h1>
            <p className="mt-4 text-sm leading-7 text-[#374151]">{ar ? p.description_ar : p.description_en}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {facts.map((f) => (
                <div key={f.k} className="rounded-xl border border-[#e5e7eb] p-3">
                  <dt className="text-[0.7rem] font-semibold text-[#6b7280]">{f.k}</dt>
                  <dd className="mt-0.5 text-sm font-bold text-[#0b1022]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="sm:col-span-2">
            {p.images[0] && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0b1022]">
                <Image src={p.images[0]} alt={name} fill sizes="(min-width:640px) 30vw, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>

        <section className="px-8 pb-8">
          <h2 className="border-b-2 border-[#ffd426] pb-2 text-lg font-bold text-[#0b1022]">{t("products.specs")}</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {p.specs.map((s, i) => (
                <tr key={s.label_en} className={i % 2 ? "bg-[#f8fafc]" : undefined}>
                  <th scope="row" className="w-2/5 px-3 py-2.5 text-start font-semibold text-[#4b5563]">{ar ? s.label_ar : s.label_en}</th>
                  <td className="px-3 py-2.5 font-semibold text-[#111827]">{ar ? s.value_ar : s.value_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-[#6b7280]">{t("datasheet.note")}</p>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] bg-[#f8fafc] px-8 py-4 text-[0.7rem] text-[#6b7280]">
          <p>
            {ar ? company.legalNameAr : company.legalName} · {t("footer.license", { no: company.licenseNo })} · {ar ? company.address.streetAr : company.address.street}, {ar ? company.address.cityAr : company.address.city}
          </p>
          <p>
            {t("datasheet.issued")}: {formatDate(today, locale)}
          </p>
        </footer>
      </article>
    </div>
  );
}
