import { Box, Cable, Fuel, Ruler, type LucideIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Configurator } from "@/components/configurator/configurator";
import { PageHero } from "@/components/page-hero";
import { configModels, gensetModels } from "@/lib/genset-models";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const ar = locale === "ar";
  return buildMetadata({
    locale,
    path: "/configurator",
    title: ar ? "صمّم مولدك ثلاثي الأبعاد | كابينة، حاوية، ATS، خزان" : "3D Generator Configurator | Canopy, Container, ATS & Tank",
    description: ar
      ? `اختر من ${gensetModels.length} موديل مولد ديزل، وأضف الكابينة أو الحاوية ولوحة ATS والخزان والمقطورة واللون، وشاهد المولد 360 درجة بالمقاسات الحقيقية، ثم أرسل التكوين لعرض سعر.`
      : `Pick from ${gensetModels.length} diesel generator models, add canopy or container, ATS, fuel tank, trailer and colour, see it in 360° at true dimensions, then send the build for a quote.`,
  });
}

export default async function ConfiguratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const points: [LucideIcon, string, string][] = ar
    ? [
        [Ruler, "مقاسات حقيقية", "الأبعاد والوزن والخزان من داتا شيت كل موديل."],
        [Box, "كابينة أو حاوية", "مفتوح، كابينة عازلة، أو حاوية ISO 20/40 قدم بأي لون RAL."],
        [Cable, "ATS ولوحات التزامن", "لوحة ATS بالتيار المناسب، ولوحة تزامن لعدة مولدات."],
        [Fuel, "خزان ومقطورة", "خزان خارجي حتى 5000 لتر مع مدة التشغيل، ومقطورة حتى 500 ك.ف.أ."],
      ]
    : [
        [Ruler, "True dimensions", "Length, width, height, weight and tank from each model's datasheet."],
        [Box, "Canopy or container", "Open, silent canopy or ISO 20/40 ft container in any RAL colour."],
        [Cable, "ATS & synchronising", "ATS rated to the set, or a synchronising panel for parallel sets."],
        [Fuel, "Tank & trailer", "External tank up to 5,000 L with running hours, road trailer up to 500 kVA."],
      ];
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
          { name: ar ? "صمّم مولدك" : "Configurator", path: "/configurator" },
        ]}
        eyebrow={ar ? "تصميم ثلاثي الأبعاد · 360°" : "3D · 360°"}
        title={ar ? "صمّم مولدك ثلاثي الأبعاد" : "Build your generator in 3D"}
        intro={
          ar
            ? "اختر الموديل والهيكل والإضافات، وشاهد المولد من كل الزوايا بالمقاسات الحقيقية، ثم أرسل التكوين لمهندسنا لعرض سعر."
            : "Choose the model, enclosure and add-ons, turn it around in 360° at true size, then send the build to our engineer for a quote."
        }
      />
      <section className="section bg-surface">
        <div className="container-x">
          <Configurator models={configModels()} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {points.map(([Icon, title, body]) => (
              <li key={title} className="rounded-2xl border border-line bg-navy-900 p-5">
                <Icon className="size-6 text-brand-500" aria-hidden />
                <h2 className="mt-3 text-base font-bold text-ink">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-5 text-muted">
            {ar
              ? "نموذج توضيحي ثلاثي الأبعاد بالمقاسات الخارجية الحقيقية؛ يتم تأكيد التفاصيل النهائية في رسم الترتيب العام (GA) عند الطلب."
              : "Illustrative 3D model at the real outside dimensions; final details are confirmed on the general arrangement (GA) drawing with your order."}
          </p>
        </div>
      </section>
    </>
  );
}
