"use client";

import { Camera, Check, Copy, FileText, Minus, Pause, Play, Plus, Ruler, Tag as TagIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import {
  allowedEnclosures,
  atsRating,
  autonomyHours,
  baseTankL,
  COLOURS,
  defaultConfig,
  dimsMm,
  ENCLOSURES,
  fromQuery,
  MAX_UNITS,
  normalise,
  SILENCERS,
  TANK_SIZES,
  toQuery,
  trailerAllowed,
  weightKg,
  type Colour,
  type Config,
  type ConfigModel,
  type Enclosure,
  type Silencer,
} from "@/lib/configurator";
import { currentModelSlug } from "@/lib/model-renames";
import type { ModelSpec } from "@/app/api/model-spec/route";
import { whatsappUrl } from "@/lib/site";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";
import { LeadForm } from "../lead-form";
import { Button, buttonVariants } from "../ui/button";

const GeneratorScene = dynamic(() => import("./generator-scene").then((m) => m.GeneratorScene), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm font-semibold text-[#5b6170]">Loading 3D…</div>,
});

const BRAND_AR: Record<string, string> = { Perkins: "بيركنز", Cummins: "كمنز", Kubota: "كوبوتا", Baudouin: "بودوان" };

const COPY = {
  en: {
    model: "Generator model",
    enclosure: "Enclosure",
    addons: "Add-ons",
    ats: "ATS panel",
    sync: "Synchronising panel",
    remote: "Remote monitoring (4G / web)",
    trailer: "Road trailer",
    trailerOff: "Trailer: single sets up to 500 kVA, open or canopy",
    units: "Sets in parallel",
    silencer: "Exhaust silencer grade",
    attenuation: "typical attenuation",
    tank: "External fuel tank",
    none: "None",
    colour: "Canopy colour",
    colourOff: "Open sets come in the standard frame and engine finish.",
    anyRal: "Any RAL colour on request.",
    summary: "Your configuration",
    rating: "Standby / prime",
    engine: "Engine",
    alternator: "Alternator",
    controller: "Controller",
    dims: "Dimensions (L × W × H)",
    weight: "Weight",
    fuel: "Fuel",
    baseTank: "base tank",
    external: "external",
    autonomy: (h: number) => `≈ ${h} h at 75 % load`,
    onRequest: "On request",
    perDatasheet: "per datasheet",
    isoContainer: "ISO high-cube container",
    whatsapp: "Send configuration on WhatsApp",
    quote: "Request a quote",
    datasheet: "Model & datasheet",
    copy: "Copy link",
    copied: "Link copied",
    snapshot: "Save image",
    rotate: "Auto-rotate",
    labels: "Labels",
    measure: "Dimensions",
    dimLabels: { l: "L", w: "W", h: "H" },
    tech: "Technical data",
    techIntro: "From the model's datasheet. Final details are confirmed on the GA drawing with the order.",
    tabs: { dims: "Dimensions & weight", ratings: "Ratings & fuel", engine: "Engine", alt: "Alternator", ctrl: "Controller & canopy" },
    build: "Build",
    lwh: "L × W × H (mm)",
    tankCol: "Base tank",
    noise: "Noise @ 7 m",
    output: "Output · 400/230 V · 50 Hz · 0.8 pf",
    output60: "Output · 480/277 V · 60 Hz · 0.8 pf",
    kva: "kVA",
    kw: "kW",
    amps: "Current",
    prime: "Prime (PRP)",
    standby: "Standby (ESP)",
    at60: "At 60 Hz · 1800 rpm",
    fuelUse: "Fuel consumption",
    load: "Load",
    lph: "L/h",
    cooling: "Cooling",
    lube: "Lubrication & exhaust",
    air: "Air intake",
    operating: "Performance",
    features: "Controller features",
    canopy: "Enclosure",
    loading: "Loading the datasheet…",
    failed: "The technical data could not be loaded. Open the model page for the full datasheet.",
    fullDs: "Full datasheet (PDF)",
    hint: "Drag to rotate · scroll or pinch to zoom",
    noWebgl: "3D view isn't available on this device — here's the product photo.",
    sceneLabels: { ats: "ATS", sync: "Sync panel", tank: "Fuel tank", trailer: "Road trailer", remote: "Remote monitoring" },
    wa: "Hi, I configured this generator on 4ugenerators.com:",
    waAsk: "Please send price and delivery time.",
  },
  ar: {
    model: "موديل المولد",
    enclosure: "نوع الهيكل",
    addons: "الإضافات",
    ats: "لوحة ATS",
    sync: "لوحة تزامن",
    remote: "مراقبة عن بُعد (4G / ويب)",
    trailer: "مقطورة (Trailer)",
    trailerOff: "المقطورة: لمولد واحد حتى 500 ك.ف.أ، مفتوح أو بكابينة",
    units: "عدد المولدات على التوازي",
    silencer: "درجة كاتم الصوت (الشكمان)",
    attenuation: "تخفيض نموذجي",
    tank: "خزان وقود خارجي",
    none: "بدون",
    colour: "لون الكابينة",
    colourOff: "المولد المفتوح يأتي بالتشطيب القياسي للقاعدة والمحرك.",
    anyRal: "أي لون RAL متاح عند الطلب.",
    summary: "مواصفات اختيارك",
    rating: "احتياطي / أساسي",
    engine: "المحرك",
    alternator: "الدينامو",
    controller: "وحدة التحكم",
    dims: "المقاسات (طول × عرض × ارتفاع)",
    weight: "الوزن",
    fuel: "الوقود",
    baseTank: "خزان القاعدة",
    external: "خارجي",
    autonomy: (h: number) => `≈ ${h} ساعة عند حمل 75%`,
    onRequest: "عند الطلب",
    perDatasheet: "حسب الداتا شيت",
    isoContainer: "حاوية ISO عالية",
    whatsapp: "أرسل التكوين على واتساب",
    quote: "اطلب عرض سعر",
    datasheet: "الموديل والداتا شيت",
    copy: "انسخ الرابط",
    copied: "تم نسخ الرابط",
    snapshot: "حفظ صورة",
    rotate: "دوران تلقائي",
    labels: "التسميات",
    measure: "المقاسات",
    dimLabels: { l: "الطول", w: "العرض", h: "الارتفاع" },
    tech: "البيانات الفنية",
    techIntro: "من الداتا شيت الخاصة بالموديل، والتفاصيل النهائية تتأكد في رسم الترتيب العام (GA) مع الطلب.",
    tabs: { dims: "المقاسات والوزن", ratings: "القدرات والوقود", engine: "المحرك", alt: "الدينامو", ctrl: "التحكم والكابينة" },
    build: "النوع",
    lwh: "طول × عرض × ارتفاع (مم)",
    tankCol: "خزان القاعدة",
    noise: "الصوت على 7 م",
    output: "القدرة · 400/230 فولت · 50 هرتز · 0.8",
    output60: "القدرة · 480/277 فولت · 60 هرتز · 0.8",
    kva: "ك.ف.أ",
    kw: "ك.و",
    amps: "التيار",
    prime: "أساسي (PRP)",
    standby: "احتياطي (ESP)",
    at60: "على 60 هرتز · 1800 لفة",
    fuelUse: "استهلاك الوقود",
    load: "الحمل",
    lph: "لتر/ساعة",
    cooling: "التبريد",
    lube: "التزييت والعادم",
    air: "سحب الهواء",
    operating: "الأداء",
    features: "مميزات وحدة التحكم",
    canopy: "الكابينة",
    loading: "جاري تحميل الداتا شيت…",
    failed: "تعذر تحميل البيانات الفنية. افتح صفحة الموديل للداتا شيت الكاملة.",
    fullDs: "الداتا شيت الكاملة (PDF)",
    hint: "اسحب للتدوير · مرّر أو قرّب بإصبعين للتكبير",
    noWebgl: "العرض ثلاثي الأبعاد غير متاح على هذا الجهاز — هذه صورة المنتج.",
    sceneLabels: { ats: "ATS", sync: "لوحة تزامن", tank: "خزان وقود", trailer: "مقطورة", remote: "مراقبة عن بُعد" },
    wa: "مرحباً، صممت هذا المولد على موقع 4ugenerators.com:",
    waAsk: "أرجو إرسال السعر ومدة التوريد.",
  },
};

function Toggle({ on, onChange, label, detail, disabled, title }: { on: boolean; onChange: (v: boolean) => void; label: string; detail?: string; disabled?: boolean; title?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      title={title}
      onClick={() => onChange(!on)}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition disabled:cursor-not-allowed disabled:opacity-45",
        on ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/25" : "border-line hover:border-zinc-400",
      )}
    >
      <span>
        <span className="block text-sm font-bold text-ink">{label}</span>
        {detail && <span className="block text-xs text-muted">{detail}</span>}
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", on ? "bg-brand-500" : "bg-zinc-300")} aria-hidden>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", on ? "start-[1.375rem]" : "start-0.5")} />
      </span>
    </button>
  );
}

