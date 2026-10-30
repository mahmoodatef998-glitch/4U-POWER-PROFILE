import type { GensetBrand } from "@/content/genset-types";
import { amps400, STANDARD_ATS_AMPS, STANDARD_KVA } from "./calculator";
import type { L10n } from "./utils";

/**
 * Generator sizing engine — the method manufacturer sizing tools use (steady-state load, motor-starting step,
 * non-linear loads, site derating, duty rating), applied to every 4U model.
 *
 * Basis:
 *  - Ratings (ISO 8528-1): standby (ESP) for mains-failure use; prime (PRP) for unlimited hours at variable load with
 *    a 24-hour average load factor limit (80 % on the Perkins / Cummins / Kubota sheets, 70 % on the Baudouin sheets).
 *  - Motor locked-rotor kVA from NEC Table 430.7(B), code letter G (≤ 6.29 kVA/hp); reduced-voltage starters cut it to
 *    ≈ 33 % (star-delta), 42 % (autotransformer 65 % tap), 50 % (soft starter at 300 % current limit).
 *  - Voltage dip on a load step ≈ X·SkVA / (kVA + X·SkVA) with a typical brushless-alternator reactance X.
 *    Typical limits: 15 % for fire pumps and sensitive controls, 20–30 % for general motor loads.
 *  - Non-linear loads (UPS, drives, chargers) need a larger alternator: ×1.15 (12-pulse) … ×2 (6-pulse, unfiltered).
 *  - Light load below 30 % of rating for long periods causes wet stacking.
 * Indicative: final selection is confirmed against the load schedule, alternator motor-starting curves and site survey.
 */

export type Duty = "standby" | "prime";
export type StartMethod = "dol" | "star_delta" | "autotx" | "soft" | "vfd";
export type Harmonics = "linear" | "igbt" | "twelve_pulse" | "six_pulse";
export type LoadKind = "lighting" | "resistive" | "sockets" | "motor" | "hvac" | "lift" | "ups" | "it" | "drive" | "welder";

/** Typical running power factor, motor behaviour and harmonic class of each load family. */
export const LOAD_KINDS: Record<LoadKind, { label: L10n; pf: number; motor: boolean; start?: StartMethod; harmonics: Harmonics }> = {
  lighting: { label: { en: "Lighting (LED)", ar: "إنارة LED" }, pf: 0.95, motor: false, harmonics: "linear" },
  resistive: { label: { en: "Heaters / water heaters / ovens", ar: "سخانات وأفران" }, pf: 1, motor: false, harmonics: "linear" },
  sockets: { label: { en: "Sockets & small power", ar: "مقابس وأحمال صغيرة" }, pf: 0.9, motor: false, harmonics: "linear" },
  motor: { label: { en: "Motor / pump / fan", ar: "محرك / مضخة / مروحة" }, pf: 0.85, motor: true, start: "dol", harmonics: "linear" },
  hvac: { label: { en: "AC / chiller compressor", ar: "ضاغط تكييف / تشلر" }, pf: 0.85, motor: true, start: "dol", harmonics: "linear" },
  lift: { label: { en: "Lift / elevator", ar: "مصعد" }, pf: 0.85, motor: true, start: "vfd", harmonics: "six_pulse" },
  ups: { label: { en: "UPS", ar: "UPS" }, pf: 0.95, motor: false, harmonics: "igbt" },
  it: { label: { en: "IT / servers / electronics", ar: "خوادم وأجهزة إلكترونية" }, pf: 0.95, motor: false, harmonics: "linear" },
  drive: { label: { en: "Variable-speed drive (VFD)", ar: "محرك بمغير سرعة VFD" }, pf: 0.95, motor: true, start: "vfd", harmonics: "six_pulse" },
  welder: { label: { en: "Welding machine", ar: "ماكينة لحام" }, pf: 0.7, motor: false, harmonics: "six_pulse" },
};

/** Starting kVA as a share of direct-on-line locked-rotor kVA (VFD: no inrush, ≈ 1.2 × running kVA). */
export const START_METHODS: Record<StartMethod, { label: L10n; factor: number }> = {
  dol: { label: { en: "Direct-on-line (DOL)", ar: "تشغيل مباشر DOL" }, factor: 1 },
  star_delta: { label: { en: "Star-delta", ar: "ستار-دلتا" }, factor: 0.33 },
  autotx: { label: { en: "Autotransformer (65 % tap)", ar: "محول ذاتي (65%)" }, factor: 0.42 },
  soft: { label: { en: "Soft starter (300 % limit)", ar: "سوفت ستارتر (300%)" }, factor: 0.5 },
  vfd: { label: { en: "VFD / inverter", ar: "إنفرتر / VFD" }, factor: 0 },
};

