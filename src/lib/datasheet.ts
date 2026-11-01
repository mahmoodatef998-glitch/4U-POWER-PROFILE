import details from "@/content/datasheet-details.json";
import type { GensetModel } from "@/content/genset-types";
import { ASPIRATION, brandName, gensetModels } from "./genset-models";
import { frameFamily, frameRating } from "@/content/alternator-ratings";
import { LIST_ALTERNATORS } from "@/content/list-alternators";
import { amps, sixtyHz } from "./quote";
import type { Locale } from "./utils";

/**
 * Everything the customer datasheet prints for one model (src/app/[locale]/models/[slug]/datasheet), built from the
 * model file (ratings, frames, fuel, dimensions — the checked figures) and, where the group's technical sheets give
 * more, from src/content/datasheet-details.json (engine, cooling, air, exhaust, alternator and controller detail).
 *
 * Engineering rules (owner, 1 Nov 2026: "take the decisions that don't hurt us"):
 * - Ratings, currents and 60 Hz figures come only from the corrected model data (held to the alternator), never
 *   from the source sheets. Currents are worked out at 400 V.
 * - A source value that fails a physical plausibility check is left out rather than printed (`hidden` lists them):
 *   fan and combustion air against swept volume and output, oil / coolant against displacement, fuel against output.
 * - Fuel figures were measured at the engine's own rating; where a set is now held to a smaller alternator they
 *   overstate consumption slightly, which errs on the safe side.
 * - No claim without a source: breaker make only where the sheet names it, tank running hours worked out from the
 *   tank and the fuel figures, no "brushless". Alternator: "4U · Leroy-Somer | Stamford" with the price list's frame(s),
 *   or "4U Power alternator" where the list offers only that (src/content/list-alternators.ts); Leroy-Somer family data
 *   (excitation, AVR, regulation, air flow) and the frame rating from src/content/alternator-ratings.ts.
 */

type Detail = {
  source: "main" | "baudouin";
  groups: { title: string; rows: [string, string][] }[];
  fuel?: { head: string[]; rows: string[][] } | null;
  breaker?: string | null;
  controllerFeatures?: string[];
};
const DETAILS = details as unknown as Record<string, Detail>;

export type Row = [label: string, value: string];
export type FuelPoint = { label: string; lph: number; highlight?: boolean };
export type Build = { name: string; dims: string; tank: string; weight: string; noise: string; highlight?: boolean };

export type Datasheet = {
  docNo: string;
  code: string;
  brandUpper: string;
  engine: string;
  controller: string | null;
  alternatorMake: string;
  prime: { kva: number; kw: number; amps: number };
  standby: { kva: number; kw: number; amps: number };
  sixty:
    | { kind: "rated"; prime: number; primeKw: number; standby: number; standbyKw: number; volts: string | null; engine?: string }
    | { kind: "fifty-only" }
    | { kind: "sixty-only"; fiftyHzModel: string | null }
    | { kind: "on-request" };
  /** the frequency the ratings above are at (60 only for a 60 Hz-only engine build) */
  hz: 50 | 60;
  fuel75: number | null;
  noiseDb: number | null;
  builds: Build[];
  buildsBadge: string;
  overview: string[];
  features: { icon: string; title: string; sub?: string }[];
  engineRows: Row[];
  coolingRows: Row[];
  alternatorRows: Row[];
  operatingRows: Row[];
  fuel: FuelPoint[];
  lubeRows: Row[];
  airRows: Row[];
  controllerFeatures: string[];
  enclosureRows: Row[];
  scope: string[];
  hidden: string[];
};

