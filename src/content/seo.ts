import type { L10n } from "@/lib/utils";

export type PageSeo = { title: L10n; description: L10n };

/**
 * Hand-written title (≈55–60 chars) + description (≈140–155 chars) for every static route.
 * `npm run check:seo` validates lengths and uniqueness.
 */
export const pageSeo = {
  home: {
    title: {
      en: "Diesel Generator & ATS Panel Supplier in UAE | 4U Power",
      ar: "مولدات كهرباء للبيع ولوحات ATS في الإمارات | فور يو باور",
    },
    description: {
      en: "Diesel generators 10–2500 kVA, ATS panels, switchgear & MDBs from SAIF Zone, Sharjah. Perkins, Cummins, Baudouin. Fast delivery to UAE, KSA & Iraq.",
      ar: "مولدات ديزل من 10 إلى 2500 ك.ف.أ ولوحات ATS ولوحات توزيع من المنطقة الحرة بالشارقة. بيركنز وكمنز وبودوان، وتوصيل سريع للإمارات والسعودية والعراق.",
    },
  },
  about: {
    title: {
      en: "About 4U Power Generation | Generator Supplier, Sharjah",
      ar: "من نحن | فور يو باور جينيريشن – مورد مولدات في الشارقة",
    },
    description: {
      en: "4U Power Generation FZC is a SAIF Zone, Sharjah supplier of diesel generators, ATS panels and switchgear serving the UAE, Saudi Arabia and Iraq.",
      ar: "فور يو باور جينيريشن (ش.م.ح) شركة في المنطقة الحرة لمطار الشارقة لتوريد مولدات الديزل ولوحات ATS ولوحات الكهرباء للإمارات والسعودية والعراق.",
    },
  },
  products: {
    title: {
      en: "Generators, Switchgear & Solar Catalog | 4U Power UAE",
      ar: "كتالوج المولدات واللوحات والطاقة الشمسية | فور يو باور",
    },
    description: {
      en: "Generators 10–2500 kVA, ATS, LV/MV switchgear, solar PV, fuel tanks and light towers — all with a 1-year warranty. Filter by kVA and fuel, then get a quote.",
      ar: "مولدات من 10 إلى 2500 ك.ف.أ ولوحات ATS وجهد منخفض ومتوسط وألواح شمسية وخزانات وقود وأبراج إنارة، بضمان سنة. فلتر حسب القدرة والوقود واطلب عرض سعر.",
    },
  },
  generators: {
    title: {
      en: "Diesel Generators for Sale in UAE | 10–2500 kVA | 4U Power",
      ar: "أسعار المولدات الكهربائية في الإمارات | مولدات ديزل للبيع",
    },
    description: {
      en: "Perkins, Cummins, Kubota & Baudouin diesel generators 10–2500 kVA from Sharjah. Standby & prime sets for industry, towers and sites. WhatsApp for a price.",
      ar: "مولدات كهربائية للبيع في الإمارات: بيركنز وكمنز وكوبوتا وبودوان من 10 إلى 2500 ك.ف.أ من الشارقة، احتياطية وأساسية. عرض سعر خلال 24 ساعة.",
    },
  },
  ats: {
    title: {
      en: "ATS Panel Suppliers in UAE | Automatic Transfer Switch",
      ar: "لوحة ATS للمولدات في الإمارات | لوحات تحويل أوتوماتيكي",
    },
    description: {
      en: "ATS panel supplier in the UAE: automatic transfer switches 63–4000 A for generators, 3/4-pole, ACB or motorised, tested in Sharjah. Quote in 24 hours.",
      ar: "مورد لوحات ATS في الإمارات: لوحات تحويل أوتوماتيكي للمولدات من 63 إلى 4000 أمبير، 3 و4 أقطاب، ACB أو مُحرّكة، مختبرة في الشارقة. عرض سعر خلال 24 ساعة.",
    },
  },
  switchgear: {
    title: {
      en: "LV & 33kV Switchgear, MDB Panel Supplier UAE | 4U Power",
      ar: "لوحات كهرباء وتوزيع MDB في الإمارات | فور يو باور الشارقة",
    },
    description: {
      en: "LV switchgear, MDB, SMDB and synchronizing panels to IEC 61439, plus 33kV MV switchgear and RMUs, built to your SLD in Sharjah. UAE quote in 24 hours.",
      ar: "لوحات جهد منخفض ولوحات توزيع رئيسية وفرعية ولوحات تحكم وتزامن مولدات وفق IEC 61439 من الشارقة، حسب المخطط أحادي الخط لمشاريع الإمارات والخليج.",
    },
  },
  calculator: {
    title: {
      en: "Generator kVA Calculator | Size Your Generator | 4U Power",
      ar: "حاسبة قدرة المولد ك.ف.أ | اعرف حجم المولد المناسب لك",
    },
    description: {
      en: "Free generator size calculator: enter your load in kW or amps or pick your site type, get the recommended kVA with safety margin and matching generators.",
      ar: "حاسبة مجانية لحجم المولد: أدخل الحمل بالكيلوواط أو الأمبير أو اختر نوع الموقع، واحصل على القدرة الموصى بها بالكيلو فولت أمبير مع المولدات المناسبة.",
    },
  },
  projects: {
    title: {
      en: "Generator & Switchgear Projects | UAE, KSA, Iraq | 4U Power",
      ar: "مشاريع المولدات ولوحات الكهرباء | الإمارات والسعودية والعراق",
    },
    description: {
      en: "Generator, ATS and switchgear supply scopes for warehouses, towers, factories, clinics and sites across the UAE, Saudi Arabia, Iraq, Qatar, Kenya and SA.",
      ar: "نماذج توريد مولدات ولوحات ATS ولوحات كهرباء لمستودعات وأبراج ومصانع وعيادات في الإمارات والسعودية والعراق وقطر وكينيا وجنوب أفريقيا.",
    },
  },
  news: {
    title: {
      en: "Generator & ATS Guides and News | 4U Power Generation UAE",
      ar: "مقالات وأخبار المولدات ولوحات ATS | فور يو باور جينيريشن",
    },
    description: {
      en: "Practical guides on generator sizing, ATS panels, engine brands, switchgear maintenance and export to Saudi Arabia and Iraq from the 4U Power team.",
      ar: "أدلة عملية حول اختيار حجم المولد ولوحات ATS وماركات المحركات وصيانة لوحات الكهرباء والتصدير للسعودية والعراق من فريق فور يو باور جينيريشن.",
    },
  },
  markets: {
    title: {
      en: "Markets We Serve | Generators for UAE, KSA & Iraq | 4U Power",
      ar: "الأسواق التي نخدمها | مولدات للإمارات والسعودية والعراق",
    },
    description: {
      en: "From SAIF Zone, Sharjah we supply generators, ATS panels and switchgear to the UAE, Saudi Arabia and Iraq, plus Qatar, Kenya and South Africa.",
      ar: "من المنطقة الحرة لمطار الشارقة نورّد المولدات ولوحات ATS ولوحات الكهرباء إلى الإمارات والسعودية والعراق، إضافة إلى قطر وكينيا وجنوب أفريقيا.",
    },
  },
  contact: {
    title: {
      en: "Contact 4U Power Generation | SAIF Zone Sharjah | WhatsApp",
      ar: "اتصل بنا | فور يو باور جينيريشن – سيف زون الشارقة | واتساب",
    },
    description: {
      en: "Call or WhatsApp +971 50 229 6962 for generator, ATS and switchgear prices. Visit Warehouse A2-020, SAIF Zone, Sharjah, UAE. Same-day replies.",
      ar: "اتصل أو راسلنا واتساب على ‎+971 50 229 6962 لأسعار المولدات ولوحات ATS والكهرباء. زورونا في مستودع A2-020، سيف زون، الشارقة. رد في نفس اليوم.",
    },
  },
  privacy: {
    title: {
      en: "Privacy Policy | 4U Power Generation FZC, Sharjah, UAE",
      ar: "سياسة الخصوصية | فور يو باور جينيريشن ش.م.ح – الشارقة",
    },
    description: {
      en: "How 4U Power Generation FZC collects, uses and protects personal data submitted through our website, quote forms, calculator and WhatsApp enquiries.",
      ar: "كيف تجمع فور يو باور جينيريشن (ش.م.ح) البيانات الشخصية المرسلة عبر الموقع ونماذج طلب السعر والحاسبة ورسائل الواتساب وكيف تستخدمها وتحميها.",
    },
  },
  terms: {
    title: {
      en: "Terms of Use | 4U Power Generation FZC Website, Sharjah",
      ar: "شروط الاستخدام | موقع فور يو باور جينيريشن ش.م.ح",
    },
    description: {
      en: "Terms governing use of the 4U Power Generation FZC website, product information, kVA calculator results, quotations and communications with our team.",
      ar: "الشروط التي تحكم استخدام موقع فور يو باور جينيريشن (ش.م.ح) ومعلومات المنتجات ونتائج حاسبة القدرة وعروض الأسعار والتواصل مع فريق المبيعات لدينا.",
    },
  },
} satisfies Record<string, PageSeo>;

