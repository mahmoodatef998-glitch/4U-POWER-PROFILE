import type { L10n } from "@/lib/utils";

type Block = { title: L10n; body: L10n };

/* ============================================================ HOME */
export const home = {
  hero: {
    eyebrow: { en: "SAIF Zone, Sharjah · Licence No. 23919", ar: "سيف زون، الشارقة · رخصة رقم 23919" },
    h1: {
      en: "**Diesel generators,** ATS panels & switchgear supplier in the **UAE**",
      ar: "مورد **مولدات ديزل** ولوحات ATS ولوحات كهرباء في **الإمارات**",
    },
    lead: {
      en: "Perkins, Cummins, Kubota and Volvo Penta generator sets from 10 to 2500 kVA — with the ATS, MDB and synchronising panels to match. Stocked in Sharjah, delivered across the UAE, Saudi Arabia and Iraq.",
      ar: "مولدات بيركنز وكمنز وكوبوتا وفولفو بنتا من 10 إلى 2500 ك.ف.أ مع لوحات ATS والتوزيع والتزامن المناسبة لها. مخزون في الشارقة وتوصيل إلى الإمارات والسعودية والعراق.",
    },
    chips: [
      { en: "10 – 2500 kVA", ar: "10 – 2500 ك.ف.أ" },
      { en: "Same-day quotes", ar: "عروض أسعار في نفس اليوم" },
      { en: "UAE · KSA · Iraq", ar: "الإمارات · السعودية · العراق" },
    ],
  },
  /** Scroll-story chapters shown under the assembling generator (hero). */
  story: [
    {
      kicker: { en: "01 — The heart", ar: "01 — قلب المولد" },
      word: { en: "ENGINE", ar: "المحرك" },
      title: { en: "Engines you can trust in 50 °C", ar: "محركات تعتمد عليها في حرارة 50 درجة" },
      body: {
        en: "Perkins, Cummins, Kubota, Volvo Penta and Chinese engine platforms from 10 to 2500 kVA — quoted side by side so you choose on facts, not brand loyalty.",
        ar: "محركات بيركنز وكمنز وكوبوتا وفولفو بنتا والمحركات الصينية من 10 إلى 2500 ك.ف.أ، نقدّمها لك جنباً إلى جنب لتختار بالأرقام لا بالاسم.",
      },
      stat: { en: "10–2500 kVA", ar: "10–2500 ك.ف.أ" },
    },
    {
      kicker: { en: "02 — Gulf-proof cooling", ar: "02 — تبريد مصمم للخليج" },
      word: { en: "COOLING", ar: "التبريد" },
      title: { en: "Sized for August, not the catalogue", ar: "مصمم لصيف أغسطس، لا لأرقام الكتالوج" },
      body: {
        en: "High-ambient radiators, canopies and site derating specified for UAE, Saudi and Iraqi summers — the output you are quoted is the output you get on site.",
        ar: "مبردات مصممة للحرارة العالية، وكبائن مناسبة، وحساب دقيق لخفض القدرة في صيف الإمارات والسعودية والعراق؛ فالقدرة المذكورة في عرض السعر هي ما تحصل عليه فعلاً في الموقع.",
      },
      stat: { en: "50 °C rated", ar: "حتى 50 °م" },
    },
    {
      kicker: { en: "03 — Automatic control", ar: "03 — تحكم أوتوماتيكي" },
      word: { en: "CONTROL", ar: "التحكم" },
      title: { en: "Power back in 5–15 seconds", ar: "الكهرباء تعود خلال 5–15 ثانية" },
      body: {
        en: "AMF controllers and ATS panels from 63 A to 4000 A start the set and transfer your load the moment the grid drops — no one needs to be on site.",
        ar: "وحدات تحكم AMF ولوحات ATS من 63 إلى 4000 أمبير تشغّل المولد وتنقل الحمل لحظة انقطاع الشبكة، دون الحاجة لوجود أحد في الموقع.",
      },
      stat: { en: "63–4000 A ATS", ar: "ATS من 63–4000 أمبير" },
    },
    {
      kicker: { en: "04 — Ready to ship", ar: "04 — جاهز للشحن" },
      word: { en: "DELIVERY", ar: "التسليم" },
      title: { en: "Ready in Sharjah. Delivered to your site.", ar: "جاهز في الشارقة ويصل إلى موقعك" },
      body: {
        en: "From SAIF Zone to the UAE in days, overland to Saudi Arabia, by sea or road to Iraq — with datasheets and export paperwork done for you.",
        ar: "من المنطقة الحرة بالشارقة إلى الإمارات خلال أيام، وبراً إلى السعودية، وبحراً أو براً إلى العراق، مع النشرات الفنية ومستندات التصدير جاهزة.",
      },
      stat: { en: "UAE · KSA · Iraq", ar: "الإمارات · السعودية · العراق" },
    },
  ],
  brands: {
    title: { en: "Engine platforms we supply", ar: "المحركات التي نوردها" },
    note: {
      en: "We supply and package generator sets built on these engine platforms. Brand names are trademarks of their respective owners.",
      ar: "نورّد ونجهّز مولدات مبنية على منصات هذه المحركات. الأسماء التجارية مملوكة لأصحابها.",
    },
  },
  who: {
    eyebrow: { en: "Who we are", ar: "من نحن" },
    title: { en: "A power equipment partner **built for speed**", ar: "شريكك في معدات الطاقة **بسرعة وموثوقية**" },
    body: {
      en: "4U Power Generation FZC is a licensed SAIF Zone company trading power generation, transmission and distribution equipment. We combine a Sharjah warehouse, multi-brand sourcing and hands-on engineering support so contractors and facility owners get the right generator and panel — quoted fast, delivered on time, documented properly.",
      ar: "فور يو باور جينيريشن (ش.م.ح) شركة مرخصة في المنطقة الحرة لمطار الشارقة لتجارة معدات توليد ونقل وتوزيع الطاقة. نجمع بين مستودع في الشارقة وتوريد متعدد الماركات ودعم هندسي عملي، ليحصل المقاولون وأصحاب المنشآت على المولد واللوحة الصحيحة بعرض سعر سريع وتسليم في الموعد ومستندات كاملة.",
    },
    points: [
      { en: "Engine-agnostic advice — we quote 2–3 brands side by side", ar: "نصيحة محايدة: نقدم عروضاً لماركتين أو ثلاث جنباً إلى جنب" },
      { en: "Generator + ATS + MDB from one supplier, sized together", ar: "المولد ولوحة ATS ولوحة التوزيع من مورد واحد وبحجم متوافق" },
      { en: "Export paperwork for KSA, Iraq and Africa handled in-house", ar: "مستندات التصدير للسعودية والعراق وأفريقيا من داخل الشركة" },
      { en: "Direct WhatsApp line to the sales engineer on your job", ar: "خط واتساب مباشر مع مهندس المبيعات المسؤول عن طلبك" },
    ],
  },
  categories: {
    eyebrow: { en: "What we supply", ar: "ما نورده" },
    title: { en: "**Complete** standby & prime **power packages**", ar: "**حلول متكاملة** للطاقة **الاحتياطية والأساسية**" },
    items: {
      generator: {
        body: { en: "Diesel, gas, hybrid & solar-hybrid sets, 10–2500 kVA.", ar: "مولدات ديزل وغاز وهجينة وشمسية من 10 إلى 2500 ك.ف.أ." },
        image: "/images/products/generator-canopy.svg",
      },
      ats_panel: {
        body: { en: "Automatic changeover from 63 A to 4000 A.", ar: "تحويل أوتوماتيكي من 63 إلى 4000 أمبير." },
        image: "/images/products/ats-panel.svg",
      },
      switchgear: {
        body: { en: "LV switchboards and generator control panels.", ar: "لوحات جهد منخفض ولوحات تحكم المولدات." },
        image: "/images/products/switchgear.svg",
      },
      mdb: {
        body: { en: "MDB, SMDB and DB panels to utility standards.", ar: "لوحات توزيع رئيسية وفرعية حسب متطلبات الهيئات." },
        image: "/images/products/mdb.svg",
      },
      sync_panel: {
        body: { en: "Parallel 2–16 generators with load sharing.", ar: "تشغيل 2 إلى 16 مولداً على التوازي مع توزيع الأحمال." },
        image: "/images/products/sync-panel.svg",
      },
    },
  },
  coverage: {
    eyebrow: { en: "Where we deliver", ar: "وجهات التسليم" },
    title: { en: "From Sharjah to **six markets** — led by the **UAE, Saudi Arabia and Iraq**", ar: "من الشارقة إلى **ستة أسواق**، في مقدمتها الإمارات والسعودية والعراق" },
    body: {
      en: "Our core markets get stock availability, overland delivery and localised specifications. Qatar, Kenya and South Africa are served by sea and road freight on project basis.",
      ar: "نوفّر لأسواقنا الرئيسية مخزوناً جاهزاً وشحناً برياً ومواصفات مطابقة للمتطلبات المحلية، ونخدم قطر وكينيا وجنوب أفريقيا بالشحن البحري والبري حسب كل مشروع.",
    },
    primary: { en: "Core markets", ar: "الأسواق الرئيسية" },
    secondary: { en: "Project markets", ar: "أسواق المشاريع" },
  },
  stats: [
    { value: 2500, suffix: "", label: { en: "kVA maximum single-set rating", ar: "أقصى قدرة لمولد واحد (ك.ف.أ)" } },
    { value: 6, suffix: "", label: { en: "countries served from Sharjah", ar: "دول نخدمها من الشارقة" } },
    { value: 5, suffix: "", label: { en: "engine platforms to choose from", ar: "منصات محركات للاختيار" } },
    { value: 4000, suffix: " A", label: { en: "maximum ATS panel rating", ar: "أقصى سعة للوحة ATS (أمبير)" } },
  ],
  testimonials: {
    eyebrow: { en: "Client feedback", ar: "آراء العملاء" },
    title: { en: "What our customers say", ar: "ماذا يقول عملاؤنا" },
  },
  news: {
    eyebrow: { en: "Guides & news", ar: "أدلة وأخبار" },
    title: { en: "**Engineering guides** from our team", ar: "**أدلة هندسية** من فريقنا" },
  },
  faq: { eyebrow: { en: "FAQ", ar: "الأسئلة الشائعة" }, title: { en: "Generator & ATS questions, **answered**", ar: "أسئلتكم عن **المولدات ولوحات ATS**" } },
  cta: {
    title: { en: "Need a generator price today?", ar: "تحتاج سعر مولد اليوم؟" },
    body: {
      en: "Send the kVA or your load list on WhatsApp — a sales engineer replies with options and pricing, usually within the hour.",
      ar: "أرسل القدرة المطلوبة أو قائمة الأحمال على الواتساب، وسيرد مهندس المبيعات بالخيارات والأسعار عادةً خلال ساعة.",
    },
  },
};

