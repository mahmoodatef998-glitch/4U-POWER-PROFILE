import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans_Arabic, Manrope, Readex_Pro } from "next/font/google";
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
// Arabic type: IBM Plex Sans Arabic for reading text, Readex Pro (geometric, pairs with Manrope) for headings.
// "swap" so first-time visitors always get the real Arabic faces; not preloaded, so English pages never download them.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});
const readexArabic = Readex_Pro({ subsets: ["arabic"], weight: "variable", variable: "--font-readex", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "4U Power Generation",
  formatDetection: { telephone: false },
  // CONTENT_TODO: paste the Google Search Console verification token when the property is created.
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
};

export const viewport: Viewport = { themeColor: "#f4f6fb", width: "device-width", initialScale: 1 };

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
      data-theme="light"
      suppressHydrationWarning
      className={`${manrope.variable} ${barlow.variable} ${plexArabic.variable} ${readexArabic.variable}`}
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