/** Alternator kVA multiplier for non-linear current. */
export const HARMONICS: Record<Harmonics, { label: L10n; factor: number }> = {
  linear: { label: { en: "Linear", ar: "خطي" }, factor: 1 },
  igbt: { label: { en: "IGBT / active front end (THDi < 5 %)", ar: "IGBT / فلتر نشط (THDi أقل من 5%)" }, factor: 1.2 },
  twelve_pulse: { label: { en: "12-pulse rectifier", ar: "مقوّم 12 نبضة" }, factor: 1.15 },
  six_pulse: { label: { en: "6-pulse rectifier, no filter", ar: "مقوّم 6 نبضات بدون فلتر" }, factor: 2 },
};

export const DIP_LIMITS = [10, 15, 20, 30] as const;

/** 24-hour average load factor allowed on the prime rating, per the brand datasheets. */
export const PRIME_LOAD_FACTOR: Record<GensetBrand, number> = { Perkins: 0.8, Cummins: 0.8, Kubota: 0.8, Baudouin: 0.7, "Lister Petter": 0.8 };

const LR_KVA_PER_HP = 6.29; // NEC 430.7(B) code G, upper bound
const KW_PER_HP = 0.746;
const MOTOR_EFF = 0.9; // converts running input kW to shaft hp
const START_PF = 0.35; // power factor while a motor is locked / accelerating
const VFD_START = 1.2;
export const ALT_REACTANCE = 0.12; // typical sub-transient reactance of brushless generator alternators (per unit)
const GEN_PF = 0.8;
const PRIME_TO_STANDBY = 1.1;

export type LoadLine = { id: string; kind: LoadKind; label?: L10n; kw: number; qty: number; pf?: number; start?: StartMethod; harmonics?: Harmonics };

export type SizingInput = {
  duty: Duty;
  ambientC: number;
  altitudeM: number;
  /** future growth, % */
  growthPct: number;
  /** maximum voltage dip on the worst load step, % */
  dipLimitPct: number;
  /** share of the connected load running at the same time, % */
  simultaneityPct: number;
  /** prime duty: 24-hour average as % of the running load */
  avgLoadPct: number;
  /** every load is switched on in one step (no sequencing after mains return) */
  startTogether: boolean;
  lines: LoadLine[];
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));

/** Site derating: full output to 40 °C and 1000 m, then ≈ 1 % per °C and ≈ 4 % per 300 m (typical published derates). */
export function siteDerate(ambientC: number, altitudeM: number) {
  const t = 1 - 0.01 * Math.max(0, ambientC - 40);
  const a = 1 - 0.04 * Math.max(0, (altitudeM - 1000) / 300);
  return clamp(t * a, 0.5, 1);
}

type MotorStart = { line: LoadLine; unitKw: number; skva: number; skw: number };

export type LoadAnalysis = {
  runningKw: number;
  runningKvar: number;
  runningKva: number;
  pf: number;
  /** alternator kVA after the non-linear multiplier */
  alternatorKva: number;
  nonLinearShare: number;
  largestMotor: MotorStart | null;
  /** kVA drawn on the worst load step (largest motor start, or everything at once) */
  stepKva: number;
  /** kW on the engine during that step */
  stepPeakKw: number;
  currentA: number;
  derate: number;
  /** requirements, already including growth */
  needKw: number;
  needAltKva: number;
};