/* ============================================================ ABOUT */
export const about = {
  h1: { en: "About 4U Power Generation FZC", ar: "عن فور يو باور جينيريشن (ش.م.ح)" },
  intro: {
    en: "A Sharjah-based supplier of diesel generators, ATS panels and switchgear — built to get reliable power to sites across the UAE, Saudi Arabia and Iraq, fast.",
    ar: "مورد مولدات ديزل ولوحات ATS ولوحات كهرباء، مقره الشارقة، يوصل طاقة موثوقة إلى المواقع في الإمارات والسعودية والعراق بسرعة.",
  },
  story: {
    title: { en: "Our story", ar: "قصتنا" },
    body: [
      {
        en: "4U Power Generation was licensed in the Sharjah Airport International Free Zone in August 2023 by a team with long experience in generators and electrical panels across the Gulf and Iraq. We saw the same problem again and again: contractors waiting weeks for a quote, generators and transfer switches bought from different suppliers that didn't match, and export documents that held equipment at the border.",
        ar: "حصلت فور يو باور جينيريشن على ترخيصها في المنطقة الحرة لمطار الشارقة الدولي في أغسطس 2023 على يد فريق يملك خبرة طويلة في المولدات ولوحات الكهرباء في الخليج والعراق. رأينا المشكلة نفسها مراراً: مقاولون ينتظرون أسابيع للحصول على عرض سعر، ومولدات ولوحات تحويل من موردين مختلفين لا تتوافق، ومستندات تصدير تعطل المعدات على الحدود.",
      },
      {
        en: "So we built 4U around three things: stock close to the airport and the Saudi border, multi-brand sourcing so we can recommend what actually fits the job, and one team that sizes the generator, the ATS and the distribution board together.",
        ar: "لذلك بنينا فور يو باور على ثلاثة أسس: مخزون قريب من المطار والحدود السعودية، وتوريد متعدد الماركات لنوصي بما يناسب المشروع فعلاً، وفريق واحد يحدد حجم المولد ولوحة ATS ولوحة التوزيع معاً.",
      },
    ],
  },
  mission: {
    title: { en: "Our mission", ar: "رسالتنا" },
    body: {
      en: "Keep our customers' power on — by supplying correctly sized, well-documented generation and switching equipment faster than anyone else in the region.",
      ar: "أن تبقى الكهرباء متوفرة لعملائنا، من خلال توريد معدات توليد وتحويل بالحجم الصحيح ومستندات كاملة وأسرع من أي مورد آخر في المنطقة.",
    },
  },
  licence: {
    title: { en: "Licence & registration", ar: "الترخيص والتسجيل" },
    note: {
      en: "Registration details as shown on our SAIF Zone trade licence. Verify anytime with the Sharjah Airport International Free Zone Authority.",
      ar: "بيانات التسجيل كما هي في رخصتنا التجارية الصادرة من سيف زون، ويمكن التحقق منها لدى هيئة المنطقة الحرة لمطار الشارقة الدولي.",
    },
    labels: {
      legalName: { en: "Legal name", ar: "الاسم القانوني" },
      licenceNo: { en: "Licence No.", ar: "رقم الرخصة" },
      authority: { en: "Issuing authority", ar: "جهة الإصدار" },
      status: { en: "Legal status", ar: "الشكل القانوني" },
      activity: { en: "Licensed activity", ar: "النشاط المرخص" },
      incorporated: { en: "Incorporated", ar: "تاريخ التأسيس" },
      address: { en: "Registered address", ar: "العنوان المسجل" },
    },
  },
  leadership: {
    title: { en: "Leadership", ar: "الإدارة" },
    intro: { en: "4U is owner-managed — you deal directly with the people accountable for your order.", ar: "يدير ملّاك فور يو باور الشركة بأنفسهم، فتتعامل مباشرة مع أصحاب القرار في طلبك." },
    role: { en: "Partner & Owner", ar: "شريك ومالك" },
  },
  why: {
    title: { en: "Why customers choose 4U", ar: "لماذا يختارنا العملاء" },
    items: [
      {
        title: { en: "Speed", ar: "السرعة" },
        body: { en: "Same-day quotations on WhatsApp and stock in Sharjah for the most requested ratings.", ar: "عروض أسعار في نفس اليوم على الواتساب ومخزون في الشارقة للقدرات الأكثر طلباً." },
      },
      {
        title: { en: "Matched systems", ar: "أنظمة متوافقة" },
        body: { en: "Generator, ATS and MDB sized together — no mismatched breakers or undersized changeovers.", ar: "المولد ولوحة ATS ولوحة التوزيع بأحجام متوافقة، بلا قواطع غير مناسبة أو لوحات تحويل صغيرة." },
      },
      {
        title: { en: "Honest brand advice", ar: "نصيحة صادقة في الماركات" },
        body: { en: "We supply several engine platforms, so our recommendation follows your budget and duty — not a single dealership target.", ar: "نورّد عدة منصات محركات، لذلك تتبع توصيتنا ميزانيتك ونوع التشغيل، لا مصلحة وكيل واحد." },
      },
      {
        title: { en: "Export-ready", ar: "جاهزون للتصدير" },
        body: { en: "Free-zone logistics and documentation for Saudi Arabia, Iraq, Qatar and Africa.", ar: "خدمات لوجستية ومستندات من المنطقة الحرة للسعودية والعراق وقطر وأفريقيا." },
      },
    ] satisfies Block[],
  },
  certs: {
    title: { en: "Certifications", ar: "الشهادات" },
    body: {
      en: "We publish certifications only when they are formally held. Manufacturer datasheets, test reports and certificates of origin are supplied with every order; company-level certifications will be listed here once obtained.",
      ar: "ننشر الشهادات فقط عند الحصول عليها رسمياً. نرفق النشرات الفنية للمصنعين وتقارير الاختبار وشهادات المنشأ مع كل طلب، وسيتم إدراج شهادات الشركة هنا عند الحصول عليها.",
    },
  },
};

