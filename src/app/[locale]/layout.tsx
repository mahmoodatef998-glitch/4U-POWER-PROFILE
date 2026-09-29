import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Analytics, GtmNoScript } from "@/components/analytics";
import { FloatingCta } from "@/components/floating-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { UtmCapture } from "@/components/utm-capture";
import { routing } from "@/i18n/routing";
import { organizationSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-arabic",
  // "optional" = no late font swap, so zero layout shift on Arabic pages. First-time visitors may see the
  // device's Arabic system font; the webfont is cached and used from the next page view.
  display: "optional",
  // Not preloaded: English pages must not pay for Arabic font files.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "4U Power Generation",
  formatDetection: { telephone: false },
  // CONTENT_TODO: paste the Google Search Console verification token when the property is created.
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
};

export const viewport: Viewport = { themeColor: "#060c18", width: "device-width", initialScale: 1 };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <html lang={ar ? "ar" : "en"} dir={ar ? "rtl" : "ltr"} className={`${manrope.variable} ${plexArabic.variable}`}>
      <body className="min-h-screen pb-[4.5rem] md:pb-0">
        <GtmNoScript />
        <JsonLd data={organizationSchema(locale as Locale)} />
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingCta />
          <UtmCapture />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
