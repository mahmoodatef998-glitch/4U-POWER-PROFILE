import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { ModelTable } from "@/components/model-table";
import { PageHero } from "@/components/page-hero";
import { BRANDS, brandModels, brandName, gensetModels } from "@/lib/genset-models";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const ar = locale === "ar";
  return buildMetadata({
    locale,
    path: "/models",
    title: ar ? "موديلات مولدات بيركنز وكمنز 10–2500 ك.ف.أ | الداتا شيت" : "Perkins & Cummins Generator Models 10–2500 kVA | Datasheets",
    description: ar
      ? `${gensetModels.length} موديل مولد ديزل بيركنز وكمنز من فور يو باور: القدرة الاحتياطية والأساسية والمحرك واستهلاك الوقود، مع داتا شيت لكل موديل.`
      : `${gensetModels.length} Perkins and Cummins diesel generator models from 4U Power: standby and prime ratings, engine and fuel consumption, with a datasheet for every model.`,
  });
}

export default async function ModelsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const ranges = BRANDS.map((brand) => {
    const list = brandModels(brand);
    return { brand, list, min: list[0]!.standbyKva, max: list[list.length - 1]!.standbyKva };
  });
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
          { name: ar ? "موديلات المولدات" : "Generator models", path: "/models" },
        ]}
        eyebrow={ar ? "50 هرتز · 1500 لفة/دقيقة" : "50 Hz · 1500 rpm"}
        title={ar ? "موديلات مولدات بيركنز وكمنز" : "Perkins & Cummins generator models"}
        intro={
          ar
            ? `${gensetModels.length} موديل من 9.9 إلى 2500 ك.ف.أ. اختر القدرة المطلوبة وافتح صفحة الموديل لتحميل الداتا شيت أو طلب السعر.`
            : `${gensetModels.length} models from 9.9 to 2,500 kVA. Pick the rating you need and open the model to download its datasheet or request a price.`
        }
      >
        <ul className="mb-8 flex flex-wrap gap-2 text-sm font-bold">
          {ranges.map((r) => (
            <li key={r.brand}>
              <a href={`#${r.brand.toLowerCase()}`} className="inline-flex rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
                {ar ? `${brandName(r.brand, locale)} · ${r.list.length} موديل` : `${r.brand} · ${r.list.length} models`}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="models_index" size="lg" />
          <CallButton location="models_index" size="lg" variant="ghostDark" />
        </div>
      </PageHero>
      {ranges.map((r, i) => (
        <section key={r.brand} id={r.brand.toLowerCase()} className={`section scroll-mt-24 ${i % 2 ? "bg-surface" : "bg-navy-900"}`} aria-labelledby={`${r.brand.toLowerCase()}-title`}>
          <div className="container-x">
            <h2 id={`${r.brand.toLowerCase()}-title`} className="text-2xl sm:text-3xl">
              {ar ? `موديلات ${brandName(r.brand, locale)} (${r.list.length})` : `${r.brand} models (${r.list.length})`}
            </h2>
            <p className="mt-2 text-muted">
              {ar ? `من ${r.min} إلى ${r.max} ك.ف.أ احتياطي.` : `${r.min} to ${r.max.toLocaleString("en")} kVA standby.`}
              {r.brand === "Cummins" && (ar ? " الحرف (A/B/C) يعني محركاً بديلاً لنفس القدرة." : " A letter suffix (A/B/C) marks an alternative engine at the same rating.")}
            </p>
            <div className="mt-6">
              <ModelTable models={r.list} locale={locale} />
            </div>
            {i === ranges.length - 1 && (
              <p className="mt-4 text-sm text-muted">
                {ar ? "القدرة الاحتياطية للاستخدام عند انقطاع الكهرباء، والأساسية للتشغيل المستمر. القيم حسب ISO 8528." : "Standby is for mains-failure use; prime is for continuous running. Ratings to ISO 8528."}
              </p>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