/* ============================================================ PILLARS */
export type Pillar = {
  eyebrow: L10n;
  h1: L10n;
  intro: L10n;
  sections: { id?: string; title: L10n; body: L10n; bullets?: L10n[] }[];
  highlights: Block[];
  productsTitle: L10n;
  waTopic: L10n;
  cta: { title: L10n; body: L10n };
  relatedPosts: string[];
};

export const generatorsPillar: Pillar = {
  eyebrow: { en: "Diesel generator supplier · UAE", ar: "مورد مولدات ديزل · الإمارات" },
  h1: {
    en: "Diesel Generator Supplier in the UAE — 10 kVA to 2500 kVA",
    ar: "مولدات ديزل في الإمارات والشارقة — من 10 إلى 2500 ك.ف.أ",
  },
  intro: {
    en: "Standby and prime-rated generator sets with Perkins, Cummins, Kubota, Volvo Penta and Chinese engine options — supplied from our SAIF Zone warehouse in Sharjah to sites across the UAE, Saudi Arabia and Iraq.",
    ar: "مولدات احتياطية وأساسية بمحركات بيركنز وكمنز وكوبوتا وفولفو بنتا والمحركات الصينية، من مستودعنا في المنطقة الحرة بالشارقة إلى المواقع في الإمارات والسعودية والعراق.",
  },
  highlights: [
    { title: { en: "10–2500 kVA", ar: "10–2500 ك.ف.أ" }, body: { en: "Single sets, or synchronised plants beyond", ar: "مولد واحد أو محطات متزامنة لما فوق ذلك" } },
    { title: { en: "5 engine platforms", ar: "5 منصات محركات" }, body: { en: "Quoted side by side for your budget", ar: "عروض جنباً إلى جنب حسب ميزانيتك" } },
    { title: { en: "50 °C rated", ar: "مهيأة لـ 50 درجة" }, body: { en: "Radiators & canopies for Gulf summers", ar: "مبردات وكبائن لصيف الخليج" } },
    { title: { en: "AMF-ready", ar: "تشغيل تلقائي" }, body: { en: "Deep Sea / ComAp auto-start controllers", ar: "وحدات تحكم Deep Sea / ComAp" } },
  ],
  sections: [
    {
      title: { en: "Standby, prime and continuous generators", ar: "مولدات احتياطية وأساسية ومستمرة" },
      body: {
        en: "A standby generator protects a building when the grid fails — lifts, fire pumps, IT and critical cooling. A prime-rated generator is the main power source on construction sites, farms and in regions with long daily outages such as Iraq. We help you pick the right rating so the engine runs in its efficient 60–80% load band and lasts.",
        ar: "المولد الاحتياطي يحمي المبنى عند انقطاع الشبكة: المصاعد ومضخات الحريق وأنظمة المعلومات والتبريد الحرج. أما المولد بقدرة أساسية فهو المصدر الرئيسي للكهرباء في مواقع الإنشاءات والمزارع والمناطق ذات الانقطاعات اليومية الطويلة مثل العراق. نساعدك على اختيار التقنين الصحيح ليعمل المحرك ضمن نطاق كفاءته بين 60 و80% ويدوم طويلاً.",
      },
    },
    {
      title: { en: "Perkins, Cummins, Kubota & Volvo Penta generators in the UAE", ar: "مولدات بيركنز وكمنز وكوبوتا وفولفو بنتا في الإمارات" },
      body: {
        en: "Perkins is the most widely serviced platform in the Gulf below 500 kVA. Cummins is favoured for heavy load acceptance on industrial and construction sites. Kubota powers our quietest compact sets for villas and clinics, and Volvo Penta offers excellent fuel economy for hotels and towers. For budget-driven projects, our Chinese Engine Series delivers dependable standby power at a lower upfront cost.",
        ar: "بيركنز هي المنصة الأكثر انتشاراً في الصيانة بالخليج تحت 500 ك.ف.أ، وكمنز مفضلة لتحمّل الأحمال الثقيلة في المواقع الصناعية والإنشائية. كوبوتا تشغّل أهدأ مولداتنا الصغيرة للفلل والعيادات، وفولفو بنتا توفر كفاءة ممتازة في الوقود للفنادق والأبراج. وللمشاريع ذات الميزانية المحدودة، توفر مولداتنا بالمحركات الصينية طاقة احتياطية موثوقة بتكلفة شراء أقل.",
      },
    },
    {
      id: "fuel-types",
      title: { en: "Diesel, gas, hybrid and solar-hybrid", ar: "ديزل وغاز وهجين وشمسي هجين" },
      body: {
        en: "Diesel remains the default for standby power in the GCC. Where piped gas is available and run hours are high, gas generators cut fuel cost. For low or variable loads — telecom shelters, farms, remote camps — hybrid generator-plus-battery and solar-hybrid systems reduce engine hours dramatically.",
        ar: "يبقى الديزل الخيار الافتراضي للطاقة الاحتياطية في الخليج. وحيث يتوفر الغاز وتكون ساعات التشغيل طويلة، تقلل مولدات الغاز تكلفة الوقود. أما للأحمال المنخفضة أو المتغيرة — محطات الاتصالات والمزارع والمخيمات النائية — فإن أنظمة المولد مع البطاريات والأنظمة الشمسية الهجينة تقلل ساعات تشغيل المحرك بشكل كبير.",
      },
    },
    {
      title: { en: "How to size a generator for your site", ar: "كيف تختار حجم المولد لموقعك" },
      body: {
        en: "Add up the running load in kW, divide by the power factor (typically 0.8) to get kVA, check the starting demand of your largest motor, then add a 20–25% margin for Gulf heat and growth. Use our kVA calculator below — it rounds up to a real catalog rating and suggests the matching ATS panel.",
        ar: "اجمع الحمل التشغيلي بالكيلوواط، واقسمه على معامل القدرة (عادةً 0.8) لتحصل على ك.ف.أ، وتحقق من تيار بدء أكبر محرك لديك، ثم أضف هامشاً من 20 إلى 25% لحرارة الخليج والتوسع. استخدم حاسبة القدرة أدناه، فهي تقرّب النتيجة إلى قدرة حقيقية من الكتالوج وتقترح لوحة ATS المناسبة.",
      },
    },
    {
      title: { en: "What's included with every generator", ar: "ما يشمله كل مولد" },
      body: { en: "Every quotation clearly lists:", ar: "كل عرض سعر يوضح بدقة:" },
      bullets: [
        { en: "Site-rated output at your ambient temperature", ar: "القدرة الفعلية في الموقع حسب درجة الحرارة المحيطة" },
        { en: "Engine, alternator and controller make and model", ar: "ماركة وموديل المحرك والدينامو ووحدة التحكم" },
        { en: "Enclosure type, noise level and fuel tank autonomy", ar: "نوع الهيكل ومستوى الضوضاء ومدة تشغيل خزان الوقود" },
        { en: "Datasheet, test report and delivery lead time", ar: "النشرة الفنية وتقرير الاختبار ومدة التسليم" },
      ],
    },
  ],
  productsTitle: { en: "Generator range", ar: "مجموعة المولدات" },
  waTopic: { en: "a diesel generator", ar: "مولد ديزل" },
  cta: {
    title: { en: "Get generator prices on WhatsApp", ar: "احصل على أسعار المولدات عبر الواتساب" },
    body: {
      en: "Tell us the kVA, fuel type and delivery city. We reply with 2–3 engine options, lead times and a written quotation.",
      ar: "أخبرنا بالقدرة ونوع الوقود ومدينة التسليم، وسنرد بخيارين أو ثلاثة من المحركات مع مدة التسليم وعرض سعر مكتوب.",
    },
  },
  relatedPosts: ["how-to-choose-the-right-kva-generator", "perkins-vs-cummins-vs-kubota-engine-brand-uae", "diesel-vs-gas-generators-gcc-climate"],
};

