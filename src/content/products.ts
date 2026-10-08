import type { Product, SpecRow } from "@/lib/types";
import { extraProducts } from "./products-2";

/**
 * Seed catalog. Mirrors the Supabase `products` table (see supabase/seed/*.sql, generated from this file).
 * CONTENT_TODO: replace illustrative images in /public/images/products with real product photos,
 * and replace the placeholder datasheet with real PDFs per model.
 */
const s = (label_en: string, label_ar: string, value_en: string, value_ar = value_en): SpecRow => ({
  label_en,
  label_ar,
  value_en,
  value_ar,
});

const DATASHEET = "/datasheets/4u-datasheet-placeholder.pdf";

const genCommon = (
  voltage = "400/230 V, 3-phase, 50 Hz (60 Hz on request)",
  voltageAr = "400/230 فولت، 3 أطوار، 50 هرتز (60 هرتز عند الطلب)",
): SpecRow[] => [
  s("Output voltage", "جهد الخرج", voltage, voltageAr),
  s("Enclosure", "الهيكل", "Open frame or sound-attenuated canopy", "إطار مفتوح أو كابينة عازلة للصوت"),
  s("Controller", "وحدة التحكم", "Deep Sea / ComAp auto-start (AMF)", "Deep Sea / ComAp تشغيل تلقائي (AMF)"),
  s("Ambient rating", "ظروف التشغيل", "Configured for 50 °C GCC ambient", "مهيأ لحرارة الخليج حتى 50 °م"),
];

