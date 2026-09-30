import type { Faq } from "./faq";
import type { L10n } from "@/lib/utils";

export type Service = { icon: "wrench" | "calendar" | "siren" | "gauge" | "flask" | "sun" | "cog" | "plug"; title: L10n; body: L10n };

export const warranty = {
  title: { en: "12-month warranty on every product", ar: "ضمان 12 شهراً على كل منتج" },
  body: {
    en: "Every generator, panel, solar system and accessory we supply carries a 12-month warranty against defects in materials and workmanship. If a covered fault appears, we repair or replace the part — and our engineers handle it directly, not through a chain of resellers.",
    ar: "كل مولد ولوحة ونظام شمسي وملحق نورّده يأتي بضمان 12 شهراً ضد عيوب المواد والتصنيع. إذا ظهر عطل مشمول بالضمان نصلح القطعة أو نستبدلها، ويتولى مهندسونا ذلك مباشرة دون سلسلة من الوسطاء.",
  },
  points: [
    { en: "Covers manufacturing defects in parts and workmanship", ar: "يشمل عيوب التصنيع في القطع وجودة العمل" },
    { en: "Starts from delivery or commissioning, as stated on your quotation", ar: "يبدأ من التسليم أو التشغيل حسب ما هو مذكور في عرض السعر" },
    { en: "Manufacturer warranties on engines, alternators and modules are passed on in full", ar: "تنتقل إليك ضمانات المصنّعين على المحركات والدينامو والألواح كاملة" },
    { en: "Keep it valid with scheduled maintenance by us or an approved technician", ar: "يبقى سارياً مع الصيانة الدورية من قبلنا أو فني معتمد" },
  ] as L10n[],
};

export const services: Service[] = [
  {
    icon: "calendar",
    title: { en: "Preventive maintenance & AMC", ar: "الصيانة الوقائية وعقود الصيانة السنوية" },
    body: {
      en: "Scheduled visits for generators, ATS, switchgear and solar: oil, filters, coolant, batteries, belts, load checks and a written report each visit.",
      ar: "زيارات مجدولة للمولدات ولوحات ATS والجهد المنخفض والأنظمة الشمسية: الزيت والفلاتر وسائل التبريد والبطاريات والسيور وفحص الأحمال، مع تقرير مكتوب في كل زيارة.",
    },
  },
  {
    icon: "siren",
    title: { en: "Breakdown repair & troubleshooting", ar: "إصلاح الأعطال وتشخيصها" },
    body: {
      en: "Fault diagnosis and repair on site — engines, alternators, controllers, ATS and panels — with parts sourced from our Sharjah stock.",
      ar: "تشخيص الأعطال وإصلاحها في الموقع للمحركات والدينامو ووحدات التحكم ولوحات ATS واللوحات، مع قطع الغيار من مخزوننا في الشارقة.",
    },
  },
  {
    icon: "flask",
    title: { en: "Testing & commissioning", ar: "الاختبار والتشغيل الأولي" },
    body: {
      en: "Pre-commissioning checks, functional testing, protection settings and handover documents for new installations.",
      ar: "فحوصات ما قبل التشغيل والاختبار الوظيفي وضبط الحمايات ومستندات التسليم للتركيبات الجديدة.",
    },
  },
  {
    icon: "gauge",
    title: { en: "Load-bank testing", ar: "اختبار المولدات بأحمال الاختبار" },
    body: {
      en: "Run your generator at real load to prove its rating, clear wet-stacking and meet annual test requirements.",
      ar: "تشغيل المولد تحت حمل حقيقي لإثبات قدرته والتخلص من تراكم الوقود غير المحترق واستيفاء متطلبات الاختبار السنوي.",
    },
  },
  {
    icon: "wrench",
    title: { en: "Panel modification & retrofit", ar: "تعديل وتحديث اللوحات" },
    body: {
      en: "Upgrade old controllers to AMF, add ATS to existing sets, extend MDBs and refurbish switchgear.",
      ar: "تحديث وحدات التحكم القديمة إلى AMF، وإضافة لوحات ATS للمولدات القائمة، وتوسيع لوحات التوزيع، وتجديد لوحات الجهد المنخفض.",
    },
  },
  {
    icon: "sun",
    title: { en: "Solar O&M", ar: "تشغيل وصيانة الأنظمة الشمسية" },
    body: {
      en: "Panel cleaning, inspection, inverter and battery checks and performance reporting for solar and hybrid systems.",
      ar: "تنظيف الألواح والفحص الدوري وفحص الإنفرتر والبطاريات وتقارير الأداء للأنظمة الشمسية والهجينة.",
    },
  },
  {
    icon: "plug",
    title: { en: "Installation", ar: "التركيب" },
    body: {
      en: "Positioning, cabling, fuel and exhaust connection for generators, panels and solar systems by our site team.",
      ar: "تثبيت المعدات وتمديد الكابلات وتوصيل الوقود والعادم للمولدات واللوحات والأنظمة الشمسية بواسطة فريق الموقع لدينا.",
    },
  },
  {
    icon: "cog",
    title: { en: "Spare parts & consumables", ar: "قطع الغيار والمستهلكات" },
    body: {
      en: "Filters, belts, batteries, controllers and breakers for the brands we supply, shipped across the UAE, KSA and Iraq.",
      ar: "فلاتر وسيور وبطاريات ووحدات تحكم وقواطع للعلامات التي نوردها، مع الشحن إلى الإمارات والسعودية والعراق.",
    },
  },
];

export const servicesFaq: Faq[] = [
  {
    q: { en: "What does the 1-year warranty cover?", ar: "ماذا يشمل ضمان السنة؟" },
    a: {
      en: "Defects in materials and workmanship on every product we supply, for 12 months from delivery or commissioning as stated on your quotation. Misuse, accidents and missed maintenance are not covered.",
      ar: "عيوب المواد والتصنيع في كل منتج نورّده لمدة 12 شهراً من التسليم أو التشغيل حسب ما هو مذكور في عرض السعر. لا يشمل سوء الاستخدام أو الحوادث أو إهمال الصيانة.",
    },
  },
  {
    q: { en: "Do you maintain generators you did not supply?", ar: "هل تصونون مولدات لم تورّدوها أنتم؟" },
    a: {
      en: "Yes. We service all major engine brands and can take over an existing site under an annual maintenance contract after a first inspection.",
      ar: "نعم، نصون جميع علامات المحركات الرئيسية، ويمكننا تولي صيانة موقع قائم بعقد صيانة سنوي بعد فحص أولي.",
    },
  },
  {
    q: { en: "How often should a standby generator be serviced?", ar: "كم مرة يجب صيانة المولد الاحتياطي؟" },
    a: {
      en: "Typically a monthly check and run, a full service every 250 running hours or 6–12 months, and a load-bank test once a year — whichever comes first.",
      ar: "عادةً فحص وتشغيل شهري، وصيانة شاملة كل 250 ساعة تشغيل أو كل 6–12 شهراً، واختبار بأحمال الاختبار مرة سنوياً، أيهما أسبق.",
    },
  },
];
