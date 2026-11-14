import type { Metadata } from "next";
import { SITE_URL, company, googleBusiness, listings, social } from "./site";
import type { Locale } from "./utils";

export const OG_IMAGE = "/images/og-default.png";

/** Absolute URL for a locale + path ("/" => "/en"). */
export function localeUrl(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}/${locale}${clean}`;
}

type MetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

/** Google cuts titles at about 60 characters: drop trailing " | …" parts (brand, "Specs & Datasheet") until it fits. */
export function fitTitle(title: string, max = 60): string {
  let t = title;
  while (t.length > max && t.includes(" | ")) {
    const shorter = t.slice(0, t.lastIndexOf(" | "));
    if (shorter.length < 30) break;
    t = shorter;
  }
  return t;
}

export function buildMetadata({ locale, path, title: fullTitle, description, image, type = "website", publishedTime, noindex }: MetaInput): Metadata {
  const title = fitTitle(fullTitle);
  const url = localeUrl(locale, path);
  const ogImage = image && !image.endsWith(".svg") ? image : OG_IMAGE;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { en: localeUrl("en", path), ar: localeUrl("ar", path), "x-default": localeUrl("en", path) },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: locale === "ar" ? company.brandAr : company.brand,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? ["en_AE"] : ["ar_AE"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large" },
  };
}

/* ------------------------------------------------------------------ JSON-LD */

export const ORG_ID = `${SITE_URL}/#organization`;
export const BUSINESS_ID = `${SITE_URL}/#localbusiness`;

function postalAddress(locale: Locale) {
  return {
    "@type": "PostalAddress",
    streetAddress: locale === "ar" ? company.address.streetAr : company.address.street,
    postOfficeBoxNumber: company.address.poBox.replace("P.O. Box ", ""),
    addressLocality: locale === "ar" ? company.address.cityAr : company.address.city,
    addressRegion: locale === "ar" ? company.address.cityAr : company.address.city,
    addressCountry: company.address.countryCode,
  };
}

/**
 * The company's one real LocalBusiness (same @id as in organizationSchema, so Google merges the nodes),
 * with the city a location page serves added as areaServed. Address, phone and hours are the real ones.
 */
export function localBusinessForArea(locale: Locale, area: { name: string; country: string }, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": BUSINESS_ID,
    name: company.brand,
    url: pageUrl,
    image: `${SITE_URL}${OG_IMAGE}`,
    telephone: company.phoneE164,
    email: company.email,
    address: postalAddress(locale),
    geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
    openingHours: company.hours,
    priceRange: "$$",
    parentOrganization: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: area.name, containedInPlace: { "@type": "Country", name: area.country } },
  };
}

export function organizationSchema(locale: Locale) {
  const sameAs = [...Object.values(social).filter((u) => u && !u.includes("wa.me")), ...listings];
  const address = postalAddress(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: company.brand,
        alternateName: [company.legalName, company.brandAr, company.legalNameAr],
        legalName: company.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-mark.png`,
        foundingDate: company.foundingDate,
        founders: company.owners.map((name) => ({ "@type": "Person", name })),
        telephone: company.phoneE164,
        email: company.email,
        address,
        identifier: { "@type": "PropertyValue", name: "SAIF Zone Licence No.", value: company.licenseNo },
        ...(sameAs.length ? { sameAs } : {}),
        areaServed: ["AE", "SA", "IQ", "QA", "KE", "ZA"],
      },
      {
        "@type": ["LocalBusiness", "Store"],
        "@id": BUSINESS_ID,
        name: company.brand,
        legalName: company.legalName,
        parentOrganization: { "@id": ORG_ID },
        url: localeUrl(locale),
        image: `${SITE_URL}${OG_IMAGE}`,
        telephone: company.phoneE164,
        email: company.email,
        address,
        geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
        hasMap: googleBusiness.mapsUrl,
        openingHours: company.hours,
        priceRange: "$$",
        currenciesAccepted: "AED, USD",
        areaServed: [
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Saudi Arabia" },
          { "@type": "Country", name: "Iraq" },
          { "@type": "Country", name: "Qatar" },
          { "@type": "Country", name: "Kenya" },
          { "@type": "Country", name: "South Africa" },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: company.phoneE164,
          contactType: "sales",
          availableLanguage: ["English", "Arabic"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.brand,
        inLanguage: locale === "ar" ? "ar-AE" : "en-AE",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(locale: Locale, crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localeUrl(locale, c.path),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
