"use client";

import * as Slider from "@radix-ui/react-slider";
import { ArrowLeft, ArrowRight, Building2, Factory, HardHat, Home, Info, Minus, Plus, PartyPopper, RotateCcw, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { logCalculation } from "@/app/actions/calculator";
import { Link } from "@/i18n/navigation";
import { engineBrandLabels } from "@/content/taxonomy";
import { trackEvent } from "@/lib/analytics";
import { calculate, matchAts, matchProducts, PRESETS, type CalcInput, type LoadItem, type LoadType } from "@/lib/calculator";
import { whatsappUrl } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn, formatNumber, type Locale } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";
import { LeadForm } from "../lead-form";
import { Button, buttonVariants } from "../ui/button";

const LOAD_ICONS: Record<LoadType, typeof Home> = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
  construction: HardHat,
  event: PartyPopper,
};

type Mode = "known_load" | "site_builder";
type Unit = "kw" | "amps";

function Help({ id, label, children }: { id: string; label: string; children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-amber-700 hover:underline"
      >
        <Info className="size-4" aria-hidden />
        {label}
      </button>
      <p id={id} hidden={!open} className="mt-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-slate-800">
        {children}
      </p>
    </div>
  );
}

function RangeInput({
  value,
  onChange,
  min,
  max,
  step,
  label,
  suffix = "",
  dir,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  suffix?: string;
  dir: "ltr" | "rtl";
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-bold text-ink">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            dir="ltr"
            className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-center text-lg font-extrabold tabular-nums focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          {suffix && <span className="text-lg font-bold text-muted">{suffix}</span>}
        </div>
      </div>
      <Slider.Root
        dir={dir}
        className="relative mt-5 flex h-6 touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => v !== undefined && onChange(v)}
        aria-label={label}
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-slate-200">
          <Slider.Range className="absolute h-full rounded-full bg-amber-500" />
        </Slider.Track>
        <Slider.Thumb className="block size-6 rounded-full border-4 border-white bg-amber-500 shadow-md ring-1 ring-amber-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900" />
      </Slider.Root>
      <div className="mt-1 flex justify-between text-xs text-muted" dir="ltr">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

export function Calculator({ products, variant = "full" }: { products: Product[]; variant?: "full" | "widget" }) {
  const t = useTranslations("calc");
  const tc = useTranslations("cta");
  const tn = useTranslations("common");
  const locale = useLocale() as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const uid = useId();
  const widget = variant === "widget";

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<Mode>("known_load");
  const [unit, setUnit] = useState<Unit>("kw");
  const [kw, setKw] = useState(80);
  const [amps, setAmps] = useState(150);
  const [voltage, setVoltage] = useState(400);
  const [phases, setPhases] = useState<1 | 3>(3);
  const [loadType, setLoadType] = useState<LoadType>("commercial");
  const [items, setItems] = useState<LoadItem[]>(PRESETS.commercial);
  const [pf, setPf] = useState(0.8);
  const [margin, setMargin] = useState(25);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const lastLogged = useRef<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const input: CalcInput = useMemo(() => {
    if (mode === "site_builder") return { mode, loadType, items, powerFactor: pf, margin };
    if (unit === "kw") return { mode, unit, kw, powerFactor: pf, margin };
    return { mode, unit, amps, voltage, phases, powerFactor: pf, margin };
  }, [mode, unit, kw, amps, voltage, phases, loadType, items, pf, margin]);

  const result = useMemo(() => calculate(input), [input]);
  const matches = useMemo(() => matchProducts(products, result.recommendedKva), [products, result.recommendedKva]);
  const ats = useMemo(() => matchAts(products, result.recommendedKva), [products, result.recommendedKva]);
  const valid = result.runningKw > 0;
  const showResult = widget ? valid : step === 4;

  // Log each distinct completed calculation once (intent data), and fire the analytics event.
  useEffect(() => {
    if (!showResult || !valid) return;
    const key = JSON.stringify(input);
    if (key === lastLogged.current) return;
    const timer = setTimeout(async () => {
      lastLogged.current = key;
      trackEvent("calculator_complete", { kva: result.recommendedKva, mode, variant });
      const res = await logCalculation({
        mode,
        load_type: mode === "site_builder" ? loadType : null,
        input_kw: mode === "known_load" && unit === "kw" ? kw : result.runningKw,
        input_amps: mode === "known_load" && unit === "amps" ? amps : null,
        voltage: mode === "known_load" && unit === "amps" ? voltage : null,
        phases: mode === "known_load" && unit === "amps" ? phases : null,
        power_factor: pf,
        safety_margin: margin,
        running_kva: result.runningKva,
        recommended_kva: result.recommendedKva,
        recommended_ats_amps: result.atsRating,
        matched_product_slug: matches[0]?.slug ?? null,
        locale,
        source_page: window.location.pathname,
      });
      setSubmissionId(res.id);
    }, widget ? 2000 : 0);
    return () => clearTimeout(timer);
  }, [showResult, valid, input, result, matches, mode, loadType, unit, kw, amps, voltage, phases, pf, margin, locale, variant, widget]);

  useEffect(() => {
    if (step === 4 && !widget) resultRef.current?.focus();
  }, [step, widget]);

  const n = (v: number) => formatNumber(v, locale);
  const productName = (p: Product) => (locale === "ar" ? p.name_ar : p.name_en);

  const waMessage = tc("whatsappCalc", {
    kva: result.recommendedKva,
    kw: result.runningKw,
    pf: pf.toFixed(2),
    ats: result.overRange ? "" : tc("whatsappCalcAts", { amps: result.atsRating }),
  });

  const setType = (lt: LoadType) => {
    setLoadType(lt);
    setItems(PRESETS[lt].map((i) => ({ ...i })));
  };
  const setQty = (id: string, qty: number) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(99, qty)) } : i)));

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];
  const field =
    "mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-bold tabular-nums focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const seg = (active: boolean) =>
    cn(
      "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition",
      active ? "bg-navy-900 text-white shadow" : "text-slate-700 hover:bg-white",
    );

  /* ------------------------------------------------------------ Step 1: load */
  const loadStep = (
    <fieldset>
      <legend className="sr-only">{t("step1")}</legend>
      {!widget && (
        <div role="radiogroup" aria-label={t("step1")} className="flex gap-1 rounded-full bg-slate-100 p-1">
          <button type="button" role="radio" aria-checked={mode === "known_load"} onClick={() => setMode("known_load")} className={seg(mode === "known_load")}>
            {t("modeKnown")}
          </button>
          <button type="button" role="radio" aria-checked={mode === "site_builder"} onClick={() => setMode("site_builder")} className={seg(mode === "site_builder")}>
            {t("modeBuilder")}
          </button>
        </div>
      )}

      {mode === "known_load" ? (
        <div className="mt-6 grid gap-5">
          <div role="radiogroup" aria-label={t("unit")} className="flex w-fit gap-1 rounded-full bg-slate-100 p-1">
            <button type="button" role="radio" aria-checked={unit === "kw"} onClick={() => setUnit("kw")} className={seg(unit === "kw")}>
              kW
            </button>
            <button type="button" role="radio" aria-checked={unit === "amps"} onClick={() => setUnit("amps")} className={seg(unit === "amps")}>
              A
            </button>
          </div>
          {unit === "kw" ? (
            <div>
              <label htmlFor={`${uid}-kw`} className="text-sm font-bold text-ink">
                {t("loadKw")}
              </label>
              <input
                id={`${uid}-kw`}
                type="number"
                inputMode="decimal"
                min={0}
                max={20000}
                value={kw}
                dir="ltr"
                onChange={(e) => setKw(Math.max(0, Number(e.target.value) || 0))}
                className={field}
                aria-invalid={!valid}
                aria-describedby={!valid ? `${uid}-invalid` : undefined}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={`${uid}-amps`} className="text-sm font-bold text-ink">{t("loadAmps")}</label>
                <input id={`${uid}-amps`} type="number" inputMode="decimal" min={0} max={20000} value={amps} dir="ltr" onChange={(e) => setAmps(Math.max(0, Number(e.target.value) || 0))} className={field} aria-invalid={!valid} />
              </div>
              <div>
                <label htmlFor={`${uid}-v`} className="text-sm font-bold text-ink">{t("voltage")}</label>
                <select id={`${uid}-v`} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className={field}>
                  {[230, 380, 400, 415, 440, 480].map((v) => (
                    <option key={v} value={v}>{v} V</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${uid}-ph`} className="text-sm font-bold text-ink">{t("phases")}</label>
                <select id={`${uid}-ph`} value={phases} onChange={(e) => setPhases(Number(e.target.value) as 1 | 3)} className={field}>
                  <option value={3}>{t("three")}</option>
                  <option value={1}>{t("single")}</option>
                </select>
              </div>
            </div>
          )}
          {!valid && (
            <p id={`${uid}-invalid`} role="alert" className="text-sm font-semibold text-red-700">
              {t("invalid")}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm font-bold text-ink" id={`${uid}-site`}>{t("siteType")}</p>
          <div role="radiogroup" aria-labelledby={`${uid}-site`} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(Object.keys(PRESETS) as LoadType[]).map((lt) => {
              const Icon = LOAD_ICONS[lt];
              const active = loadType === lt;
              return (
                <button
                  key={lt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setType(lt)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-sm font-bold transition",
                    active ? "border-amber-500 bg-amber-50 text-ink ring-2 ring-amber-500/30" : "border-line bg-white text-slate-700 hover:border-slate-400",
                  )}
                >
                  <Icon className={cn("size-6", active ? "text-amber-600" : "text-slate-500")} aria-hidden />
                  {t(lt)}
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm font-bold text-ink">{t("loadsFor")}</p>
          <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-semibold text-ink">{it.label[locale]}</p>
                  <p className="text-xs text-muted">{t("kwEach", { kw: it.kw })}</p>
                </div>
                <div className="flex items-center gap-1" role="group" aria-label={`${t("quantity")}: ${it.label[locale]}`}>
                  <button type="button" onClick={() => setQty(it.id, it.qty - 1)} className="grid size-9 place-items-center rounded-full border border-line hover:bg-slate-50" aria-label={`− ${it.label[locale]}`}>
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={it.qty}
                    dir="ltr"
                    onChange={(e) => setQty(it.id, Number(e.target.value) || 0)}
                    aria-label={`${t("quantity")}: ${it.label[locale]}`}
                    className="w-12 rounded-lg border border-line py-1.5 text-center font-bold tabular-nums"
                  />
                  <button type="button" onClick={() => setQty(it.id, it.qty + 1)} className="grid size-9 place-items-center rounded-full border border-line hover:bg-slate-50" aria-label={`+ ${it.label[locale]}`}>
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            {t("runningLoad")}: <strong className="text-ink" dir="ltr">{n(result.runningKw)} kW</strong>
          </p>
        </div>
      )}
    </fieldset>
  );

  const pfStep = (
    <div>
      <RangeInput value={pf} onChange={(v) => setPf(Math.round(v * 100) / 100)} min={0.6} max={1} step={0.01} label={t("pfLabel")} dir={dir} />
      <Help id={`${uid}-pf-help`} label={t("pfLabel")}>{t("pfHelp")}</Help>
    </div>
  );

  const marginStep = (
    <div>
      <RangeInput value={margin} onChange={setMargin} min={10} max={35} step={1} label={t("marginLabel")} suffix="%" dir={dir} />
      <Help id={`${uid}-m-help`} label={t("marginLabel")}>{t("marginHelp")}</Help>
    </div>
  );

  /* ------------------------------------------------------------ Result */
  const resultView = (
    <div ref={resultRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
      <div className="on-dark relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative grid gap-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="eyebrow">{t("recommended")}</p>
            <p className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
              <span dir="ltr">{n(result.recommendedKva)}</span> <span className="text-2xl text-amber-400">{tn("kva")}</span>
            </p>
            {!result.overRange && (
              <p className="mt-2 text-white/80">
                {t("atsRecommended")}: <strong className="text-white" dir="ltr">{n(result.atsRating)} A</strong>
                {ats && (
                  <>
                    {" · "}
                    <Link href={`/products/${ats.slug}`} className="text-amber-400 underline underline-offset-4">
                      {productName(ats)}
                    </Link>
                  </>
                )}
              </p>
            )}
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center text-sm">
            {[
              [t("runningLoad"), `${n(result.runningKw)} kW`],
              [t("runningKva"), `${n(result.runningKva)} kVA`],
              [t("withMargin", { margin }), `${n(result.requiredKva)} kVA`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <dt className="text-xs text-white/70">{k}</dt>
                <dd className="mt-1 font-bold" dir="ltr">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {result.overRange ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-slate-800">{t("overRange")}</p>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-extrabold text-ink">{t("matches")}</h3>
          {matches.length ? (
            <ul className={cn("mt-3 grid gap-3", !widget && "sm:grid-cols-3")}>
              {matches.map((p) => (
                <li key={p.slug} className="rounded-2xl border border-line p-4">
                  <Link href={`/products/${p.slug}`} className="font-bold text-ink hover:text-amber-700">
                    {productName(p)}
                  </Link>
                  {p.engine_brand && <p className="mt-1 text-sm text-muted">{engineBrandLabels[p.engine_brand]?.[locale] ?? p.engine_brand}</p>}
                  <a
                    href={whatsappUrl(`${waMessage}\n→ ${productName(p)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent("calculator_quote_click", { kva: result.recommendedKva, product: p.slug, channel: "whatsapp" });
                      trackEvent("whatsapp_click", { location: "calculator_match", product: p.slug });
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f7a41] hover:underline"
                  >
                    <WhatsAppIcon className="size-4" />
                    {t("quoteThis")}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">{t("noMatch")}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("calculator_quote_click", { kva: result.recommendedKva, channel: "whatsapp" });
            trackEvent("whatsapp_click", { location: "calculator_result" });
          }}
          className={buttonVariants({ variant: "whatsapp", size: "lg" })}
        >
          <WhatsAppIcon />
          {t("whatsappThis")}
        </a>
        {widget ? (
          <Link href="/calculator" className={buttonVariants({ variant: "outline", size: "lg" })}>
            {t("fullCalc")}
          </Link>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="lg"
            aria-expanded={showForm}
            onClick={() => {
              setShowForm(true);
              trackEvent("calculator_quote_click", { kva: result.recommendedKva, channel: "form" });
            }}
          >
            {t("quoteThis")}
          </Button>
        )}
      </div>
      {showForm && !widget && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <LeadForm
            source="calculator"
            calculatedKva={result.recommendedKva}
            calcSubmissionId={submissionId}
            productSlug={matches[0]?.slug}
            defaultMessage={waMessage}
          />
        </div>
      )}
      <p className="mt-4 text-xs text-muted">{t("disclaimer")}</p>
    </div>
  );

  /* ------------------------------------------------------------ Layout */
  if (widget) {
    return (
      <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_30px_60px_-30px_rgb(10_20_38/0.35)] sm:p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <Zap className="size-5 text-amber-600" aria-hidden />
          {t("title")}
        </div>
        <div className="mt-5">{loadStep}</div>
        <div className="mt-6">{showResult ? resultView : null}</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_30px_60px_-30px_rgb(10_20_38/0.35)] sm:p-8">
      <ol className="grid grid-cols-4 gap-2" aria-label={t("title")}>
        {steps.map((s, i) => {
          const idx = i + 1;
          const done = step > idx;
          const current = step === idx;
          return (
            <li key={s}>
              <button
                type="button"
                disabled={idx > step && !valid}
                onClick={() => (valid || idx === 1) && setStep(idx)}
                aria-current={current ? "step" : undefined}
                className="group w-full text-start disabled:cursor-not-allowed"
              >
                <span className={cn("block h-1.5 rounded-full transition", current || done ? "bg-amber-500" : "bg-slate-200")} />
                <span className={cn("mt-2 hidden text-xs font-bold sm:block", current ? "text-ink" : "text-muted")}>
                  {idx}. {s}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm font-semibold text-muted sm:hidden">
        {t("step", { n: step })} — {steps[step - 1]}
      </p>

      <div className="mt-8 min-h-64">
        {step === 1 && loadStep}
        {step === 2 && pfStep}
        {step === 3 && marginStep}
        {step === 4 && resultView}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="flip-rtl" aria-hidden />
            {t("back")}
          </Button>
        ) : (
          <span />
        )}
        {step < 3 && (
          <Button type="button" variant="dark" disabled={!valid} onClick={() => setStep((s) => s + 1)}>
            {t("next")}
            <ArrowRight className="flip-rtl" aria-hidden />
          </Button>
        )}
        {step === 3 && (
          <Button type="button" variant="primary" disabled={!valid} onClick={() => setStep(4)}>
            <Zap aria-hidden />
            {t("calculate")}
          </Button>
        )}
        {step === 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep(1);
              setShowForm(false);
            }}
          >
            <RotateCcw aria-hidden />
            {t("restart")}
          </Button>
        )}
      </div>
    </div>
  );
}
