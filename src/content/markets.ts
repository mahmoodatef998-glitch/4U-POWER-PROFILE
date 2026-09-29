import type { MarketCode } from "@/lib/types";
import type { L10n } from "@/lib/utils";
import type { Faq } from "./faq";

export type MarketPage = {
  code: MarketCode;
  tier: "primary" | "secondary";
  seo: { title: L10n; description: L10n };
  h1: L10n;
  intro: L10n;
  points: { title: L10n; body: L10n }[];
  logistics: L10n;
  focus: L10n;
  faq: Faq[];
};

export const marketPages: MarketPage[] = [
  {
    code: "uae",
    tier: "primary",
    seo: {
      title: {
        en: "Diesel Generator Supplier Sharjah & Dubai, UAE | 4U Power",
        ar: "مولدات ديزل الشارقة ودبي | مورد مولدات في الإمارات",
      },
      description: {
        en: "UAE generator supplier based in SAIF Zone, Sharjah. Diesel generators 10–2500 kVA, ATS panels and MDBs delivered to Dubai, Abu Dhabi and the Northern Emirates.",
        ar: "مورد مولدات في الإمارات من المنطقة الحرة بالشارقة. مولدات ديزل 10–2500 ك.ف.أ ولوحات ATS وMDB مع توصيل لدبي وأبوظبي والإمارات الشمالية.",
      },
    },
    h1: {
      en: "Diesel Generator & ATS Panel Supplier in Sharjah, UAE",
      ar: "مورد مولدات ديزل ولوحات ATS في الشارقة – الإمارات",
    },
    intro: {
      en: "Our warehouse is in SAIF Zone, ten minutes from Sharjah International Airport — which means UAE customers get stock generators, ATS panels and distribution boards on site in days, not weeks. We support contractors, facility managers, factories and villa owners across all seven emirates.",
      ar: "مستودعنا في المنطقة الحرة لمطار الشارقة الدولي، على بعد عشر دقائق من المطار، ما يعني أن عملاءنا في الإمارات يستلمون المولدات ولوحات ATS ولوحات التوزيع المتوفرة خلال أيام وليس أسابيع. نخدم المقاولين وإدارات المرافق والمصانع وأصحاب الفلل في الإمارات السبع.",
    },
    points: [
      {
        title: { en: "Stock in Sharjah", ar: "مخزون في الشارقة" },
        body: {
          en: "Popular 20–500 kVA ratings and ATS panels held locally for fast dispatch to Dubai, Ajman, RAK and Abu Dhabi.",
          ar: "القدرات الشائعة من 20 إلى 500 ك.ف.أ ولوحات ATS متوفرة محلياً للشحن السريع إلى دبي وعجمان ورأس الخيمة وأبوظبي.",
        },
      },
      {
        title: { en: "Utility-ready panels", ar: "لوحات جاهزة لاعتماد الهيئات" },
        body: {
          en: "MDBs and changeover panels configured to DEWA, SEWA, ADDC/TAQA and FEWA requirements on request.",
          ar: "لوحات توزيع وتحويل مجهزة حسب متطلبات ديوا وسيوا وأدك/طاقة واتحاد الماء والكهرباء عند الطلب.",
        },
      },
      {
        title: { en: "Built for 50 °C", ar: "مصممة لحرارة 50 درجة" },
        body: {
          en: "Radiators, canopies and site derating specified for UAE summer conditions — no surprises in August.",
          ar: "المبردات والكبائن ومعامل خفض القدرة محددة لظروف صيف الإمارات، بلا مفاجآت في أغسطس.",
        },
      },
    ],
    logistics: {
      en: "Local delivery by truck with offloading, or collection from Warehouse A2-020, SAIF Zone. Installation and commissioning can be arranged through our partner electrical contractors.",
      ar: "توصيل محلي بالشاحنات مع التنزيل، أو الاستلام من المستودع A2-020 في سيف زون. يمكن ترتيب التركيب والتشغيل عبر شركائنا من مقاولي الكهرباء.",
    },
    focus: {
      en: "Most requested in the UAE: 100–500 kVA canopy generators for buildings and warehouses, 250–800 A ATS panels, and MDBs for villa and G+ projects.",
      ar: "الأكثر طلباً في الإمارات: مولدات بكابينة من 100 إلى 500 ك.ف.أ للمباني والمستودعات، ولوحات ATS من 250 إلى 800 أمبير، ولوحات توزيع لمشاريع الفلل والمباني.",
    },
    faq: [
      {
        q: { en: "Do you deliver generators to Dubai and Abu Dhabi?", ar: "هل توصلون المولدات إلى دبي وأبوظبي؟" },
        a: {
          en: "Yes, we deliver across all emirates. Stock units in Sharjah typically reach Dubai within 1–2 working days and Abu Dhabi within 2–3.",
          ar: "نعم، نوصل لجميع الإمارات. الوحدات المتوفرة في الشارقة تصل عادةً إلى دبي خلال يوم إلى يومين عمل وإلى أبوظبي خلال يومين إلى ثلاثة.",
        },
      },
      {
        q: { en: "What is the price of a 100 kVA generator in the UAE?", ar: "كم سعر مولد 100 ك.ف.أ في الإمارات؟" },
        a: {
          en: "Price depends on engine brand, canopy and controller. Send us your requirement on WhatsApp and we will reply with options from different brands the same working day.",
          ar: "يعتمد السعر على نوع المحرك والكابينة ووحدة التحكم. أرسل متطلباتك على الواتساب وسنرد بخيارات من ماركات مختلفة في نفس يوم العمل.",
        },
      },
    ],
  },
  {
    code: "saudi-arabia",
    tier: "primary",
    seo: {
      title: {
        en: "Generator & ATS Panel Supplier in Saudi Arabia | 4U Power",
        ar: "مولدات ديزل ولوحات ATS في السعودية | فوريو باور",
      },
      description: {
        en: "Diesel generators 10–2500 kVA, ATS panels and switchgear exported from Sharjah to Riyadh, Jeddah and Dammam. Perkins, Cummins & Volvo sets for KSA projects.",
        ar: "مولدات ديزل من 10 إلى 2500 ك.ف.أ ولوحات ATS ولوحات كهرباء تُصدّر من الشارقة إلى الرياض وجدة والدمام. مولدات بيركنز وكمنز وفولفو لمشاريع المملكة.",
      },
    },
    h1: {
      en: "Diesel Generator Supplier for Saudi Arabia — Riyadh, Jeddah & Dammam",
      ar: "مورد مولدات ديزل في المملكة العربية السعودية – الرياض وجدة والدمام",
    },
    intro: {
      en: "Saudi Arabia's construction and industrial pipeline needs reliable standby and prime power, fast. We ship generator sets, ATS panels and synchronising panels by road from Sharjah to every major Saudi city, with the export documentation your clearing agent needs.",
      ar: "تحتاج مشاريع الإنشاءات والصناعة في المملكة إلى طاقة احتياطية وأساسية موثوقة وبسرعة. نشحن المولدات ولوحات ATS ولوحات التزامن برّاً من الشارقة إلى جميع المدن السعودية الكبرى، مع مستندات التصدير التي يحتاجها مخلّصك الجمركي.",
    },
    points: [
      {
        title: { en: "Overland delivery", ar: "شحن برّي" },
        body: {
          en: "Road freight via Al Ghuwaifat/Batha typically reaches Riyadh and Dammam in days, avoiding sea-freight lead times.",
          ar: "الشحن البري عبر منفذ الغويفات/البطحاء يصل عادةً إلى الرياض والدمام خلال أيام، دون انتظار الشحن البحري.",
        },
      },
      {
        title: { en: "60 Hz ready", ar: "جاهزة لتردد 60 هرتز" },
        body: {
          en: "Sets configured for 60 Hz and Saudi voltages (380/220 V or 400/230 V) where required by the project.",
          ar: "مولدات مهيأة لتردد 60 هرتز والجهد السعودي (380/220 أو 400/230 فولت) حسب متطلبات المشروع.",
        },
      },
      {
        title: { en: "Project documentation", ar: "مستندات المشاريع" },
        body: {
          en: "Datasheets, test reports and certificates of origin prepared for consultant submittals and SASO/customs clearance.",
          ar: "نشرات فنية وتقارير اختبار وشهادات منشأ جاهزة لتقديمات الاستشاري والتخليص الجمركي ومتطلبات ساسو.",
        },
      },
    ],
    logistics: {
      en: "DAP/DDP terms can be quoted to your site in Riyadh, Jeddah, Dammam, NEOM-region projects and beyond. We coordinate with your clearing agent for SABER/SASO requirements.",
      ar: "يمكن تسعير الشحن حتى موقعك في الرياض أو جدة أو الدمام أو مشاريع منطقة نيوم وغيرها. ننسق مع مخلّصك الجمركي بخصوص متطلبات سابر/ساسو.",
    },
    focus: {
      en: "Most requested in KSA: 200–1250 kVA Cummins and Perkins sets for construction, synchronising panels for multi-unit sites, and high-current ATS panels.",
      ar: "الأكثر طلباً في السعودية: مولدات كمنز وبيركنز من 200 إلى 1250 ك.ف.أ للإنشاءات، ولوحات تزامن للمواقع متعددة المولدات، ولوحات ATS للتيارات العالية.",
    },
    faq: [
      {
        q: { en: "Can you supply 60 Hz generators for Saudi Arabia?", ar: "هل توفرون مولدات 60 هرتز للسعودية؟" },
        a: {
          en: "Yes. Most engines we supply can be configured for 60 Hz at 1800 rpm; we confirm the rated output at 60 Hz in the quotation.",
          ar: "نعم. معظم المحركات التي نوردها يمكن ضبطها على 60 هرتز بسرعة 1800 دورة، ونؤكد القدرة المقننة عند 60 هرتز في عرض السعر.",
        },
      },
      {
        q: { en: "How long does shipping to Riyadh take?", ar: "كم يستغرق الشحن إلى الرياض؟" },
        a: {
          en: "Road freight from Sharjah to Riyadh usually takes 3–6 days including border clearance, depending on documentation readiness.",
          ar: "الشحن البري من الشارقة إلى الرياض يستغرق عادةً من 3 إلى 6 أيام بما فيها التخليص الحدودي، حسب جاهزية المستندات.",
        },
      },
    ],
  },
  {
    code: "iraq",
    tier: "primary",
    seo: {
      title: {
        en: "Generator Exporter to Iraq | Baghdad, Erbil, Basra | 4U Power",
        ar: "مولدات كهرباء للعراق | تصدير لبغداد وأربيل والبصرة",
      },
      description: {
        en: "Generator exporter to Iraq from Sharjah, UAE: diesel sets 10–2500 kVA, synchronising and ATS panels for Baghdad, Erbil and Basra. Built for long outages.",
        ar: "تصدير مولدات كهرباء إلى العراق من الشارقة: مولدات ديزل من 10 إلى 2500 ك.ف.أ ولوحات تزامن وATS لبغداد وأربيل والبصرة، مصممة لساعات الانقطاع الطويلة.",
      },
    },
    h1: {
      en: "Generator Exporter to Iraq — Diesel Sets, ATS & Sync Panels",
      ar: "تصدير مولدات الكهرباء إلى العراق – مولدات ديزل ولوحات ATS وتزامن",
    },
    intro: {
      en: "In Iraq a generator is rarely just 'backup' — it often carries the site for many hours a day. We specify prime-rated sets, larger fuel tanks and synchronised multi-unit plants so factories, hotels, hospitals and neighbourhood generator operators get power they can rely on.",
      ar: "في العراق نادراً ما يكون المولد مجرد طاقة احتياطية، فهو غالباً يحمل الموقع لساعات طويلة يومياً. لذلك نحدد مولدات بقدرة أساسية وخزانات وقود أكبر ومحطات متعددة متزامنة لتحصل المصانع والفنادق والمستشفيات وأصحاب المولدات الأهلية على كهرباء يمكن الاعتماد عليها.",
    },
    points: [
      {
        title: { en: "Prime-duty specification", ar: "مواصفات التشغيل الأساسي" },
        body: {
          en: "Engines, radiators and alternators selected for long daily run-hours and high dust and heat.",
          ar: "محركات ومبردات ودينامو مختارة لساعات تشغيل يومية طويلة وظروف غبار وحرارة عالية.",
        },
      },
      {
        title: { en: "Sync & load sharing", ar: "تزامن وتوزيع أحمال" },
        body: {
          en: "Parallel several smaller sets instead of one big unit — better fuel economy at part load and no total blackout during service.",
          ar: "تشغيل عدة مولدات أصغر على التوازي بدلاً من مولد واحد كبير، لتوفير الوقود عند الأحمال الجزئية وعدم انقطاع الكهرباء أثناء الصيانة.",
        },
      },
      {
        title: { en: "Export paperwork handled", ar: "مستندات التصدير جاهزة" },
        body: {
          en: "Commercial invoice, packing list and certificate of origin prepared for customs at Umm Qasr or overland entry.",
          ar: "فاتورة تجارية وقائمة تعبئة وشهادة منشأ جاهزة للتخليص في ميناء أم قصر أو المنافذ البرية.",
        },
      },
    ],
    logistics: {
      en: "Shipments by sea to Umm Qasr or by road via Saudi Arabia/Jordan to Baghdad, Erbil, Sulaymaniyah and Basra. We work with your freight forwarder or recommend one.",
      ar: "الشحن بحراً إلى ميناء أم قصر أو برّاً عبر السعودية/الأردن إلى بغداد وأربيل والسليمانية والبصرة. نتعامل مع وكيل الشحن الخاص بك أو نرشح لك واحداً.",
    },
    focus: {
      en: "Most requested in Iraq: 250–1000 kVA prime-rated sets, containerised units with bulk tanks, and synchronising panels for 2–6 generator plants.",
      ar: "الأكثر طلباً في العراق: مولدات بقدرة أساسية من 250 إلى 1000 ك.ف.أ، ووحدات داخل حاويات بخزانات كبيرة، ولوحات تزامن لمحطات من 2 إلى 6 مولدات.",
    },
    faq: [
      {
        q: { en: "Do you ship generators to Erbil and Basra?", ar: "هل تشحنون المولدات إلى أربيل والبصرة؟" },
        a: {
          en: "Yes — by sea to Umm Qasr for the south, and overland for Baghdad and the Kurdistan Region. We quote CIF or DAP depending on your preference.",
          ar: "نعم، بحراً إلى أم قصر للجنوب، وبرّاً لبغداد وإقليم كردستان. نقدم عرض السعر بنظام CIF أو DAP حسب رغبتك.",
        },
      },
      {
        q: { en: "Which generator is best for long daily outages?", ar: "ما أفضل مولد لساعات الانقطاع الطويلة؟" },
        a: {
          en: "Choose a prime-rated set sized so it runs at 60–80% load most of the time, with an extended fuel tank. For larger sites, two or more synchronised units are more resilient than one big set.",
          ar: "اختر مولداً بقدرة أساسية بحيث يعمل بين 60 و80% من حمله معظم الوقت مع خزان وقود ممتد. وللمواقع الكبيرة، مولدان متزامنان أو أكثر أفضل من مولد واحد كبير.",
        },
      },
    ],
  },
  {
    code: "qatar",
    tier: "secondary",
    seo: {
      title: {
        en: "Generator & ATS Panel Supplier for Qatar | Doha | 4U Power",
        ar: "مولدات ولوحات ATS لقطر | توريد إلى الدوحة | فوريو باور",
      },
      description: {
        en: "Diesel generators, hybrid telecom power and ATS panels shipped from Sharjah to Doha and projects across Qatar. Perkins, Cummins and Volvo Penta options.",
        ar: "مولدات ديزل وأنظمة طاقة هجينة للاتصالات ولوحات ATS تُشحن من الشارقة إلى الدوحة ومشاريع قطر، بخيارات بيركنز وكمنز وفولفو بنتا.",
      },
    },
    h1: { en: "Generator Supplier for Qatar", ar: "مورد مولدات كهرباء في قطر" },
    intro: {
      en: "We supply Qatar-based contractors and facility operators with generator sets, ATS panels and hybrid power systems from our Sharjah stock, shipped by road via Saudi Arabia or by sea to Hamad Port.",
      ar: "نورد للمقاولين ومشغلي المرافق في قطر المولدات ولوحات ATS وأنظمة الطاقة الهجينة من مخزوننا في الشارقة، بالشحن البري عبر السعودية أو البحري إلى ميناء حمد.",
    },
    points: [
      {
        title: { en: "Hybrid for telecom & remote sites", ar: "أنظمة هجينة للاتصالات والمواقع النائية" },
        body: {
          en: "Generator + battery systems that cut fuel and engine hours on low-load sites.",
          ar: "مولد مع بطاريات يقلل الوقود وساعات تشغيل المحرك في المواقع منخفضة الحمل.",
        },
      },
      {
        title: { en: "Kahramaa-ready panels", ar: "لوحات جاهزة لمتطلبات كهرماء" },
        body: {
          en: "ATS and distribution panels configured to consultant and Kahramaa requirements on request.",
          ar: "لوحات ATS وتوزيع مهيأة حسب متطلبات الاستشاري وكهرماء عند الطلب.",
        },
      },
    ],
    logistics: {
      en: "Road freight via Saudi Arabia or sea freight to Hamad Port.",
      ar: "شحن بري عبر السعودية أو بحري إلى ميناء حمد.",
    },
    focus: {
      en: "Typical Qatar requests: 30–300 kVA sets, hybrid telecom units and 100–630 A ATS panels.",
      ar: "طلبات قطر المعتادة: مولدات من 30 إلى 300 ك.ف.أ، ووحدات هجينة للاتصالات، ولوحات ATS من 100 إلى 630 أمبير.",
    },
    faq: [],
  },
  {
    code: "kenya",
    tier: "secondary",
    seo: {
      title: {
        en: "Diesel & Solar-Hybrid Generator Supplier Kenya | 4U Power",
        ar: "مولدات ديزل وأنظمة شمسية هجينة لكينيا | فوريو باور",
      },
      description: {
        en: "Diesel generators and solar-hybrid power systems exported from the UAE to Nairobi and Mombasa for farms, factories, hotels and off-grid sites in Kenya.",
        ar: "مولدات ديزل وأنظمة طاقة شمسية هجينة تُصدّر من الإمارات إلى نيروبي ومومباسا للمزارع والمصانع والفنادق والمواقع غير المتصلة بالشبكة في كينيا.",
      },
    },
    h1: { en: "Generator & Solar-Hybrid Supplier for Kenya", ar: "مورد مولدات وأنظمة شمسية هجينة في كينيا" },
    intro: {
      en: "For Kenyan farms, factories and lodges, we combine diesel generators with solar and battery storage to cut fuel bills while keeping power reliable — shipped from Jebel Ali to Mombasa.",
      ar: "للمزارع والمصانع والنُزل في كينيا، نجمع المولدات مع الطاقة الشمسية والبطاريات لتقليل فاتورة الوقود مع الحفاظ على موثوقية الكهرباء، بالشحن من جبل علي إلى مومباسا.",
    },
    points: [
      {
        title: { en: "Solar-hybrid systems", ar: "أنظمة شمسية هجينة" },
        body: {
          en: "PV + battery + generator under one controller for off-grid and weak-grid sites.",
          ar: "ألواح شمسية وبطاريات ومولد تحت وحدة تحكم واحدة للمواقع غير المتصلة أو ضعيفة الشبكة.",
        },
      },
      {
        title: { en: "Rugged diesel sets", ar: "مولدات ديزل متينة" },
        body: {
          en: "Perkins and Chinese-engine sets with wide service support in East Africa.",
          ar: "مولدات بيركنز وبمحركات صينية مع دعم خدمة واسع في شرق أفريقيا.",
        },
      },
    ],
    logistics: {
      en: "Sea freight from Jebel Ali to Mombasa, onward trucking to Nairobi and inland sites.",
      ar: "شحن بحري من جبل علي إلى مومباسا ثم نقل بري إلى نيروبي والمواقع الداخلية.",
    },
    focus: {
      en: "Typical Kenya requests: 20–200 kVA diesel sets and 10–100 kVA solar-hybrid systems.",
      ar: "طلبات كينيا المعتادة: مولدات ديزل من 20 إلى 200 ك.ف.أ وأنظمة شمسية هجينة من 10 إلى 100 ك.ف.أ.",
    },
    faq: [],
  },
  {
    code: "south-africa",
    tier: "secondary",
    seo: {
      title: {
        en: "Diesel Generator Supplier South Africa | Load-Shedding Power",
        ar: "مولدات ديزل لجنوب أفريقيا | حلول تخفيف الأحمال",
      },
      description: {
        en: "Diesel generators, ATS panels and hybrid systems exported from the UAE to Johannesburg, Durban and mining sites — built for load-shedding and prime power.",
        ar: "مولدات ديزل ولوحات ATS وأنظمة هجينة تُصدّر من الإمارات إلى جوهانسبرغ وديربان ومواقع التعدين، مصممة لفترات تخفيف الأحمال والتشغيل الأساسي.",
      },
    },
    h1: { en: "Generator Supplier for South Africa", ar: "مورد مولدات كهرباء في جنوب أفريقيا" },
    intro: {
      en: "Load-shedding turned standby generators into daily-use equipment for South African businesses. We supply prime-capable sets, ATS panels and hybrid battery systems sized for frequent starts and long runs.",
      ar: "حوّل تخفيف الأحمال المولدات الاحتياطية إلى معدات للاستخدام اليومي لدى الشركات في جنوب أفريقيا. نورد مولدات قادرة على التشغيل الأساسي ولوحات ATS وأنظمة بطاريات هجينة مصممة للتشغيل المتكرر والطويل.",
    },
    points: [
      {
        title: { en: "Frequent-start duty", ar: "مصممة للتشغيل المتكرر" },
        body: {
          en: "Controllers and batteries specified for multiple starts per day.",
          ar: "وحدات تحكم وبطاريات مخصصة لعدة مرات تشغيل يومياً.",
        },
      },
      {
        title: { en: "Mining & remote camps", ar: "التعدين والمخيمات النائية" },
        body: {
          en: "Containerised high-kVA sets with bulk fuel and telemetry.",
          ar: "مولدات عالية القدرة داخل حاويات مع خزانات وقود كبيرة ومراقبة عن بُعد.",
        },
      },
    ],
    logistics: {
      en: "Sea freight from Jebel Ali to Durban, with onward delivery to Gauteng and mining regions.",
      ar: "شحن بحري من جبل علي إلى ديربان مع توصيل إلى جوتنغ ومناطق التعدين.",
    },
    focus: {
      en: "Typical South Africa requests: 60–500 kVA sets with ATS, and 1000+ kVA containerised units for mines.",
      ar: "طلبات جنوب أفريقيا المعتادة: مولدات من 60 إلى 500 ك.ف.أ مع ATS، ووحدات داخل حاويات بقدرة تفوق 1000 ك.ف.أ للمناجم.",
    },
    faq: [],
  },
];

export const getMarketPage = (code: string) => marketPages.find((m) => m.code === code);
