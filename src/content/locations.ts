import type { MarketCode } from "@/lib/types";
import type { L10n } from "@/lib/utils";
import type { Faq } from "./faq";

/**
 * City landing pages ("generator supplier in <city>"). Each city carries its own facts — utility
 * authority, delivery route and time from SAIF Zone, climate and the sectors we typically supply there —
 * so every page is specific to that location. Delivery times are typical and confirmed per order.
 */
export type City = {
  slug: string;
  market: MarketCode;
  name: L10n;
  region: L10n;
  authority: L10n;
  delivery: L10n;
  climate: L10n;
  sectors: L10n;
  angle: L10n;
  popular: number[];
};

export const cities: City[] = [
  {
    slug: "dubai",
    market: "uae",
    name: { en: "Dubai", ar: "دبي" },
    region: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    authority: { en: "DEWA", ar: "هيئة كهرباء ومياه دبي (ديوا)" },
    delivery: { en: "Same or next day — about 30–45 minutes from our SAIF Zone warehouse", ar: "في نفس اليوم أو اليوم التالي، على بُعد 30 إلى 45 دقيقة من مستودعنا في سيف زون" },
    climate: { en: "50 °C summers and humid coastal air: radiators and canopies are specified for derated Gulf conditions", ar: "صيف يصل إلى 50 درجة ورطوبة ساحلية؛ لذلك نحدد المبردات والكبائن لظروف الخليج مع حساب خفض القدرة" },
    sectors: { en: "towers, hotels, malls, data rooms, warehouses in Jebel Ali and Al Quoz, and construction sites", ar: "الأبراج والفنادق والمولات وغرف البيانات والمستودعات في جبل علي والقوز ومواقع البناء" },
    angle: {
      en: "Dubai projects run on tight handover dates and consultant approvals. We supply standby sets with ATS panels and MDBs prepared for DEWA inspection, low-noise canopies for residential areas, and synchronised plants for towers and data rooms.",
      ar: "مشاريع دبي تعمل بمواعيد تسليم ضيقة وموافقات استشاريين. نورّد مولدات احتياطية مع لوحات ATS ولوحات توزيع مجهزة لفحص ديوا، وكبائن منخفضة الضوضاء للمناطق السكنية، ومحطات متزامنة للأبراج وغرف البيانات.",
    },
    popular: [100, 250, 500, 1000],
  },
  {
    slug: "abu-dhabi",
    market: "uae",
    name: { en: "Abu Dhabi", ar: "أبوظبي" },
    region: { en: "Abu Dhabi, UAE", ar: "أبوظبي، الإمارات" },
    authority: { en: "ADDC / TAQA Distribution", ar: "أبوظبي للتوزيع (طاقة للتوزيع)" },
    delivery: { en: "Next day — about 2 hours by road from SAIF Zone", ar: "في اليوم التالي، نحو ساعتين بالطريق من سيف زون" },
    climate: { en: "Extreme inland heat towards Al Dhafra and Mussafah: we size for high ambient and dust", ar: "حرارة داخلية شديدة نحو الظفرة ومصفح؛ نحدد الحجم لدرجات الحرارة المرتفعة والغبار" },
    sectors: { en: "industrial plants in ICAD and Mussafah, oil & gas camps, government buildings, hospitals and infrastructure", ar: "المصانع في آيكاد ومصفح ومخيمات النفط والغاز والمباني الحكومية والمستشفيات ومشاريع البنية التحتية" },
    angle: {
      en: "Abu Dhabi buyers often need prime-rated or heavy-duty sets for industrial and remote sites. We supply Cummins and Perkins sets up to 2500 kVA, containerised plants with bulk fuel, and panels built to ADDC requirements.",
      ar: "يحتاج العملاء في أبوظبي غالباً إلى مولدات بقدرة أساسية أو للخدمة الشاقة للمواقع الصناعية والنائية. نورّد مولدات كمنز وبيركنز حتى 2500 ك.ف.أ ومحطات داخل حاويات مع خزانات وقود كبيرة ولوحات حسب متطلبات أدك.",
    },
    popular: [200, 500, 1000, 2000],
  },
  {
    slug: "sharjah",
    market: "uae",
    name: { en: "Sharjah", ar: "الشارقة" },
    region: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    authority: { en: "SEWA", ar: "هيئة كهرباء ومياه الشارقة (سيوا)" },
    delivery: { en: "Same day — collect from our SAIF Zone warehouse or we deliver", ar: "في نفس اليوم؛ استلام من مستودعنا في سيف زون أو نوصل إليك" },
    climate: { en: "Hot, humid summers; industrial areas need sets that run long hours reliably", ar: "صيف حار ورطب، والمناطق الصناعية تحتاج مولدات تعمل لساعات طويلة بموثوقية" },
    sectors: { en: "factories and warehouses in Sharjah industrial areas and Hamriyah, schools, clinics and residential buildings", ar: "المصانع والمستودعات في المناطق الصناعية بالشارقة والحمرية والمدارس والعيادات والمباني السكنية" },
    angle: {
      en: "We are based in SAIF Zone, Sharjah — so Sharjah customers can inspect the generator before dispatch, collect the same day, and reach our engineers directly for service.",
      ar: "مقرنا في المنطقة الحرة لمطار الشارقة، لذلك يمكن لعملائنا في الشارقة معاينة المولد قبل الشحن واستلامه في نفس اليوم والتواصل مباشرة مع مهندسينا للصيانة.",
    },
    popular: [60, 150, 300, 500],
  },
  {
    slug: "ajman",
    market: "uae",
    name: { en: "Ajman", ar: "عجمان" },
    region: { en: "Ajman, UAE", ar: "عجمان، الإمارات" },
    authority: { en: "Etihad Water & Electricity", ar: "الاتحاد للماء والكهرباء" },
    delivery: { en: "Same day — about 20–30 minutes from SAIF Zone", ar: "في نفس اليوم، نحو 20 إلى 30 دقيقة من سيف زون" },
    climate: { en: "Coastal humidity and salt air: we recommend coated canopies and regular service", ar: "رطوبة ساحلية وهواء مالح؛ نوصي بكبائن مطلية وصيانة دورية" },
    sectors: { en: "workshops and factories in Ajman Industrial Area, residential towers, schools and retail", ar: "الورش والمصانع في منطقة عجمان الصناعية والأبراج السكنية والمدارس والمحلات التجارية" },
    angle: {
      en: "Ajman is minutes from our warehouse, which makes it ideal for fast replacements: when a set fails, we can deliver and connect a stock unit the same day.",
      ar: "تبعد عجمان دقائق عن مستودعنا، ما يجعلها مثالية للاستبدال السريع؛ فعند تعطل مولد يمكننا توصيل وحدة من المخزون وتوصيلها في نفس اليوم.",
    },
    popular: [30, 100, 200, 400],
  },
  {
    slug: "ras-al-khaimah",
    market: "uae",
    name: { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
    region: { en: "Ras Al Khaimah, UAE", ar: "رأس الخيمة، الإمارات" },
    authority: { en: "Etihad Water & Electricity", ar: "الاتحاد للماء والكهرباء" },
    delivery: { en: "Same or next day — about 1 hour by road", ar: "في نفس اليوم أو اليوم التالي، نحو ساعة بالطريق" },
    climate: { en: "Mountain quarries and coastal resorts: dust and humidity both matter", ar: "محاجر جبلية ومنتجعات ساحلية؛ الغبار والرطوبة كلاهما مهم" },
    sectors: { en: "quarries and crushers, cement and ceramics plants, resorts on the coast and construction", ar: "المحاجر والكسارات ومصانع الإسمنت والسيراميك والمنتجعات الساحلية ومشاريع البناء" },
    angle: {
      en: "Quarries and plants in RAK run heavy motor loads far from the grid. We size prime-rated sets for crusher and conveyor starting, with fuel tanks and light towers for night shifts.",
      ar: "تشغّل المحاجر والمصانع في رأس الخيمة أحمال محركات ثقيلة بعيداً عن الشبكة. نحدد مولدات بقدرة أساسية لبدء تشغيل الكسارات والسيور، مع خزانات وقود وأبراج إنارة للورديات الليلية.",
    },
    popular: [250, 500, 750, 1000],
  },
  {
    slug: "fujairah",
    market: "uae",
    name: { en: "Fujairah", ar: "الفجيرة" },
    region: { en: "Fujairah, UAE", ar: "الفجيرة، الإمارات" },
    authority: { en: "Etihad Water & Electricity", ar: "الاتحاد للماء والكهرباء" },
    delivery: { en: "Next day — about 1.5 hours across the Hajar mountains", ar: "في اليوم التالي، نحو ساعة ونصف عبر جبال الحجر" },
    climate: { en: "Port humidity and salt spray: marine-grade protection recommended", ar: "رطوبة الميناء ورذاذ الملح؛ نوصي بحماية مناسبة للبيئة البحرية" },
    sectors: { en: "port and oil-terminal facilities, hotels on the east coast, quarries and farms", ar: "مرافق الميناء ومحطات النفط والفنادق على الساحل الشرقي والمحاجر والمزارع" },
    angle: {
      en: "For Fujairah port and terminal sites we supply standby and prime sets with synchronising panels, plus coated enclosures that hold up to the coastal environment.",
      ar: "لمواقع ميناء الفجيرة ومحطاتها نورّد مولدات احتياطية وأساسية مع لوحات تزامن، وأغلفة مطلية تتحمل البيئة الساحلية.",
    },
    popular: [100, 300, 650, 1250],
  },
  {
    slug: "al-ain",
    market: "uae",
    name: { en: "Al Ain", ar: "العين" },
    region: { en: "Al Ain, UAE", ar: "العين، الإمارات" },
    authority: { en: "AADC / TAQA Distribution", ar: "العين للتوزيع (طاقة للتوزيع)" },
    delivery: { en: "Next day — about 2 hours by road", ar: "في اليوم التالي، نحو ساعتين بالطريق" },
    climate: { en: "The hottest inland conditions in the UAE: generous radiator and derating margins", ar: "أشد الظروف الداخلية حرارة في الإمارات؛ هوامش أكبر للمبرد وخفض القدرة" },
    sectors: { en: "farms and irrigation, poultry and dairy, hospitals, universities and border-area facilities", ar: "المزارع والري ومزارع الدواجن والألبان والمستشفيات والجامعات والمنشآت الحدودية" },
    angle: {
      en: "Al Ain's farms and agri-businesses are where solar-hybrid systems pay back fastest: we supply PV, batteries and backup gensets as one system, sized for pumps and cold rooms.",
      ar: "في مزارع العين والأعمال الزراعية تسترد الأنظمة الشمسية الهجينة تكلفتها بأسرع وقت؛ نورّد الألواح والبطاريات والمولد الاحتياطي كنظام واحد بحجم يناسب المضخات وغرف التبريد.",
    },
    popular: [30, 80, 150, 300],
  },
  {
    slug: "riyadh",
    market: "saudi-arabia",
    name: { en: "Riyadh", ar: "الرياض" },
    region: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
    authority: { en: "Saudi Electricity Company (SEC)", ar: "الشركة السعودية للكهرباء" },
    delivery: { en: "Typically 3–6 days overland via the Batha border, with export documents", ar: "عادةً من 3 إلى 6 أيام براً عبر منفذ البطحاء مع مستندات التصدير" },
    climate: { en: "Dry heat above 45 °C and dust storms: heavy-duty air filtration and 60 Hz options", ar: "حرارة جافة فوق 45 درجة وعواصف غبار؛ فلاتر هواء للخدمة الشاقة وخيارات 60 هرتز" },
    sectors: { en: "giga-project construction, warehouses and logistics hubs, hospitals, malls and data centres", ar: "مشاريع البناء الكبرى والمستودعات ومراكز الخدمات اللوجستية والمستشفيات والمولات ومراكز البيانات" },
    angle: {
      en: "Saudi Arabia runs at 60 Hz in parts of the network and SASO documentation applies to imports. We configure sets for 60 Hz where needed and prepare the commercial invoice, packing list and certificate of origin for clearance.",
      ar: "تعمل أجزاء من الشبكة السعودية بتردد 60 هرتز وتنطبق متطلبات هيئة المواصفات على الواردات. نجهز المولدات بتردد 60 هرتز عند الحاجة ونعد الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ للتخليص.",
    },
    popular: [250, 500, 1000, 2000],
  },
  {
    slug: "jeddah",
    market: "saudi-arabia",
    name: { en: "Jeddah", ar: "جدة" },
    region: { en: "Jeddah, Saudi Arabia", ar: "جدة، المملكة العربية السعودية" },
    authority: { en: "Saudi Electricity Company (SEC)", ar: "الشركة السعودية للكهرباء" },
    delivery: { en: "Typically 5–8 days overland, or by sea on project basis", ar: "عادةً من 5 إلى 8 أيام براً، أو بحراً حسب المشروع" },
    climate: { en: "Hot and humid Red Sea coast: corrosion protection and good ventilation", ar: "ساحل البحر الأحمر الحار والرطب؛ حماية من التآكل وتهوية جيدة" },
    sectors: { en: "hotels and hospitality, hospitals, port logistics, residential compounds and construction", ar: "الفنادق والضيافة والمستشفيات وخدمات الميناء والمجمعات السكنية ومشاريع البناء" },
    angle: {
      en: "For Jeddah hospitality and healthcare we supply silent standby sets with fast-transfer ATS panels, with full documentation for consultants and SEC.",
      ar: "لقطاعي الضيافة والرعاية الصحية في جدة نورّد مولدات احتياطية صامتة مع لوحات ATS سريعة التحويل ومستندات كاملة للاستشاريين والشركة السعودية للكهرباء.",
    },
    popular: [150, 400, 750, 1250],
  },
  {
    slug: "dammam",
    market: "saudi-arabia",
    name: { en: "Dammam & Al Khobar", ar: "الدمام والخبر" },
    region: { en: "Eastern Province, Saudi Arabia", ar: "المنطقة الشرقية، المملكة العربية السعودية" },
    authority: { en: "Saudi Electricity Company (SEC)", ar: "الشركة السعودية للكهرباء" },
    delivery: { en: "Typically 2–4 days overland — the closest Saudi market to the UAE", ar: "عادةً من 2 إلى 4 أيام براً، وهي أقرب سوق سعودي للإمارات" },
    climate: { en: "Humid Gulf coast with industrial dust: robust filtration and coated canopies", ar: "ساحل خليجي رطب مع غبار صناعي؛ فلترة قوية وكبائن مطلية" },
    sectors: { en: "oil & gas services, Jubail and Dammam industrial cities, workshops, camps and warehouses", ar: "خدمات النفط والغاز والمدن الصناعية في الجبيل والدمام والورش والمخيمات والمستودعات" },
    angle: {
      en: "Eastern Province industry needs prime-rated sets and switchgear that survive heat and continuous duty. We supply Cummins and Perkins sets, sync panels and MCCs, trucked directly from Sharjah.",
      ar: "تحتاج صناعة المنطقة الشرقية إلى مولدات بقدرة أساسية ولوحات تتحمل الحرارة والتشغيل المتواصل. نورّد مولدات كمنز وبيركنز ولوحات تزامن ومراكز تحكم بالمحركات مشحونة مباشرة من الشارقة.",
    },
    popular: [300, 500, 1000, 1500],
  },
  {
    slug: "baghdad",
    market: "iraq",
    name: { en: "Baghdad", ar: "بغداد" },
    region: { en: "Baghdad, Iraq", ar: "بغداد، العراق" },
    authority: { en: "Ministry of Electricity", ar: "وزارة الكهرباء" },
    delivery: { en: "By sea to Umm Qasr then road, or overland — typically 2–4 weeks", ar: "بحراً إلى أم قصر ثم براً، أو براً مباشرة، عادةً من 2 إلى 4 أسابيع" },
    climate: { en: "Summers above 50 °C and long daily outages: sets run as prime power for many hours", ar: "صيف فوق 50 درجة وانقطاعات يومية طويلة؛ تعمل المولدات كقدرة أساسية لساعات طويلة" },
    sectors: { en: "neighbourhood (ambeer) generators, hospitals, malls, factories and government buildings", ar: "مولدات الأحياء (الأمبيرات) والمستشفيات والمولات والمصانع والمباني الحكومية" },
    angle: {
      en: "In Baghdad the generator is often the main supply. We focus on prime-rated engines with large fuel tanks, and synchronised multi-set plants for neighbourhood and commercial supply.",
      ar: "في بغداد يكون المولد غالباً هو المصدر الرئيسي للكهرباء. نركز على محركات بقدرة أساسية مع خزانات وقود كبيرة، ومحطات متعددة المولدات متزامنة لتغذية الأحياء والمنشآت التجارية.",
    },
    popular: [250, 500, 1000, 1500],
  },
  {
    slug: "erbil",
    market: "iraq",
    name: { en: "Erbil", ar: "أربيل" },
    region: { en: "Erbil, Kurdistan Region of Iraq", ar: "أربيل، إقليم كردستان العراق" },
    authority: { en: "Kurdistan Ministry of Electricity", ar: "وزارة الكهرباء في إقليم كردستان" },
    delivery: { en: "Overland or via Umm Qasr — typically 2–4 weeks", ar: "براً أو عبر أم قصر، عادةً من 2 إلى 4 أسابيع" },
    climate: { en: "Hot summers and cold winters: cold-start aids and wide operating range", ar: "صيف حار وشتاء بارد؛ أدوات مساعدة للتشغيل البارد ونطاق تشغيل واسع" },
    sectors: { en: "hotels, malls, residential projects, oil & gas services and factories", ar: "الفنادق والمولات والمشاريع السكنية وخدمات النفط والغاز والمصانع" },
    angle: {
      en: "Erbil projects need sets that start reliably in winter and run hard in summer. We add jacket-water heaters and battery chargers as standard and supply sync panels for growing sites.",
      ar: "تحتاج مشاريع أربيل إلى مولدات تبدأ بموثوقية في الشتاء وتعمل بقوة في الصيف. نضيف سخانات مياه التبريد وشواحن البطاريات كمعيار ونورّد لوحات تزامن للمواقع التي تتوسع.",
    },
    popular: [200, 400, 750, 1000],
  },
  {
    slug: "basra",
    market: "iraq",
    name: { en: "Basra", ar: "البصرة" },
    region: { en: "Basra, Iraq", ar: "البصرة، العراق" },
    authority: { en: "Ministry of Electricity", ar: "وزارة الكهرباء" },
    delivery: { en: "By sea to Umm Qasr — the fastest route into Iraq, typically 1–3 weeks", ar: "بحراً إلى ميناء أم قصر، وهو أسرع طريق إلى العراق، عادةً من 1 إلى 3 أسابيع" },
    climate: { en: "Extreme heat and humidity on the Gulf: high-ambient radiators essential", ar: "حرارة ورطوبة شديدتان على الخليج؛ المبردات المخصصة للحرارة العالية ضرورية" },
    sectors: { en: "oil field services and camps, port operations, hospitals and residential supply", ar: "خدمات حقول النفط والمخيمات وعمليات الميناء والمستشفيات وتغذية المناطق السكنية" },
    angle: {
      en: "Basra's oil-field and port sites run 24/7. We supply containerised prime-power plants, fuel systems and load banks, shipped via Umm Qasr with complete export paperwork.",
      ar: "تعمل مواقع حقول النفط والميناء في البصرة على مدار الساعة. نورّد محطات قدرة أساسية داخل حاويات وأنظمة وقود وأحمال اختبار، مشحونة عبر أم قصر مع مستندات تصدير كاملة.",
    },
    popular: [500, 1000, 1500, 2500],
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

export function cityFaq(c: City): Faq[] {
  const n = c.name;
  return [
    {
      q: { en: `Do you deliver generators to ${n.en}?`, ar: `هل توصلون المولدات إلى ${n.ar}؟` },
      a: { en: `Yes. ${c.delivery.en}. Delivery times are confirmed with your quotation.`, ar: `نعم. ${c.delivery.ar}. نؤكد مدة التسليم مع عرض السعر.` },
    },
    {
      q: { en: `Can your ATS and distribution panels meet ${c.authority.en} requirements?`, ar: `هل تطابق لوحات ATS والتوزيع لديكم متطلبات ${c.authority.ar}؟` },
      a: {
        en: `On request we build ATS panels and MDBs to ${c.authority.en} requirements and the consultant's specification, with test certificates and clear labelling.`,
        ar: `عند الطلب نجهّز لوحات ATS ولوحات التوزيع حسب متطلبات ${c.authority.ar} ومواصفات الاستشاري، مع شهادات الاختبار والتعليم الواضح.`,
      },
    },
    {
      q: { en: `What generator sizes are most requested in ${n.en}?`, ar: `ما أحجام المولدات الأكثر طلباً في ${n.ar}؟` },
      a: {
        en: `For ${c.sectors.en}, we most often quote ${c.popular.map((k) => `${k} kVA`).join(", ")}. Use our kVA calculator or send your load list for an exact size.`,
        ar: `لـ${c.sectors.ar}، نقدم عروضاً في الغالب لأحجام ${c.popular.map((k) => `${k} ك.ف.أ`).join(" و")}. استخدم حاسبة القدرة أو أرسل قائمة الأحمال لتحديد الحجم بدقة.`,
      },
    },
    {
      q: { en: `Do you offer warranty and maintenance in ${n.en}?`, ar: `هل تقدمون الضمان والصيانة في ${n.ar}؟` },
      a: {
        en: "Every product carries a 12-month warranty. We offer maintenance contracts, repairs and load-bank testing, and support remote sites with spare parts shipped from Sharjah.",
        ar: "كل منتج مشمول بضمان 12 شهراً، ونقدم عقود صيانة وإصلاح واختبار بأحمال الاختبار، وندعم المواقع البعيدة بقطع غيار تُشحن من الشارقة.",
      },
    },
  ];
}
