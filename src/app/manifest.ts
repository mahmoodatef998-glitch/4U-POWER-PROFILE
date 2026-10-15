import type { MetadataRoute } from "next";

/**
 * Installable web app ("Add to Home screen"). Opens the live site without browser chrome; launches are tagged
 * utm_source=app so Analytics shows how often the installed app brings people back. "/" picks the visitor's language.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "4U Power Generation",
    short_name: "4U Power",
    description: "Diesel generators, ATS panels and switchgear in the UAE: models, datasheets, kVA calculator and quotes on WhatsApp.",
    start_url: "/?utm_source=app&utm_medium=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    categories: ["business", "shopping", "utilities"],
    icons: [
      { src: "/images/app/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/app/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/app/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "kVA Calculator · حاسبة القدرة", short_name: "Calculator", url: "/calculator?utm_source=app&utm_medium=pwa", icons: [{ src: "/images/app/icon-192.png", sizes: "192x192" }] },
      { name: "Generator models · الموديلات", short_name: "Models", url: "/models?utm_source=app&utm_medium=pwa", icons: [{ src: "/images/app/icon-192.png", sizes: "192x192" }] },
      { name: "Get a quote · اطلب عرض سعر", short_name: "Quote", url: "/contact?utm_source=app&utm_medium=pwa", icons: [{ src: "/images/app/icon-192.png", sizes: "192x192" }] },
    ],
    screenshots: [
      { src: "/images/app/screen-mobile.webp", sizes: "1080x1920", type: "image/webp", form_factor: "narrow", label: "4U Power Generation on your phone" },
      { src: "/images/app/screen-desktop.webp", sizes: "1920x1080", type: "image/webp", form_factor: "wide", label: "4U Power Generation" },
    ],
  };
}