const coreProducts: Product[] = [
  {
    category: "generator",
    slug: "perkins-diesel-generator-10-200kva",
    name_en: "Perkins Diesel Generator 10–200 kVA",
    name_ar: "مولد ديزل بيركنز 10–200 كيلو فولت أمبير",
    kva_min: 10,
    kva_max: 200,
    engine_brand: "Perkins",
    fuel_type: "diesel",
    description_en:
      "Compact Perkins 400 and 1100 Series powered generator sets for villas, shops, telecom sites and light commercial standby. Low fuel consumption, wide parts availability across the GCC and fast delivery from our SAIF Zone warehouse.",
    description_ar:
      "مولدات بمحركات بيركنز من الفئة 400 و1100 للفلل والمحلات ومواقع الاتصالات والاستخدام التجاري الاحتياطي الخفيف. استهلاك وقود منخفض، قطع غيار متوفرة في كل دول الخليج، وتسليم سريع من مستودعنا في المنطقة الحرة بالشارقة.",
    specs: [
      s("Power range", "نطاق القدرة", "10 – 200 kVA (prime / standby)", "10 – 200 ك.ف.أ (أساسي / احتياطي)"),
      s("Engine", "المحرك", "Perkins 400 / 1100 Series, water-cooled", "بيركنز الفئة 400 / 1100، تبريد بالماء"),
      s("Alternator", "المولّد (الدينامو)", "Brushless, H-class insulation", "بدون فرش، عزل فئة H"),
      ...genCommon(),
      s("Fuel tank", "خزان الوقود", "8–12 hour base tank", "خزان قاعدي يكفي 8–12 ساعة"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/perkins-diesel-generator-4u.webp", "/images/products/generator-canopy.svg", "/images/products/generator-open.svg"],
    sort_order: 10,
    is_published: true,
  },
  {
    category: "generator",
    slug: "perkins-diesel-generator-250-2500kva",
    name_en: "Perkins Industrial Generator 250–2500 kVA",
    name_ar: "مولد بيركنز صناعي 250–2500 كيلو فولت أمبير",
    kva_min: 250,
    kva_max: 2500,
    engine_brand: "Perkins",
    fuel_type: "diesel",
    description_en:
      "Heavy-duty Perkins 1300, 2000 and 4000 Series sets for factories, hospitals, data rooms and towers. Supplied as containerised or canopy units, ready for synchronisation and remote monitoring.",
    description_ar:
      "مولدات بيركنز للخدمة الشاقة من الفئات 1300 و2000 و4000 للمصانع والمستشفيات وغرف البيانات والأبراج. تتوفر داخل حاويات أو كبائن، وجاهزة للتزامن والمراقبة عن بُعد.",
    specs: [
      s("Power range", "نطاق القدرة", "250 – 2500 kVA", "250 – 2500 ك.ف.أ"),
      s("Engine", "المحرك", "Perkins 1300 / 2000 / 4000 Series", "بيركنز الفئات 1300 / 2000 / 4000"),
      s("Alternator", "المولّد (الدينامو)", "Brushless, PMG excitation option", "بدون فرش، مع خيار إثارة PMG"),
      ...genCommon(),
      s("Parallel operation", "التشغيل المتوازي", "Sync-ready controller", "وحدة تحكم جاهزة للتزامن"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/perkins-containerized-generator-4u.webp", "/images/products/perkins-diesel-generator-4u.webp", "/images/products/generator-container.svg"],
    sort_order: 20,
    is_published: true,
  },
  {
    category: "generator",
    slug: "cummins-diesel-generator-20-500kva",
    name_en: "Cummins Diesel Generator 20–500 kVA",
    name_ar: "مولد ديزل كمنز 20–500 كيلو فولت أمبير",
    kva_min: 20,
    kva_max: 500,
    engine_brand: "Cummins",
    fuel_type: "diesel",
    description_en:
      "Cummins-engined generator sets known for strong load acceptance — a common choice for construction sites, commercial buildings and rental fleets in the UAE, Saudi Arabia and Iraq.",
    description_ar:
      "مولدات بمحركات كمنز معروفة بقدرتها العالية على تحمّل الأحمال المفاجئة، وهي خيار شائع لمواقع البناء والمباني التجارية وأساطيل التأجير في الإمارات والسعودية والعراق.",
    specs: [
      s("Power range", "نطاق القدرة", "20 – 500 kVA", "20 – 500 ك.ف.أ"),
      s("Engine", "المحرك", "Cummins 4B / 6B / 6C / QSL / QSZ family", "كمنز عائلة 4B / 6B / 6C / QSL / QSZ"),
      s("Alternator", "المولّد (الدينامو)", "Brushless, AVR ±1%", "بدون فرش، منظم جهد ±1%"),
      ...genCommon(),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/cummins-diesel-generator-4u.webp", "/images/products/generator-canopy.svg", "/images/products/generator-open.svg"],
    sort_order: 30,
    is_published: true,
  },
  {
    category: "generator",
    slug: "cummins-diesel-generator-550-2500kva",
    name_en: "Cummins Heavy-Duty Generator 550–2500 kVA",
    name_ar: "مولد كمنز للخدمة الشاقة 550–2500 كيلو فولت أمبير",
    kva_min: 550,
    kva_max: 2500,
    engine_brand: "Cummins",
    fuel_type: "diesel",
    description_en:
      "High-horsepower Cummins QSK / KTA sets for mission-critical standby and continuous prime power in mining, oil & gas and utilities. Available containerised with bulk fuel and synchronising gear.",
    description_ar:
      "مولدات كمنز عالية القدرة من فئة QSK / KTA للطاقة الاحتياطية الحرجة والتشغيل الأساسي المستمر في التعدين والنفط والغاز والمرافق. متوفرة داخل حاويات مع خزانات وقود كبيرة ومعدات تزامن.",
    specs: [
      s("Power range", "نطاق القدرة", "550 – 2500 kVA", "550 – 2500 ك.ف.أ"),
      s("Engine", "المحرك", "Cummins KTA / QSK series", "كمنز فئة KTA / QSK"),
      ...genCommon(),
      s("Duty", "نوع التشغيل", "Standby, prime and continuous ratings", "احتياطي، أساسي ومستمر"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/cummins-containerized-generator-4u.webp", "/images/products/cummins-diesel-generator-4u.webp", "/images/products/generator-container.svg"],
    sort_order: 40,
    is_published: true,
  },
  {
    category: "generator",
    slug: "kubota-silent-generator-10-40kva",
    name_en: "Kubota Silent Generator 10–40 kVA",
    name_ar: "مولد كوبوتا صامت 10–40 كيلو فولت أمبير",
    kva_min: 10,
    kva_max: 40,
    engine_brand: "Kubota",
    fuel_type: "diesel",
    description_en:
      "Ultra-quiet Kubota-powered sets for villas, clinics, retail units and events where noise matters. Compact footprint, single or three-phase output.",
    description_ar:
      "مولدات هادئة جداً بمحركات كوبوتا للفلل والعيادات والمحلات والفعاليات حيث يهم مستوى الضوضاء. حجم صغير وخرج أحادي أو ثلاثي الأطوار.",
    specs: [
      s("Power range", "نطاق القدرة", "10 – 40 kVA", "10 – 40 ك.ف.أ"),
      s("Engine", "المحرك", "Kubota D / V series, water-cooled", "كوبوتا فئة D / V، تبريد بالماء"),
      s("Noise level", "مستوى الضوضاء", "From 62 dB(A) @ 7 m (model dependent)", "من 62 ديسيبل على بعد 7 م (حسب الموديل)"),
      ...genCommon("400/230 V 3-phase or 230 V single-phase, 50 Hz", "400/230 فولت 3 أطوار أو 230 فولت طور واحد، 50 هرتز"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/kubota-diesel-generator-4u.webp", "/images/products/generator-canopy.svg"],
    sort_order: 50,
    is_published: true,
  },
  {
    category: "generator",
    slug: "lister-petter-generator-7-60kva",
    name_en: "Lister Petter Generator 7–60 kVA",
    name_ar: "مولد ليستر بيتر 7–60 كيلو فولت أمبير",
    kva_min: 7,
    kva_max: 60,
    engine_brand: "Lister Petter",
    fuel_type: "diesel",
    description_en:
      "Compact Lister Petter-powered sets built for long, low-maintenance running — a proven choice for farms, telecom sites, workshops and remote cabins.",
    description_ar:
      "مولدات صغيرة بمحركات ليستر بيتر مصممة للتشغيل الطويل بصيانة قليلة، خيار مجرب للمزارع ومواقع الاتصالات والورش والمواقع البعيدة.",
    specs: [
      s("Power range", "نطاق القدرة", "7 – 60 kVA", "7 – 60 ك.ف.أ"),
      s("Engine", "المحرك", "Lister Petter industrial diesel", "ليستر بيتر ديزل صناعي"),
      ...genCommon("400/230 V 3-phase or 230 V single-phase, 50 Hz", "400/230 فولت 3 أطوار أو 230 فولت طور واحد، 50 هرتز"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/lister-petter-diesel-generator-4u.webp", "/images/products/generator-canopy.svg"],
    sort_order: 55,
    is_published: true,
  },
  {
    category: "generator",
    slug: "volvo-penta-generator-80-700kva",
    name_en: "Volvo Penta Generator 80–700 kVA",
    name_ar: "مولد فولفو بنتا 80–700 كيلو فولت أمبير",
    kva_min: 80,
    kva_max: 700,
    engine_brand: "Volvo Penta",
    fuel_type: "diesel",
    description_en:
      "Volvo Penta TAD-series gensets offering excellent fuel economy and clean emissions for hotels, commercial towers and marine-adjacent facilities.",
    description_ar:
      "مولدات فولفو بنتا من فئة TAD توفر كفاءة عالية في استهلاك الوقود وانبعاثات منخفضة، مناسبة للفنادق والأبراج التجارية والمنشآت القريبة من البحر.",
    specs: [
      s("Power range", "نطاق القدرة", "80 – 700 kVA", "80 – 700 ك.ف.أ"),
      s("Engine", "المحرك", "Volvo Penta TAD series", "فولفو بنتا فئة TAD"),
      ...genCommon(),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/volvo-penta-diesel-generator-4u.webp", "/images/products/volvo-penta-containerized-generator-4u.webp", "/images/products/generator-open.svg"],
    sort_order: 60,
    is_published: true,
  },
  {
    category: "generator",
    slug: "baudouin-diesel-generator-20-2500kva",
    name_en: "Baudouin Diesel Generator 20–2500 kVA",
    name_ar: "مولد ديزل بودوان 20–2500 كيلو فولت أمبير",
    kva_min: 20,
    kva_max: 2500,
    engine_brand: "Baudouin",
    fuel_type: "diesel",
    description_en:
      "Baudouin-powered sets (Weichai group) covering compact canopies to containerised prime-power plants — strong value for industry, construction and long running hours.",
    description_ar:
      "مولدات بمحركات بودوان (مجموعة ويتشاي) من الكبائن الصغيرة حتى محطات القدرة الأساسية داخل الحاويات، بقيمة ممتازة للمصانع ومواقع البناء وساعات التشغيل الطويلة.",
    specs: [
      s("Power range", "نطاق القدرة", "20 – 2500 kVA", "20 – 2500 ك.ف.أ"),
      s("Engine", "المحرك", "Baudouin industrial diesel (Weichai group)", "بودوان ديزل صناعي (مجموعة ويتشاي)"),
      s("Packaging", "التجهيز", "Silent canopy or 20/40 ft container", "كابينة صامتة أو حاوية 20/40 قدم"),
      ...genCommon(),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/baudouin-diesel-generator-4u.webp", "/images/products/baudouin-containerized-generator-4u.webp", "/images/products/generator-open.svg"],
    sort_order: 65,
    is_published: true,
  },
  {
    category: "generator",
    slug: "chinese-engine-generator-series-20-1000kva",
    name_en: "Chinese Engine Series Generator 20–1000 kVA",
    name_ar: "مولدات بمحركات صينية 20–1000 كيلو فولت أمبير",
    kva_min: 20,
    kva_max: 1000,
    engine_brand: "Chinese Engine Series",
    fuel_type: "diesel",
    description_en:
      "Value-engineered generator sets built on proven Chinese engine platforms — the budget-conscious option for construction, agriculture and backup power where total cost of ownership comes first.",
    description_ar:
      "مولدات اقتصادية مبنية على منصات محركات صينية مجرّبة، وهي الخيار الأنسب من حيث التكلفة لمواقع البناء والزراعة والطاقة الاحتياطية.",
    specs: [
      s("Power range", "نطاق القدرة", "20 – 1000 kVA", "20 – 1000 ك.ف.أ"),
      s("Engine", "المحرك", "Proven Chinese engine platforms (brand confirmed per quote)", "منصات محركات صينية مجرّبة (تحدد العلامة في عرض السعر)"),
      ...genCommon(),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/chinese-engine-generator-canopy-4u.webp", "/images/products/chinese-engine-generator-open-4u.webp"],
    sort_order: 70,
    is_published: true,
  },
  {
    category: "generator",
    slug: "gas-generator-50-1000kva",
    name_en: "Natural Gas Generator 50–1000 kVA",
    name_ar: "مولد يعمل بالغاز الطبيعي 50–1000 كيلو فولت أمبير",
    kva_min: 50,
    kva_max: 1000,
    engine_brand: null,
    fuel_type: "gas",
    description_en:
      "Natural-gas and LPG generator sets for sites with piped gas — lower running cost and emissions for continuous-duty industrial and commercial applications.",
    description_ar:
      "مولدات تعمل بالغاز الطبيعي أو الغاز المسال للمواقع المتصلة بشبكة غاز، بتكلفة تشغيل وانبعاثات أقل للتطبيقات الصناعية والتجارية ذات التشغيل المستمر.",
    specs: [
      s("Power range", "نطاق القدرة", "50 – 1000 kVA", "50 – 1000 ك.ف.أ"),
      s("Fuel", "الوقود", "Natural gas / LPG", "غاز طبيعي / غاز مسال"),
      ...genCommon(),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/gas-generator-containerized-4u.webp", "/images/products/generator-container.svg"],
    sort_order: 80,
    is_published: true,
  },
  {
    category: "generator",
    slug: "hybrid-battery-generator-20-200kva",
    name_en: "Hybrid Generator + Battery System 20–200 kVA",
    name_ar: "نظام مولد هجين مع بطاريات 20–200 كيلو فولت أمبير",
    kva_min: 20,
    kva_max: 200,
    engine_brand: null,
    fuel_type: "hybrid",
    description_en:
      "Diesel generator paired with a lithium battery bank and smart controller. The engine only runs when needed, cutting fuel use and maintenance on low- or variable-load sites.",
    description_ar:
      "مولد ديزل مقترن بمجموعة بطاريات ليثيوم ووحدة تحكم ذكية، يعمل المحرك فقط عند الحاجة فيقلل استهلاك الوقود والصيانة في المواقع ذات الأحمال المنخفضة أو المتغيرة.",
    specs: [
      s("Power range", "نطاق القدرة", "20 – 200 kVA", "20 – 200 ك.ف.أ"),
      s("Storage", "التخزين", "LiFePO4 battery bank, sized per site", "بطاريات ليثيوم فوسفات الحديد حسب الموقع"),
      s("Typical fuel saving", "التوفير المعتاد في الوقود", "Up to 50% on low-load sites", "حتى 50% في المواقع منخفضة الحمل"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/hybrid-battery-generator-4u.webp", "/images/products/generator-canopy.svg"],
    sort_order: 90,
    is_published: true,
  },
  {
    category: "generator",
    slug: "solar-hybrid-power-system-10-100kva",
    name_en: "Solar-Hybrid Power System 10–100 kVA",
    name_ar: "نظام طاقة هجين بالطاقة الشمسية 10–100 كيلو فولت أمبير",
    kva_min: 10,
    kva_max: 100,
    engine_brand: null,
    fuel_type: "solar",
    description_en:
      "PV array, battery storage and a backup diesel generator integrated under one controller — for farms, remote camps and off-grid sites across the GCC and Africa.",
    description_ar:
      "ألواح شمسية وبطاريات تخزين ومولد ديزل احتياطي تحت وحدة تحكم واحدة، للمزارع والمخيمات النائية والمواقع غير المتصلة بالشبكة في الخليج وأفريقيا.",
    specs: [
      s("Power range", "نطاق القدرة", "10 – 100 kVA", "10 – 100 ك.ف.أ"),
      s("Sources", "مصادر الطاقة", "PV + battery + diesel backup", "ألواح شمسية + بطاريات + ديزل احتياطي"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/solar-hybrid-power-system-4u.webp", "/images/products/generator-canopy.svg"],
    sort_order: 100,
    is_published: true,
  },
  {
    category: "ats_panel",
    slug: "ats-panel-63a-400a",
    name_en: "Automatic Transfer Switch Panel 63–400 A",
    name_ar: "لوحة تحويل أوتوماتيكي ATS من 63 إلى 400 أمبير",
    kva_min: 10,
    kva_max: 275,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "Wall- or floor-mounted ATS panels that switch your load from mains to generator in seconds when power fails — and back again when it returns. Motorised changeover or contactor based, 3- or 4-pole.",
    description_ar:
      "لوحات ATS جدارية أو أرضية تنقل الحمل من الكهرباء العامة إلى المولد خلال ثوانٍ عند انقطاع التيار، وتعيده تلقائياً عند عودته. بمفتاح تحويل مُحرّك أو كونتاكتور، 3 أو 4 أقطاب.",
    specs: [
      s("Current rating", "التيار المقنن", "63 – 400 A", "63 – 400 أمبير"),
      s("Poles", "الأقطاب", "3P or 4P (switched neutral)", "3 أو 4 أقطاب (فصل التعادل)"),
      s("Controller", "وحدة التحكم", "Auto mains-failure with adjustable timers", "كشف انقطاع تلقائي مع مؤقتات قابلة للضبط"),
      s("Enclosure", "الغلاف", "IP54 powder-coated steel (IP65 option)", "حديد مطلي IP54 (خيار IP65)"),
      s("Testing", "الاختبار", "Factory function-tested before dispatch", "مختبرة وظيفياً قبل الشحن"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/ats-panel-63-400a-4u.webp", "/images/products/ats-panel.svg"],
    sort_order: 110,
    is_published: true,
  },
  {
    category: "ats_panel",
    slug: "ats-panel-630a-4000a",
    name_en: "High-Current ATS Panel 630–4000 A",
    name_ar: "لوحة ATS للتيارات العالية من 630 إلى 4000 أمبير",
    kva_min: 276,
    kva_max: 2770,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "Floor-standing ATS and ACB-based changeover panels for industrial plants, hospitals and towers — with metering, bypass and multi-source (mains/generator/generator) logic.",
    description_ar:
      "لوحات تحويل أرضية بقواطع ACB للمصانع والمستشفيات والأبراج، مع قياس رقمي وخيار تجاوز (Bypass) ومنطق تحويل بين عدة مصادر (كهرباء/مولد/مولد).",
    specs: [
      s("Current rating", "التيار المقنن", "630 – 4000 A", "630 – 4000 أمبير"),
      s("Switching device", "جهاز التحويل", "Motorised ACB pair or open-transition ATS", "زوج قواطع ACB مُحرّكة أو ATS انتقال مفتوح"),
      s("Metering", "القياس", "Multifunction meter, Modbus", "عداد متعدد الوظائف، Modbus"),
      s("Form of separation", "نوع الفصل الداخلي", "Up to Form 4b", "حتى Form 4b"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/ats-panel-630-4000a-4u.webp", "/images/products/ats-panel-63-400a-4u.webp", "/images/products/switchgear.svg"],
    sort_order: 120,
    is_published: true,
  },
  {
    category: "switchgear",
    slug: "low-voltage-switchgear-panel",
    name_en: "Low Voltage Switchgear Panel up to 6300 A",
    name_ar: "لوحة مفاتيح جهد منخفض حتى 6300 أمبير",
    kva_min: null,
    kva_max: null,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "Main LV switchboards built around ACB incomers and MCCB feeders for buildings, plants and infrastructure — configured to your single-line diagram and local authority requirements.",
    description_ar:
      "لوحات توزيع رئيسية للجهد المنخفض بقواطع ACB للمداخل وMCCB للمخارج، للمباني والمصانع والبنية التحتية، وتُجهّز وفق المخطط أحادي الخط ومتطلبات هيئة الكهرباء المحلية.",
    specs: [
      s("Rated current", "التيار المقنن", "Up to 6300 A", "حتى 6300 أمبير"),
      s("Short-circuit rating", "تحمّل القصر", "Up to 100 kA / 1 s (design dependent)", "حتى 100 ك.أ / 1 ث (حسب التصميم)"),
      s("Standard", "المعيار", "Designed to IEC 61439", "مصممة وفق IEC 61439"),
      s("Form of separation", "نوع الفصل الداخلي", "Form 2 to Form 4b", "من Form 2 إلى Form 4b"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/lv-switchgear-4u.webp", "/images/products/switchgear.svg"],
    sort_order: 130,
    is_published: true,
  },
  {
    category: "switchgear",
    slug: "generator-control-amf-panel",
    name_en: "Generator Control & AMF Panel",
    name_ar: "لوحة تحكم المولد والتشغيل التلقائي AMF",
    kva_min: 10,
    kva_max: 2500,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "Stand-alone generator control and auto mains-failure panels with remote start, protection and SMS/Ethernet monitoring — ideal for retrofitting older sets.",
    description_ar:
      "لوحات تحكم مستقلة للمولدات مع تشغيل تلقائي عند انقطاع الكهرباء، وتشغيل عن بُعد، وحماية ومراقبة عبر الرسائل أو الشبكة، مثالية لتحديث المولدات القديمة.",
    specs: [
      s("Controllers", "وحدات التحكم", "Deep Sea, ComAp, SmartGen", "Deep Sea وComAp وSmartGen"),
      s("Monitoring", "المراقبة", "Ethernet / GSM / Modbus", "شبكة / GSM / Modbus"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/amf-control-panel-4u.webp", "/images/products/ats-panel.svg"],
    sort_order: 140,
    is_published: true,
  },
  {
    category: "mdb",
    slug: "main-distribution-board-mdb",
    name_en: "Main Distribution Board (MDB) up to 4000 A",
    name_ar: "لوحة التوزيع الرئيسية MDB حتى 4000 أمبير",
    kva_min: null,
    kva_max: null,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "MDBs, SMDBs and DBs for villas, towers, warehouses and factories — busbar-based, fully labelled and supplied with test certificates ready for utility inspection.",
    description_ar:
      "لوحات توزيع رئيسية وفرعية للفلل والأبراج والمستودعات والمصانع، بقضبان نحاسية ومُعلّمة بالكامل ومع شهادات اختبار جاهزة لفحص هيئة الكهرباء.",
    specs: [
      s("Rated current", "التيار المقنن", "100 – 4000 A", "100 – 4000 أمبير"),
      s("Busbar", "القضبان", "Tinned copper, sized per design", "نحاس مقصدر حسب التصميم"),
      s("Types", "الأنواع", "MDB, SMDB, DB, capacitor bank", "MDB وSMDB وDB ولوحات مكثفات"),
      s("Utility approval", "اعتماد الهيئة", "Built to DEWA / SEWA / ADDC / SEC requirements on request", "حسب متطلبات ديوا / سيوا / أدك / السعودية للكهرباء عند الطلب"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/mdb-4u.webp", "/images/products/mdb.svg"],
    sort_order: 150,
    is_published: true,
  },
  {
    category: "sync_panel",
    slug: "generator-synchronizing-panel",
    name_en: "Generator Synchronizing Panel",
    name_ar: "لوحة تزامن المولدات",
    kva_min: 200,
    kva_max: 10000,
    engine_brand: null,
    fuel_type: null,
    description_en:
      "Run two or more generators in parallel as one power plant — load sharing, load-demand start/stop and mains synchronisation for redundancy and fuel efficiency.",
    description_ar:
      "تشغيل مولدين أو أكثر على التوازي كمحطة طاقة واحدة، مع توزيع الأحمال وتشغيل/إيقاف حسب الطلب والتزامن مع الشبكة لتحقيق الاعتمادية وتوفير الوقود.",
    specs: [
      s("Configuration", "التكوين", "2 – 16 generators in parallel", "من 2 إلى 16 مولداً على التوازي"),
      s("Controllers", "وحدات التحكم", "Deep Sea DSE8610 / ComAp InteliGen", "Deep Sea DSE8610 / ComAp InteliGen"),
      s("Functions", "الوظائف", "Load sharing, load-demand, mains paralleling", "توزيع الأحمال، التشغيل حسب الطلب، التوازي مع الشبكة"),
    ],
    spec_sheet_url: DATASHEET,
    images: ["/images/products/synchronizing-panel-4u.webp", "/images/products/sync-panel.svg"],
    sort_order: 160,
    is_published: true,
  },
];

export const products: Product[] = [...coreProducts, ...extraProducts].sort((a, b) => a.sort_order - b.sort_order);
