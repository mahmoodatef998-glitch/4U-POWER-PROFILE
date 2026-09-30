import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Analytics, GtmNoScript } from "@/components/analytics";
import { FloatingCta } from "@/components/floating-cta";
import { Footer } from "@/components/footer";
import { SpotlightTracker } from "@/components/fx";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { UtmCapture } from "@/components/utm-capture";
import { routing } from "@/i18n/routing";
import { organizationSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["800"], variable: "--font-barlow", display: "swap" });
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

export const viewport: Viewport = { themeColor: "#0a0a0b", width: "device-width", initialScale: 1 };

// Only /en and /ar exist; anything else (e.g. /favicon.ico) is a hard 404 instead of rendering with a bogus locale.
export const dynamicParams = false;

const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <html
      lang={ar ? "ar" : "en"}
      dir={ar ? "rtl" : "ltr"}
      data-theme="dark"
      suppressHydrationWarning
      className={`${manrope.variable} ${barlow.variable} ${plexArabic.variable}`}
    >
      <head>
        {/* apply the saved theme before first paint (no flash) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen pb-[4.5rem] md:pb-0">
        <GtmNoScript />
        <JsonLd data={organizationSchema(locale as Locale)} />
        <NextIntlClientProvider>
          <Header />
          <main id="main" className="relative isolate">
            {/* night-sky glow that follows the viewport across every page */}
            <div aria-hidden className="nebula pointer-events-none sticky top-0 -z-10 -mb-[100vh] h-screen" />
            {children}
          </main>
          <Footer />
          <FloatingCta />
          <UtmCapture />
          <SpotlightTracker />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
