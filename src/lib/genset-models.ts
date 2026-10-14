import { cumminsModels } from "@/content/cummins-models";
import type { GensetBrand, GensetDim, GensetModel, GensetModelData } from "@/content/genset-types";
import { perkinsModels } from "@/content/perkins-models";
import { baudouinModels } from "@/content/baudouin-models";
import { kubotaModels } from "@/content/kubota-models";
import { generatorImageForKva } from "./generator-image";
import type { ConfigModel } from "./configurator";
import type { SizingModel } from "./sizing";
import type { Locale } from "./utils";

export type { GensetBrand, GensetModel } from "@/content/genset-types";

/** Per engine brand: Arabic name, the two catalogue products its models split between, and the fallback photo. */
export const GENSET_BRANDS: Record<GensetBrand, { ar: string; small: string; large: string; isSmall: (m: GensetModel) => boolean; image: string }> = {
  Perkins: {
    ar: "بيركنز",
    small: "perkins-diesel-generator-10-200kva",
    large: "perkins-diesel-generator-250-2500kva",
    isSmall: (m) => m.primeKva <= 200,
    image: "/images/products/perkins-diesel-generator-4u.webp",
  },
  Cummins: {
    ar: "كمنز",
    small: "cummins-diesel-generator-20-500kva",
    large: "cummins-diesel-generator-550-2500kva",
    isSmall: (m) => m.standbyKva <= 500,
    image: "/images/products/cummins-diesel-generator-4u.webp",
  },
  Kubota: {
    ar: "كوبوتا",
    small: "kubota-silent-generator-10-40kva",
    large: "kubota-silent-generator-10-40kva",
    isSmall: () => true,
    image: "/images/products/kubota-diesel-generator-4u.webp",
  },
  Baudouin: {
    ar: "بودوان",
    small: "baudouin-diesel-generator-20-2500kva",
    large: "baudouin-diesel-generator-20-2500kva",
    isSmall: () => true,
    image: "/images/products/baudouin-diesel-generator-4u.webp",
  },
};
export const BRANDS = Object.keys(GENSET_BRANDS) as GensetBrand[];

const tag = (brand: GensetBrand) => (m: GensetModelData): GensetModel => ({ ...m, brand });
export const gensetModels: GensetModel[] = [...perkinsModels.map(tag("Perkins")), ...cumminsModels.map(tag("Cummins")), ...kubotaModels.map(tag("Kubota")), ...baudouinModels.map(tag("Baudouin"))];
export const brandModels = (brand: GensetBrand) => gensetModels.filter((m) => m.brand === brand);

export const getModel = (slug: string) => gensetModels.find((m) => m.slug === slug) ?? null;
export const productForModel = (m: GensetModel) => (GENSET_BRANDS[m.brand].isSmall(m) ? GENSET_BRANDS[m.brand].small : GENSET_BRANDS[m.brand].large);
export const modelsForProduct = (productSlug: string) => gensetModels.filter((m) => productForModel(m) === productSlug);

/** The model(s) of one brand a buyer asking for `kva` should see: every exact standby match, else the nearest below and above. */
function nearestOfBrand(kva: number, brand: GensetBrand): GensetModel[] {
  const list = brandModels(brand);
  const exact = list.filter((m) => m.standbyKva === kva);
  if (exact.length) return exact;
  const below = [...list].reverse().find((m) => m.standbyKva < kva);
  const above = list.find((m) => m.standbyKva > kva);
  return [below, above].filter((m): m is GensetModel => !!m);
}

/** Nearest models across brands, ordered by rating then brand; a brand whose range stops far from `kva` is left out. */
export function nearestModels(kva: number, brands: GensetBrand[] = BRANDS): GensetModel[] {
  const all = brands.flatMap((b) => nearestOfBrand(kva, b));
  const close = all.filter((m) => m.standbyKva >= kva / 1.6 && m.standbyKva <= kva * 1.6);
  return (close.length ? close : all).sort((a, b) => a.standbyKva - b.standbyKva || BRANDS.indexOf(a.brand) - BRANDS.indexOf(b.brand));
}

