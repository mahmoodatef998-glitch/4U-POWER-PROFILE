import { engineBrandLabels } from "./taxonomy";
import { amps400, STANDARD_ATS_AMPS } from "@/lib/calculator";
import type { L10n } from "@/lib/utils";
import type { Faq } from "./faq";

/**
 * Programmatic "X kVA generator" landing pages. Every figure is computed from engineering rules of thumb
 * (0.8 pf, 400 V 3-phase, ~0.25 L/kWh at load) so each page carries genuinely size-specific data —
 * running load, current, ATS size, fuel burn, tank sizing, typical uses — rather than templated filler.
 */
export const GENERATOR_SIZES = [10, 15, 20, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500, 650, 750, 1000, 1250, 1500, 2000, 2500] as const;
export type GeneratorSize = (typeof GENERATOR_SIZES)[number];

export const sizeSlug = (kva: number) => `${kva}-kva`;
export const sizeFromSlug = (slug: string) => {
  const m = /^(\d+)-kva$/.exec(slug);
  const kva = m ? Number(m[1]) : NaN;
  return (GENERATOR_SIZES as readonly number[]).includes(kva) ? kva : null;
};

const fmt = (n: number, ar: boolean) => new Intl.NumberFormat(ar ? "ar-AE-u-nu-latn" : "en-AE", { maximumFractionDigits: 1 }).format(n);
const round5 = (n: number) => Math.round(n / 5) * 5;

export function sizeData(kva: number) {
  const kw = kva * 0.8;
  const amps = amps400(kva);
  const ats = STANDARD_ATS_AMPS.find((a) => a >= amps * 1.0) ?? Math.ceil(amps / 100) * 100;
  const fuel75 = kw * 0.75 * 0.26; // L/h at 75 % load
  const fuel100 = kw * 0.25 + kw * 0.02; // L/h at full load (slightly worse specific consumption)
  const fuel50 = kw * 0.5 * 0.28;
  const tank8h = round5(fuel75 * 8 * 1.1);
  const tank24h = round5(fuel75 * 24 * 1.1);
  const primeKva = Math.round(kva / 1.1);
  // typical split-AC units (2 TR ≈ 2.4 kW running) the set can carry at 80 % of its kW
  const acUnits = Math.max(1, Math.floor((kw * 0.8) / 2.4));
  const enclosure = kva <= 60 ? "canopy" : kva <= 500 ? "canopy-or-open" : kva <= 1250 ? "open-or-container" : "container";
  const engines = kva <= 40 ? ["Kubota", "Perkins", "Lister Petter"] : kva <= 60 ? ["Perkins", "Cummins", "Lister Petter"] : kva <= 200 ? ["Perkins", "Cummins", "Volvo Penta", "Baudouin"] : kva <= 700 ? ["Cummins", "Perkins", "Volvo Penta", "Baudouin"] : ["Cummins", "Perkins", "Baudouin"];
  return { kva, kw, amps, ats, fuel50, fuel75, fuel100, tank8h, tank24h, primeKva, acUnits, enclosure, engines };
}

