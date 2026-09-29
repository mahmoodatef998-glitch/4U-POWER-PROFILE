import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/content/legal";
import { pageSeo } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/privacy", title: pageSeo.privacy.title[locale], description: pageSeo.privacy.description[locale] });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage locale={locale} doc={privacy} path="/privacy" />;
}