/**
 * Title / description overrides for catalog products whose Search Console queries the product name
 * alone doesn't match (e.g. "33kv switchgear", "ats panel supplier"). Without an entry the product page
 * uses its name + brand and its description.
 */
export const productSeo: Record<string, PageSeo> = {
  "ats-panel-63a-400a": {
    title: { en: "ATS Panel Supplier in UAE | 63–400 A Transfer Switch", ar: "لوحة ATS من 63 إلى 400 أمبير | مورد لوحات ATS في الإمارات" },
    description: {
      en: "ATS panels 63–400 A from a UAE supplier: 3- or 4-pole, motorised or contactor changeover, IP54, factory function-tested in Sharjah. Quote in 24 hours.",
      ar: "لوحة ATS للمولدات من 63 إلى 400 أمبير: 3 أو 4 أقطاب، تحويل بمحرك أو كونتاكتور، غلاف IP54 ومختبرة في الشارقة قبل الشحن. عرض سعر خلال 24 ساعة.",
    },
  },
  "ats-panel-630a-4000a": {
    title: { en: "ATS Panel 630–4000 A | ACB Changeover Supplier in UAE", ar: "لوحة ATS من 630 إلى 4000 أمبير بقواطع ACB في الإمارات" },
    description: {
      en: "High-current ATS panels 630–4000 A with motorised ACB pair, metering and Modbus, up to Form 4b, for plants, hospitals and towers in the UAE. Quote in 24h.",
      ar: "لوحات ATS للتيارات العالية من 630 إلى 4000 أمبير بزوج قواطع ACB مُحرّكة وعداد وModbus حتى Form 4b للمصانع والمستشفيات والأبراج. عرض سعر خلال 24 ساعة.",
    },
  },
  "mv-switchgear-33kv": {
    title: { en: "33kV Switchgear Supplier in UAE | MV Switchgear & RMU", ar: "لوحات جهد متوسط 33 ك.ف في الإمارات | سويتشجير 33kV" },
    description: {
      en: "33kV switchgear and ring main units for substations and generator step-up: metal-clad panels, numerical relays, CT/VT metering. UAE supply, quote in 24h.",
      ar: "لوحات جهد متوسط حتى 33 ك.ف ووحدات RMU للمحطات الفرعية ورفع جهد المولدات، مع مرحلات حماية رقمية وقياس. توريد في الإمارات وعرض سعر خلال 24 ساعة.",
    },
  },
};