export function analyse(input: SizingInput): LoadAnalysis {
  const sim = clamp(input.simultaneityPct, 10, 100) / 100;
  const growth = 1 + clamp(input.growthPct, 0, 100) / 100;
  let P = 0;
  let Q = 0;
  let extraAlt = 0;
  let nonLinearKva = 0;
  let stepAllKva = 0;
  let stepAllKw = 0;
  const motors: MotorStart[] = [];

  for (const line of input.lines) {
    const qty = Math.max(0, Math.round(line.qty));
    const kw = Math.max(0, line.kw);
    if (!qty || !kw) continue;
    const kind = LOAD_KINDS[line.kind];
    const pf = clamp(line.pf ?? kind.pf, 0.5, 1);
    const p = kw * qty * sim;
    const s = p / pf;
    P += p;
    Q += p * Math.tan(Math.acos(pf));
    const h = HARMONICS[line.harmonics ?? kind.harmonics].factor;
    extraAlt += s * (h - 1);
    if (h > 1) nonLinearKva += s;

    if (kind.motor) {
      const method = line.start ?? kind.start ?? "dol";
      const runKva = kw / pf;
      const skva = method === "vfd" ? VFD_START * runKva : ((kw * MOTOR_EFF) / KW_PER_HP) * LR_KVA_PER_HP * START_METHODS[method].factor;
      const skw = method === "vfd" ? VFD_START * kw : skva * START_PF;
      motors.push({ line, unitKw: kw, skva, skw });
      stepAllKva += skva * qty;
      stepAllKw += skw * qty;
    } else {
      stepAllKva += kw * qty / pf;
      stepAllKw += kw * qty;
    }
  }

  const S = Math.hypot(P, Q);
  const largest = motors.reduce<MotorStart | null>((a, m) => (!a || m.skva > a.skva ? m : a), null);
  const stepKva = input.startTogether ? stepAllKva : (largest?.skva ?? 0);
  const stepPeakKw = input.startTogether ? stepAllKw : largest ? P - largest.unitKw + largest.skw : P;

  return {
    runningKw: P,
    runningKvar: Q,
    runningKva: S,
    pf: S ? P / S : 1,
    alternatorKva: S + extraAlt,
    nonLinearShare: S ? nonLinearKva / S : 0,
    largestMotor: largest,
    stepKva,
    stepPeakKw,
    currentA: amps400(S),
    derate: siteDerate(input.ambientC, input.altitudeM),
    needKw: P * growth,
    needAltKva: (S + extraAlt) * growth,
  };
}

export type Constraint = "kw" | "kva" | "dip" | "start" | "prime_avg";

export const CONSTRAINT_LABEL: Record<Constraint, L10n> = {
  kw: { en: "Running kW (engine)", ar: "القدرة الفعلية kW (المحرك)" },
  kva: { en: "Running kVA (alternator)", ar: "القدرة الظاهرية kVA (الدينامو)" },
  dip: { en: "Voltage dip on motor start", ar: "هبوط الجهد عند بدء المحرك" },
  start: { en: "Engine power during motor start", ar: "قدرة المحرك أثناء بدء التشغيل" },
  prime_avg: { en: "Prime 24 h average load", ar: "متوسط الحمل لـ 24 ساعة (Prime)" },
};

/** Minimum generic rating in the chosen duty, and which requirement sets it. */
export function minimumRating(input: SizingInput, a: LoadAnalysis) {
  const d = clamp(input.dipLimitPct, 5, 40) / 100;
  const dutyToStandby = input.duty === "prime" ? PRIME_TO_STANDBY : 1;
  // everything expressed as STANDBY kVA so it can be compared on one scale
  const req: Record<Constraint, number> = {
    kw: (a.needKw / GEN_PF / a.derate) * dutyToStandby,
    kva: (a.needAltKva / a.derate) * dutyToStandby,
    dip: a.stepKva ? (ALT_REACTANCE * a.stepKva * (1 - d)) / d : 0,
    start: a.stepPeakKw / GEN_PF / a.derate,
    prime_avg: input.duty === "prime" ? ((a.runningKw * clamp(input.avgLoadPct, 10, 100)) / 100 / 0.7 / GEN_PF / a.derate) * PRIME_TO_STANDBY : 0,
  };
  const binding = (Object.keys(req) as Constraint[]).reduce((b, k) => (req[k] > req[b] ? k : b), "kw");
  const standbyKva = req[binding];
  const standard = STANDARD_KVA.find((k) => k >= standbyKva) ?? null;
  return { standbyKva, primeKva: standbyKva / PRIME_TO_STANDBY, binding, req, standard };
}

/** The slice of a model the sizing needs (kept small so it can be sent to the browser). */
export type SizingModel = {
  slug: string;
  code: string;
  brand: GensetBrand;
  engine: string;
  standbyKva: number;
  standbyKw: number;
  primeKva: number;
  primeKw: number;
  /** L/h at 50 / 75 / 100 % prime and at standby */
  fuel: [number | null, number, number, number | null] | null;
  tankL: number | null;
};

export type ModelFit = {
  model: SizingModel;
  units: number;
  ok: boolean;
  fails: Constraint[];
  /** running load as % of the derated duty rating */
  loadPct: number;
  dipPct: number;
  fuelLph: number | null;
  tankHours: number | null;
  atsAmps: number;
};

/**
 * Fuel use at a fraction of the prime rating: interpolated between datasheet points; below the lowest point it follows
 * the usual diesel "Willans line" (fuel ≈ 10 % no-load + 90 % proportional), anchored to that point.
 */