type Band = { uses: L10n; note: L10n };
function band(kva: number): Band {
  if (kva <= 20)
    return {
      uses: { en: "villas, shops, small offices, telecom shelters and site cabins", ar: "الفلل والمحلات والمكاتب الصغيرة ومحطات الاتصالات وكبائن المواقع" },
      note: { en: "At this size a silent canopy and single- or three-phase output are the usual choices; Kubota and Perkins 400 Series engines keep noise and fuel low.", ar: "في هذا الحجم تكون الكابينة الصامتة والخرج أحادي أو ثلاثي الأطوار هي الخيار المعتاد، ومحركات كوبوتا وبيركنز 400 تحافظ على ضوضاء واستهلاك وقود منخفضين." },
    };
  if (kva <= 80)
    return {
      uses: { en: "clinics, restaurants, workshops, small warehouses, farms and construction site offices", ar: "العيادات والمطاعم والورش والمستودعات الصغيرة والمزارع ومكاتب مواقع البناء" },
      note: { en: "A very common standby size in the UAE: pair it with an AMF controller and an ATS so the building switches over without anyone on site.", ar: "حجم احتياطي شائع جداً في الإمارات؛ يُركّب مع وحدة تحكم AMF ولوحة ATS لينتقل المبنى إلى المولد دون وجود أحد في الموقع." },
    };
  if (kva <= 250)
    return {
      uses: { en: "schools, supermarkets, mid-size buildings, cold stores, pump stations and construction sites", ar: "المدارس والسوبرماركت والمباني المتوسطة ومخازن التبريد ومحطات الضخ ومواقع البناء" },
      note: { en: "Check the largest motor or chiller start: in this range the starting kVA often decides the size more than the running load.", ar: "تحقق من بدء تشغيل أكبر محرك أو مبرد؛ ففي هذا النطاق غالباً ما تحدد قدرة البدء الحجم أكثر من الحمل التشغيلي." },
    };
  if (kva <= 750)
    return {
      uses: { en: "hotels, malls, hospitals, factories, towers and large construction projects", ar: "الفنادق والمولات والمستشفيات والمصانع والأبراج ومشاريع البناء الكبيرة" },
      note: { en: "Consider two synchronised sets instead of one large set for redundancy and better fuel use at part load.", ar: "فكّر في مولدين متزامنين بدلاً من مولد واحد كبير لتحقيق الاحتياطية وكفاءة أفضل في استهلاك الوقود عند الأحمال الجزئية." },
    };
  return {
    uses: { en: "data centres, hospitals, industrial plants, mining, oil & gas and utility backup", ar: "مراكز البيانات والمستشفيات والمصانع الكبرى والتعدين والنفط والغاز ودعم شبكات الكهرباء" },
    note: { en: "Usually containerised with bulk fuel and synchronising panels; MV step-up transformers are common above 1500 kVA.", ar: "غالباً داخل حاويات مع خزانات وقود كبيرة ولوحات تزامن، وتنتشر محولات رفع الجهد المتوسط فوق 1500 ك.ف.أ." },
  };
}