export const atsPillar: Pillar = {
  eyebrow: { en: "Automatic transfer switch panels", ar: "لوحات التحويل الأوتوماتيكي" },
  h1: {
    en: "ATS Panel Supplier in the UAE — Automatic Transfer Switches 63–4000 A",
    ar: "لوحات ATS في الإمارات — لوحات تحويل أوتوماتيكي من 63 إلى 4000 أمبير",
  },
  intro: {
    en: "Automatic transfer switch panels that start your generator and take over the load within seconds of a power cut — configured to your generator, earthing system and utility requirements in Sharjah, Dubai, Abu Dhabi, Saudi Arabia and Iraq.",
    ar: "لوحات تحويل أوتوماتيكي تشغّل المولد وتنقل الحمل خلال ثوانٍ من انقطاع الكهرباء، مجهزة حسب المولد ونظام التأريض ومتطلبات الهيئات في الشارقة ودبي وأبوظبي والسعودية والعراق.",
  },
  highlights: [
    { title: { en: "63 – 4000 A", ar: "63 – 4000 أمبير" }, body: { en: "Motorised, contactor & ACB types", ar: "مفتاح مُحرَّك أو كونتاكتور أو قواطع ACB" } },
    { title: { en: "3P / 4P", ar: "3 أو 4 أقطاب" }, body: { en: "Switched neutral where required", ar: "فصل خط التعادل عند الحاجة" } },
    { title: { en: "5–15 s transfer", ar: "تحويل خلال 5–15 ثانية" }, body: { en: "Adjustable timers & cool-down", ar: "مؤقتات قابلة للضبط وتبريد" } },
    { title: { en: "IP54 / IP65", ar: "IP54 / IP65" }, body: { en: "Indoor or outdoor enclosures", ar: "أغلفة داخلية أو خارجية" } },
  ],
  sections: [
    {
      title: { en: "What an ATS panel does", ar: "ما وظيفة لوحة ATS" },
      body: {
        en: "An automatic transfer switch monitors mains voltage and frequency. When supply fails it signals the generator to start, waits for stable output, transfers the load, and returns it to mains once the grid is healthy — then lets the engine cool down before stopping. No one needs to be on site.",
        ar: "تراقب لوحة التحويل الأوتوماتيكي جهد وتردد الكهرباء العامة. عند الانقطاع ترسل إشارة لتشغيل المولد، وتنتظر استقرار الخرج، ثم تنقل الحمل، وتعيده للشبكة عند عودتها، وتترك المحرك يبرد قبل إيقافه، دون الحاجة لوجود أحد في الموقع.",
      },
    },
    {
      title: { en: "ATS panel types we supply", ar: "أنواع لوحات ATS التي نوردها" },
      body: { en: "We select the switching technology to suit the rating and duty:", ar: "نختار تقنية التحويل حسب السعة ونوع التشغيل:" },
      bullets: [
        { en: "Motorised changeover ATS — compact and cost-effective, 63–1600 A", ar: "ATS بمفتاح تحويل مُحرّك — صغير واقتصادي، من 63 إلى 1600 أمبير" },
        { en: "Contactor-based ATS — simple and fast for smaller loads", ar: "ATS بالكونتاكتورات — بسيط وسريع للأحمال الصغيرة" },
        { en: "ACB changeover panels — 630–4000 A with protection and metering", ar: "لوحات تحويل بقواطع ACB — من 630 إلى 4000 أمبير مع الحماية والقياس" },
        { en: "Multi-source logic — mains / generator / generator and bypass options", ar: "منطق متعدد المصادر — كهرباء / مولد / مولد مع خيار التجاوز" },
      ],
    },
    {
      title: { en: "Sizing an automatic transfer switch", ar: "كيف تختار سعة لوحة التحويل الأوتوماتيكي" },
      body: {
        en: "Size the ATS to the generator's full-load current, or the incoming mains breaker if larger. At 400 V three-phase, current ≈ kVA × 1.44: a 250 kVA generator needs a 400 A ATS, a 500 kVA set an 800 A panel. Our kVA calculator recommends the ATS rating automatically.",
        ar: "اختر سعة ATS حسب تيار الحمل الكامل للمولد، أو قاطع التغذية الرئيسي إن كان أكبر. على 400 فولت ثلاثي الأطوار يكون التيار ≈ ك.ف.أ × 1.44: فالمولد 250 ك.ف.أ يحتاج لوحة 400 أمبير، والمولد 500 ك.ف.أ يحتاج لوحة 800 أمبير. حاسبة القدرة لدينا تقترح سعة ATS تلقائياً.",
      },
    },
    {
      title: { en: "Built for UAE plant rooms and utility approval", ar: "مصممة لغرف الكهرباء في الإمارات ومتطلبات الهيئات" },
      body: {
        en: "Powder-coated IP54 enclosures (IP65 for outdoor), mechanical and electrical interlocks, clear labelling and function testing before dispatch. Panels can be configured to DEWA, SEWA, ADDC/TAQA or SEC requirements on request.",
        ar: "أغلفة مطلية IP54 (وIP65 للخارج)، وتشابك ميكانيكي وكهربائي، وتعليم واضح، واختبار وظيفي قبل الشحن. ويمكن تجهيز اللوحات حسب متطلبات هيئة كهرباء ومياه دبي (ديوا) أو هيئة الشارقة (سيوا) أو أبوظبي للتوزيع (أدك) أو الشركة السعودية للكهرباء عند الطلب.",
      },
    },
  ],
  productsTitle: { en: "ATS panel range", ar: "مجموعة لوحات ATS" },
  waTopic: { en: "an ATS panel", ar: "لوحة ATS" },
  cta: {
    title: { en: "Send your generator details — get the matching ATS", ar: "أرسل بيانات المولد واحصل على لوحة ATS المناسبة" },
    body: {
      en: "Share the generator kVA (or a nameplate photo) and your main breaker size on WhatsApp. We'll propose the right ATS panel and price the same day.",
      ar: "أرسل قدرة المولد (أو صورة لوحة البيانات) وسعة القاطع الرئيسي على الواتساب، وسنقترح لوحة ATS المناسبة مع السعر في نفس اليوم.",
    },
  },
  relatedPosts: ["ats-panels-explained", "how-to-choose-the-right-kva-generator", "switchgear-maintenance-checklist"],
};