export function fuelAt(m: SizingModel, primeFraction: number): number | null {
  if (!m.fuel) return null;
  const [p50, p75, p100, sb] = m.fuel;
  const pts: [number, number][] = [];
  if (p50 != null) pts.push([0.5, p50]);
  pts.push([0.75, p75], [1, p100]);
  if (sb != null) pts.push([m.standbyKw / m.primeKw, sb]);
  const x = Math.max(0.05, primeFraction);
  const [x0, y0] = pts[0]!;
  let y: number;
  if (x <= x0) y = (y0 * (0.1 + 0.9 * x)) / (0.1 + 0.9 * x0);
  else {
    let i = pts.findIndex(([px]) => px >= x);
    if (i === -1) i = pts.length - 1;
    const [xa, ya] = pts[i - 1]!;
    const [xb, yb] = pts[i]!;
    y = ya + ((yb - ya) * (x - xa)) / (xb - xa);
  }
  return Math.round(y * 100) / 100;
}

export function evaluate(m: SizingModel, input: SizingInput, a: LoadAnalysis, units = 1): ModelFit {
  const d = clamp(input.dipLimitPct, 5, 40) / 100;
  const dutyKva = (input.duty === "prime" ? m.primeKva : m.standbyKva) * units;
  const dutyKw = (input.duty === "prime" ? m.primeKw : m.standbyKw) * units;
  const sbKva = m.standbyKva * units;
  const sbKw = m.standbyKw * units;
  const dip = a.stepKva ? (ALT_REACTANCE * a.stepKva) / (sbKva + ALT_REACTANCE * a.stepKva) : 0;
  const fails: Constraint[] = [];
  if (a.needKw > dutyKw * a.derate) fails.push("kw");
  if (a.needAltKva > dutyKva * a.derate) fails.push("kva");
  if (dip > d + 1e-9) fails.push("dip");
  if (a.stepPeakKw > sbKw * a.derate) fails.push("start");
  if (input.duty === "prime" && (a.runningKw * clamp(input.avgLoadPct, 10, 100)) / 100 > PRIME_LOAD_FACTOR[m.brand] * m.primeKw * units * a.derate) fails.push("prime_avg");
  const perUnitKw = a.runningKw / units;
  const fuel = fuelAt(m, perUnitKw / m.primeKw);
  const fuelLph = fuel != null ? fuel * units : null;
  return {
    model: m,
    units,
    ok: fails.length === 0,
    fails,
    loadPct: dutyKw ? (a.runningKw / (dutyKw * a.derate)) * 100 : 0,
    dipPct: dip * 100,
    fuelLph,
    tankHours: fuelLph && m.tankL ? (m.tankL * units) / fuelLph : null,
    atsAmps: STANDARD_ATS_AMPS.find((x) => x >= amps400(sbKva)) ?? Math.ceil(amps400(sbKva) / 100) * 100,
  };
}

/**
 * Smallest passing model of each brand. Only when no single set of any brand is big enough: N identical sets in
 * parallel, from the brands whose largest set is a sensible building block (≥ 500 kVA).
 */
export function recommend(models: SizingModel[], input: SizingInput, a: LoadAnalysis): ModelFit[] {
  if (a.runningKw <= 0) return [];
  const byBrand = new Map<GensetBrand, SizingModel[]>();
  for (const m of [...models].sort((x, y) => x.standbyKva - y.standbyKva || x.code.localeCompare(y.code))) {
    byBrand.set(m.brand, [...(byBrand.get(m.brand) ?? []), m]);
  }
  const size = (f: ModelFit) => f.model.standbyKva * f.units;
  const order = (x: ModelFit, y: ModelFit) => x.units - y.units || size(x) - size(y) || (x.fuelLph ?? 1e9) - (y.fuelLph ?? 1e9);

  const singles = [...byBrand.values()].flatMap((list) => {
    const f = list.map((m) => evaluate(m, input, a)).find((x) => x.ok);
    return f ? [f] : [];
  });
  if (singles.length) return singles.sort(order);

  const parallel: ModelFit[] = [];
  for (const list of byBrand.values()) {
    const top = list[list.length - 1];
    if (!top || top.standbyKva < 500) continue;
    for (let n = 2; n <= 8; n++) {
      const f = evaluate(top, input, a, n);
      if (f.ok) {
        parallel.push(f);
        break;
      }
    }
  }
  return parallel.sort(order);
}

export type SizingNote = "light_load" | "harmonics" | "sequencing" | "soft_start" | "derate" | "parallel";