export function sizeCopy(kva: number, locale: "en" | "ar") {
  const ar = locale === "ar";
  const d = sizeData(kva);
  const b = band(kva);
  const n = (v: number) => fmt(v, ar);
  const enclosure: Record<string, L10n> = {
    canopy: { en: "Sound-attenuated canopy", ar: "كابينة عازلة للصوت" },
    "canopy-or-open": { en: "Canopy or open frame", ar: "كابينة أو إطار مفتوح" },
    "open-or-container": { en: "Open frame or container", ar: "إطار مفتوح أو حاوية" },
    container: { en: "20/40 ft container", ar: "حاوية 20 / 40 قدم" },
  };

  const title = ar ? `سعر مولد ${kva} كيلو فولت أمبير في الإمارات | المواصفات` : `${kva} kVA Diesel Generator Price & Specs in UAE`;
  const seoTitle = ar ? `مولد ${kva} ك.ف.أ ديزل: السعر والمواصفات | فور يو باور` : `${kva} kVA Generator Price & Specs UAE | 4U Power`;
  const seoDesc = ar
    ? `مولد ديزل ${kva} ك.ف.أ (${n(d.kw)} كيلوواط): التيار ${n(Math.round(d.amps))} أمبير، لوحة ATS ${d.ats} أمبير، استهلاك ${n(Math.round(d.fuel75))} لتر/ساعة. سعر في نفس اليوم وتوصيل من الشارقة.`
    : `${kva} kVA (${n(d.kw)} kW) diesel generator: ${n(Math.round(d.amps))} A full load, ${d.ats} A ATS, ~${n(Math.round(d.fuel75))} L/h at 75% load. Same-day price, delivery from Sharjah.`;
  const intro = ar
    ? `مولد ${kva} كيلو فولت أمبير يعطي نحو ${n(d.kw)} كيلوواط عند معامل قدرة 0.8، وهو حجم مناسب لـ${b.uses.ar}. نورّده بمحركات ${d.engines.map((e) => engineBrandLabels[e]?.ar ?? e).join(" أو ")} من مستودعنا في الشارقة، مع لوحة ATS المناسبة وضمان سنة.`
    : `A ${kva} kVA generator delivers about ${n(d.kw)} kW at 0.8 power factor — the right size for ${b.uses.en}. We supply it with ${d.engines.join(", ").replace(/, ([^,]*)$/, " or $1")} engines from our Sharjah warehouse, with a matched ATS panel and a 1-year warranty.`;

  const specs: { k: L10n; v: string }[] = [
    { k: { en: "Standby rating", ar: "القدرة الاحتياطية" }, v: ar ? `${kva} ك.ف.أ / ${n(d.kw)} كيلوواط` : `${kva} kVA / ${n(d.kw)} kW` },
    { k: { en: "Prime rating (typical)", ar: "القدرة الأساسية (تقريباً)" }, v: ar ? `≈ ${d.primeKva} ك.ف.أ` : `≈ ${d.primeKva} kVA` },
    { k: { en: "Full-load current @ 400 V", ar: "تيار الحمل الكامل عند 400 فولت" }, v: ar ? `${n(Math.round(d.amps))} أمبير` : `${n(Math.round(d.amps))} A` },
    { k: { en: "Matching ATS panel", ar: "لوحة ATS المناسبة" }, v: ar ? `${d.ats} أمبير، 4 أقطاب` : `${d.ats} A, 4-pole` },
    { k: { en: "Fuel use @ 50 / 75 / 100 % load", ar: "استهلاك الوقود عند 50 / 75 / 100% حمل" }, v: ar ? `${n(d.fuel50)} / ${n(d.fuel75)} / ${n(d.fuel100)} لتر/ساعة` : `${n(d.fuel50)} / ${n(d.fuel75)} / ${n(d.fuel100)} L/h` },
    { k: { en: "Base tank for 8 h @ 75 %", ar: "خزان قاعدي لـ 8 ساعات عند 75%" }, v: ar ? `≈ ${n(d.tank8h)} لتر` : `≈ ${n(d.tank8h)} L` },
    { k: { en: "Engine options", ar: "خيارات المحرك" }, v: ar ? d.engines.map((e) => engineBrandLabels[e]?.ar ?? e).join("، ") : d.engines.join(", ") },
    { k: { en: "Enclosure", ar: "الهيكل" }, v: enclosure[d.enclosure]![locale] },
    { k: { en: "Voltage / frequency", ar: "الجهد / التردد" }, v: ar ? "400/230 فولت، 50 هرتز (60 هرتز للسعودية عند الطلب)" : "400/230 V, 50 Hz (60 Hz for KSA on request)" },
    { k: { en: "Warranty", ar: "الضمان" }, v: ar ? "12 شهراً" : "12 months" },
  ];

  const faq: Faq[] = [
    {
      q: { en: `How much load can a ${kva} kVA generator run?`, ar: `ما الحمل الذي يشغّله مولد ${kva} ك.ف.أ؟` },
      a: {
        en: `About ${n(d.kw)} kW of running load at 0.8 power factor. Keep 20–25 % headroom for motor starting and Gulf heat — in practice roughly ${n(Math.round(d.kw * 0.8))} kW continuous, for example around ${d.acUnits} split AC units of 2 tons, or the equivalent mix of lighting, pumps and equipment.`,
        ar: `نحو ${n(d.kw)} كيلوواط من الحمل التشغيلي عند معامل قدرة 0.8. اترك هامشاً من 20 إلى 25% لبدء المحركات وحرارة الخليج، أي عملياً نحو ${n(Math.round(d.kw * 0.8))} كيلوواط بشكل مستمر، مثل ${d.acUnits} وحدة تكييف سبليت 2 طن تقريباً أو ما يعادلها من إنارة ومضخات ومعدات.`,
      },
    },
    {
      q: { en: `How much diesel does a ${kva} kVA generator use per hour?`, ar: `كم لتر ديزل يستهلك مولد ${kva} ك.ف.أ في الساعة؟` },
      a: {
        en: `Roughly ${n(d.fuel50)} L/h at 50 % load, ${n(d.fuel75)} L/h at 75 % and ${n(d.fuel100)} L/h at full load. Exact figures depend on the engine model; we include the manufacturer's fuel curve with every quotation.`,
        ar: `تقريباً ${n(d.fuel50)} لتر/ساعة عند 50% حمل، و${n(d.fuel75)} لتر/ساعة عند 75%، و${n(d.fuel100)} لتر/ساعة عند الحمل الكامل. الأرقام الدقيقة تعتمد على موديل المحرك، ونرفق منحنى استهلاك المصنّع مع كل عرض سعر.`,
      },
    },
    {
      q: { en: `What size ATS panel does a ${kva} kVA generator need?`, ar: `ما حجم لوحة ATS المناسبة لمولد ${kva} ك.ف.أ؟` },
      a: {
        en: `Full-load current at 400 V three-phase is about ${n(Math.round(d.amps))} A, so a ${d.ats} A ATS is the usual match — or the main incoming breaker rating if that is larger. A 4-pole ATS is recommended where the generator neutral is separately earthed.`,
        ar: `تيار الحمل الكامل عند 400 فولت ثلاثي الأطوار نحو ${n(Math.round(d.amps))} أمبير، لذلك تكون لوحة ATS بسعة ${d.ats} أمبير هي المناسبة عادةً، أو بسعة القاطع الرئيسي إن كان أكبر. ويوصى بلوحة رباعية الأقطاب عندما يكون تعادل المولد مؤرضاً بشكل منفصل.`,
      },
    },
    {
      q: { en: `What is the price of a ${kva} kVA generator in the UAE?`, ar: `كم سعر مولد ${kva} ك.ف.أ في الإمارات؟` },
      a: {
        en: `It depends on the engine brand, enclosure, controller and whether you need an ATS and fuel tank. Send us the site and delivery city on WhatsApp and we reply the same working day with 2–3 engine options side by side.`,
        ar: `يعتمد السعر على ماركة المحرك ونوع الهيكل ووحدة التحكم وهل تحتاج لوحة ATS وخزان وقود. أرسل لنا الموقع ومدينة التسليم على الواتساب ونرد في نفس يوم العمل بخيارين أو ثلاثة من المحركات جنباً إلى جنب.`,
      },
    },
    {
      q: { en: `Standby or prime: which ${kva} kVA rating do I need?`, ar: `قدرة احتياطية أم أساسية: أيهما أحتاج لمولد ${kva} ك.ف.أ؟` },
      a: {
        en: `Standby (${kva} kVA) is for emergency backup with limited annual hours. If the set is your main power — a construction site or an area with daily outages — size on the prime rating (about ${d.primeKva} kVA for this set) or choose the next size up.`,
        ar: `القدرة الاحتياطية (${kva} ك.ف.أ) للطوارئ بعدد ساعات سنوية محدود. أما إذا كان المولد هو المصدر الرئيسي، كموقع بناء أو منطقة بانقطاعات يومية، فاعتمد على القدرة الأساسية (نحو ${d.primeKva} ك.ف.أ لهذا المولد) أو اختر الحجم الأكبر التالي.`,
      },
    },
  ];

  return { title, seoTitle, seoDesc, intro, note: b.note[locale], uses: b.uses[locale], specs: specs.map((s) => ({ k: s.k[locale], v: s.v })), faq, data: d };
}