const n1 = (x: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(x);
const num = (s: string) => {
  const m = s.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};
/** "137 x 171 mm" → "137 × 171 mm", "6.2 kPA" → "6.2 kPa", "+ 1%" → "± 1 %"; text is otherwise kept as written. */
const clean = (v: string) =>
  v
    .replace(/(\d)\s*x\s*(\d)/g, "$1 × $2")
    .replace(/kPA\b/g, "kPa")
    .replace(/^\+\s*(\d)/, "± $1")
    .replace(/(\d)\s*%/g, "$1 %")
    .replace(/m³\/Sec\b/gi, "m³/s")
    .replace(/\s+/g, " ")
    .trim();
const sentence = (v: string) => (/^[A-Z][a-z]+(?:[- ][A-Z][a-z]+)+$/.test(v) ? v.charAt(0) + v.slice(1).toLowerCase() : v);

function detailRows(d: Detail | undefined, group: RegExp) {
  const rows: [string, string][] = [];
  for (const g of d?.groups ?? []) if (group.test(g.title)) rows.push(...g.rows);
  return rows;
}
const pick = (rows: [string, string][], label: RegExp) => rows.find(([k]) => label.test(k))?.[1] ?? null;

export function buildDatasheet(m: GensetModel, locale: Locale): Datasheet {
  const ar = locale === "ar";
  const L = (en: string, a: string) => (ar ? a : en);
  const d = DETAILS[m.code];
  const hidden: string[] = [];
  const keep = (label: string, value: string | null, ok: boolean) => {
    if (value && !ok) hidden.push(`${m.code} ${label}: ${value}`);
    return value && ok ? value : null;
  };
  const row = (label: string, value: string | null | undefined): Row[] => (value ? [[label, value]] : []);

  const engine = detailRows(d, /^Engine$/);
  const cooling = detailRows(d, /Cooling/);
  const lube = detailRows(d, /Lubrication/);
  const air = detailRows(d, /^Air/);
  const exhaust = detailRows(d, /Exhaust|Air & exhaust/);
  const alt = detailRows(d, /^Alternator$/);
  const altOp = detailRows(d, /Alternator operating/);
  const fuelSys = detailRows(d, /Fuel system/);

  // --- plausibility references -------------------------------------------------------------------------------
  const disp = m.displacementL;
  const swept = disp ? (disp * 1500) / 2 / 1000 : null; // m³/min of swept volume at 1500 rpm
  const charged = !!m.aspiration && m.aspiration !== "na";
  const kwm = m.standbyKw / 0.9; // rough engine output for ratio checks
  const flow = (v: string | null) => {
    if (!v) return null;
    const x = num(v);
    if (x == null) return null;
    return /m³\/s|m3\/s|\/sec/i.test(v) ? x * 60 : x;
  };
  const inRange = (x: number | null, lo: number, hi: number) => x != null && x >= lo && x <= hi;

  // --- engine ------------------------------------------------------------------------------------------------
  const cyl = m.cylinders ? `${m.cylinders} ${m.layout === "V" ? "in V" : "vertical in-line"}` : null;
  const cycle = pick(engine, /^Cycle$/) ? "4-stroke" : null;
  const cylCycle = pick(engine, /Cycle \/ cylinders/) ?? (cyl ? [cyl, cycle ?? "4-stroke"].join(" · ") : null);
  const govClass = pick(engine, /Governing class/);
  const governing =
    m.governing === "electronic" ? `Electronic${govClass ? ` · class ${govClass} (ISO 8528-1)` : ""}`
    : m.governing === "mechanical" ? `Mechanical${govClass ? ` · class ${govClass} (ISO 8528-1)` : ""}`
    : pick(engine, /^Governor$/);
  const skipEngine = /^(Cylinders|Cycle|Cycle \/ cylinders|Aspiration|Cooling|Governor|Governing class|Displacement|Bore|Rated speed|Type|Compression ratio|Charging alternator|Starter \/ charge alt\.|Lube oil filter)/;
  const engineRows: Row[] = [
    ...row(L("Make / model", "الماركة / الموديل"), `${m.brand} ${m.engine}`),
    ...row(L("Cylinders / cycle", "الأسطوانات / الدورة"), cylCycle ? clean(cylCycle) : null),
    ...row(L("Aspiration", "التنفس"), m.aspiration ? ASPIRATION[m.aspiration][0] : pick(engine, /Aspiration/)),
    ...row(L("Speed", "السرعة"), m.ratedHz === 60 ? "1800 rpm (60 Hz build)" : "1500 rpm"),
    ...row(L("Cooling", "التبريد"), m.cooling === "air" ? "Air cooled" : "Water cooled"),
    ...row(L("Governing", "منظم السرعة"), governing ? clean(governing) : null),
    ...row(L("Compression ratio", "نسبة الانضغاط"), (() => {
      const v = pick(engine, /Compression ratio/);
      return v ? (v.includes(":") ? v.replace(/\s*:\s*/, " : ") : `${v} : 1`) : null;
    })()),
    ...row(L("Displacement", "السعة"), disp ? `${n1(disp)} L` : pick(engine, /Displacement/)),
    ...row(L("Bore × stroke", "القطر × الشوط"), m.boreStrokeMm ? clean(`${m.boreStrokeMm} mm`) : pick(engine, /Bore/) && clean(pick(engine, /Bore/)!)),
    ...row(L("Charging alternator", "دينامو الشحن"), (() => {
      const v = pick(engine, /Charging alternator|Starter \/ charge alt\./);
      return v ? clean(v.replace(/(\d+)\s*AMPS?\b/i, "$1 A")) : null;
    })()),
    ...engine.filter(([k]) => !skipEngine.test(k)).map(([k, v]): Row => [k, clean(v)]),
    ...fuelSys.filter(([k]) => /Recommended fuel/.test(k)).map(([, v]): Row => [L("Fuel", "الوقود"), sentence(clean(v))]),
  ];

  // --- cooling & air ------------------------------------------------------------------------------------------
  const fan = pick(cooling, /Cooling fan air flow/);
  const fanOk = keep("cooling fan air flow", fan, inRange((flow(fan) ?? 0) / kwm, 0.4, 8));
  const fanLoad = pick(cooling, /Radiator fan load/);
  const fanLoadOk = keep("radiator fan load", fanLoad, inRange((num(fanLoad ?? "") ?? 0) / kwm, 0.005, 0.08));
  const heatP = pick(cooling, /Heat radiated to room \(PRP\)/);
  const heatE = pick(cooling, /Heat radiated to room \(ESP\)/);
  const heatOk = heatP && inRange((num(heatP) ?? 0) / m.primeKw, 0.02, 0.35);
  if (heatP && !heatOk) hidden.push(`${m.code} heat to room: ${heatP}`);
  const coolant = m.coolantL ?? num(pick(cooling, /Coolant capacity/) ?? "");
  const coolantOk = coolant && (!disp || inRange(coolant / disp, 0.8, 12)) ? coolant : null;
  if (coolant && !coolantOk) hidden.push(`${m.code} coolant: ${coolant} L`);
  const ambient = m.ambientC === undefined ? 50 : m.ambientC;
  const skipCooling = /^(Coolant capacity|Cooling fan air flow|Radiator fan load|Heat radiated|Cooling$|Radiator ambient|Limiting ambient)/;
  const coolingRows: Row[] = [
    ...row(L("Total coolant capacity", "سعة سائل التبريد"), coolantOk ? `${n1(coolantOk)} L` : null),
    ...(m.cooling === "air" ? [] : row(L("Cooling fan air flow", "تدفق هواء المروحة"), fanOk ? clean(fanOk) : null)),
    ...row(L("Radiator fan load", "حمل مروحة الرادياتير"), fanLoadOk ? clean(fanLoadOk) : null),
    ...row(L("Heat radiation to room (PRP / ESP)", "الحرارة المشعة للغرفة (أساسي / احتياطي)"), heatOk ? `${num(heatP!)}${heatE ? ` / ${num(heatE)}` : ""} kW` : null),
    ...cooling.filter(([k]) => !skipCooling.test(k)).map(([k, v]): Row => [k, clean(v)]),
    ...(m.cooling === "air" ? [] : row(L("Radiator", "الرادياتير"), ambient ? `${ambient} °C ambient, fan protective shroud` : "Fan protective shroud")),
  ];

  // --- alternator ----------------------------------------------------------------------------------------------
  const ls = m.alternator.leroySomer;
  const tal = !!ls && /^TAL/i.test(ls);
  const altVal = (re: RegExp) => pick(alt, re);
  // the price list decides what is offered: its Leroy-Somer frame(s) and / or a 4U Power alternator
  const offer = LIST_ALTERNATORS[m.code];
  const listLs = offer?.leroySomer.filter((x) => x !== "TAL") ?? [];
  const lsOffered = !offer || offer.leroySomer.length > 0;
  const options = offer
    ? [
        ...(offer.leroySomer.length ? [listLs.length ? `Leroy-Somer ${listLs.join(" / ")}` : `Leroy-Somer${ls ? ` ${ls}` : ""}`] : []),
        ...(offer.fourU ? ["4U Power alternator"] : []),
      ].join(" · ")
    : null;
  const make = lsOffered ? "4U · Leroy-Somer | Stamford" : "4U Power alternator";
  const fam = lsOffered ? frameFamily(ls) : null;
  const fr = lsOffered ? frameRating(ls) : null;
  const frPair = fr ? (m.ratedHz === 60 ? fr.hz60 : fr.hz50) : null;
  const alternatorRowsLs: Row[] = [
    ...row(L("Make", "الماركة"), make),
    ...row(L("Options on the price list", "الخيارات في البرايس ليست"), options),
    ...row(lsOffered ? L("Leroy-Somer frame", "موديل ليروي سومر") : L("Leroy-Somer frame (on request)", "موديل ليروي سومر (عند الطلب)"), ls),
    ...row(
      m.ratedHz === 60 ? L("Frame rating · 480 V 60 Hz", "قدرة الفريم · 480 فولت 60 هرتز") : L("Frame rating · 400 V 50 Hz", "قدرة الفريم · 400 فولت 50 هرتز"),
      frPair ? `${n1(frPair[0])} / ${n1(frPair[1])} kVA (cont. / standby)` : null,
    ),
    ...row(L("Stamford frame", "موديل ستامفورد"), lsOffered && m.alternator.stamford ? clean(m.alternator.stamford) : null),
    ...row(L("Poles", "الأقطاب"), altVal(/Poles/) ?? "4"),
    ...row(L("Winding", "الملفات"), fam ? `2/3 pitch · ${fam.wires} wires` : altVal(/Winding pitch/) ? `${altVal(/Winding pitch/)} pitch${altVal(/Winding leads/) ? ` · ${altVal(/Winding leads/)} leads` : ""}` : altVal(/Winding leads/) ? `${altVal(/Winding leads/)} leads` : null),
    ...row(L("Bearing", "كرسي التحميل"), altVal(/Bearing/) ? sentence(altVal(/Bearing/)!) : "Single bearing"),
    ...row(L("Insulation / protection", "العزل / الحماية"), [fam ? "Class H" : altVal(/Insulation/)?.replace(/^Cont\.\s*/, "").replace(/\s*-\s*/, " – ") ?? "Class H", fam ? "IP 23" : altVal(/Protection/) ?? (tal ? "IP 23" : null)].filter(Boolean).join(" · ")),
    ...row(L("Excitation", "الإثارة"), fam ? fam.excitation : altVal(/Excitation/) ? sentence(altVal(/Excitation/)!) : null),
    ...row(L("AVR", "منظم الجهد"), fam ? fam.avr : altVal(/AVR/)),
  ];
  // a 4U Power alternator only: the source sheets describe the Leroy-Somer frame, so none of that detail applies
  const alternatorRows: Row[] = lsOffered ? alternatorRowsLs : alternatorRowsLs.filter(([k]) => /Make|Options|frame \(on request\)|Poles|الماركة|الخيارات|عند الطلب|الأقطاب/.test(k));
  const operatingRows: Row[] = !lsOffered
    ? []
    : fam
    ? [
        [L("Overspeed", "السرعة القصوى"), "2,250 rpm"],
        [L("Voltage regulation", "تنظيم الجهد"), fam.regulation],
        [L("Harmonic distortion (THD)", "التشوه التوافقي (THD)"), fam.thd],
        [L("Telephone influence (TIF)", "تأثير الهاتف (TIF)"), fam.tif],
        [L("Cooling air flow (50 Hz)", "تدفق هواء التبريد (50 هرتز)"), fam.airFlow],
      ]
    : [
        ...row(L("Overspeed", "السرعة القصوى"), (() => {
          const v = pick(altOp, /Overspeed/);
          return v ? `${n1(num(v)!)} rpm` : tal ? "2,250 rpm" : null;
        })()),
        ...row(L("Voltage regulation", "تنظيم الجهد"), pick(altOp, /Voltage regulation/) ? clean(pick(altOp, /Voltage regulation/)!) : tal ? "± 1 %" : null),
        ...row(L("Harmonic content (THF)", "التشوه التوافقي (THF)"), pick(altOp, /THF/) ? clean(pick(altOp, /THF/)!) : null),
        ...row(L("Telephone influence (TIF)", "تأثير الهاتف (TIF)"), pick(altOp, /TIF/) ? clean(pick(altOp, /TIF/)!) : null),
        ...row(L("Cooling air flow", "تدفق هواء التبريد"), pick(altOp, /Cooling air flow/) ? clean(pick(altOp, /Cooling air flow/)!) : null),
      ];

  // --- fuel ----------------------------------------------------------------------------------------------------
  const f = m.fuelLph;
  let fuel: FuelPoint[] = [];
  const sheetFuel = (re: RegExp) => {
    const r = d?.fuel?.rows.find(([k]) => re.test(k ?? ""));
    return r ? num(r[1] ?? "") : null;
  };
  if (f) {
    const p50 = f.p50 ?? sheetFuel(/^50\s*%/);
    const sb = f.standby ?? sheetFuel(/^Standby/i);
    fuel = [
      ...(p50 ? [{ label: "50 %", lph: p50 }] : []),
      { label: "75 %", lph: f.p75, highlight: true },
      { label: "100 %", lph: f.p100 },
      ...(sb ? [{ label: L("Standby (ESP)", "احتياطي (ESP)"), lph: sb }] : []),
    ];
    const sfc = f.p100 / m.primeKw; // L/kWh at full prime
    const rising = fuel.every((p, i) => i === 0 || p.lph >= fuel[i - 1]!.lph);
    if (!inRange(sfc, 0.18, 0.42) || !rising) {
      hidden.push(`${m.code} fuel table (100 % = ${f.p100} L/h for ${m.primeKw} kW)`);
      fuel = [];
    }
  }

  // --- lubrication, exhaust, air -----------------------------------------------------------------------------
  const oil = m.oilL ?? num(pick(lube, /Total oil/) ?? "");
  const oilOk = oil && (!disp || inRange(oil / disp, 0.5, 8)) ? oil : null;
  if (oil && !oilOk) hidden.push(`${m.code} oil: ${oil} L`);
  const exFlow = pick(exhaust, /Exhaust gas flow/);
  const caP = pick(air, /Combustion air flow \(PRP\)/);
  const caE = pick(air, /Combustion air flow \(ESP\)/);
  const caRatio = swept ? (flow(caP) ?? 0) / swept : null;
  // swept volume × volumetric efficiency: about 0.7–1.1 naturally aspirated, up to ~9 with high boost
  const caOk = caP && (caRatio == null || (charged ? inRange(caRatio, 1.1, 9) : inRange(caRatio, 0.65, 1.15)));
  if (caP && !caOk) hidden.push(`${m.code} combustion air: ${caP}`);
  // hot exhaust is 1.5–3.5 × the combustion air by volume
  const exRatio = caOk ? (flow(exFlow) ?? 0) / flow(caP)! : swept ? (flow(exFlow) ?? 0) / swept : null;
  const exFlowOk = keep("exhaust gas flow", exFlow, exRatio == null || (caOk ? inRange(exRatio, 1.5, 3.6) : inRange(exRatio, 1.2, 28)));
  const lubeRows: Row[] = [
    ...row(L("Oil filter", "فلتر الزيت"), pick(lube, /Oil filter/) ? sentence(clean(pick(lube, /Oil filter/)!)) : null),
    ...row(L("Total oil capacity", "سعة الزيت"), oilOk ? `${n1(oilOk)} L` : null),
    ...row(L("Oil type", "نوع الزيت"), pick(lube, /Oil type/) ? clean(pick(lube, /Oil type/)!).replace(/^API-/, "API ") : null),
    ...lube.filter(([k]) => /Oil pressure|Oil shutdown|Oil capacity low/.test(k)).map(([k, v]): Row => [k, clean(v)]),
    ...row(L("Muffler", "كاتم الصوت"), pick(exhaust, /Silencer/) ? sentence(clean(pick(exhaust, /Silencer/)!)) : null),
    ...row(L("Max. back pressure", "أقصى ضغط عكسي"), pick(exhaust, /back pressure/i) ? clean(pick(exhaust, /back pressure/i)!) : null),
    ...row(L("Exhaust gas flow", "تدفق غاز العادم"), exFlowOk ? clean(exFlowOk).replace(/\s+\/(\d)/, " / $1") : null),
    ...row(L("Exhaust gas temperature", "حرارة غاز العادم"), pick(exhaust, /Exhaust gas temperature/) ? clean(pick(exhaust, /Exhaust gas temperature/)!) : null),
    ...row(L("Exhaust pipe min. dia.", "أقل قطر لماسورة العادم"), pick(exhaust, /pipe/) ? clean(pick(exhaust, /pipe/)!) : null),
  ];
  const airRows: Row[] = [
    ...row(L("Air filter", "فلتر الهواء"), pick([...air, ...exhaust], /Air filter/) ? sentence(clean(pick([...air, ...exhaust], /Air filter/)!)) : null),
    ...row(L("Combustion air flow (PRP / ESP)", "تدفق هواء الاحتراق (أساسي / احتياطي)"), caOk ? `${num(caP!)}${caE ? ` / ${num(caE)}` : ""} m³/min` : null),
    ...row(L("Max. intake restriction", "أقصى مقاومة للسحب"), pick([...air, ...exhaust], /intake restriction/i) ? clean(pick([...air, ...exhaust], /intake restriction/i)!) : null),
  ];

  // --- control, builds, scope ----------------------------------------------------------------------------------
  const controlGroup = detailRows(d, /^Control system$/).filter(([k]) => !/Module|Circuit breaker|Ambient/.test(k));
  const controllerFeatures = (d?.controllerFeatures ?? (controlGroup.length ? controlGroup.map(([k, v]) => `${k}: ${v}`) : controllerFeaturesFor(m.controller)))
    .filter((x) => !/^Digital inputs; Analogue Inputs$|Increased input and output/i.test(x))
    .map((x) =>
      x
        .replace(/using USB communication/i, "(USB)")
        .replace(/Automatically transfers between mains \(utility\) and generator/i, "Automatic transfer between mains and generator")
        .replace(/IP65 rating \(with optional gasket\).*/i, "IP65 with optional gasket")
        .replace(/configurable using can/i, "configurable using CAN")
        .replace(/kVA h, kVAr h/, "kVAh, kVArh")
        .replace(/^3 phase/, "3-phase")
        .replace(/\//g, " / "),
    );

  const container = m.enclosed?.container;
  const dims = (x: GensetModel["open"]) => (!x ? "–" : x.container ? x.container : x.l && x.w && x.h ? `${n1(x.l)} × ${n1(x.w)} × ${n1(x.h)}` : "–");
  const builds: Build[] = [];
  if (m.open) builds.push({ name: L("Open set", "مفتوح"), dims: dims(m.open), tank: m.open.tankL ? `${n1(m.open.tankL)} L` : "–", weight: m.open.kg ? `${n1(m.open.kg)} kg` : "–", noise: "–" });
  if (m.enclosed)
    builds.push({
      name: container ? L("Container", "حاوية") : L("Silent canopy", "كابينة صامتة"),
      dims: dims(m.enclosed),
      tank: m.enclosed.tankL ? `${n1(m.enclosed.tankL)} L` : "–",
      weight: m.enclosed.kg ? `${n1(m.enclosed.kg)} kg` : "–",
      noise: m.noiseDb ? `${m.noiseDb} dB(A) ± 3` : "–",
      highlight: true,
    });
  const buildsBadge = m.open && m.enclosed ? L(`Open & ${container ? "container" : "silent"} builds`, `مفتوح و${container ? "حاوية" : "كابينة صامتة"}`) : m.enclosed ? L(container ? "Containerised build" : "Silent build", container ? "داخل حاوية" : "كابينة صامتة") : L("Open & silent builds", "مفتوح وكابينة صامتة");

  const tankL = m.open?.tankL ?? m.enclosed?.tankL ?? null;
  const hours = tankL && f ? Math.floor(tankL / f.p100) : null;
  const breaker = d?.breaker ? `Main breaker: ${clean(d.breaker).replace(/^(\d) pole/, "$1-pole")}` : m.breaker === "schneider-acb" ? "Main breaker: Schneider ACB" : m.breaker === "ls" ? "Main breaker: 3-pole LS Electric" : "Main breaker: 3-pole LS MCCB";
  const scope = [
    `${m.brand} ${m.engine} engine with air, fuel and oil filters, starter motor and charging alternator`,
    lsOffered ? `4U · Leroy-Somer | Stamford alternator${ls ? ` (${ls})` : ""}` : "4U Power alternator",
    ...(m.cooling === "air" ? [] : [`Radiator for ${ambient ?? 50} °C with fan protective shroud`]),
    ...(m.controller ? [`Deep Sea ${m.controller} auto start / AMF controller`] : []),
    breaker,
    hours && hours >= 2 ? `Base frame with built-in fuel tank (${n1(tankL!)} L, about ${hours} h at full prime load)` : "Base frame with fuel tank or external day tank (sized to site)",
  ];

  // --- 60 Hz -----------------------------------------------------------------------------------------------------
  const s60 = sixtyHz(m);
  const sixty: Datasheet["sixty"] =
    m.ratedHz === 60
      ? { kind: "sixty-only", fiftyHzModel: FIFTY_HZ_EQUIVALENT[m.code] ?? null }
      : s60.kind === "datasheet"
      ? { kind: "rated", prime: s60.rating.prime, primeKw: s60.rating.primeKw, standby: s60.rating.standby, standbyKw: s60.rating.standbyKw, volts: s60.rating.volts, engine: s60.rating.engine }
      : s60.kind === "fifty-only" ? { kind: "fifty-only" } : { kind: "on-request" };
  const sixtyLine =
    sixty.kind === "rated"
      ? L(`60 Hz: ${n1(sixty.prime)} kVA prime / ${n1(sixty.standby)} kVA standby at 1800 rpm${sixty.volts ? `, ${sixty.volts} V` : ""}`, `60 هرتز: ${n1(sixty.prime)} ك.ف.أ أساسي / ${n1(sixty.standby)} ك.ف.أ احتياطي على 1800 لفة${sixty.volts ? `، ${sixty.volts} فولت` : ""}`)
      : sixty.kind === "fifty-only" ? L("50 Hz engine build — not offered at 60 Hz", "نسخة محرك 50 هرتز — غير متاحة على 60 هرتز")
      : sixty.kind === "sixty-only"
        ? L(`60 Hz engine build — not rated at 50 Hz${sixty.fiftyHzModel ? `; for 50 Hz see ${sixty.fiftyHzModel}` : ""}`, `نسخة محرك 60 هرتز — بدون قدرة على 50 هرتز${sixty.fiftyHzModel ? `؛ لـ 50 هرتز شوف ${sixty.fiftyHzModel}` : ""}`)
      : L("60 Hz: 1800 rpm, 380–480 V — ratings on request", "60 هرتز: 1800 لفة، 380–480 فولت — القدرات عند الطلب");

  const fuel75 = f && fuel.length ? f.p75 : null;
  const brandAr = brandName(m.brand, "ar");
  const overview = [
    L(
      `The ${m.code} is a ${n1(m.primeKva)} kVA prime / ${n1(m.standbyKva)} kVA standby diesel generating set with a ${m.brand} ${m.engine} engine, a ${make} alternator${m.controller ? ` and a ${m.controller} controller` : ""}.`,
      `${m.code} مولد ديزل بقدرة ${n1(m.primeKva)} ك.ف.أ أساسي / ${n1(m.standbyKva)} ك.ف.أ احتياطي، بمحرك ${brandAr} ${m.engine} ودينامو ${make}${m.controller ? ` ووحدة تحكم ${m.controller}` : ""}.`,
    ),
    m.ratedHz === 60
      ? L("Outputs at 480/277 V, 3-phase, 60 Hz, 1800 rpm, 0.8 pf", "الخرج 480/277 فولت، 3 فاز، 60 هرتز، 1800 لفة/دقيقة، معامل قدرة 0.8")
      : L("Outputs at 400/230 V, 3-phase, 50 Hz, 1500 rpm, 0.8 pf", "الخرج 400/230 فولت، 3 فاز، 50 هرتز، 1500 لفة/دقيقة، معامل قدرة 0.8"),
    sixtyLine,
    L("Warranty: 12 months or 1,000 running hours, whichever comes first.", "الضمان: 12 شهراً أو 1000 ساعة تشغيل أيهما أسبق."),
  ];

  const features: Datasheet["features"] = [
    { icon: "engine", title: `${m.brand} ${m.engine} diesel engine`, sub: [cyl, m.aspiration ? ASPIRATION[m.aspiration][0].toLowerCase() : null, m.cooling === "air" ? "air cooled" : "water cooled"].filter(Boolean).join(", ") },
    { icon: "alternator", title: lsOffered ? `4U · Leroy-Somer | Stamford alternator${ls ? ` · ${ls}` : ""}` : "4U Power alternator", sub: options ?? undefined },
    ...(m.controller ? [{ icon: "control", title: `Deep Sea ${m.controller} auto start / AMF controller` }] : []),
    { icon: "bolt", title: m.ratedHz === 60 ? "480/277 V · 3-phase · 60 Hz · 1800 rpm · 0.8 pf" : "400/230 V · 3-phase · 50 Hz · 1500 rpm · 0.8 pf", sub: sixtyLine },
    ...(fuel75 ? [{ icon: "fuel", title: `Fuel use ${n1(fuel75)} L/h at 75 % prime load` }] : []),
    ...(m.noiseDb ? [{ icon: "sound", title: `${container ? "Container" : "Silent canopy"} ${m.noiseDb} dB(A) ± 3 at 7 m` }] : []),
  ];

  const enclosureRows: Row[] = container
    ? [
        [L("Enclosure", "الغلاف"), container],
        [L("Access", "الوصول"), "Lockable side doors"],
        [L("Transport", "النقل"), "ISO corner castings for lifting and shipping"],
        [L("Colours", "الألوان"), "Container RAL 9010 · base frame RAL 9011"],
      ]
    : [
        [L("Enclosure", "الغلاف"), "Acoustic and weather-proof canopy"],
        [L("Drainage", "التصريف"), "Fuel and water drainage"],
        [L("Transport", "النقل"), "Single-point lifting, forklift pockets"],
        [L("Protection", "الحماية"), "IP 23"],
        [L("Colours", "الألوان"), "Canopy RAL 9010 · base frame RAL 9011"],
      ];

  return {
    docNo: `4U-DS-${m.code.replace(/^4U-/, "")}`,
    code: m.code,
    brandUpper: m.brand.toUpperCase(),
    engine: m.engine,
    controller: m.controller,
    alternatorMake: make,
    prime: { kva: m.primeKva, kw: m.primeKw, amps: amps(m.primeKva, m.ratedHz === 60 ? "480/277" : "400/230") },
    standby: { kva: m.standbyKva, kw: m.standbyKw, amps: amps(m.standbyKva, m.ratedHz === 60 ? "480/277" : "400/230") },
    sixty,
    hz: m.ratedHz ?? 50,
    fuel75,
    noiseDb: m.noiseDb,
    builds,
    buildsBadge,
    overview,
    features,
    engineRows,
    coolingRows,
    alternatorRows,
    operatingRows,
    fuel,
    lubeRows,
    airRows,
    controllerFeatures,
    enclosureRows,
    scope,
    hidden,
  };
}

/** A controller's feature list taken from a sheet of another set with the same controller (Lister, list-only sets). */
function controllerFeaturesFor(controller: string | null): string[] {
  if (!controller) return [];
  const fam = controller.replace(/\s*MKII$/, "");
  const withList = gensetModels.filter((x) => DETAILS[x.code]?.controllerFeatures?.length && x.controller);
  const same = withList.find((x) => x.controller === controller) ?? withList.find((x) => x.controller!.replace(/\s*MKII$/, "") === fam);
  return same ? DETAILS[same.code]!.controllerFeatures! : [];
}

export const SHUTDOWNS = {
  en: ["Over and under speed", "Low and high battery voltage", "Start and stop failure", "Over current", "Under / over generator voltage", "Low oil pressure", "High engine temperature", "Emergency stop"],
  ar: ["زيادة ونقص السرعة", "انخفاض وارتفاع جهد البطارية", "فشل التشغيل والإيقاف", "زيادة التيار", "نقص / زيادة جهد المولد", "انخفاض ضغط الزيت", "ارتفاع حرارة المحرك", "زر الطوارئ"],
};

export const OPTIONS: { icon: string; en: string; ar: string; items: string[] }[] = [
  { icon: "engine", en: "Engine", ar: "المحرك", items: ["Heavy-duty air filter", "Coolant heater", "Lubricant oil heater", "Fuel and water separator", "Lube oil rotary pump"] },
  { icon: "alternator", en: "Alternator", ar: "الدينامو", items: ["Leroy-Somer / Stamford alternator", "Anti-condensation heater", "PMG + AVR", "Double bearing", "RTDs for bearing and winding"] },
  { icon: "control", en: "Control", ar: "التحكم", items: ["AMF", "Parallel (synchronising)", "Low-temperature package", "Control screen heater", "Remote annunciator", "ComAp / DEIF controllers"] },
  { icon: "breaker", en: "Circuit breaker", ar: "القاطع", items: ["3 / 4 poles", "Fixed or draw-out type", "Motorised mechanism"] },
  { icon: "transfer", en: "Transfer switch", ar: "مفتاح التحويل", items: ["ATS cabinet", "Contactor type ATS", "Motorised changeover type ATS"] },
  { icon: "fan", en: "Cooling", ar: "التبريد", items: ["55 °C radiator", "Remote radiator"] },
  { icon: "battery", en: "Start battery", ar: "بطارية التشغيل", items: ["Nickel-cadmium battery", "Maintenance-free battery", "Battery charger and selector switch", "Charging current meter"] },
  { icon: "tank", en: "Fuel & exhaust", ar: "الوقود والعادم", items: ["Single / double wall external tank (500–5000 L)", "Fuel transfer pump", "Residential, critical or hospital grade silencer"] },
];

/** The 50 Hz set to offer instead of a 60 Hz-only engine build (the maker's 1500 rpm engine of the same family / size). */
const FIFTY_HZ_EQUIVALENT: Record<string, string> = { "4U-C68": "4U-C60", "4U-C1608": "4U-C1500", "4U-C2290": "4U-C2047", "4U-P24": "4U-P20" };

export const VOLTAGES = ["400/230 V", "380/220 V", "415/240 V", "440/254 V", "480/277 V", "416/240 V", "220/127 V", "208/120 V"];
