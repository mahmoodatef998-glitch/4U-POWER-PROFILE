import { perkinsModels, type GensetDim, type GensetModel } from "@/content/perkins-models";
import { generatorImageForKva } from "./generator-image";
import type { Locale } from "./utils";

export type { GensetModel } from "@/content/perkins-models";
export const gensetModels = perkinsModels;

/** Perkins catalogue products; models split between them on prime rating (≤ 200 kVA prime → small range). */
export const PERKINS_SMALL = "perkins-diesel-generator-10-200kva";
export const PERKINS_LARGE = "perkins-diesel-generator-250-2500kva";

export const getModel = (slug: string) => gensetModels.find((m) => m.slug === slug) ?? null;
export const productForModel = (m: GensetModel) => (m.primeKva <= 200 ? PERKINS_SMALL : PERKINS_LARGE);
export const modelsForProduct = (productSlug: string) => gensetModels.filter((m) => productForModel(m) === productSlug);

/** The model(s) a buyer asking for `kva` should see: an exact standby match, else the nearest below and above. */
export function nearestModels(kva: number): GensetModel[] {
  const exact = gensetModels.find((m) => m.standbyKva === kva);
  if (exact) return [exact];
  const below = [...gensetModels].reverse().find((m) => m.standbyKva < kva);
  const above = gensetModels.find((m) => m.standbyKva > kva);
  return [below, above].filter((m): m is GensetModel => !!m);
}

export const modelImage = (m: GensetModel) => generatorImageForKva(m.standbyKva, "Perkins") ?? "/images/products/perkins-diesel-generator-4u.webp";
export const modelPath = (m: GensetModel) => `/models/${m.slug}`;

const fmt = (n: number, locale: Locale) => new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", { maximumFractionDigits: 1 }).format(n);
const L = (locale: Locale, en: string, ar: string) => (locale === "ar" ? ar : en);

const ASPIRATION: Record<GensetModel["aspiration"], [string, string]> = {
  na: ["Naturally aspirated", "تنفس طبيعي"],
  turbo: ["Turbocharged", "تيربو"],
  "turbo-aa": ["Turbocharged, air-to-air charge cooled", "تيربو مع تبريد هواء الشحن (هواء-هواء)"],
  "twin-turbo-aa": ["Twin-turbocharged, air-to-air charge cooled", "تيربو مزدوج مع تبريد هواء الشحن"],
  "turbo-water": ["Turbocharged, water charge cooled", "تيربو مع تبريد مائي لهواء الشحن"],
};

export function modelName(m: GensetModel, locale: Locale) {
  return L(locale, `${m.code} — ${fmt(m.standbyKva, locale)} kVA Perkins diesel generator`, `${m.code} — مولد ديزل بيركنز ${fmt(m.standbyKva, locale)} ك.ف.أ`);
}

const dimText = (d: GensetDim | null, locale: Locale) =>
  !d ? null : d.container ? (locale === "ar" ? d.container.replace("custom container", "حاوية مخصصة").replace("ISO HC container", "حاوية ISO عالية") : d.container) : `${d.l} × ${d.w} × ${d.h} mm`;

export type SpecSection = { title: string; rows: { k: string; v: string }[] };