export const brandName = (brand: GensetBrand, locale: Locale) => (locale === "ar" ? GENSET_BRANDS[brand].ar : brand);
/** "Perkins, Cummins & Kubota" / "بيركنز وكمنز وكوبوتا" */
export const brandList = (locale: Locale) =>
  locale === "ar" ? BRANDS.map((b) => GENSET_BRANDS[b].ar).join(" و") : `${BRANDS.slice(0, -1).join(", ")} & ${BRANDS[BRANDS.length - 1]}`;
export const modelImage = (m: GensetModel) => generatorImageForKva(m.standbyKva, m.brand) ?? GENSET_BRANDS[m.brand].image;
export const modelPath = (m: GensetModel) => `/models/${m.slug}`;
/** Brand landing page, at the address the old site ranked with ("/perkins-diesel-generators"). */
export const brandHubPath = (brand: GensetBrand) => `/${brand.toLowerCase()}-diesel-generators`;

/** Every model reduced to what the 3D configurator needs (sent to the browser). */
export const configModels = (): ConfigModel[] =>
  gensetModels.map((m) => {
    const enc = m.enclosed;
    // very long "enclosed" builds on the sheets are containers, not canopies
    const containerNote = enc?.container ?? (enc?.l && enc.l > 7000 ? `${Math.round(enc.l / 1000)} m container` : null);
    const dim = (d: GensetDim | null) => (d && d.l && d.w && d.h ? { l: d.l, w: d.w, h: d.h, kg: d.kg, tankL: d.tankL ?? null } : null);
    return {
      slug: m.slug,
      code: m.code,
      brand: m.brand,
      engine: m.engine,
      standbyKva: m.standbyKva,
      primeKva: m.primeKva,
      alternator: [m.alternator.leroySomer, m.alternator.stamford].filter(Boolean).join(" | "),
      controller: m.controller,
      open: dim(m.open),
      canopy: containerNote ? null : dim(enc),
      containerNote,
      containerKg: containerNote ? (enc?.kg ?? null) : null,
      fuel75: m.fuelLph?.p75 ?? null,
      image: modelImage(m),
    };
  });

/** Every model reduced to what the kVA calculator needs (sent to the browser). */
export const sizingModels = (): SizingModel[] =>
  gensetModels.map((m) => ({
    slug: m.slug,
    code: m.code,
    brand: m.brand,
    engine: m.engine,
    standbyKva: m.standbyKva,
    standbyKw: m.standbyKw,
    primeKva: m.primeKva,
    primeKw: m.primeKw,
    fuel: m.fuelLph ? [m.fuelLph.p50, m.fuelLph.p75, m.fuelLph.p100, m.fuelLph.standby] : null,
    tankL: m.enclosed?.tankL ?? m.open?.tankL ?? null,
  }));

const fmt = (n: number, locale: Locale) => new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", { maximumFractionDigits: 1 }).format(n);
const L = (locale: Locale, en: string, ar: string) => (locale === "ar" ? ar : en);

const ASPIRATION: Record<GensetModel["aspiration"], [string, string]> = {
  na: ["Naturally aspirated", "تنفس طبيعي"],
  turbo: ["Turbocharged", "تيربو"],
  "turbo-ac": ["Turbocharged & aftercooled", "تيربو مع تبريد لاحق (Aftercooled)"],
  "turbo-aa": ["Turbocharged, air-to-air charge cooled", "تيربو مع تبريد هواء الشحن (هواء-هواء)"],
  "twin-turbo-aa": ["Twin-turbocharged, air-to-air charge cooled", "تيربو مزدوج مع تبريد هواء الشحن"],
  "turbo-water": ["Turbocharged, water charge cooled", "تيربو مع تبريد مائي لهواء الشحن"],
};

