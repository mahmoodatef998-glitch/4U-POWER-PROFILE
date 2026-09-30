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
      ar: "مولدات ديزل ولوحات ATS في الإمارات | فور يو باور الشارقة",
    },
    description: {
      en: "Diesel generators 10–2500 kVA, ATS panels, switchgear & MDBs from SAIF Zone, Sharjah. Perkins, Cummins, Volvo. Fast delivery to UAE, KSA & Iraq.",
      ar: "مولدات ديزل من 10 إلى 2500 ك.ف.أ ولوحات ATS ولوحات توزيع من المنطقة الحرة بالشارقة. بيركنز وكمنز وفولفو، وتوصيل سريع للإمارات والسعودية والعراق.",
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
      en: "Diesel Generator Supplier UAE | 10–2500 kVA | 4U Power",
      ar: "مولدات ديزل الشارقة والإمارات | 10–2500 ك.ف.أ | فور يو باور",
    },
    description: {
      en: "Perkins, Cummins, Kubota & Volvo diesel generators 10–2500 kVA from Sharjah. Standby & prime sets for industry, towers and sites. WhatsApp for a price.",
      ar: "مولدات ديزل بيركنز وكمنز وكوبوتا وفولفو من 10 إلى 2500 ك.ف.أ من الشارقة، احتياطية وأساسية للمصانع والأبراج والمواقع. اطلب السعر عبر الواتساب.",
    },
  },
  ats: {
    title: {
      en: "ATS Panel Supplier UAE | Automatic Transfer Switch Sharjah",
      ar: "لوحات ATS الإمارات | لوحات تحويل أوتوماتيكي في الشارقة",
    },
    description: {
      en: "Automatic transfer switch panels 63–4000 A for generators, built and tested in Sharjah. 3/4-pole, ACB and motorised types. Delivery across UAE, KSA & Iraq.",
      ar: "لوحات تحويل أوتوماتيكي ATS من 63 إلى 4000 أمبير للمولدات، مختبرة في الشارقة، 3 و4 أقطاب بقواطع ACB أو مُحرّكة، مع توصيل للإمارات والسعودية والعراق.",
    },
  },
  switchgear: {
    title: {
      en: "LV Switchgear & MDB Panel Supplier UAE | 4U Power Sharjah",
      ar: "لوحات كهرباء وتوزيع MDB في الإمارات | فور يو باور الشارقة",
    },
    description: {
      en: "Low voltage switchgear, MDB, SMDB, control and generator synchronizing panels to IEC 61439 from Sharjah. Built to your SLD for projects in the UAE and GCC.",
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
      en: "Call or WhatsApp +971 52 336 7694 for generator, ATS and switchgear prices. Visit Warehouse A2-020, SAIF Zone, Sharjah, UAE. Same-day replies.",
      ar: "اتصل أو راسلنا واتساب على ‎+971 52 336 7694 لأسعار المولدات ولوحات ATS والكهرباء. زورونا في مستودع A2-020، سيف زون، الشارقة. رد في نفس اليوم.",
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