/** Every datasheet section, bilingual; rows with no data are dropped rather than shown empty. */
export function modelSpecSections(m: GensetModel, locale: Locale): SpecSection[] {
  const kva = (n: number) => `${fmt(n, locale)} ${L(locale, "kVA", "ك.ف.أ")}`;
  const kw = (n: number) => `${fmt(n, locale)} ${L(locale, "kW", "ك.و")}`;
  const row = (en: string, ar: string, v: string | null | undefined) => (v ? [{ k: L(locale, en, ar), v }] : []);
  const lph = (n: number) => `${fmt(n, locale)} ${L(locale, "L/h", "لتر/ساعة")}`;
  const sections: SpecSection[] = [
    {
      title: L(locale, "Output ratings", "القدرات"),
      rows: [
        ...row("Standby (ESP)", "احتياطي (Standby)", `${kva(m.standbyKva)} / ${kw(m.standbyKw)}`),
        ...row("Prime (PRP)", "أساسي (Prime)", `${kva(m.primeKva)} / ${kw(m.primeKw)}`),
        ...row("Voltage / frequency", "الجهد / التردد", L(locale, "400/230 V · 3-phase · 50 Hz · 1500 rpm", "400/230 فولت · 3 فاز · 50 هرتز · 1500 لفة/دقيقة")),
        ...row("Power factor", "معامل القدرة", "0.8"),
        ...row("Other voltages", "جهود أخرى", "380/220 · 415/240 · 440/254 · 480/277 V"),
      ],
    },
    {
      title: L(locale, "Engine", "المحرك"),
      rows: [
        ...row("Make / model", "الماركة / الموديل", `Perkins ${m.engine}`),
        ...row("Cylinders", "عدد الأسطوانات", `${m.cylinders} ${m.layout === "V" ? L(locale, "in 60° V", "على شكل V") : L(locale, "in-line", "على خط واحد")}`),
        ...row("Displacement", "السعة", `${fmt(m.displacementL, locale)} ${L(locale, "L", "لتر")}`),
        ...row("Bore × stroke", "القطر × الشوط", `${m.boreStrokeMm} mm`),
        ...row("Aspiration", "التنفس", ASPIRATION[m.aspiration][locale === "ar" ? 1 : 0]),
        ...row("Governing", "منظم السرعة", m.governing === "electronic" ? L(locale, "Electronic", "إلكتروني") : L(locale, "Mechanical", "ميكانيكي")),
        ...row("Cooling", "التبريد", L(locale, "Water cooled, radiator for 50 °C ambient", "تبريد مائي، رادياتير لحرارة محيطة 50°م")),
        ...row("Coolant capacity", "سعة سائل التبريد", m.coolantL ? `${fmt(m.coolantL, locale)} ${L(locale, "L", "لتر")}` : null),
        ...row("Lube oil capacity", "سعة الزيت", m.oilL ? `${fmt(m.oilL, locale)} ${L(locale, "L", "لتر")}` : null),
      ],
    },
    {
      title: L(locale, "Alternator", "الدينامو (المولّد)"),
      rows: [
        ...row("Make", "الماركة", "4U · Leroy-Somer | Stamford"),
        ...row("Leroy-Somer frame", "موديل ليروي سومر", m.alternator.leroySomer),
        ...row("Stamford frame", "موديل ستامفورد", m.alternator.stamford),
        ...row("Type", "النوع", L(locale, "Brushless, self-excited, 4-pole, single bearing", "بدون فرش، تغذية ذاتية، 4 أقطاب، كرسي تحميل واحد")),
        ...row("Insulation / protection", "العزل / الحماية", L(locale, "Class H · IP23", "فئة H · IP23")),
        ...row("Voltage regulation", "تنظيم الجهد", "± 1 %"),
      ],
    },
    {
      title: L(locale, "Fuel consumption", "استهلاك الوقود"),
      rows: m.fuelLph
        ? [
            ...row("50 % prime load", "عند 50% من الحمل", lph(m.fuelLph.p50)),
            ...row("75 % prime load", "عند 75% من الحمل", lph(m.fuelLph.p75)),
            ...row("100 % prime load", "عند 100% من الحمل", lph(m.fuelLph.p100)),
            ...row("Standby rating", "عند القدرة الاحتياطية", lph(m.fuelLph.standby)),
          ]
        : row("Fuel consumption", "استهلاك الوقود", L(locale, "On request", "عند الطلب")),
    },
    {
      title: L(locale, "Dimensions & weight", "المقاسات والوزن"),
      rows: [
        ...row("Open set (L × W × H)", "مفتوح (طول × عرض × ارتفاع)", dimText(m.open, locale)),
        ...row("Open set weight", "وزن المفتوح", m.open?.kg ? `${fmt(m.open.kg, locale)} ${L(locale, "kg", "كجم")}` : null),
        ...row(m.enclosed?.container ? "Container" : "Silent canopy (L × W × H)", m.enclosed?.container ? "الحاوية" : "بالكابينة (طول × عرض × ارتفاع)", dimText(m.enclosed, locale)),
        ...row(m.enclosed?.container ? "Containerised weight" : "Canopy weight", m.enclosed?.container ? "الوزن داخل الحاوية" : "وزن الكابينة", m.enclosed?.kg ? `${fmt(m.enclosed.kg, locale)} ${L(locale, "kg", "كجم")}` : null),
        ...row("Base fuel tank", "خزان الوقود القاعدي", m.enclosed?.tankL || m.open?.tankL ? `${fmt((m.enclosed?.tankL ?? m.open?.tankL) as number, locale)} ${L(locale, "L", "لتر")}` : L(locale, "External day tank (sized to site)", "خزان خارجي حسب الموقع")),
        ...row("Noise @ 7 m", "مستوى الصوت على 7 م", m.noiseDb ? `${fmt(m.noiseDb, locale)} dB(A) ± 3` : null),
      ],
    },
    {
      title: L(locale, "Control & protection", "التحكم والحماية"),
      rows: [
        ...row("Controller", "وحدة التحكم", `Deep Sea ${m.controller}${L(locale, " — auto start / AMF", " — تشغيل تلقائي / AMF")}`),
        ...row("Main breaker", "القاطع الرئيسي", L(locale, "3-pole LS MCCB", "قاطع LS ثلاثي الأقطاب (MCCB)")),
        ...row(
          "Shutdowns & alarms",
          "الإنذارات والإيقاف",
          L(locale, "Over/under speed & voltage, over-current, low oil pressure, high engine temperature, battery, start/stop failure, emergency stop", "زيادة/نقص السرعة والجهد، زيادة التيار، ضغط الزيت المنخفض، حرارة المحرك العالية، البطارية، فشل التشغيل/الإيقاف، زر الطوارئ"),
        ),
        ...row("Warranty", "الضمان", L(locale, "12 months or 1,000 running hours, whichever first", "12 شهراً أو 1000 ساعة تشغيل أيهما أسبق")),
      ],
    },
  ];
  return sections.filter((s) => s.rows.length);
}

/** Standard rating definitions printed on every sheet (ISO 8528-1). */
export const ratingNotes = (locale: Locale) =>
  locale === "ar"
    ? [
        "القدرة الأساسية (Prime): تشغيل غير محدود الساعات بمتوسط حمل 80% خلال كل 24 ساعة، مع تحميل زائد 10% لمدة ساعة كل 12 ساعة.",
        "القدرة الاحتياطية (Standby): حتى 500 ساعة سنوياً بمتوسط حمل 80% عند انقطاع الكهرباء، دون تحميل زائد.",
        "الخيارات: كابينة عازلة للصوت أو حاوية، خزان خارجي (500–5000 لتر)، لوحة ATS، تشغيل متوازي، رادياتير 55°م، سخان المحرك.",
      ]
    : [
        "Prime (PRP): unlimited hours at an average 80 % load over each 24 h, with 10 % overload for 1 h in every 12 h.",
        "Standby (ESP): up to 500 h a year at an average 80 % load during mains failure; no overload.",
        "Options: silent canopy or container, external tank (500–5,000 L), ATS panel, synchronising, 55 °C radiator, engine heaters.",
      ];
