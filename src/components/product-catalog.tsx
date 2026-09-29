"use client";

import * as Slider from "@radix-ui/react-slider";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { categoryLabels, engineBrandLabels, engineBrands, fuelLabels } from "@/content/taxonomy";
import { CATEGORIES, FUEL_TYPES, type Category, type FuelType, type Product } from "@/lib/types";
import { cn, type Locale } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { WhatsAppButton } from "./cta-buttons";

const KVA_MIN = 10;
const KVA_MAX = 2500;

export function ProductCatalog({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const params = useSearchParams();

  const [category, setCategory] = useState<Category | "all">("all");
  const [fuel, setFuel] = useState<FuelType | "all">("all");
  const [engine, setEngine] = useState<string>("all");
  const [kva, setKva] = useState<[number, number]>([KVA_MIN, KVA_MAX]);

  // Deep links from pillar pages, e.g. /products?category=ats_panel
  useEffect(() => {
    const c = params.get("category");
    if (c && (CATEGORIES as readonly string[]).includes(c)) setCategory(c as Category);
    const f = params.get("fuel");
    if (f && (FUEL_TYPES as readonly string[]).includes(f)) setFuel(f as FuelType);
    const e = params.get("engine");
    if (e) setEngine(e);
  }, [params]);

  const kvaFiltered = kva[0] !== KVA_MIN || kva[1] !== KVA_MAX;
  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (category !== "all" && p.category !== category) return false;
        if (fuel !== "all" && p.fuel_type !== fuel) return false;
        if (engine !== "all" && p.engine_brand !== engine) return false;
        if (kvaFiltered) {
          if (p.kva_min == null || p.kva_max == null) return false;
          if (p.kva_max < kva[0] || p.kva_min > kva[1]) return false;
        }
        return true;
      }),
    [products, category, fuel, engine, kva, kvaFiltered],
  );

  const reset = () => {
    setCategory("all");
    setFuel("all");
    setEngine("all");
    setKva([KVA_MIN, KVA_MAX]);
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-2 text-sm font-semibold transition",
      active ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-slate-700 hover:border-slate-400",
    );
  const select = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="lg:col-span-3" aria-labelledby="filters-title">
        <div className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 id="filters-title" className="flex items-center gap-2 text-base font-extrabold">
              <SlidersHorizontal className="size-4 text-amber-600" aria-hidden />
              {t("filters")}
            </h2>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline">
              <RotateCcw className="size-3.5" aria-hidden />
              {t("reset")}
            </button>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-bold text-ink">{tc("category")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={chip(category === "all")}>
                {t("allCategories")}
              </button>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>
                  {categoryLabels[c][locale]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <p id="kva-label" className="text-sm font-bold text-ink">{t("kvaRange")}</p>
            <Slider.Root
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="relative mt-4 flex h-6 touch-none select-none items-center"
              value={kva}
              min={KVA_MIN}
              max={KVA_MAX}
              step={10}
              minStepsBetweenThumbs={1}
              onValueChange={(v) => setKva([v[0] ?? KVA_MIN, v[1] ?? KVA_MAX])}
              aria-labelledby="kva-label"
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-slate-200">
                <Slider.Range className="absolute h-full rounded-full bg-amber-500" />
              </Slider.Track>
              {[0, 1].map((i) => (
                <Slider.Thumb
                  key={i}
                  aria-label={i === 0 ? "min kVA" : "max kVA"}
                  className="block size-5 rounded-full border-4 border-white bg-amber-500 shadow ring-1 ring-amber-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                />
              ))}
            </Slider.Root>
            <p className="mt-2 text-sm font-bold tabular-nums text-ink" dir="ltr">
              {kva[0]} – {kva[1]} kVA
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-bold text-ink">
              {t("fuelType")}
              <select value={fuel} onChange={(e) => setFuel(e.target.value as FuelType | "all")} className={select}>
                <option value="all">{t("any")}</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{fuelLabels[f][locale]}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-ink">
              {t("engineBrand")}
              <select value={engine} onChange={(e) => setEngine(e.target.value)} className={select}>
                <option value="all">{t("any")}</option>
                {engineBrands.map((b) => (
                  <option key={b} value={b}>{engineBrandLabels[b]?.[locale] ?? b}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-9">
        <p className="text-sm font-semibold text-muted" aria-live="polite">
          {t("results", { count: filtered.length })}
        </p>
        {filtered.length ? (
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-muted">{t("noResults")}</p>
            <WhatsAppButton location="catalog_empty" className="mt-5" />
          </div>
        )}
      </div>
    </div>
  );
}
