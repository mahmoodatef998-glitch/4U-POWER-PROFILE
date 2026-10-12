import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { ModelTable } from "@/components/model-table";
import { PageHero } from "@/components/page-hero";
import { gensetModels } from "@/lib/genset-models";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const ar = locale === "ar";
  return buildMetadata({
    locale,
    path: "/models",
    title: ar ? "موديلات مولدات بيركنز 10–2500 ك.ف.أ | الداتا شيت" : "Perkins Generator Models 10–2500 kVA | Datasheets",
    description: ar
      ? `${gensetModels.length} موديل مولد ديزل بيركنز من فور يو باور: القدرة الاحتياطية والأساسية والمحرك واستهلاك الوقود، مع داتا شيت لكل موديل.`
      : `${gensetModels.length} Perkins diesel generator models from 4U Power: standby and prime ratings, engine and fuel consumption, with a datasheet for every model.`,
  });
}

export default async function ModelsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
          { name: ar ? "موديلات بيركنز" : "Perkins models", path: "/models" },
        ]}
        eyebrow={ar ? "50 هرتز · 1500 لفة/دقيقة" : "50 Hz · 1500 rpm"}
        title={ar ? "موديلات مولدات بيركنز" : "Perkins generator models"}
        intro={
          ar
            ? `${gensetModels.length} موديل من 9.9 إلى 2500 ك.ف.أ. اختر القدرة المطلوبة وافتح صفحة الموديل لتحميل الداتا شيت أو طلب السعر.`
            : `${gensetModels.length} models from 9.9 to 2,500 kVA. Pick the rating you need and open the model to download its datasheet or request a price.`
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="models_index" size="lg" />
          <CallButton location="models_index" size="lg" variant="ghostDark" />
        </div>
      </PageHero>
      <section className="section bg-navy-900">
        <div className="container-x">
          <ModelTable models={gensetModels} locale={locale} />
          <p className="mt-4 text-sm text-muted">
            {ar ? "القدرة الاحتياطية للاستخدام عند انقطاع الكهرباء، والأساسية للتشغيل المستمر. القيم حسب ISO 8528." : "Standby is for mains-failure use; prime is for continuous running. Ratings to ISO 8528."}
          </p>
        </div>
      </section>
    </>
  );
}
