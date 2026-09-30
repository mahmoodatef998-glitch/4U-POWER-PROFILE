import type { Category, FuelType, MarketCode, Sector } from "@/lib/types";
import type { L10n } from "@/lib/utils";

export const categoryLabels: Record<Category, L10n> = {
  generator: { en: "Generators", ar: "المولدات" },
  ats_panel: { en: "ATS Panels", ar: "لوحات ATS" },
  switchgear: { en: "Switchgear", ar: "لوحات الجهد المنخفض" },
  mdb: { en: "MDB", ar: "لوحات التوزيع MDB" },
  sync_panel: { en: "Synchronizing Panels", ar: "لوحات التزامن" },
};

/** Where each category's pillar page lives. */
export const categoryHref: Record<Category, string> = {
  generator: "/generators",
  ats_panel: "/ats-panels",
  switchgear: "/switchgear",
  mdb: "/switchgear#mdb",
  sync_panel: "/switchgear#synchronizing-panels",
};

export const fuelLabels: Record<FuelType, L10n> = {
  diesel: { en: "Diesel", ar: "ديزل" },
  gas: { en: "Gas", ar: "غاز" },
  hybrid: { en: "Hybrid", ar: "هجين" },
  solar: { en: "Solar-hybrid", ar: "شمسي هجين" },
};

export const engineBrands = ["Perkins", "Cummins", "Kubota", "Volvo Penta", "Chinese Engine Series"] as const;

export const engineBrandLabels: Record<string, L10n> = {
  Perkins: { en: "Perkins", ar: "بيركنز" },
  Cummins: { en: "Cummins", ar: "كمنز" },
  Kubota: { en: "Kubota", ar: "كوبوتا" },
  "Volvo Penta": { en: "Volvo Penta", ar: "فولفو بنتا" },
  "Chinese Engine Series": { en: "Chinese Engine Series", ar: "محركات صينية" },
};

export const sectorLabels: Record<Sector, L10n> = {
  industrial: { en: "Industrial", ar: "صناعي" },
  commercial: { en: "Commercial", ar: "تجاري" },
  construction: { en: "Construction", ar: "مقاولات وبناء" },
  healthcare: { en: "Healthcare", ar: "رعاية صحية" },
  hospitality: { en: "Hospitality", ar: "ضيافة وفنادق" },
  oil_gas: { en: "Oil & Gas", ar: "نفط وغاز" },
  telecom: { en: "Telecom", ar: "اتصالات" },
  residential: { en: "Residential", ar: "سكني" },
};

export const marketNames: Record<MarketCode, L10n> = {
  uae: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  "saudi-arabia": { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  iraq: { en: "Iraq", ar: "العراق" },
  qatar: { en: "Qatar", ar: "قطر" },
  kenya: { en: "Kenya", ar: "كينيا" },
  "south-africa": { en: "South Africa", ar: "جنوب أفريقيا" },
};

export const marketShort: Record<MarketCode, L10n> = {
  uae: { en: "UAE", ar: "الإمارات" },
  "saudi-arabia": { en: "KSA", ar: "السعودية" },
  iraq: { en: "Iraq", ar: "العراق" },
  qatar: { en: "Qatar", ar: "قطر" },
  kenya: { en: "Kenya", ar: "كينيا" },
  "south-africa": { en: "South Africa", ar: "جنوب أفريقيا" },
};

export const marketFlags: Record<MarketCode, string> = {
  uae: "🇦🇪",
  "saudi-arabia": "🇸🇦",
  iraq: "🇮🇶",
  qatar: "🇶🇦",
  kenya: "🇰🇪",
  "south-africa": "🇿🇦",
};

export const primaryMarkets: MarketCode[] = ["uae", "saudi-arabia", "iraq"];
export const secondaryMarkets: MarketCode[] = ["qatar", "kenya", "south-africa"];

/** Approx. city coordinates used by the coverage map (lat, lng). */
export const marketGeo: Record<MarketCode, { lat: number; lng: number; city: L10n }> = {
  uae: { lat: 25.33, lng: 55.52, city: { en: "Sharjah (HQ)", ar: "الشارقة (المقر)" } },
  "saudi-arabia": { lat: 24.71, lng: 46.68, city: { en: "Riyadh", ar: "الرياض" } },
  iraq: { lat: 33.31, lng: 44.36, city: { en: "Baghdad", ar: "بغداد" } },
  qatar: { lat: 25.29, lng: 51.53, city: { en: "Doha", ar: "الدوحة" } },
  kenya: { lat: -1.29, lng: 36.82, city: { en: "Nairobi", ar: "نيروبي" } },
  "south-africa": { lat: -26.2, lng: 28.05, city: { en: "Johannesburg", ar: "جوهانسبرغ" } },
};