export function modelName(m: GensetModel, locale: Locale) {
  return L(locale, `${m.code} — ${fmt(m.standbyKva, locale)} kVA ${m.brand} diesel generator`, `${m.code} — مولد ديزل ${GENSET_BRANDS[m.brand].ar} ${fmt(m.standbyKva, locale)} ك.ف.أ`);
}

const dimText = (d: GensetDim | null, locale: Locale) =>
  !d ? null
  : d.container
    ? locale === "ar"
      ? d.container.replace("custom container", "حاوية مخصصة").replace("ISO HC container", "حاوية ISO عالية").replace(/^(\d+) ft container$/, "حاوية $1 قدم")
      : d.container
    : `${d.l} × ${d.w} × ${d.h} mm`;

export type SpecSection = { title: string; rows: { k: string; v: string }[] };

export const aspirationText = (m: GensetModel, locale: Locale) => ASPIRATION[m.aspiration][locale === "ar" ? 1 : 0];

/** Every datasheet section, bilingual; rows with no data are dropped rather than shown empty. */
export function modelSpecSections(m: GensetModel, locale: Locale): SpecSection[] {
  const kva = (n: number) => `${fmt(n, locale)} ${L(locale, "kVA", "ك.ف.أ")}`;
  const kw = (n: number) => `${fmt(n, locale)} ${L(locale, "kW", "ك.و")}`;
  const row = (en: string, ar: string, v: string | null | undefined) => (v ? [{ k: L(locale, en, ar), v }] : []);
  const lph = (n: number) => `${fmt(n, locale)} ${L(locale, "L/h", "لتر/ساعة")}`;
  const ambient = m.ambientC === undefined ? 50 : m.ambientC;
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
        ...row("Make / model", "الماركة / الموديل", `${m.brand} ${m.engine}`),
        ...row("Cylinders", "عدد الأسطوانات", `${m.cylinders} ${m.layout === "V" ? L(locale, "in 60° V", "على شكل V") : L(locale, "in-line", "على خط واحد")}`),
        ...row("Displacement", "السعة", `${new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", { maximumFractionDigits: 3 }).format(m.displacementL)} ${L(locale, "L", "لتر")}`),
        ...row("Bore × stroke", "القطر × الشوط", `${m.boreStrokeMm} mm`),
        ...row("Aspiration", "التنفس", ASPIRATION[m.aspiration][locale === "ar" ? 1 : 0]),
        ...row("Governing", "منظم السرعة", m.governing === "electronic" ? L(locale, "Electronic", "إلكتروني") : L(locale, "Mechanical", "ميكانيكي")),
        ...row("Cooling", "التبريد", ambient ? L(locale, `Water cooled, radiator for ${fmt(ambient, "en")} °C ambient`, `تبريد مائي، رادياتير لحرارة محيطة ${fmt(ambient, locale)}°م`) : L(locale, "Water cooled", "تبريد مائي")),
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
            ...row("50 % prime load", "عند 50% من الحمل", m.fuelLph.p50 ? lph(m.fuelLph.p50) : null),
            ...row("75 % prime load", "عند 75% من الحمل", lph(m.fuelLph.p75)),
            ...row("100 % prime load", "عند 100% من الحمل", lph(m.fuelLph.p100)),
            ...row("Standby rating", "عند القدرة الاحتياطية", m.fuelLph.standby ? lph(m.fuelLph.standby) : null),
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
        ...row("Main breaker", "القاطع الرئيسي", m.breaker === "schneider-acb"
            ? L(locale, "Schneider ACB", "قاطع هوائي شنايدر (ACB)")
            : m.breaker === "ls"
              ? L(locale, "3-pole LS Electric", "قاطع LS Electric ثلاثي الأقطاب")
              : L(locale, "3-pole LS MCCB", "قاطع LS ثلاثي الأقطاب (MCCB)")),
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
