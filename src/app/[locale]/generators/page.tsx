import { getTranslations, setRequestLocale } from "next-intl/server";
import { PillarPage } from "@/components/pillar-page";
import { generatorsFaq } from "@/content/faq";
import { generatorsPillar } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/generators", title: pageSeo.generators.title[locale], description: pageSeo.generators.description[locale] });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return (
    <PillarPage
      locale={locale}
      path="/generators"
      navLabel={t("generators")}
      pillar={generatorsPillar}
      categories={["generator"]}
      faq={generatorsFaq}
      faqTitle={locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
    />
  );
}
