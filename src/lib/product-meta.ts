import { BatteryCharging, Flame, Fuel, Sun } from "lucide-react";
import type { FuelType, Product } from "./types";
import { formatNumber, type Locale } from "./utils";

export const FUEL_ICONS: Record<FuelType, typeof Fuel> = { diesel: Fuel, gas: Flame, hybrid: BatteryCharging, solar: Sun };

export function kvaLabel(p: Pick<Product, "kva_min" | "kva_max">, locale: Locale, unit: string) {
  if (p.kva_min == null || p.kva_max == null) return null;
  return `${formatNumber(p.kva_min, locale)}–${formatNumber(p.kva_max, locale)} ${unit}`;
}
