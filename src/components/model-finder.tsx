"use client";

import { Check, FileText, Plus, Scale, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import type { GensetBrand } from "@/lib/genset-models";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppButton } from "./cta-buttons";

/** What the finder needs of each model (kept small: it ships to the browser). */
export type FinderModel = {
  slug: string;
  code: string;
  brand: GensetBrand;
  engine: string;
  primeKva: number;
  primeKw: number;
  standbyKva: number;
  standbyKw: number;
  fuel75: number | null;
  fuel100: number | null;
  canopy: { l?: number; w?: number; h?: number; kg: number | null; tankL?: number | null } | null;
  noiseDb: number | null;
  controller: string | null;
};

const QUICK = [20, 50, 100, 250, 500, 1000, 2000];
const MAX_COMPARE = 3;
const SHOW = 12;

/**
 * "I need X kVA": the models whose prime (or standby) rating covers X, smallest first, with up to three
 * picked side by side. Everything shown comes from the model data files (the same numbers as the datasheets).
 */
export function ModelFinder({ models, brands, locale }: { models: FinderModel[]; brands: { id: GensetBrand; label: string }[]; locale: Locale }) {
  const ar = locale === "ar";
  const nf = useMemo(() => new Intl.NumberFormat(ar ? "ar-AE" : "en-AE", { maximumFractionDigits: 1 }), [ar]);
  const n = (v: number | null | undefined) => (v == null ? "—" : nf.format(v));
  const KVA = ar ? "ك.ف.أ" : "kVA";
  const KW = ar ? "ك.و" : "kW";
  const LPH = ar ? "لتر/س" : "L/h";
  const [kva, setKva] = useState<number | null>(null);
  const [basis, setBasis] = useState<"prime" | "standby">("prime");
  const [picked, setPicked] = useState<Set<GensetBrand>>(new Set());
  const [compare, setCompare] = useState<string[]>([]);

  // links from size pages and brand hubs open the finder pre-filled: /models?kva=300 or ?brand=Perkins
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const k = Number(q.get("kva"));
    if (k > 0 && k <= 5000) setKva(k);
    const b = q.get("brand");
    const hit = brands.find((x) => x.id.toLowerCase() === (b ?? "").toLowerCase());
    if (hit) setPicked(new Set([hit.id]));
    if (k > 0 || hit) document.getElementById("finder-title")?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    if (!kva) return [];
    const rating = (m: FinderModel) => (basis === "prime" ? m.primeKva : m.standbyKva);
    return models
      .filter((m) => (picked.size === 0 || picked.has(m.brand)) && rating(m) >= kva)
      .sort((a, b) => rating(a) - rating(b) || a.code.localeCompare(b.code))
      .slice(0, SHOW);
  }, [models, kva, basis, picked]);

  const chosen = compare.map((slug) => models.find((m) => m.slug === slug)).filter((m): m is FinderModel => !!m);

  function toggleBrand(b: GensetBrand) {
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  }

  function toggleCompare(slug: string) {
    setCompare((c) => {
      if (c.includes(slug)) return c.filter((x) => x !== slug);
      if (c.length >= MAX_COMPARE) return c;
      const next = [...c, slug];
      if (next.length >= 2) trackEvent("model_compare", { models: next.join(",") });
      return next;
    });
  }

  const dims = (m: FinderModel) => (m.canopy?.l && m.canopy.w && m.canopy.h ? `${n(m.canopy.l)} × ${n(m.canopy.w)} × ${n(m.canopy.h)}` : "—");
  const rows: { label: string; value: (m: FinderModel) => string; ltr?: boolean }[] = [
    { label: ar ? "أساسي (Prime)" : "Prime", value: (m) => `${n(m.primeKva)} ${KVA} · ${n(m.primeKw)} ${KW}` },
    { label: ar ? "احتياطي (Standby)" : "Standby", value: (m) => `${n(m.standbyKva)} ${KVA} · ${n(m.standbyKw)} ${KW}` },
    { label: ar ? "المحرك" : "Engine", value: (m) => `${m.brand} ${m.engine}`, ltr: true },
    { label: ar ? "الوقود عند 75% (لتر/س)" : "Fuel at 75% (L/h)", value: (m) => n(m.fuel75) },
    { label: ar ? "الوقود عند 100% (لتر/س)" : "Fuel at 100% (L/h)", value: (m) => n(m.fuel100) },
    { label: ar ? "الكانوبي ط × ع × ار (مم)" : "Canopy L × W × H (mm)", value: dims },
    { label: ar ? "وزن الكانوبي (كجم)" : "Canopy weight (kg)", value: (m) => n(m.canopy?.kg) },
    { label: ar ? "الخزان القاعدي (لتر)" : "Base tank (L)", value: (m) => n(m.canopy?.tankL) },
    { label: ar ? "الصوت (ديسيبل @ 7 م)" : "Noise (dB(A) @ 7 m)", value: (m) => n(m.noiseDb) },
    { label: ar ? "وحدة التحكم" : "Controller", value: (m) => m.controller ?? "—", ltr: true },
  ];

  const chip = "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <section className="section bg-surface" aria-labelledby="finder-title">
      <div className="container-x">
        <h2 id="finder-title" className="text-2xl sm:text-3xl">
          {ar ? "ابحث عن الموديل بالقدرة وقارن" : "Find a model by kVA and compare"}
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          {ar
            ? "اكتب القدرة التي تحتاجها، واختر ماركة أو أكثر، ثم أضف حتى 3 موديلات للمقارنة جنباً إلى جنب."
            : "Type the kVA you need, narrow it to one or more engine brands, then add up to three models to compare side by side."}
        </p>

        <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-navy-900 p-4 sm:p-5 lg:grid-cols-[auto_auto_1fr] lg:items-end">
          <label className="grid gap-1.5 text-sm font-bold" htmlFor="finder-kva">
            {ar ? "القدرة المطلوبة (ك.ف.أ)" : "Load you need (kVA)"}
            <input
              id="finder-kva"
              type="number"
              inputMode="decimal"
              min={1}
              max={5000}
              placeholder={ar ? "مثال: 150" : "e.g. 150"}
              value={kva ?? ""}
              onChange={(e) => setKva(e.target.valueAsNumber > 0 ? e.target.valueAsNumber : null)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base font-normal text-ink lg:w-40"
            />
          </label>
          <fieldset className="grid gap-1.5">
            <legend className="mb-1.5 text-sm font-bold">{ar ? "على أساس" : "Covered at"}</legend>
            <div className="inline-flex rounded-lg border border-line p-1">
              {(["prime", "standby"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={basis === b}
                  onClick={() => setBasis(b)}
                  className={cn("rounded-md px-3 py-1.5 text-sm font-bold", basis === b ? "bg-brand-500 text-ink-950" : "text-muted hover:text-ink")}
                >
                  {b === "prime" ? (ar ? "أساسي (تشغيل يومي)" : "Prime (daily use)") : ar ? "احتياطي (طوارئ)" : "Standby (backup)"}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">{ar ? "ماركة المحرك" : "Engine brand"}</legend>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={picked.has(b.id)}
                  onClick={() => toggleBrand(b.id)}
                  className={cn(chip, picked.has(b.id) ? "border-brand-500 bg-brand-500/15 text-ink" : "border-line text-muted hover:text-ink")}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {!kva ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-muted">{ar ? "مقاسات شائعة:" : "Common sizes:"}</span>
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => setKva(q)} className={cn(chip, "border-line text-ink hover:border-brand-500")}>
                {n(q)} {KVA}
              </button>
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="mt-5 text-muted">
            {ar ? "لا يوجد موديل بهذه القدرة لهذه الماركات. جرّب ماركة أخرى، أو أكثر من مولد على التوازي — اسألنا على واتساب." : "No single model covers that with these brands. Try another brand, or several sets in parallel — ask us on WhatsApp."}
          </p>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {results.map((m) => {
              const on = compare.includes(m.slug);
              const full = !on && compare.length >= MAX_COMPARE;
              return (
                <li key={m.slug} className={cn("flex flex-col rounded-2xl border bg-navy-900 p-4", on ? "border-brand-500" : "border-line")}>
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/models/${m.slug}`} className="text-lg font-extrabold text-ink hover:text-brand-700 hover:underline" dir="ltr">
                      {m.code}
                    </Link>
                    <span className="text-sm text-muted" dir="ltr">{m.brand}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted" dir="ltr">{m.engine}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm tabular-nums">
                    <dt className="text-muted">{ar ? "أساسي" : "Prime"}</dt>
                    <dd className="font-semibold text-ink">{n(m.primeKva)} {KVA}</dd>
                    <dt className="text-muted">{ar ? "احتياطي" : "Standby"}</dt>
                    <dd className="font-semibold text-ink">{n(m.standbyKva)} {KVA}</dd>
                    <dt className="text-muted">{ar ? "وقود 75%" : "Fuel 75%"}</dt>
                    <dd className="text-ink">{m.fuel75 == null ? "—" : `${n(m.fuel75)} ${LPH}`}</dd>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(m.slug)}
                      disabled={full}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-bold",
                        on ? "border-brand-500 bg-brand-500 text-ink-950" : "border-line text-ink hover:border-brand-500",
                        full && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {on ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                      {on ? (ar ? "في المقارنة" : "Comparing") : ar ? "قارن" : "Compare"}
                    </button>
                    <Link href={`/models/${m.slug}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-700 hover:underline">
                      <FileText className="size-4" aria-hidden />
                      {ar ? "الداتا شيت" : "Datasheet"}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {chosen.length > 0 && (
          <div className="mt-8 scroll-mt-28">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-xl font-extrabold">
                <Scale className="size-5 text-brand-500" aria-hidden />
                {ar ? `مقارنة ${n(chosen.length)} من ${n(MAX_COMPARE)}` : `Comparing ${chosen.length} of ${MAX_COMPARE}`}
              </h3>
              <button type="button" onClick={() => setCompare([])} className="text-sm font-semibold text-muted underline hover:text-ink">
                {ar ? "مسح المقارنة" : "Clear comparison"}
              </button>
            </div>
            {chosen.length < 2 && <p className="mt-2 text-sm text-muted">{ar ? "أضف موديلاً آخر على الأقل لترى الفرق." : "Add at least one more model to see the difference."}</p>}
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-navy-900">
              <table className="w-full min-w-[32rem] text-start text-sm">
                <caption className="sr-only">{ar ? "مقارنة الموديلات" : "Model comparison"}</caption>
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start text-xs uppercase tracking-wide text-muted">{ar ? "البند" : "Item"}</th>
                    {chosen.map((m) => (
                      <th key={m.slug} scope="col" className="px-4 py-3 text-start">
                        <span className="flex items-center justify-between gap-2">
                          <Link href={`/models/${m.slug}`} className="font-extrabold text-ink hover:underline" dir="ltr">{m.code}</Link>
                          <button type="button" onClick={() => toggleCompare(m.slug)} aria-label={ar ? `إزالة ${m.code}` : `Remove ${m.code}`} className="rounded p-1 text-muted hover:text-ink">
                            <X className="size-4" aria-hidden />
                          </button>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row" className="px-4 py-2.5 text-start font-semibold text-muted">{r.label}</th>
                      {chosen.map((m) => (
                        <td key={m.slug} className="px-4 py-2.5 tabular-nums text-ink" dir={r.ltr ? "ltr" : undefined}>
                          {r.value(m)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <WhatsAppButton
                location="model_compare"
                size="lg"
                label={ar ? "اطلب سعر هذه الموديلات" : "Get a price for these models"}
                message={ar ? `مرحباً، أريد عرض سعر للموديلات: ${chosen.map((m) => m.code).join("، ")}` : `Hello, please quote these models: ${chosen.map((m) => m.code).join(", ")}`}
              />
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
