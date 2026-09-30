"use client";

import { useSyncExternalStore } from "react";
import type { Category } from "./types";

/** One line in the multi-item quotation request (RFQ). A snapshot of the product so the cart renders anywhere. */
export type QuoteItem = {
  slug: string;
  category: Category;
  name_en: string;
  name_ar: string;
  /** e.g. "10–200 kVA" / "63–400 A" — already localized per language */
  spec_en: string;
  spec_ar: string;
  image: string | null;
  qty: number;
};

const KEY = "4u-quote-cart";
const EVENT = "4u-quote-cart";
const EMPTY: QuoteItem[] = [];
let cache: QuoteItem[] | null = null;

function read(): QuoteItem[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as QuoteItem[]) : [];
    cache = Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.slug === "string" && i.qty > 0) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: QuoteItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage); // keep tabs in sync
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useQuoteCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    has: (slug: string) => items.some((i) => i.slug === slug),
    add: (item: Omit<QuoteItem, "qty">, qty = 1) => {
      const cur = read();
      const found = cur.find((i) => i.slug === item.slug);
      write(found ? cur.map((i) => (i.slug === item.slug ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) : [...cur, { ...item, qty }]);
    },
    setQty: (slug: string, qty: number) => write(read().flatMap((i) => (i.slug !== slug ? [i] : qty > 0 ? [{ ...i, qty: Math.min(99, qty) }] : []))),
    remove: (slug: string) => write(read().filter((i) => i.slug !== slug)),
    clear: () => write([]),
  };
}

/** Plain-text list used in the lead message and the WhatsApp hand-off. */
export function quoteSummary(items: QuoteItem[], locale: "en" | "ar") {
  return items.map((i) => `• ${i.qty} × ${locale === "ar" ? i.name_ar : i.name_en}${(locale === "ar" ? i.spec_ar : i.spec_en) ? ` (${locale === "ar" ? i.spec_ar : i.spec_en})` : ""}`).join("\n");
}
