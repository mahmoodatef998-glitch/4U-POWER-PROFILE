import { BatteryCharging, Flame, Fuel, Sun } from "lucide-react";
import type { FuelType, Product } from "./types";
import { formatNumber, type Locale } from "./utils";

export const FUEL_ICONS: Record<FuelType, typeof Fuel> = { diesel: Fuel, gas: Flame, hybrid: BatteryCharging, solar: Sun };

export function kvaLabel(p: Pick<Product, "kva_min" | "kva_max">, locale: Locale, unit: string) {
  if (p.kva_min == null || p.kva_max == null) return null;
  return `${formatNumber(p.kva_min, locale)}–${formatNumber(p.kva_max, locale)} ${unit}`;
}

/** Snapshot of a product for the quote cart (both languages, so switching locale keeps the cart readable). */
export function quoteItemFor(p: Product) {
  return {
    slug: p.slug,
    category: p.category,
    name_en: p.name_en,
    name_ar: p.name_ar,
    spec_en: kvaLabel(p, "en", "kVA") ?? "",
    spec_ar: kvaLabel(p, "ar", "ك.ف.أ") ?? "",
    image: p.images[0] ?? null,
  };
}