export function notes(input: SizingInput, a: LoadAnalysis, best: ModelFit | undefined, softStartSaving: number | null): SizingNote[] {
  const out: SizingNote[] = [];
  if (best && best.loadPct < 30) out.push("light_load");
  if (a.nonLinearShare > 0.2) out.push("harmonics");
  if (!input.startTogether && a.largestMotor) out.push("sequencing");
  if (softStartSaving) out.push("soft_start");
  if (a.derate < 0.999) out.push("derate");
  if (best && best.units > 1) out.push("parallel");
  return out;
}

/** If the largest motor is started DOL, how small could the set be with a soft starter instead? */
export function softStartAlternative(models: SizingModel[], input: SizingInput, a: LoadAnalysis, best: ModelFit | undefined) {
  const big = a.largestMotor;
  if (!big || !best || (big.line.start ?? LOAD_KINDS[big.line.kind].start) !== "dol") return null;
  const alt: SizingInput = { ...input, lines: input.lines.map((l) => (l.id === big.line.id ? { ...l, start: "soft" as const } : l)) };
  const altBest = recommend(models, alt, analyse(alt))[0];
  if (!altBest) return null;
  const saving = best.model.standbyKva * best.units - altBest.model.standbyKva * altBest.units;
  return saving > 0 ? { fit: altBest, savingKva: saving } : null;
}

export type SiteType = "residential" | "commercial" | "industrial" | "construction" | "event";
export const SITE_TYPES: SiteType[] = ["residential", "commercial", "industrial", "construction", "event"];

const line = (id: string, kind: LoadKind, en: string, ar: string, kw: number, qty: number, extra: Partial<LoadLine> = {}): LoadLine => ({
  id,
  kind,
  label: { en, ar },
  kw,
  qty,
  ...extra,
});

/** Typical load schedules per site type — every value is editable in the calculator. */
export const SITE_PRESETS: Record<SiteType, LoadLine[]> = {
  residential: [
    line("r-ac", "hvac", "Split AC 2 TR", "مكيف سبليت 2 طن", 2.5, 4),
    line("r-light", "lighting", "Lighting", "الإنارة", 3, 1),
    line("r-pump", "motor", "Water pump", "مضخة مياه", 1.5, 1),
    line("r-kitchen", "sockets", "Kitchen & sockets", "المطبخ والمقابس", 4, 1),
    line("r-heater", "resistive", "Water heaters", "سخانات مياه", 3, 2),
  ],
  commercial: [
    line("c-ac", "hvac", "Package AC 10 TR", "تكييف باكيج 10 طن", 12, 3),
    line("c-light", "lighting", "Lighting", "الإنارة", 10, 1),
    line("c-ups", "ups", "IT / UPS", "خوادم / UPS", 8, 1),
    line("c-lift", "lift", "Passenger lift", "مصعد ركاب", 11, 1),
    line("c-small", "sockets", "Sockets & small power", "مقابس وأحمال صغيرة", 15, 1),
  ],
  industrial: [
    line("i-m37", "motor", "Motor 37 kW", "محرك 37 ك.و", 37, 1),
    line("i-m15", "motor", "Motor 15 kW", "محرك 15 ك.و", 15, 3),
    line("i-comp", "motor", "Air compressor 22 kW", "ضاغط هواء 22 ك.و", 22, 1, { start: "star_delta" }),
    line("i-light", "lighting", "High-bay lighting", "إنارة صناعية", 12, 1),
    line("i-chiller", "hvac", "Process chiller", "مبرد تشغيل", 30, 1, { start: "star_delta" }),
  ],
  construction: [
    line("k-crane", "drive", "Tower crane (inverter)", "رافعة برجية (إنفرتر)", 45, 1),
    line("k-hoist", "motor", "Material hoist", "رافعة مواد", 15, 1),
    line("k-weld", "welder", "Welding machines", "ماكينات لحام", 10, 2),
    line("k-office", "hvac", "Site cabins AC", "تكييف الكبائن", 6, 3),
    line("k-pump", "motor", "Dewatering pump", "مضخة نزح", 7.5, 2),
  ],
  event: [
    line("e-light", "lighting", "Stage & LED lighting", "إنارة المسرح وLED", 20, 1),
    line("e-sound", "it", "Sound system", "نظام الصوت", 10, 1),
    line("e-cater", "resistive", "Catering", "معدات الضيافة", 15, 1),
    line("e-ac", "hvac", "Tent AC unit", "مكيف خيمة", 10, 3),
    line("e-screen", "it", "LED screens", "شاشات LED", 6, 2),
  ],
};