export const switchgearPillar: Pillar = {
  eyebrow: { en: "LV switchgear · MDB · Sync panels", ar: "لوحات جهد منخفض · MDB · تزامن" },
  h1: {
    en: "Switchgear, MDB & Control Panel Supplier in Sharjah, UAE",
    ar: "لوحات كهرباء ولوحات توزيع MDB ولوحات تحكم في الشارقة — الإمارات",
  },
  intro: {
    en: "Low voltage switchboards, main distribution boards, generator control and synchronising panels — configured to your single-line diagram and supplied with the documentation consultants and utilities expect.",
    ar: "لوحات جهد منخفض ولوحات توزيع رئيسية ولوحات تحكم وتزامن المولدات، مجهزة حسب المخطط أحادي الخط ومرفقة بالمستندات التي يطلبها الاستشاريون والهيئات.",
  },
  highlights: [
    { title: { en: "Up to 6300 A", ar: "حتى 6300 أمبير" }, body: { en: "ACB incomers, MCCB feeders", ar: "مداخل ACB ومخارج MCCB" } },
    { title: { en: "IEC 61439", ar: "IEC 61439" }, body: { en: "Designed to the assembly standard", ar: "مصممة وفق معيار التجميع" } },
    { title: { en: "Form 2 – 4b", ar: "Form 2 – 4b" }, body: { en: "Internal separation to spec", ar: "فصل داخلي حسب المواصفات" } },
    { title: { en: "2–16 gensets", ar: "2–16 مولداً" }, body: { en: "Synchronising & load sharing", ar: "تزامن وتوزيع أحمال" } },
  ],
  sections: [
    {
      title: { en: "Low voltage switchgear", ar: "لوحات الجهد المنخفض" },
      body: {
        en: "Main LV switchboards built around air circuit breaker incomers and moulded-case feeders, with metering, surge protection and capacitor banks as required. Suitable for commercial towers, factories, warehouses and infrastructure projects across the UAE and GCC.",
        ar: "لوحات جهد منخفض رئيسية بمداخل قواطع هوائية ACB ومخارج MCCB، مع القياس والحماية من الارتفاعات المفاجئة ولوحات المكثفات حسب الحاجة، مناسبة للأبراج التجارية والمصانع والمستودعات ومشاريع البنية التحتية في الإمارات والخليج.",
      },
    },
    {
      id: "mdb",
      title: { en: "Main distribution boards (MDB, SMDB, DB)", ar: "لوحات التوزيع الرئيسية والفرعية (MDB وSMDB وDB)" },
      body: {
        en: "MDBs from 100 A to 4000 A with tinned copper busbars, clear circuit labelling and test certificates — ready for DEWA, SEWA, ADDC/TAQA or FEWA inspection. We also supply SMDBs and final DBs so the whole distribution system comes from one source.",
        ar: "لوحات توزيع رئيسية من 100 إلى 4000 أمبير بقضبان نحاسية مقصدرة وتعليم واضح للدوائر وشهادات اختبار، جاهزة لفحص هيئة كهرباء ومياه دبي (ديوا) أو هيئة الشارقة (سيوا) أو أبوظبي للتوزيع (أدك) أو اتحاد الماء والكهرباء. كما نورد اللوحات الفرعية والنهائية ليأتي نظام التوزيع بالكامل من مصدر واحد.",
      },
    },
    {
      id: "synchronizing-panels",
      title: { en: "Generator synchronising panels", ar: "لوحات تزامن المولدات" },
      body: {
        en: "Run two or more generators as one plant. Synchronising panels provide automatic paralleling, load sharing, load-demand start/stop and optional mains paralleling — adding redundancy, allowing maintenance without blackout and improving fuel economy at part load.",
        ar: "شغّل مولدين أو أكثر كمحطة واحدة. توفر لوحات التزامن التوازي التلقائي وتوزيع الأحمال والتشغيل والإيقاف حسب الطلب مع خيار التوازي مع الشبكة، ما يضيف الاعتمادية ويسمح بالصيانة دون انقطاع ويحسن استهلاك الوقود عند الأحمال الجزئية.",
      },
    },
    {
      title: { en: "Generator control & AMF panels", ar: "لوحات تحكم المولدات والتشغيل التلقائي AMF" },
      body: {
        en: "Stand-alone control and auto-mains-failure panels with Deep Sea, ComAp or SmartGen controllers — ideal for upgrading older generators with remote start, protection and monitoring.",
        ar: "لوحات تحكم مستقلة وتشغيل تلقائي عند انقطاع الكهرباء بوحدات Deep Sea أو ComAp أو SmartGen، مثالية لتحديث المولدات القديمة بالتشغيل عن بُعد والحماية والمراقبة.",
      },
    },
    {
      title: { en: "What we need to quote", ar: "ما نحتاجه لتقديم عرض السعر" },
      body: { en: "Send any of the following and we'll turn it into a priced proposal:", ar: "أرسل أياً مما يلي وسنحوله إلى عرض سعر:" },
      bullets: [
        { en: "Single-line diagram (SLD) or load schedule", ar: "المخطط أحادي الخط أو جدول الأحمال" },
        { en: "Consultant specification or utility requirements", ar: "مواصفات الاستشاري أو متطلبات الهيئة" },
        { en: "Photos of existing panels for retrofit projects", ar: "صور اللوحات الحالية لمشاريع التحديث" },
      ],
    },
  ],
  productsTitle: { en: "Switchgear, MDB & sync panel range", ar: "مجموعة لوحات الجهد المنخفض والتوزيع والتزامن" },
  waTopic: { en: "switchgear / MDB panels", ar: "لوحات جهد منخفض / لوحات توزيع" },
  cta: {
    title: { en: "Send your SLD for a switchgear quotation", ar: "أرسل المخطط أحادي الخط للحصول على عرض سعر" },
    body: {
      en: "WhatsApp us your single-line diagram or load schedule. Our team will review it and reply with a configured, priced proposal.",
      ar: "أرسل لنا المخطط أحادي الخط أو جدول الأحمال على الواتساب، وسيراجعه فريقنا ويرد بعرض سعر مفصّل.",
    },
  },
  relatedPosts: ["switchgear-maintenance-checklist", "ats-panels-explained", "export-markets-uae-ksa-iraq"],
};
