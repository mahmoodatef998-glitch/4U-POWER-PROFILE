import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/legal";
import { pageSeo } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/terms", title: pageSeo.terms.title[locale], description: pageSeo.terms.description[locale] });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage locale={locale} doc={terms} path="/terms" />;
}
