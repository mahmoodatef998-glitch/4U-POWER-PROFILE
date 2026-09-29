import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Locale = "en" | "ar";
export type L10n<T = string> = { en: T; ar: T };

export const pick = <T,>(value: L10n<T>, locale: Locale): T => value[locale];

export function formatNumber(n: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-AE").format(n);
}

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { dateStyle: "long" }).format(new Date(iso));
}
