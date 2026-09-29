import { getTranslations, setRequestLocale } from "next-intl/server";
import { PillarPage } from "@/components/pillar-page";
import { switchgearFaq } from "@/content/faq";
import { switchgearPillar } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/switchgear", title: pageSeo.switchgear.title[locale], description: pageSeo.switchgear.description[locale] });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return (
    <PillarPage
      locale={locale}
      path="/switchgear"
      navLabel={t("switchgear")}
      pillar={switchgearPillar}
      categories={["switchgear", "mdb", "sync_panel"]}
      faq={switchgearFaq}
      faqTitle={locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
    />
  );
}
