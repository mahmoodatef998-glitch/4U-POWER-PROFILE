import { CheckCircle2, Ship } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { RATINGS_60HZ } from "@/content/genset-60hz";
import { cities } from "@/content/locations";
import { fiftyHzModels, modelPath } from "@/lib/genset-models";
import { getMarketPage, marketPages } from "@/content/markets";
import { Link } from "@/i18n/navigation";
import { marketNames } from "@/content/taxonomy";
import { routing } from "@/i18n/routing";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => marketPages.map((m) => ({ locale, country: m.code })));
}

type Props = { params: Promise<{ locale: Locale; country: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, country } = await params;
  const m = getMarketPage(country);
  if (!m) return {};
  return buildMetadata({ locale, path: `/markets/${country}`, title: m.seo.title[locale], description: m.seo.description[locale] });
}

const FEATURED: Record<string, string[]> = {
  uae: ["perkins-diesel-generator-10-200kva", "ats-panel-63a-400a", "main-distribution-board-mdb"],
  "saudi-arabia": ["cummins-diesel-generator-20-500kva", "generator-synchronizing-panel", "ats-panel-630a-4000a"],
  iraq: ["perkins-diesel-generator-250-2500kva", "cummins-diesel-generator-550-2500kva", "generator-synchronizing-panel"],
  qatar: ["hybrid-battery-generator-20-200kva", "baudouin-diesel-generator-20-2500kva", "ats-panel-63a-400a"],
  kenya: ["solar-hybrid-power-system-10-100kva", "chinese-engine-generator-series-20-1000kva", "perkins-diesel-generator-10-200kva"],
  "south-africa": ["cummins-diesel-generator-20-500kva", "ats-panel-63a-400a", "cummins-diesel-generator-550-2500kva"],
};

/** Common sizes for the Saudi 60 Hz table: the first model at each prime rating that has published 1800 rpm figures. */
const KSA_60HZ_SIZES = [20, 30, 50, 100, 150, 200, 250, 300, 400, 500, 650, 800, 1000, 1250, 1500, 2000];
function ksa60Rows() {
  const all = fiftyHzModels();
  return KSA_60HZ_SIZES.map((k) => all.find((m) => m.primeKva === k && RATINGS_60HZ[m.engine])).filter((m) => m !== undefined);
}

