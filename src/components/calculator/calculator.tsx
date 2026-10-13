"use client";

import * as Slider from "@radix-ui/react-slider";
import {
  AlertTriangle,
  Box,
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  FileText,
  HardHat,
  Home,
  Minus,
  PartyPopper,
  Plus,
  RotateCcw,
  Trash2,
  Zap,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { logCalculationRun } from "@/lib/api-client";
import { trackEvent } from "@/lib/analytics";
import { matchAts } from "@/lib/calculator";
import {
  analyse,
  CONSTRAINT_LABEL,
  DIP_LIMITS,
  HARMONICS,
  LOAD_KINDS,
  minimumRating,
  notes as sizingNotes,
  recommend,
  SITE_PRESETS,
  SITE_TYPES,
  softStartAlternative,
  START_METHODS,
  type Duty,
  type Harmonics,
  type LoadKind,
  type LoadLine,
  type SiteType,
  type SizingInput,
  type SizingModel,
  type SizingNote,
  type StartMethod,
} from "@/lib/sizing";
import { whatsappUrl } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";
import { LeadForm } from "../lead-form";
import { Button, buttonVariants } from "../ui/button";

const SITE_ICONS: Record<SiteType, typeof Home> = { residential: Home, commercial: Building2, industrial: Factory, construction: HardHat, event: PartyPopper };

const COPY = {
  en: {
    title: "Generator sizing calculator",
    steps: ["Load", "Site & duty", "Starting & quality", "Recommendation"],
    stepOf: (n: number) => `Step ${n} of 4`,
    modeTotal: "I know my total load",
    modeList: "Build a load schedule",
    totalKw: "Total running load (kW)",
    amps: "Measured current per phase (A)",
    voltage: "Voltage",
    phases: "Phases",
    three: "3-phase",
    single: "1-phase",
    pf: "Load power factor",
    pfHint: "Mixed sites ≈ 0.8. Offices & IT ≈ 0.9–0.95. Motors ≈ 0.85.",
    motorKw: "Largest motor in the load (kW, 0 if none)",
    motorHint: "Pump, compressor, chiller, lift — the one that draws the most when it starts.",
    startMethod: "Starting method",
    nonLinKw: "UPS / drives / chargers in the load (kW)",
    harmonics: "Rectifier type",
    siteType: "Site type",
    loadName: "Load",
    kind: "Type",
    kw: "kW",
    qty: "Qty",
    add: "Add load",
    remove: "Remove",
    simultaneity: "Running at the same time",
    simHint: "Share of the connected load that runs together at the peak hour (diversity).",
    duty: "How will the generator run?",
    standby: "Standby — backup when mains fails",
    standbyHint: "ESP rating (ISO 8528-1): mains-failure use, up to ~500 h a year, no overload.",
    prime: "Prime — main power, no grid",
    primeHint: "PRP rating: unlimited hours at variable load; 24 h average limited to 70–80 % of PRP, 10 % overload 1 h in 12.",
    ambient: "Hottest ambient at site",
    altitude: "Site altitude (m above sea level)",
    growth: "Future growth allowance",
    derateNote: (f: number) => `Site derating applied: ${f} % of rated output`,
    dip: "Maximum voltage dip when the largest motor starts",
    dipOpts: { 10: "10 % — IT, medical, sensitive electronics", 15: "15 % — fire pumps (code), sensitive controls", 20: "20 % — standard buildings & motors", 30: "30 % — construction, non-critical" } as Record<number, string>,
    sequencing: "After mains returns, loads switch on…",
    staggered: "In sequence (largest motor last)",
    together: "All at once",
    avgLoad: "Average load over 24 h (% of running load)",
    next: "Next",
    back: "Back",
    calculate: "Calculate",
    restart: "Start again",
    invalid: "Enter a load greater than zero.",
    minRating: (d: Duty) => (d === "standby" ? "Minimum standby rating" : "Minimum prime rating"),
    standardSize: "Nearest standard size",
    sizedBy: "Sized by",
    bestFit: "Best-fit 4U model",
    running: "Running load",
    kvaRun: "Apparent power",
    pfOverall: "Overall PF",
    current: "Current @ 400 V",
    motorStart: "Largest motor start",
    alt: "Alternator kVA (harmonics)",
    picks: "Models that meet every check",
    pickCols: ["Model", "Standby / prime", "Load", "Dip", "Fuel at this load", "Tank"],
    perHour: "L/h",
    hours: "h",
    onRequest: "On request",
    datasheet: "Datasheet",
    quote: "Quote",
    inParallel: (n: number) => `${n} sets in parallel`,
    ats: "Matching ATS",
    sync: "Synchronising panel required",
    noPick: "No standard set covers this load — our engineers will design a synchronised plant.",
    softStart: (code: string, kva: number) => `With a soft starter on the largest motor, ${code} would be enough (${kva} kVA smaller).`,
    noteText: {
      light_load: "Running below 30 % of rating for long periods causes wet stacking — consider a smaller set or a load bank.",
      harmonics: "Non-linear loads above 20 %: specify a PMG-excited, low-reactance alternator and confirm the UPS input THD.",
      sequencing: "Assumes the ATS/BMS starts motors in sequence. If everything switches on together, choose “All at once”.",
      soft_start: "",
      derate: "Output reduced for site temperature/altitude: full rating up to 40 °C and 1000 m, then ≈ 1 %/°C and ≈ 4 %/300 m.",
      parallel: "Above a single set: identical sets in parallel on a synchronising panel (N+1 adds redundancy).",
    } as Record<SizingNote, string>,
    whatsapp: "Send to our engineer on WhatsApp",
    form: "Request a quote",
    disclaimer:
      "Engineering estimate for budgeting and model selection. Final sizing is confirmed against your load schedule, motor nameplates and the alternator's motor-starting curve.",
    fullCalc: "Open full calculator",
    widgetKw: "Total running load (kW)",
    widgetHint: "Standby, 45 °C, 15 % growth. Open the full calculator for motors, UPS and prime duty.",
    method: "Method & standards",
  },
  ar: {
    title: "حاسبة حجم المولد",
    steps: ["الحمل", "الموقع ونوع التشغيل", "بدء التشغيل والجودة", "التوصية"],
    stepOf: (n: number) => `الخطوة ${n} من 4`,
    modeTotal: "أعرف إجمالي الحمل",
    modeList: "جدول الأحمال بالتفصيل",
    totalKw: "إجمالي الحمل التشغيلي (ك.و)",
    amps: "التيار المقاس لكل فاز (أمبير)",
    voltage: "الجهد",
    phases: "الفازات",
    three: "3 فاز",
    single: "فاز واحد",
    pf: "معامل القدرة للحمل",
    pfHint: "المواقع المختلطة ≈ 0.8، المكاتب والخوادم ≈ 0.9–0.95، المحركات ≈ 0.85.",
    motorKw: "أكبر محرك في الحمل (ك.و، 0 إن لم يوجد)",
    motorHint: "مضخة أو ضاغط أو تشلر أو مصعد — الأكثر سحباً للتيار عند التشغيل.",
    startMethod: "طريقة التشغيل",
    nonLinKw: "أحمال UPS / إنفرتر / شواحن ضمن الحمل (ك.و)",
    harmonics: "نوع المقوّم",
    siteType: "نوع الموقع",
    loadName: "الحمل",
    kind: "النوع",
    kw: "ك.و",
    qty: "العدد",
    add: "إضافة حمل",
    remove: "حذف",
    simultaneity: "نسبة التشغيل المتزامن",
    simHint: "نسبة الأحمال التي تعمل معاً في وقت الذروة (معامل التباين).",
    duty: "كيف سيعمل المولد؟",
    standby: "احتياطي — عند انقطاع الكهرباء",
    standbyHint: "قدرة ESP حسب ISO 8528-1: للطوارئ حتى ~500 ساعة سنوياً، بدون تحميل زائد.",
    prime: "أساسي — مصدر الكهرباء الرئيسي",
    primeHint: "قدرة PRP: ساعات غير محدودة بحمل متغير؛ متوسط 24 ساعة لا يتجاوز 70–80% من PRP، وتحميل زائد 10% لساعة كل 12 ساعة.",
    ambient: "أعلى حرارة في الموقع",
    altitude: "ارتفاع الموقع عن سطح البحر (م)",
    growth: "هامش التوسع المستقبلي",
    derateNote: (f: number) => `تم تطبيق خفض القدرة للموقع: ${f}% من القدرة الاسمية`,
    dip: "أقصى هبوط مسموح في الجهد عند بدء أكبر محرك",
    dipOpts: { 10: "10% — خوادم، معدات طبية وإلكترونيات حساسة", 15: "15% — مضخات الحريق وأنظمة التحكم الحساسة", 20: "20% — المباني والمحركات العادية", 30: "30% — مواقع إنشاء وأحمال غير حرجة" } as Record<number, string>,
    sequencing: "عند عودة الكهرباء تعمل الأحمال…",
    staggered: "بالتتابع (أكبر محرك في الآخر)",
    together: "كلها مرة واحدة",
    avgLoad: "متوسط الحمل خلال 24 ساعة (% من الحمل التشغيلي)",
    next: "التالي",
    back: "رجوع",
    calculate: "احسب",
    restart: "ابدأ من جديد",
    invalid: "أدخل حملاً أكبر من صفر.",
    minRating: (d: Duty) => (d === "standby" ? "أقل قدرة احتياطية مطلوبة" : "أقل قدرة أساسية مطلوبة"),
    standardSize: "أقرب مقاس قياسي",
    sizedBy: "العامل المحدد للحجم",
    bestFit: "أنسب موديل 4U",
    running: "الحمل التشغيلي",
    kvaRun: "القدرة الظاهرية",
    pfOverall: "معامل القدرة الكلي",
    current: "التيار عند 400 فولت",
    motorStart: "بدء أكبر محرك",
    alt: "قدرة الدينامو (توافقيات)",
    picks: "موديلات تحقق كل الشروط",
    pickCols: ["الموديل", "احتياطي / أساسي", "الحمل", "هبوط الجهد", "الوقود عند هذا الحمل", "الخزان"],
    perHour: "لتر/س",
    hours: "ساعة",
    onRequest: "عند الطلب",
    datasheet: "الداتا شيت",
    quote: "عرض سعر",
    inParallel: (n: number) => `${n} مولدات على التوازي`,
    ats: "لوحة ATS المناسبة",
    sync: "يلزم لوحة تزامن (Synchronising)",
    noPick: "لا يوجد مولد قياسي يغطي هذا الحمل — سيصمم مهندسونا محطة مولدات متزامنة.",
    softStart: (code: string, kva: number) => `باستخدام سوفت ستارتر لأكبر محرك يكفي الموديل ${code} (أصغر بـ ${kva} ك.ف.أ).`,
    noteText: {
      light_load: "التشغيل تحت 30% من القدرة لفترات طويلة يسبب ترسبات (Wet stacking) — فكّر في مولد أصغر أو Load bank.",
      harmonics: "أحمال غير خطية أكثر من 20%: يُفضّل دينامو بإثارة PMG ومفاعلة منخفضة، مع التأكد من THD لمدخل الـ UPS.",
      sequencing: "الحساب يفترض تشغيل المحركات بالتتابع عبر لوحة ATS/BMS. إن كانت تعمل كلها معاً اختر «كلها مرة واحدة».",
      soft_start: "",
      derate: "تم خفض القدرة حسب حرارة/ارتفاع الموقع: القدرة كاملة حتى 40°م و1000 م، ثم ≈ 1% لكل درجة و≈ 4% لكل 300 م.",
      parallel: "أكبر من مولد واحد: مولدات متماثلة على التوازي بلوحة تزامن (N+1 للاحتياط).",
    } as Record<SizingNote, string>,
    whatsapp: "أرسل النتيجة لمهندسنا على واتساب",
    form: "اطلب عرض سعر",
    disclaimer: "تقدير هندسي لاختيار الموديل والميزانية. يتم تأكيد الحجم النهائي على جدول الأحمال ولوحات المحركات ومنحنى بدء المحركات للدينامو.",
    fullCalc: "افتح الحاسبة الكاملة",
    widgetKw: "إجمالي الحمل التشغيلي (ك.و)",
    widgetHint: "احتياطي، 45°م، هامش 15%. افتح الحاسبة الكاملة للمحركات والـ UPS والتشغيل الأساسي.",
    method: "المنهجية والمعايير",
  },
};

const BRAND_AR: Record<string, string> = { Perkins: "بيركنز", Cummins: "كمنز", Kubota: "كوبوتا", Baudouin: "بودوان" };

function Seg<T extends string | number | boolean>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-2xl bg-zinc-100 p-1">
      {options.map(([v, l]) => (
        <button
          key={String(v)}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn("flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition", value === v ? "bg-navy-950 text-white shadow" : "text-zinc-700 hover:bg-navy-900")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Range({ value, onChange, min, max, step, label, suffix = "", dir, hint }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; label: string; suffix?: string; dir: "ltr" | "rtl"; hint?: string }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
        <div className="flex items-center gap-1">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            dir="ltr"
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-20 rounded-xl border border-zinc-300 px-2 py-1.5 text-center font-extrabold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          {suffix && <span className="font-bold text-muted">{suffix}</span>}
        </div>
      </div>
      <Slider.Root dir={dir} className="relative mt-4 flex h-6 touch-none select-none items-center" value={[value]} min={min} max={max} step={step} onValueChange={([v]) => v !== undefined && onChange(v)} aria-label={label}>
        <Slider.Track className="relative h-2 grow rounded-full bg-zinc-200">
          <Slider.Range className="absolute h-full rounded-full bg-brand-500" />
        </Slider.Track>
        <Slider.Thumb className="block size-6 rounded-full border-4 border-white bg-brand-500 shadow-md ring-1 ring-brand-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900" />
      </Slider.Root>
      {hint && <p className="mt-2 text-xs leading-5 text-muted">{hint}</p>}
    </div>
  );
}

const field =
  "mt-1.5 block w-full rounded-xl border border-zinc-300 bg-navy-900 px-3 py-2.5 font-bold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

export function Calculator({ products, models, variant = "full" }: { products: Product[]; models: SizingModel[]; variant?: "full" | "widget" }) {
  const locale = useLocale() as Locale;
  const c = COPY[locale];
  const ar = locale === "ar";
  const dir = ar ? "rtl" : "ltr";
  const uid = useId();
  const widget = variant === "widget";

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"total" | "list">("total");
  const [unit, setUnit] = useState<"kw" | "amps">("kw");
  const [kw, setKw] = useState(80);
  const [amps, setAmps] = useState(150);
  const [voltage, setVoltage] = useState(400);
  const [phases, setPhases] = useState<1 | 3>(3);
  const [pf, setPf] = useState(0.8);
  const [motorKw, setMotorKw] = useState(0);
  const [motorStart, setMotorStart] = useState<StartMethod>("dol");
  const [nlKw, setNlKw] = useState(0);
  const [nlType, setNlType] = useState<Harmonics>("igbt");
  const [site, setSite] = useState<SiteType>("commercial");
  const [lines, setLines] = useState<LoadLine[]>(() => SITE_PRESETS.commercial.map((l) => ({ ...l })));
  const [sim, setSim] = useState(100);
  const [duty, setDuty] = useState<Duty>("standby");
  const [ambient, setAmbient] = useState(45);
  const [altitude, setAltitude] = useState(0);
  const [growth, setGrowth] = useState(15);
  const [dipLimit, setDipLimit] = useState(20);
  const [together, setTogether] = useState(false);
  const [avgLoad, setAvgLoad] = useState(75);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const lastLogged = useRef("");
  /** the widget's default load, shown before the visitor touches anything — not a calculation */
  const widgetDefault = useRef<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // total-load mode → one mixed line + optional largest motor + optional non-linear block
  const totalKw = useMemo(() => {
    if (unit === "kw") return Math.max(0, kw);
    const kva = ((phases === 3 ? Math.sqrt(3) : 1) * voltage * Math.max(0, amps)) / 1000;
    return kva * pf;
  }, [unit, kw, amps, voltage, phases, pf]);

  const input: SizingInput = useMemo(() => {
    const common = { duty, ambientC: ambient, altitudeM: altitude, growthPct: growth, dipLimitPct: dipLimit, avgLoadPct: avgLoad, startTogether: together };
    if (widget) return { ...common, duty: "standby", ambientC: 45, altitudeM: 0, growthPct: 15, dipLimitPct: 20, startTogether: false, simultaneityPct: 100, lines: [{ id: "w", kind: "sockets", kw: Math.max(0, kw), qty: 1, pf: 0.8 }] };
    if (mode === "list") return { ...common, simultaneityPct: sim, lines };
    const m = Math.min(Math.max(0, motorKw), totalKw);
    const u = Math.min(Math.max(0, nlKw), totalKw - m);
    const out: LoadLine[] = [{ id: "mixed", kind: "sockets", kw: totalKw - m - u, qty: 1, pf }];
    if (m > 0) out.push({ id: "motor", kind: "motor", kw: m, qty: 1, start: motorStart });
    if (u > 0) out.push({ id: "nl", kind: "ups", kw: u, qty: 1, harmonics: nlType });
    return { ...common, simultaneityPct: 100, lines: out };
  }, [widget, mode, duty, ambient, altitude, growth, dipLimit, avgLoad, together, sim, lines, totalKw, motorKw, nlKw, pf, motorStart, nlType, kw]);

  const a = useMemo(() => analyse(input), [input]);
  const min = useMemo(() => minimumRating(input, a), [input, a]);
  const picks = useMemo(() => recommend(models, input, a), [models, input, a]);
  const best = picks[0];
  const soft = useMemo(() => (widget ? null : softStartAlternative(models, input, a, best)), [widget, models, input, a, best]);
  const noteList = useMemo(() => sizingNotes(input, a, best, soft?.savingKva ?? null), [input, a, best, soft]);
  const ats = useMemo(() => (best && best.units === 1 ? matchAts(products, best.model.standbyKva) : undefined), [products, best]);
  const valid = a.runningKw > 0;
  const showResult = widget ? valid : step === 4;

  const n = (v: number, d = 0) => new Intl.NumberFormat(ar ? "ar-AE-u-nu-latn" : "en-AE", { maximumFractionDigits: d }).format(v);
  const brand = (b: string) => (ar ? (BRAND_AR[b] ?? b) : b);
  const fitName = (f: NonNullable<typeof best>) => `${f.units > 1 ? `${f.units} × ` : ""}${f.model.code}`;

  const waMessage = useMemo(() => {
    const lines = ar
      ? [
          "مرحباً، نتيجة حاسبة 4U:",
          `• الحمل: ${n(a.runningKw)} ك.و / ${n(a.runningKva)} ك.ف.أ (PF ${n(a.pf, 2)})`,
          `• التشغيل: ${duty === "standby" ? "احتياطي" : "أساسي"} · ${ambient}°م · ${altitude} م`,
          a.largestMotor ? `• أكبر محرك: ${n(a.largestMotor.unitKw)} ك.و (${START_METHODS[a.largestMotor.line.start ?? LOAD_KINDS[a.largestMotor.line.kind].start ?? "dol"].label.ar})` : "",
          `• أقل قدرة: ${n(min.standbyKva)} ك.ف.أ احتياطي`,
          best ? `• الموديلات: ${picks.map(fitName).join(" / ")}` : "",
          "أرجو إرسال السعر والتوفر.",
        ]
      : [
          "Hi, 4U calculator result:",
          `• Load: ${n(a.runningKw)} kW / ${n(a.runningKva)} kVA (PF ${n(a.pf, 2)})`,
          `• Duty: ${duty} · ${ambient} °C · ${altitude} m`,
          a.largestMotor ? `• Largest motor: ${n(a.largestMotor.unitKw)} kW (${START_METHODS[a.largestMotor.line.start ?? LOAD_KINDS[a.largestMotor.line.kind].start ?? "dol"].label.en})` : "",
          `• Minimum: ${n(min.standbyKva)} kVA standby`,
          best ? `• Models: ${picks.map(fitName).join(" / ")}` : "",
          "Please send price and availability.",
        ];
    return lines.filter(Boolean).join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, min, picks, best, duty, ambient, altitude, ar]);

  // Log each distinct completed calculation once (intent data), and fire the analytics event.
  useEffect(() => {
    if (!showResult || !valid) return;
    const key = JSON.stringify(input);
    if (key === lastLogged.current) return;
    // the widget renders a result for its default load on every page view; only count it once the visitor changes something
    if (widget && (widgetDefault.current ??= key) === key) return;
    const timer = setTimeout(async () => {
      lastLogged.current = key;
      trackEvent("calculator_complete", { kva: min.standard ?? Math.round(min.standbyKva), mode, variant, model: best?.model.code });
      const res = await logCalculationRun({
        mode: widget || mode === "total" ? "known_load" : "site_builder",
        load_type: mode === "list" && !widget ? site : null,
        input_kw: Math.round(a.runningKw * 10) / 10,
        input_amps: !widget && mode === "total" && unit === "amps" ? amps : null,
        voltage: !widget && mode === "total" && unit === "amps" ? voltage : null,
        phases: !widget && mode === "total" && unit === "amps" ? phases : null,
        power_factor: Math.round(a.pf * 100) / 100,
        safety_margin: input.growthPct,
        running_kva: Math.round(a.runningKva * 10) / 10,
        recommended_kva: best ? best.model.standbyKva * best.units : Math.round(min.standbyKva),
        recommended_ats_amps: best?.atsAmps ?? 0,
        matched_product_slug: best?.model.slug ?? null,
        locale,
        source_page: window.location.pathname,
        details: {
          duty: input.duty,
          ambient_c: input.ambientC,
          altitude_m: input.altitudeM,
          dip_limit: input.dipLimitPct,
          start_together: input.startTogether,
          min_standby_kva: Math.round(min.standbyKva),
          sized_by: min.binding,
          largest_motor_kw: a.largestMotor?.unitKw ?? null,
          non_linear_share: Math.round(a.nonLinearShare * 100),
          picks: picks.map(fitName),
        },
      });
      setSubmissionId(res.id);
    }, widget ? 2000 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, valid, input]);

  useEffect(() => {
    if (step === 4 && !widget) resultRef.current?.focus();
  }, [step, widget]);

  const setPreset = (s: SiteType) => {
    setSite(s);
    setLines(SITE_PRESETS[s].map((l) => ({ ...l })));
  };
  const patch = (id: string, p: Partial<LoadLine>) => setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...p } : l)));

  /* ------------------------------------------------------------ Step 1: load */
  const loadStep = (
    <fieldset className="grid gap-6">
      <legend className="sr-only">{c.steps[0]}</legend>
      <Seg label={c.steps[0]!} value={mode} onChange={setMode} options={[["total", c.modeTotal], ["list", c.modeList]]} />
      {mode === "total" ? (
        <div className="grid gap-5">
          <div className="w-fit">
            <Seg label={c.totalKw} value={unit} onChange={setUnit} options={[["kw", "kW"], ["amps", ar ? "أمبير" : "Amps"]]} />
          </div>
          {unit === "kw" ? (
            <div>
              <label htmlFor={`${uid}-kw`} className="text-sm font-bold text-ink">{c.totalKw}</label>
              <input id={`${uid}-kw`} type="number" inputMode="decimal" min={0} max={20000} value={kw} dir="ltr" onChange={(e) => setKw(Math.max(0, Number(e.target.value) || 0))} className={cn(field, "text-lg")} aria-invalid={!valid} />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor={`${uid}-a`} className="text-sm font-bold text-ink">{c.amps}</label>
                <input id={`${uid}-a`} type="number" inputMode="decimal" min={0} max={20000} value={amps} dir="ltr" onChange={(e) => setAmps(Math.max(0, Number(e.target.value) || 0))} className={field} aria-invalid={!valid} />
              </div>
              <div>
                <label htmlFor={`${uid}-v`} className="text-sm font-bold text-ink">{c.voltage}</label>
                <select id={`${uid}-v`} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className={field}>
                  {[230, 380, 400, 415, 440, 480].map((v) => <option key={v} value={v}>{v} V</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={`${uid}-ph`} className="text-sm font-bold text-ink">{c.phases}</label>
                <select id={`${uid}-ph`} value={phases} onChange={(e) => setPhases(Number(e.target.value) as 1 | 3)} className={field}>
                  <option value={3}>{c.three}</option>
                  <option value={1}>{c.single}</option>
                </select>
              </div>
            </div>
          )}
          <Range value={pf} onChange={(v) => setPf(Math.round(v * 100) / 100)} min={0.6} max={1} step={0.01} label={c.pf} dir={dir} hint={c.pfHint} />
          <div className="grid gap-4 rounded-2xl border border-line p-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-m`} className="text-sm font-bold text-ink">{c.motorKw}</label>
              <input id={`${uid}-m`} type="number" inputMode="decimal" min={0} max={5000} value={motorKw} dir="ltr" onChange={(e) => setMotorKw(Math.max(0, Number(e.target.value) || 0))} className={field} />
              <p className="mt-1.5 text-xs leading-5 text-muted">{c.motorHint}</p>
            </div>
            <div>
              <label htmlFor={`${uid}-ms`} className="text-sm font-bold text-ink">{c.startMethod}</label>
              <select id={`${uid}-ms`} value={motorStart} onChange={(e) => setMotorStart(e.target.value as StartMethod)} className={field} disabled={!motorKw}>
                {(Object.keys(START_METHODS) as StartMethod[]).map((k) => <option key={k} value={k}>{START_METHODS[k].label[locale]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-u`} className="text-sm font-bold text-ink">{c.nonLinKw}</label>
              <input id={`${uid}-u`} type="number" inputMode="decimal" min={0} max={20000} value={nlKw} dir="ltr" onChange={(e) => setNlKw(Math.max(0, Number(e.target.value) || 0))} className={field} />
            </div>
            <div>
              <label htmlFor={`${uid}-h`} className="text-sm font-bold text-ink">{c.harmonics}</label>
              <select id={`${uid}-h`} value={nlType} onChange={(e) => setNlType(e.target.value as Harmonics)} className={field} disabled={!nlKw}>
                {(["igbt", "twelve_pulse", "six_pulse"] as Harmonics[]).map((k) => <option key={k} value={k}>{HARMONICS[k].label[locale]}</option>)}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-bold text-ink" id={`${uid}-site`}>{c.siteType}</p>
            <div role="radiogroup" aria-labelledby={`${uid}-site`} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SITE_TYPES.map((s) => {
                const Icon = SITE_ICONS[s];
                const active = site === s;
                return (
                  <button key={s} type="button" role="radio" aria-checked={active} onClick={() => setPreset(s)} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-sm font-bold transition", active ? "border-brand-500 bg-brand-50 text-ink ring-2 ring-brand-500/30" : "border-line bg-navy-900 text-zinc-700 hover:border-zinc-400")}>
                    <Icon className={cn("size-6", active ? "text-brand-600" : "text-zinc-500")} aria-hidden />
                    {SITE_LABEL[s][locale]}
                  </button>
                );
              })}
            </div>
          </div>
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {lines.map((l) => {
              const kind = LOAD_KINDS[l.kind];
              return (
                <li key={l.id} className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-12 sm:items-end">
                  <div className="col-span-2 sm:col-span-4">
                    <label className="text-xs font-bold text-muted" htmlFor={`${uid}-${l.id}-k`}>{l.label?.[locale] ?? c.loadName}</label>
                    <select id={`${uid}-${l.id}-k`} value={l.kind} onChange={(e) => patch(l.id, { kind: e.target.value as LoadKind, start: undefined, harmonics: undefined })} className={cn(field, "py-2 text-sm")}>
                      {(Object.keys(LOAD_KINDS) as LoadKind[]).map((k) => <option key={k} value={k}>{LOAD_KINDS[k].label[locale]}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-muted" htmlFor={`${uid}-${l.id}-kw`}>{c.kw}</label>
                    <input id={`${uid}-${l.id}-kw`} type="number" inputMode="decimal" min={0} max={5000} value={l.kw} dir="ltr" onChange={(e) => patch(l.id, { kw: Math.max(0, Number(e.target.value) || 0) })} className={cn(field, "py-2 text-sm")} />
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs font-bold text-muted">{c.qty}</span>
                    <div className="mt-1.5 flex items-center gap-1" role="group" aria-label={`${c.qty}: ${l.label?.[locale] ?? kind.label[locale]}`}>
                      <button type="button" onClick={() => patch(l.id, { qty: Math.max(0, l.qty - 1) })} className="grid size-9 place-items-center rounded-full border border-line hover:bg-zinc-50" aria-label="−"><Minus className="size-4" aria-hidden /></button>
                      <span className="w-8 text-center font-bold tabular-nums" dir="ltr">{l.qty}</span>
                      <button type="button" onClick={() => patch(l.id, { qty: Math.min(99, l.qty + 1) })} className="grid size-9 place-items-center rounded-full border border-line hover:bg-zinc-50" aria-label="+"><Plus className="size-4" aria-hidden /></button>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    {kind.motor && kind.start !== "vfd" ? (
                      <>
                        <label className="text-xs font-bold text-muted" htmlFor={`${uid}-${l.id}-s`}>{c.startMethod}</label>
                        <select id={`${uid}-${l.id}-s`} value={l.start ?? kind.start ?? "dol"} onChange={(e) => patch(l.id, { start: e.target.value as StartMethod })} className={cn(field, "py-2 text-sm")}>
                          {(Object.keys(START_METHODS) as StartMethod[]).map((k) => <option key={k} value={k}>{START_METHODS[k].label[locale]}</option>)}
                        </select>
                      </>
                    ) : kind.harmonics !== "linear" && !kind.motor ? (
                      <>
                        <label className="text-xs font-bold text-muted" htmlFor={`${uid}-${l.id}-h`}>{c.harmonics}</label>
                        <select id={`${uid}-${l.id}-h`} value={l.harmonics ?? kind.harmonics} onChange={(e) => patch(l.id, { harmonics: e.target.value as Harmonics })} className={cn(field, "py-2 text-sm")}>
                          {(["igbt", "twelve_pulse", "six_pulse"] as Harmonics[]).map((k) => <option key={k} value={k}>{HARMONICS[k].label[locale]}</option>)}
                        </select>
                      </>
                    ) : null}
                  </div>
                  <div className="flex justify-end sm:col-span-1">
                    <button type="button" onClick={() => setLines((p) => p.filter((x) => x.id !== l.id))} className="grid size-9 place-items-center rounded-full text-muted hover:bg-zinc-50 hover:text-red-600" aria-label={`${c.remove}: ${l.label?.[locale] ?? kind.label[locale]}`}>
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Button type="button" variant="outline" className="w-fit" onClick={() => setLines((p) => [...p, { id: `x${Date.now()}`, kind: "sockets", kw: 5, qty: 1 }])}>
            <Plus aria-hidden />
            {c.add}
          </Button>
          <Range value={sim} onChange={setSim} min={50} max={100} step={5} label={c.simultaneity} suffix="%" dir={dir} hint={c.simHint} />
          <p className="text-sm text-muted">
            {c.running}: <strong className="text-ink" dir="ltr">{n(a.runningKw, 1)} kW · {n(a.runningKva, 1)} kVA</strong>
          </p>
        </div>
      )}
      {!valid && <p role="alert" className="text-sm font-semibold text-red-700">{c.invalid}</p>}
    </fieldset>
  );

  /* ------------------------------------------------------------ Step 2: site & duty */
  const siteStep = (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold text-ink">{c.duty}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={c.duty}>
          {(["standby", "prime"] as Duty[]).map((d) => (
            <button key={d} type="button" role="radio" aria-checked={duty === d} onClick={() => setDuty(d)} className={cn("rounded-2xl border p-4 text-start transition", duty === d ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/30" : "border-line hover:border-zinc-400")}>
              <span className="block font-bold text-ink">{d === "standby" ? c.standby : c.prime}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{d === "standby" ? c.standbyHint : c.primeHint}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-t`} className="text-sm font-bold text-ink">{c.ambient}</label>
          <select id={`${uid}-t`} value={ambient} onChange={(e) => setAmbient(Number(e.target.value))} className={field}>
            {[35, 40, 45, 50, 55].map((t) => <option key={t} value={t}>{t} °C</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-alt`} className="text-sm font-bold text-ink">{c.altitude}</label>
          <input id={`${uid}-alt`} type="number" inputMode="numeric" min={0} max={4000} step={50} value={altitude} dir="ltr" onChange={(e) => setAltitude(Math.min(4000, Math.max(0, Number(e.target.value) || 0)))} className={field} />
        </div>
      </div>
      <p className="-mt-2 text-xs text-muted">{c.derateNote(Math.round(a.derate * 100))}</p>
      <Range value={growth} onChange={setGrowth} min={0} max={30} step={1} label={c.growth} suffix="%" dir={dir} />
    </div>
  );

  /* ------------------------------------------------------------ Step 3: starting & quality */
  const qualityStep = (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold text-ink">{c.dip}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={c.dip}>
          {DIP_LIMITS.map((d) => (
            <button key={d} type="button" role="radio" aria-checked={dipLimit === d} onClick={() => setDipLimit(d)} className={cn("rounded-2xl border p-3 text-start text-sm font-semibold transition", dipLimit === d ? "border-brand-500 bg-brand-50 text-ink ring-2 ring-brand-500/30" : "border-line text-zinc-700 hover:border-zinc-400")}>
              {c.dipOpts[d]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold text-ink">{c.sequencing}</p>
        <Seg label={c.sequencing} value={together} onChange={setTogether} options={[[false, c.staggered], [true, c.together]]} />
      </div>
      {duty === "prime" && <Range value={avgLoad} onChange={setAvgLoad} min={40} max={100} step={5} label={c.avgLoad} suffix="%" dir={dir} />}
    </div>
  );

  /* ------------------------------------------------------------ Result */
  const stat = (k: string, v: string) => (
    <div key={k} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <dt className="text-xs text-white/70">{k}</dt>
      <dd className="mt-1 font-bold" dir="ltr">{v}</dd>
    </div>
  );

  const resultView = (
    <div ref={resultRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
      <div className="on-dark relative overflow-hidden rounded-2xl bg-navy-950 p-6 text-white sm:p-8">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{c.minRating(input.duty)}</p>
            <p className="mt-2 text-5xl font-extrabold tracking-tight">
              <span dir="ltr">{n(input.duty === "prime" ? min.primeKva : min.standbyKva)}</span> <span className="text-2xl text-brand-400">{ar ? "ك.ف.أ" : "kVA"}</span>
            </p>
            <p className="mt-2 text-sm text-white/80">
              {c.sizedBy}: <strong className="text-white">{CONSTRAINT_LABEL[min.binding][locale]}</strong>
              {min.standard && <> · {c.standardSize}: <strong className="text-white" dir="ltr">{min.standard} kVA</strong></>}
            </p>
            {best && (
              <div className="mt-5 rounded-xl bg-brand-500/10 p-4 ring-1 ring-brand-400/30">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-400">{c.bestFit}</p>
                <p className="mt-1 text-2xl font-extrabold" dir="ltr">{fitName(best)}</p>
                <p className="text-sm text-white/80">
                  {brand(best.model.brand)} {best.model.engine} · <span dir="ltr">{n(best.model.standbyKva)}/{n(best.model.primeKva)} kVA</span>
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {best.units > 1 ? c.sync : <>{c.ats}: <strong className="text-white" dir="ltr">{best.atsAmps} A</strong>{ats && <> · <Link href={`/products/${ats.slug}`} className="text-brand-400 underline underline-offset-4">{ar ? ats.name_ar : ats.name_en}</Link></>}</>}
                </p>
              </div>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-3 self-start text-center text-sm sm:grid-cols-3">
            {stat(c.running, `${n(a.runningKw, 1)} kW`)}
            {stat(c.kvaRun, `${n(a.runningKva, 1)} kVA`)}
            {stat(c.pfOverall, n(a.pf, 2))}
            {stat(c.current, `${n(a.currentA)} A`)}
            {a.largestMotor && stat(c.motorStart, `${n(a.stepKva)} kVA`)}
            {a.nonLinearShare > 0 && stat(c.alt, `${n(a.alternatorKva)} kVA`)}
          </dl>
        </div>
      </div>

      {soft && <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm font-semibold text-zinc-800">{c.softStart(fitName(soft.fit), soft.savingKva)}</p>}

      <div className="mt-6">
        <h3 className="text-lg font-extrabold text-ink">{c.picks}</h3>
        {picks.length ? (
          <div className="relative mt-3 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[40rem] text-start text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  {c.pickCols.map((h) => <th key={h} scope="col" className="px-3 py-2.5 text-start">{h}</th>)}
                  <th scope="col" className="px-3 py-2.5"><span className="sr-only">{c.quote}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {picks.map((f, i) => (
                  <tr key={f.model.slug} className={i === 0 ? "bg-brand-50" : undefined}>
                    <th scope="row" className="px-3 py-3 text-start">
                      <Link href={`/models/${f.model.slug}`} className="font-bold text-ink hover:text-brand-700 hover:underline" dir="ltr">{fitName(f)}</Link>
                      <span className="block text-xs text-muted">{brand(f.model.brand)} {f.model.engine}</span>
                    </th>
                    <td className="px-3 py-3 tabular-nums" dir="ltr">{n(f.model.standbyKva)} / {n(f.model.primeKva)}</td>
                    <td className="px-3 py-3 tabular-nums" dir="ltr">{n(f.loadPct)}%</td>
                    <td className="px-3 py-3 tabular-nums" dir="ltr">{a.stepKva ? `${n(f.dipPct, 1)}%` : "—"}</td>
                    <td className="px-3 py-3 tabular-nums">{f.fuelLph != null ? <span dir="ltr">{n(f.fuelLph, 1)} {c.perHour}</span> : <span className="text-muted">{c.onRequest}</span>}</td>
                    <td className="px-3 py-3 tabular-nums">{f.tankHours != null ? <span dir="ltr">≈ {n(f.tankHours)} {c.hours}</span> : "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                        <Link href={`/models/${f.model.slug}`} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
                          <FileText className="size-4" aria-hidden />
                          {c.datasheet}
                        </Link>
                        <Link href={`/configurator?model=${f.model.slug}${f.units > 1 ? `&units=${Math.min(4, f.units)}` : ""}`} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
                          <Box className="size-4" aria-hidden />
                          3D
                        </Link>
                        <a
                          href={whatsappUrl(`${waMessage}\n→ ${fitName(f)}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            trackEvent("calculator_quote_click", { kva: f.model.standbyKva, product: f.model.slug, channel: "whatsapp" });
                            trackEvent("whatsapp_click", { location: "calculator_match", product: f.model.slug });
                          }}
                          className="inline-flex items-center gap-1 font-bold text-emerald-500 hover:underline"
                        >
                          <WhatsAppIcon className="size-4" />
                          {c.quote}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">{c.noPick}</p>
        )}
      </div>

      {noteList.filter((k) => c.noteText[k]).length > 0 && (
        <ul className="mt-5 space-y-2">
          {noteList.filter((k) => c.noteText[k]).map((k) => (
            <li key={k} className="flex gap-2 text-sm leading-6 text-muted">
              <AlertTriangle className="mt-1 size-4 shrink-0 text-amber-500" aria-hidden />
              {c.noteText[k]}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("calculator_quote_click", { kva: best?.model.standbyKva ?? 0, channel: "whatsapp" });
            trackEvent("whatsapp_click", { location: "calculator_result" });
          }}
          className={buttonVariants({ variant: "whatsapp", size: "lg" })}
        >
          <WhatsAppIcon />
          {c.whatsapp}
        </a>
        <Button
          type="button"
          variant="primary"
          size="lg"
          aria-expanded={showForm}
          onClick={() => {
            setShowForm(true);
            trackEvent("calculator_quote_click", { kva: best?.model.standbyKva ?? 0, channel: "form" });
          }}
        >
          {c.form}
        </Button>
      </div>
      {showForm && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <LeadForm source="calculator" calculatedKva={best ? best.model.standbyKva * best.units : Math.round(min.standbyKva)} calcSubmissionId={submissionId} productSlug={best?.model.slug} productName={best ? fitName(best) : undefined} defaultMessage={waMessage} />
        </div>
      )}
      <p className="mt-4 text-xs leading-5 text-muted">{c.disclaimer}</p>
    </div>
  );

  /* ------------------------------------------------------------ Widget */
  if (widget) {
    return (
      <div className="rounded-3xl border border-line bg-navy-900 p-5 shadow-[0_30px_60px_-30px_rgb(10_10_11/0.35)] sm:p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <Zap className="size-5 text-brand-600" aria-hidden />
          {c.title}
        </div>
        <label htmlFor={`${uid}-wkw`} className="mt-5 block text-sm font-bold text-ink">{c.widgetKw}</label>
        <input id={`${uid}-wkw`} type="number" inputMode="decimal" min={0} max={20000} value={kw} dir="ltr" onChange={(e) => setKw(Math.max(0, Number(e.target.value) || 0))} className={cn(field, "text-lg")} />
        <p className="mt-2 text-xs text-muted">{c.widgetHint}</p>
        {showResult && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-navy-950 p-4 text-white">
              <p className="text-xs text-white/70">{c.minRating("standby")}</p>
              <p className="mt-1 text-3xl font-extrabold" dir="ltr">{n(min.standbyKva)} <span className="text-base text-brand-400">kVA</span></p>
            </div>
            {best && (
              <Link href={`/models/${best.model.slug}`} className="rounded-2xl border border-line p-4 hover:border-brand-500">
                <p className="text-xs text-muted">{c.bestFit}</p>
                <p className="mt-1 text-xl font-extrabold text-ink" dir="ltr">{fitName(best)}</p>
                <p className="text-xs text-muted">{brand(best.model.brand)} · {picks.length > 1 && `+${picks.length - 1}`}</p>
              </Link>
            )}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/calculator" className={buttonVariants({ variant: "outline", size: "lg" })}>{c.fullCalc}</Link>
          {showResult && (
            <a href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { location: "calculator_widget" })} className={buttonVariants({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon />
              {c.whatsapp}
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ Wizard */
  return (
    <div className="rounded-3xl border border-line bg-navy-900 p-5 shadow-[0_30px_60px_-30px_rgb(10_10_11/0.35)] sm:p-8">
      <ol className="grid grid-cols-4 gap-2" aria-label={c.title}>
        {c.steps.map((s, i) => {
          const idx = i + 1;
          return (
            <li key={s}>
              <button type="button" disabled={idx > step && !valid} onClick={() => (valid || idx === 1) && setStep(idx)} aria-current={step === idx ? "step" : undefined} aria-label={`${idx}. ${s}`} className="group w-full text-start disabled:cursor-not-allowed">
                <span className={cn("block h-1.5 rounded-full transition", step >= idx ? "bg-brand-500" : "bg-zinc-200")} />
                <span className={cn("mt-2 hidden text-xs font-bold sm:block", step === idx ? "text-ink" : "text-muted")}>{idx}. {s}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm font-semibold text-muted sm:hidden">{c.stepOf(step)} — {c.steps[step - 1]}</p>

      <div className="mt-8 min-h-64">
        {step === 1 && loadStep}
        {step === 2 && siteStep}
        {step === 3 && qualityStep}
        {step === 4 && resultView}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="flip-rtl" aria-hidden />
            {c.back}
          </Button>
        ) : (
          <span />
        )}
        {step < 3 && (
          <Button type="button" variant="dark" disabled={!valid} onClick={() => setStep((s) => s + 1)}>
            {c.next}
            <ArrowRight className="flip-rtl" aria-hidden />
          </Button>
        )}
        {step === 3 && (
          <Button type="button" variant="primary" disabled={!valid} onClick={() => setStep(4)}>
            <Zap aria-hidden />
            {c.calculate}
          </Button>
        )}
        {step === 4 && (
          <Button type="button" variant="outline" onClick={() => { setStep(1); setShowForm(false); }}>
            <RotateCcw aria-hidden />
            {c.restart}
          </Button>
        )}
      </div>
    </div>
  );
}

const SITE_LABEL: Record<SiteType, { en: string; ar: string }> = {
  residential: { en: "Villa / residential", ar: "فيلا / سكني" },
  commercial: { en: "Commercial / office", ar: "تجاري / مكاتب" },
  industrial: { en: "Industrial / factory", ar: "صناعي / مصنع" },
  construction: { en: "Construction site", ar: "موقع إنشاء" },
  event: { en: "Event / temporary", ar: "فعاليات / مؤقت" },
};