function hasWebgl() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Configurator({ models }: { models: ConfigModel[] }) {
  const locale = useLocale() as Locale;
  const c = COPY[locale];
  const ar = locale === "ar";
  const bySlug = useMemo(() => new Map(models.map((m) => [m.slug, m])), [models]);
  const fallback = models.find((m) => m.slug === "4u-p225") ?? models[0]!;
  const [config, setConfig] = useState<Config>(() => defaultConfig(fallback));
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [spec, setSpec] = useState<ModelSpec | null>(null);
  const [specState, setSpecState] = useState<"loading" | "ok" | "error">("loading");
  const [tab, setTab] = useState<"dims" | "ratings" | "engine" | "alt" | "ctrl">("dims");
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const model = bySlug.get(config.model) ?? fallback;

  // initial state from a shared link (?model=…&enc=…)
  useEffect(() => {
    setWebgl(hasWebgl());
    const q = new URLSearchParams(window.location.search);
    const m = bySlug.get(currentModelSlug(q.get("model") ?? "")) ?? fallback;
    setConfig(normalise(fromQuery(q, defaultConfig(m)), m));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) window.history.replaceState(null, "", `${window.location.pathname}?${toQuery(config)}`);
  }, [config, ready]);

  const update = (p: Partial<Config>) => setConfig((prev) => normalise({ ...prev, ...p }, bySlug.get(p.model ?? prev.model) ?? model));
  const setModel = (slug: string) => {
    const m = bySlug.get(slug);
    if (!m) return;
    setConfig((prev) => {
      const keepEnc = allowedEnclosures(m).includes(prev.enclosure) ? prev.enclosure : undefined;
      const base = defaultConfig(m);
      return normalise({ ...prev, model: slug, enclosure: keepEnc ?? base.enclosure }, m);
    });
  };

  // the selected model's datasheet data (fetched per model, cached at the edge)
  useEffect(() => {
    const ctl = new AbortController();
    setSpecState("loading");
    fetch(`/api/model-spec?slug=${encodeURIComponent(model.slug)}&locale=${locale}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: ModelSpec) => {
        setSpec(d);
        setSpecState("ok");
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setSpecState("error");
      });
    return () => ctl.abort();
  }, [model.slug, locale]);

  const dims = dimsMm(model, config.enclosure);
  const encl = allowedEnclosures(model);
  const amps = atsRating(model, config.units);
  const autonomy = autonomyHours(model, config);
  const weight = weightKg(model, config.enclosure);
  const baseTank = baseTankL(model, config.enclosure);
  const container = config.enclosure === "container20" || config.enclosure === "container40";
  const brand = (b: string) => (ar ? (BRAND_AR[b] ?? b) : b);
  const n = (v: number) => new Intl.NumberFormat(ar ? "ar-AE-u-nu-latn" : "en-AE", { maximumFractionDigits: 0 }).format(v);

  const groups = useMemo(() => {
    const g = new Map<string, ConfigModel[]>();
    for (const m of models) g.set(m.brand, [...(g.get(m.brand) ?? []), m]);
    return [...g.entries()];
  }, [models]);

  const addons = [
    config.ats && `${config.units > 1 ? c.sync : c.ats} ${amps} A`,
    config.remote && c.remote,
    config.trailer && c.trailer,
    config.tankL > 0 && `${c.tank} ${n(config.tankL)} L`,
  ].filter(Boolean) as string[];

  const shareUrl = typeof window === "undefined" ? "" : `${window.location.origin}${window.location.pathname}?${toQuery(config)}`;
  const waMessage = [
    c.wa,
    `• ${config.units > 1 ? `${config.units} × ` : ""}${model.code} — ${n(model.standbyKva)}/${n(model.primeKva)} kVA (${brand(model.brand)} ${model.engine})`,
    `• ${ENCLOSURES[config.enclosure].label[locale]}${!container && config.enclosure !== "open" ? ` · ${COLOURS[config.colour].ral}` : container ? ` · ${COLOURS[config.colour].ral}` : ""}`,
    `• ${c.silencer}: ${SILENCERS[config.silencer].label[locale]}`,
    addons.length ? `• ${addons.join(" · ")}` : "",
    shareUrl,
    c.waAsk,
  ]
    .filter(Boolean)
    .join("\n");

  const snapshot = () => {
    const canvas = stageRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${model.code}-${config.enclosure}.png`;
    a.click();
    trackEvent("configurator_snapshot", { model: model.code });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the URL bar already holds the link */
    }
  };

  const section = "rounded-3xl border border-line bg-navy-900 p-5 sm:p-6";
  const h = "text-sm font-extrabold uppercase tracking-wide text-muted";

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      {/* ------------------------------------------------ 3D stage */}
      <div className="min-w-0 lg:sticky lg:top-24 xl:top-36 lg:col-span-7">
        <div ref={stageRef} className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-3xl border border-line bg-[radial-gradient(120%_90%_at_50%_15%,#ffffff_0%,#e6eaef_55%,#cdd4dd_100%)] lg:h-[72vh]">
          {webgl ? (
            <GeneratorScene
              brand={model.brand}
              code={model.code}
              config={config}
              dims={dims}
              atsAmps={amps}
              autoRotate={autoRotate}
              showLabels={showLabels}
              labels={c.sceneLabels}
              showDims={showDims}
              dimLabels={c.dimLabels}
            />
          ) : (
            <div className="grid h-full place-items-center p-6 text-center">
              <div>
                <Image src={model.image} alt={model.code} width={640} height={480} className="mx-auto max-h-[40vh] w-auto rounded-2xl object-cover" />
                <p className="mt-3 text-sm text-zinc-600">{c.noWebgl}</p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <div className="rounded-2xl bg-[#0b1022]/85 px-3 py-2 text-[#fff] shadow-lg">
              <p className="text-lg font-extrabold leading-tight" dir="ltr">{config.units > 1 ? `${config.units} × ${model.code}` : model.code}</p>
              <p className="text-xs text-[#fff]/75">{ENCLOSURES[config.enclosure].label[locale]} · <span dir="ltr">{n(model.standbyKva)} kVA</span></p>
            </div>
            <div className="pointer-events-auto flex gap-1.5">
              {[
                { on: autoRotate, set: () => setAutoRotate((v) => !v), icon: autoRotate ? Pause : Play, label: c.rotate },
                { on: showLabels, set: () => setShowLabels((v) => !v), icon: TagIcon, label: c.labels },
                { on: showDims, set: () => setShowDims((v) => !v), icon: Ruler, label: c.measure },
                { on: false, set: snapshot, icon: Camera, label: c.snapshot },
              ].map((b) => (
                <button key={b.label} type="button" onClick={b.set} aria-pressed={b.on} aria-label={b.label} title={b.label} className={cn("grid size-10 place-items-center rounded-full shadow-md ring-1 ring-black/10 transition", b.on ? "bg-[#0b1022] text-[#fff]" : "bg-[#fff] text-[#0b1022] hover:bg-[#eef0f3]")}>
                  <b.icon className="size-4" aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs font-semibold text-[#4b5160]">{c.hint}</p>
        </div>
      </div>

      {/* ------------------------------------------------ options */}
      <div className="grid min-w-0 gap-5 lg:col-span-5">
        <section className={section} aria-labelledby="cfg-model">
          <h2 id="cfg-model" className={h}>{c.model}</h2>
          <select
            aria-labelledby="cfg-model"
            value={model.slug}
            onChange={(e) => setModel(e.target.value)}
            className="mt-3 block w-full rounded-xl border border-zinc-300 bg-navy-900 px-3 py-3 font-bold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {groups.map(([b, list]) => (
              <optgroup key={b} label={brand(b)}>
                {list.map((m) => (
                  <option key={m.slug} value={m.slug}>{`${m.code} · ${m.standbyKva}/${m.primeKva} kVA · ${m.engine}`}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </section>

        <section className={section} aria-labelledby="cfg-enc">
          <h2 id="cfg-enc" className={h}>{c.enclosure}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="cfg-enc">
            {(Object.keys(ENCLOSURES) as Enclosure[]).map((e) => {
              const ok = encl.includes(e);
              const active = config.enclosure === e;
              return (
                <button key={e} type="button" role="radio" aria-checked={active} disabled={!ok} onClick={() => update({ enclosure: e })} className={cn("rounded-2xl border p-3 text-start transition disabled:cursor-not-allowed disabled:opacity-40", active ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/25" : "border-line hover:border-zinc-400")}>
                  <span className="block text-sm font-bold text-ink">{ENCLOSURES[e].label[locale]}</span>
                  <span className="block text-xs text-muted">{ENCLOSURES[e].hint[locale]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={section} aria-labelledby="cfg-add">
          <h2 id="cfg-add" className={h}>{c.addons}</h2>
          <div className="mt-3 grid gap-2">
            <Toggle on={config.ats} onChange={(v) => update({ ats: v })} label={config.units > 1 ? c.sync : c.ats} detail={`${n(amps)} A`} />
            <Toggle on={config.remote} onChange={(v) => update({ remote: v })} label={c.remote} detail="DSE WebNet / SMS alarms" />
            <Toggle on={config.trailer} onChange={(v) => update({ trailer: v })} label={c.trailer} disabled={!trailerAllowed(model, config)} detail={!trailerAllowed(model, config) ? c.trailerOff : undefined} />
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
              <span className="text-sm font-bold text-ink">{c.units}</span>
              <div className="flex items-center gap-1" role="group" aria-label={c.units}>
                <button type="button" onClick={() => update({ units: config.units - 1 })} disabled={config.units <= 1} className="grid size-9 place-items-center rounded-full border border-line hover:bg-zinc-50 disabled:opacity-40" aria-label="−"><Minus className="size-4" aria-hidden /></button>
                <span className="w-8 text-center text-lg font-extrabold tabular-nums" dir="ltr">{config.units}</span>
                <button type="button" onClick={() => update({ units: config.units + 1 })} disabled={config.units >= MAX_UNITS} className="grid size-9 place-items-center rounded-full border border-line hover:bg-zinc-50 disabled:opacity-40" aria-label="+"><Plus className="size-4" aria-hidden /></button>
              </div>
            </div>
          </div>
        </section>

        <section className={section} aria-labelledby="cfg-sil">
          <h2 id="cfg-sil" className={h}>{c.silencer}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-labelledby="cfg-sil">
            {(Object.keys(SILENCERS) as Silencer[]).map((s) => (
              <button key={s} type="button" role="radio" aria-checked={config.silencer === s} onClick={() => update({ silencer: s })} className={cn("rounded-2xl border p-3 text-center transition", config.silencer === s ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/25" : "border-line hover:border-zinc-400")}>
                <span className="block text-sm font-bold text-ink">{SILENCERS[s].label[locale]}</span>
                <span className="block text-[0.7rem] text-muted" dir="ltr">−{SILENCERS[s].db} dB(A)</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{c.attenuation}</p>
        </section>

        <section className={section} aria-labelledby="cfg-tank">
          <h2 id="cfg-tank" className={h}>{c.tank}</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cfg-tank">
            {TANK_SIZES.map((t) => (
              <button key={t} type="button" role="radio" aria-checked={config.tankL === t} onClick={() => update({ tankL: t })} className={cn("rounded-full border px-4 py-2 text-sm font-bold transition", config.tankL === t ? "border-brand-500 bg-brand-50 text-ink ring-2 ring-brand-500/25" : "border-line text-zinc-700 hover:border-zinc-400")}>
                {t ? <span dir="ltr">{n(t)} L</span> : c.none}
              </button>
            ))}
          </div>
        </section>

        <section className={section} aria-labelledby="cfg-col">
          <h2 id="cfg-col" className={h}>{c.colour}</h2>
          {config.enclosure === "open" ? (
            <p className="mt-3 text-sm text-muted">{c.colourOff}</p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cfg-col">
                {(Object.keys(COLOURS) as Colour[]).map((k) => (
                  <button key={k} type="button" role="radio" aria-checked={config.colour === k} aria-label={`${COLOURS[k].label[locale]} ${COLOURS[k].ral}`} title={`${COLOURS[k].label[locale]} · ${COLOURS[k].ral}`} onClick={() => update({ colour: k })} className={cn("grid size-11 place-items-center rounded-full ring-1 ring-black/15 transition", config.colour === k && "ring-4 ring-brand-500")} style={{ background: COLOURS[k].hex }}>
                    {config.colour === k && <Check className={cn("size-5", ["white", "grey", "beige", "yellow"].includes(k) ? "text-[#0b1022]" : "text-white")} aria-hidden />}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">{COLOURS[config.colour].label[locale]} · {COLOURS[config.colour].ral}. {c.anyRal}</p>
            </>
          )}
        </section>

        {/* ------------------------------------------------ summary + CTA */}
        <section className="on-dark rounded-3xl bg-navy-950 p-5 text-white sm:p-6" aria-labelledby="cfg-sum">
          <h2 id="cfg-sum" className="eyebrow">{c.summary}</h2>
          <p className="mt-2 text-2xl font-extrabold" dir="ltr">{config.units > 1 ? `${config.units} × ` : ""}{model.code}</p>
          <dl className="mt-4 grid gap-2 text-sm">
            {[
              [c.rating, <span key="r" dir="ltr">{n(model.standbyKva)} / {n(model.primeKva)} kVA</span>],
              [c.engine, <span key="e" dir="ltr">{model.brand} {model.engine}</span>],
              [c.alternator, <span key="a" dir="ltr">4U · {model.alternator}</span>],
              [c.controller, <span key="c" dir="ltr">Deep Sea {model.controller}</span>],
              [c.dims, <span key="d" dir="ltr">{n(dims.l)} × {n(dims.w)} × {n(dims.h)} mm{container ? ` · ${c.isoContainer}` : ""}</span>],
              [c.weight, weight ? <span key="w" dir="ltr">{n(weight)} kg</span> : c.onRequest],
              [
                c.fuel,
                <span key="f">
                  {[baseTank ? `${c.baseTank} ${n(baseTank)} L` : null, config.tankL ? `${c.external} ${n(config.tankL)} L` : null].filter(Boolean).join(" + ") || "—"}
                  {autonomy ? ` · ${c.autonomy(Math.round(autonomy))}` : ""}
                </span>,
              ],
              [c.silencer, `${SILENCERS[config.silencer].label[locale]} (−${SILENCERS[config.silencer].db} dB(A))`],
              ...(addons.length ? [[c.addons, addons.join(" · ")] as const] : []),
            ].map(([k, v]) => (
              <div key={k as string} className="grid grid-cols-5 gap-3 border-b border-white/10 pb-2 last:border-0">
                <dt className="col-span-2 text-white/65">{k}</dt>
                <dd className="col-span-3 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-2">
            <a
              href={whatsappUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("configurator_quote_click", { model: model.code, enclosure: config.enclosure, channel: "whatsapp" });
                trackEvent("whatsapp_click", { location: "configurator", product: model.slug });
              }}
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <WhatsAppIcon />
              {c.whatsapp}
            </a>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="primary" onClick={() => { setShowForm(true); trackEvent("configurator_quote_click", { model: model.code, channel: "form" }); }} aria-expanded={showForm}>
                {c.quote}
              </Button>
              <Button type="button" variant="ghostDark" onClick={copyLink}>
                {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                {copied ? c.copied : c.copy}
              </Button>
            </div>
            <Link href={`/models/${model.slug}`} className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-400 hover:underline">
              <FileText className="size-4" aria-hidden />
              {c.datasheet}
            </Link>
          </div>
        </section>
        {showForm && (
          <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <LeadForm source="quote_form" productSlug={model.slug} productName={`${config.units > 1 ? `${config.units} × ` : ""}${model.code}`} calculatedKva={model.standbyKva * config.units} defaultMessage={waMessage} />
          </div>
        )}
      </div>
    </div>

    {/* ------------------------------------------------ technical data (the model's datasheet); outside the grid so
        the sticky 3D stage never slides over it */}
    <TechData spec={spec} state={specState} tab={tab} setTab={setTab} c={c} n={n} enclosure={config.enclosure} slug={model.slug} code={model.code} />
    </>
  );
}

type Copy = (typeof COPY)["en"];
type Tab = "dims" | "ratings" | "engine" | "alt" | "ctrl";

function Rows({ title, rows }: { title?: string; rows: [string, string][] }) {
  if (!rows.length) return null;
  return (
    <div className="min-w-0">
      {title && <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand-700 rtl:tracking-normal">{title}</h4>}
      <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-5 gap-3 px-4 py-2.5 text-sm odd:bg-surface">
            <dt className="col-span-2 text-muted">{k}</dt>
            <dd className="col-span-3 font-semibold text-ink" dir="auto">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TechData({ spec, state, tab, setTab, c, n, enclosure, slug, code }: { spec: ModelSpec | null; state: "loading" | "ok" | "error"; tab: Tab; setTab: (t: Tab) => void; c: Copy; n: (v: number) => string; enclosure: Enclosure; slug: string; code: string }) {
  const tabs = Object.entries(c.tabs) as [Tab, string][];
  // the build row matching the enclosure picked above
  const isCurrent = (name: string) => (enclosure === "open" ? /open|مفتوح/i.test(name) : enclosure === "canopy" ? /canopy|كابينة/i.test(name) : /container|حاوية/i.test(name));
  const th = "px-4 py-2.5 text-start text-xs font-bold uppercase tracking-wide text-muted rtl:tracking-normal";
  const td = "px-4 py-2.5 text-sm font-semibold text-ink";
  return (
    <section className="mt-6 min-w-0 rounded-3xl border border-line bg-navy-900 p-5 sm:p-6" aria-labelledby="cfg-tech">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="cfg-tech" className="text-xl font-extrabold text-ink sm:text-2xl">
            {c.tech} · <span dir="ltr">{spec?.code ?? code}</span>
          </h2>
          <p className="mt-1 text-sm text-muted">{c.techIntro}</p>
        </div>
        <Link href={`/models/${slug}`} className={buttonVariants({ variant: "outline", size: "md" })}>
          <FileText aria-hidden />
          {c.fullDs}
        </Link>
      </div>

      <div role="tablist" aria-label={c.tech} className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition", tab === id ? "bg-gold text-ink-950" : "border border-line text-muted hover:text-ink")}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
        {state === "loading" && !spec && <p className="animate-pulse text-sm text-muted">{c.loading}</p>}
        {state === "error" && <p className="text-sm text-muted">{c.failed}</p>}
        {spec && (
          <div className={cn("transition-opacity", state === "loading" && "opacity-50")}>
            {tab === "dims" && (
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[34rem] text-start">
                  <thead className="bg-surface">
                    <tr>
                      <th className={th}>{c.build}</th>
                      <th className={th}>{c.lwh}</th>
                      <th className={th}>{c.weight}</th>
                      <th className={th}>{c.tankCol}</th>
                      <th className={th}>{c.noise}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {spec.builds.map((b) => (
                      <tr key={b.name} className={isCurrent(b.name) ? "bg-brand-50" : undefined}>
                        <td className={td}>{b.name}</td>
                        <td className={td} dir="ltr">{b.dims}</td>
                        <td className={td} dir="ltr">{b.weight}</td>
                        <td className={td} dir="ltr">{b.tank}</td>
                        <td className={td} dir="ltr">{b.noise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "ratings" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="min-w-0">
                  <div className="overflow-x-auto rounded-2xl border border-line">
                    <table className="w-full text-start">
                      <thead className="bg-surface">
                        <tr>
                          <th className={th} dir="auto">{spec.hz === 60 ? c.output60 : c.output}</th>
                          <th className={th}>{c.kva}</th>
                          <th className={th}>{c.kw}</th>
                          <th className={th}>{c.amps}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {[[c.prime, spec.prime], [c.standby, spec.standby]].map(([k, r]) => {
                          const v = r as ModelSpec["prime"];
                          return (
                            <tr key={k as string}>
                              <td className={td}>{k as string}</td>
                              <td className={td} dir="ltr">{n(v.kva)}</td>
                              <td className={td} dir="ltr">{n(v.kw)}</td>
                              <td className={td} dir="ltr">{n(v.amps)} A</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {spec.sixty && (
                    <p className="mt-3 text-sm text-muted">
                      {c.at60}: <b className="text-ink" dir="ltr">{n(spec.sixty.prime)}{spec.sixty.standby ? ` / ${n(spec.sixty.standby)}` : ""} kVA</b>
                    </p>
                  )}
                </div>
                {spec.fuel.length > 0 && (
                  <div className="min-w-0">
                    <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand-700 rtl:tracking-normal">{c.fuelUse}</h4>
                    <ul className="grid gap-2">
                      {spec.fuel.map((f) => {
                        const max = Math.max(...spec.fuel.map((x) => x.lph));
                        return (
                          <li key={f.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-sm">
                            <span className="text-muted">{f.label}</span>
                            <span className="h-2.5 overflow-hidden rounded-full bg-surface ring-1 ring-line">
                              <span className={cn("block h-full rounded-full", f.highlight ? "bg-brand-500" : "bg-zinc-400")} style={{ width: `${(f.lph / max) * 100}%` }} />
                            </span>
                            <b className="text-ink tabular-nums" dir="ltr">{f.lph} {c.lph}</b>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {tab === "engine" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <Rows rows={spec.engineRows} />
                <div className="grid gap-5">
                  <Rows title={c.cooling} rows={spec.coolingRows} />
                  <Rows title={c.lube} rows={spec.lubeRows} />
                  <Rows title={c.air} rows={spec.airRows} />
                </div>
              </div>
            )}
            {tab === "alt" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <Rows rows={spec.alternatorRows} />
                <Rows title={c.operating} rows={spec.operatingRows} />
              </div>
            )}
            {tab === "ctrl" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="min-w-0">
                  <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brand-700 rtl:tracking-normal">
                    {c.features}{spec.controller ? <> · <span dir="ltr">Deep Sea {spec.controller}</span></> : null}
                  </h4>
                  <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
                    {spec.controllerFeatures.map((f) => (
                      <li key={f} className="flex gap-2 text-ink">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Rows title={c.canopy} rows={spec.enclosureRows} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
