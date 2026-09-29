import type { Product } from "./types";
import type { L10n } from "./utils";

/** Standard generator ratings (kVA, standby). The recommendation rounds UP to one of these. */
export const STANDARD_KVA = [
  10, 15, 20, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 550, 630, 750, 800, 900, 1000, 1250,
  1500, 1750, 2000, 2250, 2500,
] as const;

export const STANDARD_ATS_AMPS = [63, 100, 125, 160, 200, 250, 315, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000] as const;

export const MAX_SINGLE_KVA = 2500;

export type LoadType = "residential" | "commercial" | "industrial" | "construction" | "event";
export const LOAD_TYPES: LoadType[] = ["residential", "commercial", "industrial", "construction", "event"];

export type LoadItem = {
  id: string;
  label: L10n;
  kw: number;
  /** Starting kVA multiple of running kVA for DOL motors; 1 = no significant inrush. */
  surge: number;
  qty: number;
};

const item = (id: string, en: string, ar: string, kw: number, qty: number, surge = 1): LoadItem => ({
  id,
  label: { en, ar },
  kw,
  surge,
  qty,
});

/** Typical-load presets per site type — editable by the user (quantities). */
export const PRESETS: Record<LoadType, LoadItem[]> = {
  residential: [
    item("split_ac", "Split AC 2 ton", "مكيف سبليت 2 طن", 2.5, 4, 3),
    item("lighting", "Lighting & sockets", "إنارة ومقابس", 3, 1),
    item("water_pump", "Water pump 1.5 kW", "مضخة مياه 1.5 كيلوواط", 1.5, 1, 5),
    item("kitchen", "Kitchen appliances", "أجهزة المطبخ", 4, 1),
    item("water_heater", "Water heaters", "سخانات مياه", 3, 2),
  ],
  commercial: [
    item("package_ac", "Package AC unit 10 ton", "وحدة تكييف باكيج 10 طن", 12, 3, 3),
    item("lighting", "Lighting", "الإنارة", 10, 1),
    item("it", "IT / servers / UPS", "خوادم وأجهزة UPS", 8, 1),
    item("lift", "Passenger lift", "مصعد ركاب", 11, 1, 2.5),
    item("small_power", "Small power (sockets)", "مقابس وأحمال صغيرة", 15, 1),
  ],
  industrial: [
    item("motor_large", "Motor 37 kW (DOL)", "محرك 37 كيلوواط (بدء مباشر)", 37, 1, 6),
    item("motor_mid", "Motor 15 kW", "محرك 15 كيلوواط", 15, 3, 6),
    item("compressor", "Air compressor 22 kW", "ضاغط هواء 22 كيلوواط", 22, 1, 5),
    item("lighting", "High-bay lighting", "إنارة صناعية", 12, 1),
    item("chiller", "Process chiller 30 kW", "مبرد تشغيل 30 كيلوواط", 30, 1, 3),
  ],
  construction: [
    item("tower_crane", "Tower crane", "رافعة برجية", 45, 1, 3),
    item("hoist", "Material hoist", "رافعة مواد", 15, 1, 3),
    item("welder", "Welding machines", "ماكينات لحام", 10, 2, 1.5),
    item("site_office", "Site offices & cabins (AC)", "مكاتب الموقع والكبائن (مع تكييف)", 6, 3, 3),
    item("pump", "Dewatering pump", "مضخة نزح مياه", 7.5, 2, 5),
  ],
  event: [
    item("stage_lighting", "Stage & LED lighting", "إنارة المسرح وLED", 20, 1),
    item("sound", "Sound system", "نظام الصوت", 10, 1),
    item("catering", "Catering equipment", "معدات الضيافة", 15, 1),
    item("tent_ac", "Tent AC unit", "مكيف خيمة", 10, 3, 3),
    item("screens", "LED screens", "شاشات LED", 6, 2),
  ],
};

export type CalcInput =
  | { mode: "known_load"; unit: "kw"; kw: number; powerFactor: number; margin: number }
  | {
      mode: "known_load";
      unit: "amps";
      amps: number;
      voltage: number;
      phases: 1 | 3;
      powerFactor: number;
      margin: number;
    }
  | { mode: "site_builder"; loadType: LoadType; items: LoadItem[]; powerFactor: number; margin: number };

export type CalcResult = {
  runningKw: number;
  runningKva: number;
  startingKva: number;
  requiredKva: number;
  recommendedKva: number;
  overRange: boolean;
  atsAmps: number;
  atsRating: number;
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function amps400(kva: number) {
  return (kva * 1000) / (Math.sqrt(3) * 400);
}

export function calculate(input: CalcInput): CalcResult {
  const pf = Math.min(Math.max(input.powerFactor, 0.6), 1);
  const margin = Math.min(Math.max(input.margin, 0), 50) / 100;

  let runningKw = 0;
  let runningKva = 0;
  let startingKva = 0;

  if (input.mode === "known_load") {
    if (input.unit === "kw") {
      runningKw = Math.max(0, input.kw);
      runningKva = runningKw / pf;
    } else {
      const factor = input.phases === 3 ? Math.sqrt(3) : 1;
      runningKva = (factor * input.voltage * Math.max(0, input.amps)) / 1000;
      runningKw = runningKva * pf;
    }
    startingKva = runningKva;
  } else {
    let largestExtra = 0;
    for (const it of input.items) {
      if (it.qty <= 0) continue;
      runningKw += it.kw * it.qty;
      // extra kVA drawn while the single largest motor starts (others already running)
      largestExtra = Math.max(largestExtra, ((it.surge - 1) * it.kw) / pf);
    }
    runningKva = runningKw / pf;
    // Diesel gensets tolerate short motor-start transients; allow a 1.5x transient capability on the rating.
    startingKva = (runningKva + largestExtra) / 1.5;
  }

  const requiredKva = Math.max(runningKva * (1 + margin), startingKva);
  const overRange = requiredKva > MAX_SINGLE_KVA;
  const recommendedKva = overRange
    ? Math.ceil(requiredKva / 50) * 50
    : (STANDARD_KVA.find((k) => k >= requiredKva) ?? MAX_SINGLE_KVA);

  const atsAmps = amps400(recommendedKva);
  const atsRating = STANDARD_ATS_AMPS.find((a) => a >= atsAmps) ?? Math.ceil(atsAmps / 100) * 100;

  return {
    runningKw: round1(runningKw),
    runningKva: round1(runningKva),
    startingKva: round1(startingKva),
    requiredKva: round1(requiredKva),
    recommendedKva,
    overRange,
    atsAmps: Math.round(atsAmps),
    atsRating,
  };
}

/** Catalog units whose kVA range covers the recommended rating, best fit first. */
export function matchProducts(products: Product[], kva: number, limit = 3) {
  return products
    .filter((p) => p.category === "generator" && p.kva_min != null && p.kva_max != null)
    .filter((p) => kva >= (p.kva_min as number) && kva <= (p.kva_max as number))
    .sort((a, b) => {
      // prefer diesel, then narrower range (more specific fit)
      const fuel = Number(b.fuel_type === "diesel") - Number(a.fuel_type === "diesel");
      if (fuel) return fuel;
      return ((a.kva_max as number) - (a.kva_min as number)) - ((b.kva_max as number) - (b.kva_min as number));
    })
    .slice(0, limit);
}

export function matchAts(products: Product[], kva: number) {
  return products.find(
    (p) => p.category === "ats_panel" && p.kva_min != null && p.kva_max != null && kva >= p.kva_min && kva <= p.kva_max,
  );
}
