import type { Product, SpecRow } from "@/lib/types";

/**
 * Solar, lighting, fuel & accessory lines and additional switchgear (from the group profile:
 * solar stations & parks, solar light towers, BESS, fuel systems, canopies, trailers, load banks,
 * MV switchgear up to 33 kV, MCC / VFD, PFC and PLC panels).
 * Specs are typical ranges; each order is confirmed against the project specification.
 */
const s = (label_en: string, label_ar: string, value_en: string, value_ar = value_en): SpecRow => ({ label_en, label_ar, value_en, value_ar });
const DATASHEET = "/datasheets/4u-datasheet-placeholder.pdf";

const base = { kva_min: null, kva_max: null, engine_brand: null, fuel_type: null, spec_sheet_url: DATASHEET, is_published: true } as const;

export const extraProducts: Product[] = [
  // ------------------------------------------------------------------ solar
  {
    ...base,
    category: "solar",
    slug: "solar-pv-panels",
    name_en: "Solar PV Panels 450–700 W",
    name_ar: "ألواح شمسية كهروضوئية 450–700 واط",
    fuel_type: "solar",
    description_en:
      "Tier-1 monocrystalline PV modules for rooftops, farms, telecom sites and solar-hybrid gensets — supplied loose or as complete kits with inverters, mounting structures and cabling.",
    description_ar:
      "ألواح شمسية أحادية البلورة من الفئة الأولى للأسطح والمزارع ومحطات الاتصالات وأنظمة المولدات الهجينة، تُورَّد منفردة أو كحزمة كاملة مع المحولات (الإنفرتر) وهياكل التثبيت والكابلات.",
    specs: [
      s("Module power", "قدرة اللوح", "450 – 700 Wp", "450 – 700 واط ذروة"),
      s("Cell technology", "تقنية الخلايا", "Monocrystalline PERC / TOPCon, bifacial options", "أحادية البلورة PERC / TOPCon مع خيارات ثنائية الوجه"),
      s("Module efficiency", "كفاءة اللوح", "Typically 21 – 23 %", "عادةً 21 – 23%"),
      s("System options", "خيارات النظام", "On-grid, off-grid and hybrid with inverters & batteries", "متصل بالشبكة أو مستقل أو هجين مع الإنفرتر والبطاريات"),
      s("Mounting", "التثبيت", "Rooftop, ground-mount and carport structures", "هياكل للأسطح والأرض ومظلات السيارات"),
      s("Climate", "ظروف التشغيل", "Selected for high-temperature, dusty GCC sites", "مختارة لمواقع الخليج عالية الحرارة والغبار"),
    ],
    images: ["/images/products/solar-pv.svg"],
    sort_order: 200,
  },
  {
    ...base,
    category: "solar",
    slug: "solar-power-stations-parks",
    name_en: "Solar Power Stations & Solar Parks",
    name_ar: "محطات ومزارع الطاقة الشمسية",
    fuel_type: "solar",
    description_en:
      "Design, supply, installation and commissioning of ground-mounted solar stations and parks — from farm and factory plants to utility-scale fields, integrated with generators and switchgear.",
    description_ar:
      "تصميم وتوريد وتركيب وتشغيل محطات ومزارع الطاقة الشمسية الأرضية، من محطات المزارع والمصانع حتى الحقول الكبيرة، مع دمجها بالمولدات ولوحات الكهرباء.",
    specs: [
      s("Plant size", "حجم المحطة", "From 50 kWp to multi-MWp", "من 50 كيلوواط ذروة حتى عدة ميغاواط"),
      s("Scope", "نطاق العمل", "Design, supply, installation, testing & commissioning", "التصميم والتوريد والتركيب والاختبار والتشغيل"),
      s("Configuration", "التكوين", "On-grid, off-grid or solar-diesel hybrid", "متصل بالشبكة أو مستقل أو هجين شمسي-ديزل"),
      s("Integration", "الربط", "LV / MV switchgear, ATS, sync with generators, BESS", "لوحات جهد منخفض ومتوسط، ATS، تزامن مع المولدات، تخزين بالبطاريات"),
      s("Monitoring", "المراقبة", "Remote plant monitoring and reporting", "مراقبة المحطة عن بُعد وتقارير الأداء"),
    ],
    images: ["/images/products/solar-station.svg", "/images/products/solar-pv.svg"],
    sort_order: 210,
  },
  {
    ...base,
    category: "solar",
    slug: "solar-light-tower",
    name_en: "Solar Light Tower (LED)",
    name_ar: "برج إنارة شمسي (LED)",
    fuel_type: "solar",
    description_en:
      "Trailer-mounted LED light tower powered by solar panels and batteries — silent, zero fuel, ideal for construction sites, roads, events and security perimeters.",
    description_ar:
      "برج إنارة LED على مقطورة يعمل بالألواح الشمسية والبطاريات؛ صامت وبدون وقود، مثالي لمواقع الإنشاءات والطرق والفعاليات وأسوار الحماية.",
    specs: [
      s("Lighting", "الإنارة", "4 × LED floodlights", "4 كشافات LED"),
      s("Mast", "الصاري", "Telescopic, typically 7 – 9 m", "تلسكوبي، عادةً 7 – 9 أمتار"),
      s("Power", "مصدر الطاقة", "Solar panels + lithium or gel battery bank", "ألواح شمسية + بطاريات ليثيوم أو جل"),
      s("Operation", "التشغيل", "Dusk-to-dawn automatic, timer or manual", "تلقائي من الغروب حتى الشروق، أو بمؤقت أو يدوي"),
      s("Mobility", "التنقل", "Towable trailer with outriggers", "مقطورة قابلة للسحب مع دعامات تثبيت"),
    ],
    images: ["/images/products/solar-light-tower.svg"],
    sort_order: 220,
  },
  {
    ...base,
    category: "solar",
    slug: "battery-energy-storage-bess",
    name_en: "Battery Energy Storage Systems (BESS)",
    name_ar: "أنظمة تخزين الطاقة بالبطاريات (BESS)",
    fuel_type: "hybrid",
    description_en:
      "Lithium battery storage that stores solar energy, shaves peaks and lets generators run less — cabinet and containerised systems with hybrid inverters and energy management.",
    description_ar:
      "تخزين بالبطاريات الليثيوم يحفظ الطاقة الشمسية ويخفض أحمال الذروة ويقلل ساعات تشغيل المولدات، في خزائن أو حاويات مع إنفرتر هجين ونظام إدارة طاقة.",
    specs: [
      s("Capacity", "السعة", "From 30 kWh cabinets to multi-MWh containers", "من خزائن 30 كيلوواط ساعة حتى حاويات بعدة ميغاواط ساعة"),
      s("Chemistry", "نوع البطاريات", "Lithium iron phosphate (LFP)", "ليثيوم فوسفات الحديد (LFP)"),
      s("Functions", "الوظائف", "Solar shifting, peak shaving, genset hybridisation, backup", "نقل الطاقة الشمسية، خفض الذروة، التشغيل الهجين مع المولد، الطاقة الاحتياطية"),
      s("Cooling", "التبريد", "Air-conditioned enclosures for GCC ambient", "أغلفة مكيفة لحرارة الخليج"),
    ],
    images: ["/images/products/bess.svg"],
    sort_order: 230,
  },

  // ------------------------------------------------------------------ fuel tanks & accessories
  {
    ...base,
    category: "accessories",
    slug: "generator-fuel-tanks",
    name_en: "Generator Fuel Tanks — Base, Day & Bulk",
    name_ar: "خزانات وقود المولدات — قاعدية ويومية ورئيسية",
    fuel_type: "diesel",
    description_en:
      "Double-wall base tanks, day tanks and bulk storage tanks with fuel transfer systems, level gauges and alarms — sized for the run time your site needs.",
    description_ar:
      "خزانات قاعدية مزدوجة الجدار وخزانات يومية وخزانات تخزين رئيسية مع أنظمة نقل الوقود ومؤشرات المنسوب والإنذارات، بأحجام تناسب مدة التشغيل المطلوبة لموقعك.",
    specs: [
      s("Types", "الأنواع", "Sub-base (belly), day tanks, above-ground bulk tanks", "خزانات قاعدية، خزانات يومية، خزانات رئيسية فوق الأرض"),
      s("Capacity", "السعة", "Typically 500 – 50,000 litres", "عادةً 500 – 50,000 لتر"),
      s("Construction", "التصنيع", "Single or double wall steel, painted / galvanised", "حديد بجدار مفرد أو مزدوج، مطلي أو مجلفن"),
      s("Accessories", "الملحقات", "Transfer pumps, level gauge, low/high alarms, leak detection", "مضخات نقل، مؤشر منسوب، إنذارات انخفاض وارتفاع، كشف تسرب"),
      s("Autonomy", "مدة التشغيل", "Sized for 8 h to several days of run time", "بأحجام تكفي من 8 ساعات حتى عدة أيام تشغيل"),
    ],
    images: ["/images/products/fuel-tank.svg"],
    sort_order: 300,
  },
  {
    ...base,
    category: "accessories",
    slug: "diesel-light-tower",
    name_en: "Diesel Light Tower (LED / Metal Halide)",
    name_ar: "برج إنارة بالديزل (LED / ميتال هاليد)",
    fuel_type: "diesel",
    description_en:
      "Towable light towers with a diesel generator, telescopic mast and 4 floodlights — high output for night works on construction sites, mines, ports and events.",
    description_ar:
      "أبراج إنارة قابلة للسحب مزودة بمولد ديزل وصاري تلسكوبي و4 كشافات، بإضاءة قوية لأعمال الليل في مواقع الإنشاءات والمناجم والموانئ والفعاليات.",
    specs: [
      s("Lighting", "الإنارة", "4 × LED or metal-halide floodlights", "4 كشافات LED أو ميتال هاليد"),
      s("Mast", "الصاري", "Telescopic, typically 7 – 9 m, 360° rotation", "تلسكوبي، عادةً 7 – 9 أمتار، دوران 360°"),
      s("Generator", "المولد", "Built-in diesel set with auxiliary socket", "مولد ديزل مدمج مع مقبس خرج إضافي"),
      s("Run time", "مدة التشغيل", "Long-run fuel tank for multi-night operation", "خزان وقود للتشغيل لعدة ليالٍ متواصلة"),
    ],
    images: ["/images/products/light-tower.svg"],
    sort_order: 310,
  },
  {
    ...base,
    category: "accessories",
    slug: "acoustic-canopies-enclosures",
    name_en: "Acoustic Canopies & Generator Enclosures",
    name_ar: "كبائن عازلة للصوت وأغلفة المولدات",
    description_en:
      "Sound-attenuated canopies and weatherproof enclosures for new or existing generator sets — lower noise, better protection from dust, sand and heat.",
    description_ar:
      "كبائن عازلة للصوت وأغلفة مقاومة للعوامل الجوية للمولدات الجديدة أو القائمة، لخفض الضوضاء وحماية أفضل من الغبار والرمال والحرارة.",
    specs: [
      s("Types", "الأنواع", "Silent, super-silent and weatherproof canopies; walk-in enclosures", "كبائن صامتة وفائقة الصمت ومقاومة للعوامل الجوية، وأغلفة يمكن الدخول إليها"),
      s("Noise", "مستوى الضوضاء", "Designed to the site noise limit (dB(A) @ 7 m)", "مصممة حسب حد الضوضاء في الموقع (ديسيبل على بُعد 7 م)"),
      s("Construction", "التصنيع", "Powder-coated steel, rock-wool lining", "حديد مطلي بالبودرة مع بطانة صوف صخري"),
      s("Ventilation", "التهوية", "Sized airflow for 50 °C ambient", "تدفق هواء محسوب لحرارة 50 °م"),
    ],
    images: ["/images/products/cummins-diesel-generator-4u.webp", "/images/products/generator-canopy.svg"],
    sort_order: 320,
  },
  {
    ...base,
    category: "accessories",
    slug: "generator-trailers",
    name_en: "Generator Trailers (Mobile Gensets)",
    name_ar: "مقطورات المولدات (مولدات متنقلة)",
    description_en:
      "Road-towable trailers that turn canopy generators into mobile power for rental fleets, construction sites and events.",
    description_ar:
      "مقطورات قابلة للسحب على الطرق تحوّل المولدات ذات الكبائن إلى طاقة متنقلة لأساطيل التأجير ومواقع الإنشاءات والفعاليات.",
    specs: [
      s("Capacity", "السعة", "Single or tandem axle, sized to the genset weight", "محور مفرد أو مزدوج حسب وزن المولد"),
      s("Features", "المزايا", "Brakes, lights, jockey wheel, lifting points", "فرامل وإضاءة وعجلة أمامية ونقاط رفع"),
      s("Options", "الخيارات", "Integrated fuel tank and cable reel", "خزان وقود مدمج وبكرة كابلات"),
    ],
    images: ["/images/products/generator-trailer.svg"],
    sort_order: 330,
  },
  {
    ...base,
    category: "accessories",
    slug: "load-banks",
    name_en: "Load Banks for Generator Testing",
    name_ar: "أحمال اختبار المولدات (Load Banks)",
    description_en:
      "Resistive and resistive-reactive load banks to test generators and UPS at real load — for commissioning, annual testing and wet-stacking prevention.",
    description_ar:
      "أحمال اختبار مقاومية ومقاومية-حثية لاختبار المولدات وأنظمة UPS تحت حمل حقيقي، للتشغيل الأولي والاختبار السنوي ومنع تراكم الوقود غير المحترق.",
    specs: [
      s("Type", "النوع", "Resistive (kW) or resistive-reactive (kVA, 0.8 pf)", "مقاومي (كيلوواط) أو مقاومي-حثي (ك.ف.أ، معامل قدرة 0.8)"),
      s("Rating", "القدرة", "Portable and containerised units", "وحدات متنقلة وداخل حاويات"),
      s("Control", "التحكم", "Step control with metering and data logging", "تحكم بالخطوات مع القياس وتسجيل البيانات"),
      s("Service", "الخدمة", "Available with our load-bank testing service", "متوفر مع خدمة اختبار الأحمال لدينا"),
    ],
    images: ["/images/products/load-bank.svg"],
    sort_order: 340,
  },

  // ------------------------------------------------------------------ switchgear additions
  {
    ...base,
    category: "switchgear",
    slug: "mv-switchgear-33kv",
    name_en: "MV Switchgear up to 33 kV",
    name_ar: "لوحات الجهد المتوسط حتى 33 ك.ف",
    description_en:
      "Medium-voltage switchgear and ring main units for substations, generator step-up and industrial distribution, supplied with protection relays and metering.",
    description_ar:
      "لوحات جهد متوسط ووحدات حلقية (RMU) للمحطات الفرعية ورفع جهد المولدات والتوزيع الصناعي، مع مرحلات الحماية والقياس.",
    specs: [
      s("Voltage", "الجهد", "Up to 33 kV", "حتى 33 كيلوفولت"),
      s("Types", "الأنواع", "Ring main units, metal-clad / air-insulated panels", "وحدات حلقية RMU، لوحات معدنية ومعزولة بالهواء"),
      s("Protection", "الحماية", "Numerical protection relays, CT / VT metering", "مرحلات حماية رقمية، قياس بمحولات التيار والجهد"),
      s("Components", "المكونات", "Leading brands such as Schneider Electric, ABB, LS Electric (per specification)", "علامات رائدة مثل شنايدر إلكتريك وABB وLS Electric (حسب المواصفات)"),
    ],
    images: ["/images/products/mv-switchgear.svg"],
    sort_order: 125,
  },
  {
    ...base,
    category: "switchgear",
    slug: "mcc-vfd-panels",
    name_en: "Motor Control Centres (MCC) & VFD Panels",
    name_ar: "مراكز التحكم بالمحركات (MCC) ولوحات تشغيل المحركات (VFD)",
    description_en:
      "MCCs with DOL, star-delta, soft-starter and VFD feeders for pumps, fans, compressors and process lines — built to the load schedule.",
    description_ar:
      "مراكز تحكم بالمحركات بمخارج تشغيل مباشر ونجمة-دلتا وبادئ ناعم ومغيّرات سرعة للمضخات والمراوح والضواغط وخطوط الإنتاج، مصنّعة حسب جدول الأحمال.",
    specs: [
      s("Starters", "طرق التشغيل", "DOL, star-delta, soft starter, VFD", "تشغيل مباشر، نجمة-دلتا، بادئ ناعم، مغيّر سرعة"),
      s("Rating", "القدرة", "Motor feeders up to several hundred kW", "مخارج محركات حتى عدة مئات من الكيلوواط"),
      s("Standard", "المعيار", "Assembled to IEC 61439", "مجمّعة وفق IEC 61439"),
      s("Integration", "الربط", "PLC / SCADA interface on request", "ربط مع PLC / SCADA عند الطلب"),
    ],
    images: ["/images/products/mcc-panel.svg"],
    sort_order: 126,
  },
  {
    ...base,
    category: "switchgear",
    slug: "capacitor-bank-pfc-panel",
    name_en: "Capacitor Banks & Power Factor Correction Panels",
    name_ar: "لوحات المكثفات وتحسين معامل القدرة",
    description_en:
      "Automatic power factor correction panels that cut kVA demand and utility penalties — detuned options for harmonic-rich loads.",
    description_ar:
      "لوحات تحسين معامل القدرة الأوتوماتيكية التي تقلل الطلب على القدرة الظاهرية وغرامات شركة الكهرباء، مع خيارات بملفات تنقية للأحمال ذات التوافقيات.",
    specs: [
      s("Rating", "القدرة", "Typically 50 – 1000 kVAr", "عادةً 50 – 1000 ك.ف.أ.ر"),
      s("Control", "التحكم", "Automatic step controller", "وحدة تحكم أوتوماتيكية بالخطوات"),
      s("Options", "الخيارات", "Detuned reactors (7 % / 14 %), harmonic filters", "ملفات تنقية (7% / 14%) ومرشحات توافقيات"),
    ],
    images: ["/images/products/switchgear.svg"],
    sort_order: 127,
  },
  {
    ...base,
    category: "switchgear",
    slug: "plc-control-panels",
    name_en: "PLC & Automation Control Panels",
    name_ar: "لوحات التحكم المبرمجة (PLC) والأتمتة",
    description_en:
      "PLC and HMI control panels for generator plants, pump stations, load-shedding logic and custom power-management schemes.",
    description_ar:
      "لوحات تحكم مبرمجة PLC مع شاشات HMI لمحطات المولدات ومحطات الضخ ومنطق فصل الأحمال وأنظمة إدارة الطاقة المخصصة.",
    specs: [
      s("Controllers", "وحدات التحكم", "PLC + HMI from leading brands (per specification)", "PLC وشاشات HMI من علامات رائدة (حسب المواصفات)"),
      s("Applications", "التطبيقات", "Load management, pump control, generator sequencing", "إدارة الأحمال، التحكم بالمضخات، تسلسل تشغيل المولدات"),
      s("Communication", "الاتصال", "Modbus, Ethernet, remote monitoring", "Modbus وEthernet ومراقبة عن بُعد"),
    ],
    images: ["/images/products/mdb.svg"],
    sort_order: 128,
  },
];