export default async function MarketPage({ params }: Props) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const m = getMarketPage(country);
  if (!m) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const all = await getProducts();
  const featured = (FEATURED[m.code] ?? []).map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const name = marketNames[m.code][locale];
  const waMessage = t("cta.whatsappPage", { topic: ar ? `التوريد إلى ${name}` : `supply to ${name}` });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.markets"), path: "/markets" },
          { name, path: `/markets/${m.code}` },
        ]}
        eyebrow={name}
        title={pick(m.h1, locale)}
        intro={pick(m.intro, locale)}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`market_${m.code}`} message={waMessage} size="lg" />
          <CallButton location={`market_${m.code}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section bg-navy-900">
        <div className="container-x">
          <SectionHeading title={ar ? `لماذا فور يو باور في ${name}` : `Why 4U Power for ${name}`} />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {m.points.map((pt) => (
              <li key={pt.title.en} className="rounded-2xl border border-line bg-surface p-6">
                <CheckCircle2 className="size-6 text-brand-600" aria-hidden />
                <h3 className="mt-4 text-lg text-ink">{pick(pt.title, locale)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{pick(pt.body, locale)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="on-dark rounded-2xl bg-navy-950 p-6 text-white">
              <h3 className="flex items-center gap-2 text-lg">
                <Ship className="size-5 text-brand-400" aria-hidden />
                {ar ? "الشحن والتسليم" : "Shipping & delivery"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/80">{pick(m.logistics, locale)}</p>
            </div>
            <div className="rounded-2xl border border-brand-500/40 bg-brand-50 p-6">
              <h3 className="text-lg text-ink">{ar ? "الأكثر طلباً" : "Most requested"}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-700">{pick(m.focus, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section bg-surface" aria-labelledby="feat-title">
          <div className="container-x">
            <SectionHeading id="feat-title" title={ar ? `منتجات مقترحة لـ ${name}` : `Recommended for ${name}`} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {m.code === "saudi-arabia" && (
        <section className="section" aria-labelledby="hz60-title">
          <div className="container-x">
            <SectionHeading id="hz60-title" title={ar ? "مولدات 60 هرتز للسعودية: القدرة على 50 و60 هرتز" : "60 Hz generators for Saudi Arabia: 50 Hz vs 60 Hz ratings"} />
            <p className="mt-4 max-w-3xl leading-7 text-muted">
              {ar
                ? "شبكة السعودية تعمل على 60 هرتز، والمحرك على 1800 لفة لا يعطي دائماً نفس قدرة 1500 لفة. هذه قدرات 60 هرتز المنشورة من المصنّعين لأحجام شائعة، ونؤكد القدرة على الجهد المطلوب لمشروعك في عرض السعر."
                : "Saudi Arabia's grid runs at 60 Hz, and an engine at 1800 rpm does not always give the same output as at 1500 rpm. These are the makers' published 60 Hz ratings for common sizes; we confirm the rating at your project voltage in the quotation."}
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[40rem] text-start text-sm">
                <caption className="sr-only">{ar ? "قدرات المولدات على 50 و60 هرتز" : "Generator ratings at 50 Hz and 60 Hz"}</caption>
                <thead className="bg-surface text-muted">
                  <tr>
                    {(ar
                      ? ["الموديل", "المحرك", "50 هرتز أساسي / احتياطي", "60 هرتز أساسي / احتياطي"]
                      : ["Model", "Engine", "50 Hz prime / standby", "60 Hz prime / standby"]
                    ).map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ksa60Rows().map((x) => {
                    const r = RATINGS_60HZ[x.engine]!;
                    const unit = ar ? "ك.ف.أ" : "kVA";
                    return (
                      <tr key={x.slug}>
                        <th scope="row" className="px-4 py-3 text-start">
                          <Link href={modelPath(x)} className="font-bold text-brand-700 hover:underline">{x.code}</Link>
                        </th>
                        <td className="px-4 py-3 text-ink" dir="ltr">{x.brand} {r.engine ?? x.engine}</td>
                        <td className="px-4 py-3 text-ink whitespace-nowrap">{x.primeKva} / {x.standbyKva} {unit}</td>
                        <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">{r.prime} / {r.standby} {unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {cities.some((c) => c.market === m.code) && (
        <section className="section" aria-labelledby="cities-title">
          <div className="container-x">
            <SectionHeading id="cities-title" title={ar ? `مورد مولدات في مدن ${name}` : `Generator suppliers by city in ${name}`} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cities
                .filter((c) => c.market === m.code)
                .map((c) => (
                  <li key={c.slug}>
                    <Link href={`/locations/${c.slug}`} className="flex h-full rounded-2xl border border-line px-5 py-4 font-semibold text-ink transition hover:border-brand-500/50 hover:bg-white/5">
                      {ar ? `مورد مولدات في ${pick(c.name, locale)}` : `Generator supplier in ${c.name.en}`}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {m.faq.length > 0 && <FaqBlock locale={locale} items={m.faq} title={ar ? "الأسئلة الشائعة" : "Frequently asked questions"} eyebrow={locale === "ar" ? "أسئلة وأجوبة" : "FAQ"} className="bg-navy-900" />}
      <CtaBanner
        title={ar ? `اطلب عرض سعر للتوريد إلى ${name}` : `Get a quotation for delivery to ${name}`}
        body={ar ? "أرسل القدرة ومدينة التسليم وسنرد بالخيارات والسعر ومدة الشحن." : "Send the kVA and delivery city — we reply with options, pricing and shipping time."}
        message={waMessage}
        location={`market_cta_${m.code}`}
      />
    </>
  );
}
