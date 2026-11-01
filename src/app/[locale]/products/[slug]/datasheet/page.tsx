import { ArrowLeft, Cog, FlaskConical, Fuel, Globe, Layers, MapPin, Phone, ShieldCheck, Truck, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Barlow_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/print-button";
import { products as seedProducts } from "@/content/products";
import { categoryLabels, engineBrandLabels, fuelLabels } from "@/content/taxonomy";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProduct } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";
import { formatDate, type Locale } from "@/lib/utils";
// same 4U sheet parts as the model datasheets (navy / red, Barlow Condensed, fixed A4 pages)
import s from "../../../models/[slug]/datasheet/datasheet.module.css";
import { FitPages } from "../../../models/[slug]/datasheet/fit-pages";

const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], style: ["normal", "italic"], variable: "--ds-font", display: "swap" });

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

type Kpi = { I: LucideIcon; head: string; value: ReactNode; sub?: string };

/**
 * Product (range) datasheet: one A4 page in the 4U navy / red style of the model datasheets — cover photo,
 * key figures, overview, photos and the product's specification table. Every value comes from the product
 * record; print / "Save as PDF" gives the page edge to edge.
 */
export default async function DatasheetPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getProduct(slug);
  if (!p) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = (en: string, a: string) => (ar ? a : en);
  const name = ar ? p.name_ar : p.name_en;
  const category = categoryLabels[p.category][locale];
  const today = new Date().toISOString().slice(0, 10);

  // last word(s) in red, as the model code's tail: the kVA range when the name ends with it
  const m = name.match(/^(.*?)(\s[\d.,–-]+\s?(?:kVA|ك\.ف\.أ|A|أمبير|kV)?)$/);
  const [head, tail] = m ? [m[1] ?? name, m[2] ?? ""] : [name, ""];

  const kvaMin = p.kva_min != null && p.kva_max != null ? `${p.kva_min}–${p.kva_max}` : null;
  const engine = p.engine_brand ? (engineBrandLabels[p.engine_brand]?.[locale] ?? p.engine_brand) : null;
  const fuel = p.fuel_type ? fuelLabels[p.fuel_type][locale] : null;
  const kpis: Kpi[] = [
    kvaMin
      ? { I: Zap, head: t("products.kvaRange"), value: <span className={`${s.kpiVal} ${s.ltr}`}>{kvaMin}<small>kVA</small></span>, sub: category }
      : { I: Layers, head: t("common.category"), value: <span className={s.kpiText}>{category}</span> },
    ...(engine ? [{ I: Cog, head: t("common.engine"), value: <span className={s.kpiText}>{engine}</span>, sub: fuel ?? undefined }] : fuel ? [{ I: Fuel, head: t("common.fuel"), value: <span className={s.kpiText}>{fuel}</span> }] : []),
  ];
  const specLines = p.specs.slice(0, 3).map((x) => (ar ? x.value_ar : x.value_en));
  // real photos only (the line drawings are for cards)
  const photos = p.images.slice(1).filter((src) => !src.endsWith(".svg")).slice(0, 2);
  const H2 = ({ children }: { children: ReactNode }) => <h2 className={s.h2}>{children}</h2>;
  /** number ranges ("10-200", "63–400") kept left-to-right and unbroken inside Arabic text */
  const iso = (text: string): ReactNode[] =>
    text.split(/(\d[\d.,]*\s?[–-]\s?\d[\d.,]*)/).map((part, i) => (i % 2 ? <span key={i} className={s.ltr} style={{ whiteSpace: "nowrap" }}>{part}</span> : part));

  return (
    <div className={barlow.variable}>
      <div className="no-print mx-auto mt-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-2">
        <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="flip-rtl size-4" aria-hidden />
          {t("datasheet.back")}
        </Link>
        <PrintButton label={t("datasheet.print")} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#e02b36] px-5 text-sm font-bold text-white hover:bg-[#b81d27]" />
      </div>

      <div className={`sheet ${s.doc}`} dir={ar ? "rtl" : "ltr"} lang={locale}>
        <section className={s.page}>
          <div className={s.hero}>
            <div className={s.heroImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.images[0] && <img src={p.images[0]} alt={name} />}
            </div>
            <div className={s.heroShade} />
            <i className={s.slash} aria-hidden />
            <div className={s.heroTop}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-full-red.png" alt="4U Power Generation" className={s.logo} />
              <div className={s.docLabel}>
                <span className={s.kicker}>{L("Product data sheet", "بيانات فنية للمنتج")}</span>
                <span className={s.tag}>{category}</span>
              </div>
            </div>
            <div className={s.heroText}>
              <div className={s.powered}>{category}</div>
              <h1 className={`${s.pname} ${name.length > 32 ? s.long : ""}`}>
                {iso(head)}
                {tail && <span className={`${s.tail} ${s.ltr}`}>{tail}</span>}
              </h1>
              {specLines.length > 0 && (
                <div className={s.specLines}>
                  {specLines.map((v) => (
                    <div key={v}>{v}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={s.kpis} style={{ gridTemplateColumns: `repeat(${kpis.length + 1}, 1fr)` }}>
            {kpis.map(({ I, head: h, value, sub }, i) => (
              <div key={h} className={`${s.kpi} ${i === 0 ? s.kpiRed : s.kpiNavy}`}>
                <div className={s.kpiHead}>
                  <I aria-hidden /> {h}
                </div>
                {value}
                {sub && <div className={s.kpiSub}>{sub}</div>}
              </div>
            ))}
            <div className={`${s.kpi} ${s.kpiWhite}`}>
              <div className={s.kpiHead}>
                <ShieldCheck aria-hidden /> {L("Warranty", "الضمان")}
              </div>
              <span className={s.kpiVal}>
                12<small>{L("months", "شهراً")}</small>
              </span>
              <div className={s.kpiSub}>{L("or 1,000 running hours", "أو 1,000 ساعة تشغيل")}</div>
            </div>
          </div>

          <div className={s.cols}>
            <div className={s.col}>
              <div>
                <H2>{L("Overview", "نظرة عامة")}</H2>
                <p className={s.p}>{ar ? p.description_ar : p.description_en}</p>
              </div>
              {photos.length > 0 && (
                <div className={s.thumbs}>
                  {photos.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt={name} />
                  ))}
                </div>
              )}
              <div>
                <H2>{L("Service & support", "الخدمة والدعم")}</H2>
                <div className={`${s.tiles} ${s.tiles2}`}>
                  {[
                    { I: ShieldCheck, t: t("common.warrantyLong") },
                    { I: FlaskConical, t: L("Testing & commissioning", "اختبار وتشغيل") },
                    { I: Wrench, t: L("Maintenance & AMC", "صيانة وعقود سنوية") },
                    { I: Truck, t: L("Delivery: UAE · KSA · Iraq", "التوصيل: الإمارات · السعودية · العراق") },
                  ].map(({ I, t: label }) => (
                    <div key={label} className={s.tile}>
                      <I aria-hidden />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={s.col}>
              {p.specs.length > 0 && (
                <div>
                  <H2>{t("products.specs")}</H2>
                  <table className={`${s.table} ${s.kv}`}>
                    <tbody>
                      {p.specs.map((x) => (
                        <tr key={x.label_en}>
                          <th scope="row">{ar ? x.label_ar : x.label_en}</th>
                          <td>{ar ? x.value_ar : x.value_en}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className={s.note}>{t("datasheet.note")}</p>
                </div>
              )}
            </div>
          </div>

          <div className={s.contactBar}>
            <div className={s.contactItem}>
              <MapPin aria-hidden />
              <div>
                <b>{ar ? company.legalNameAr : "4U Power Generation (FZC)"}</b>
                <span>
                  {t("footer.license", { no: company.licenseNo })} · {t("datasheet.issued")}: {formatDate(today, locale)}
                </span>
              </div>
            </div>
            <div className={s.contactItem}>
              <Globe aria-hidden />
              <div className={s.ltr}>
                <b>www.4ugenerators.com</b>
                <span>{company.email}</span>
              </div>
            </div>
            <div className={s.contactItem}>
              <Phone aria-hidden />
              <div>
                <b className={s.ltr}>{company.phone}</b>
                <span>{L("Sales & support", "المبيعات والدعم")}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FitPages />
    </div>
  );
}
