import { hasLocale } from "next-intl";
import { notFound, permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { legacyRedirect } from "@/lib/legacy-redirects";

type Props = { params: Promise<{ locale: string; rest: string[] }> };

// Unknown paths inside a locale: old addresses Google still has are sent (308) to the closest page;
// anything else renders the localized 404 with a real 404 status (no soft-404s).
export default async function CatchAll({ params }: Props) {
  const { locale, rest } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const target = legacyRedirect(`/${rest.join("/")}`);
  if (target) permanentRedirect(`/${locale}${target}`);
  notFound();
}
