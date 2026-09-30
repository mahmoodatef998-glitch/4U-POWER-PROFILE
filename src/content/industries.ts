import type { L10n } from "@/lib/utils";

export type Industry = {
  slug: string;
  icon: "hospital" | "server" | "hardhat" | "factory" | "building" | "sprout";
  name: L10n;
  h1: L10n;
  intro: L10n;
  seo: { title: L10n; description: L10n };
  /** typical sizing, shown as a highlight */
  range: L10n;
  challenges: { title: L10n; body: L10n }[];
  solution: L10n[];
  products: string[];
  faq: { q: L10n; a: L10n }[];
};

export const industries: Industry[] = [
  {
    slug: "hospitals-healthcare",
    icon: "hospital",
    name: { en: "Hospitals & healthcare", ar: "المستشفيات والرعاية الصحية" },
    h1: { en: "Standby generators & ATS for hospitals and clinics in the UAE", ar: "مولدات احتياطية ولوحات ATS للمستشفيات والعيادات في الإمارات" },
    intro: {
      en: "Operating theatres, ICUs, medical gas and cold storage cannot wait for the grid. We supply generator sets, automatic transfer panels and distribution boards sized for critical healthcare loads, with the documentation consultants and authorities ask for.",
      ar: "غرف العمليات والعناية المركزة والغازات الطبية وثلاجات الأدوية لا تحتمل انتظار عودة الكهرباء. نورّد مولدات ولوحات تحويل أوتوماتيكي ولوحات توزيع بأحجام مناسبة للأحمال الحرجة في المنشآت الصحية، مع المستندات التي يطلبها الاستشاريون والهيئات.",
    },
    seo: {
      title: { en: "Hospital Generators & ATS Panels UAE | 4U Power", ar: "مولدات ولوحات ATS للمستشفيات في الإمارات | فور يو باور" },
      description: {
        en: "Standby diesel generators, fast-transfer ATS panels and MDBs for hospitals, clinics and labs in the UAE, KSA and Iraq. Sized for critical loads, quoted same day.",
        ar: "مولدات ديزل احتياطية ولوحات ATS سريعة التحويل ولوحات توزيع للمستشفيات والعيادات والمختبرات في الإمارات والسعودية والعراق، بأحجام مناسبة للأحمال الحرجة وعرض سعر في نفس اليوم.",
      },
    },
    range: { en: "Typical: 60–2500 kVA, often 2+ sets in parallel", ar: "النطاق المعتاد: 60–2500 ك.ف.أ، وغالباً مولدان أو أكثر على التوازي" },
    challenges: [
      {
        title: { en: "Seconds matter", ar: "كل ثانية مهمة" },
        body: {
          en: "Life-safety and critical branches must be back on generator power within seconds; many codes set a 10-second limit.",
          ar: "يجب أن تعود دوائر سلامة الأرواح والأحمال الحرجة إلى المولد خلال ثوانٍ، وكثير من الأكواد تحدد 10 ثوانٍ كحد أقصى.",
        },
      },
      {
        title: { en: "No single point of failure", ar: "لا نقطة فشل واحدة" },
        body: {
          en: "Redundant sets, synchronising panels and bypass-isolation ATS keep power available during maintenance.",
          ar: "المولدات الاحتياطية المزدوجة ولوحات التزامن ولوحات ATS مع التجاوز والعزل تُبقي الكهرباء متاحة أثناء الصيانة.",
        },
      },
      {
        title: { en: "Heavy step loads", ar: "أحمال مفاجئة كبيرة" },
        body: {
          en: "Chillers, imaging equipment and lifts start together; the set must accept the load step without voltage collapse.",
          ar: "المبردات وأجهزة الأشعة والمصاعد تبدأ معاً، ويجب أن يتحمل المولد هذه القفزة دون انهيار الجهد.",
        },
      },
    ],
    solution: [
      { en: "Prime or standby sets on Perkins, Cummins or Volvo Penta engines with AMF controllers", ar: "مولدات احتياطية أو أساسية بمحركات بيركنز أو كمنز أو فولفو بنتا مع وحدات تحكم AMF" },
      { en: "4-pole ATS panels with adjustable timers and transfer in 5–10 seconds", ar: "لوحات ATS رباعية الأقطاب بمؤقتات قابلة للضبط وتحويل خلال 5–10 ثوانٍ" },
      { en: "Synchronising panels for N+1 redundancy and load sharing", ar: "لوحات تزامن لتحقيق احتياطية N+1 وتوزيع الأحمال" },
      { en: "MDBs with separate essential and non-essential sections", ar: "لوحات توزيع رئيسية بأقسام منفصلة للأحمال الأساسية وغير الأساسية" },
    ],
    products: ["cummins-diesel-generator-20-500kva", "ats-panel-630a-4000a", "generator-synchronizing-panel"],
    faq: [
      {
        q: { en: "How fast must a hospital generator take the load?", ar: "ما السرعة المطلوبة لتحويل الحمل إلى مولد المستشفى؟" },
        a: {
          en: "Most healthcare standards require essential circuits to be restored within 10 seconds. We set ATS timers and generator start sequences to meet the limit your consultant specifies.",
          ar: "تشترط معظم معايير الرعاية الصحية إعادة تغذية الدوائر الأساسية خلال 10 ثوانٍ. نضبط مؤقتات لوحة ATS وتسلسل تشغيل المولد لتحقيق الحد الذي يحدده الاستشاري.",
        },
      },
      {
        q: { en: "One large generator or two smaller ones?", ar: "مولد واحد كبير أم مولدان أصغر؟" },
        a: {
          en: "For critical sites we usually recommend two or more synchronised sets: if one is in service, the other carries the essential load.",
          ar: "للمواقع الحرجة نوصي عادةً بمولدين أو أكثر على التزامن؛ فإذا كان أحدهما في الصيانة يحمل الآخر الأحمال الأساسية.",
        },
      },
    ],
  },
  {
    slug: "data-centres-telecom",
    icon: "server",
    name: { en: "Data centres & telecom", ar: "مراكز البيانات والاتصالات" },
    h1: { en: "Generators and switchgear for data centres and telecom sites", ar: "مولدات ولوحات كهرباء لمراكز البيانات ومحطات الاتصالات" },
    intro: {
      en: "The UPS rides through the first seconds; the generator carries the site for hours. We supply sets, synchronising and distribution panels for server rooms, edge data centres and remote telecom shelters across the Gulf.",
      ar: "يتحمّل نظام UPS الثواني الأولى، ويحمل المولد الموقع لساعات. نورّد المولدات ولوحات التزامن والتوزيع لغرف الخوادم ومراكز البيانات الطرفية ومحطات الاتصالات النائية في الخليج.",
    },
    seo: {
      title: { en: "Data Centre & Telecom Generators UAE | 4U Power", ar: "مولدات مراكز البيانات والاتصالات في الإمارات | فور يو باور" },
      description: {
        en: "Standby generators, sync panels and ATS for data centres, server rooms and telecom towers in the UAE, KSA and Iraq. N+1 designs, hybrid options for remote sites.",
        ar: "مولدات احتياطية ولوحات تزامن ولوحات ATS لمراكز البيانات وغرف الخوادم وأبراج الاتصالات في الإمارات والسعودية والعراق، بتصاميم N+1 وخيارات هجينة للمواقع النائية.",
      },
    },
    range: { en: "Typical: 20–100 kVA per telecom site · 500–2500 kVA per data-centre block", ar: "النطاق المعتاد: 20–100 ك.ف.أ لمحطة الاتصالات · 500–2500 ك.ف.أ لكل وحدة في مركز البيانات" },
    challenges: [
      {
        title: { en: "Non-linear UPS loads", ar: "أحمال UPS غير خطية" },
        body: {
          en: "UPS rectifiers distort the waveform; the alternator must be sized for harmonics, not just kW.",
          ar: "مقوّمات UPS تشوّه شكل الموجة، لذلك يجب اختيار الدينامو بما يتحمل التوافقيات، لا حسب الكيلوواط فقط.",
        },
      },
      {
        title: { en: "Redundancy tiers", ar: "مستويات الاحتياطية" },
        body: {
          en: "N+1 or 2N generator plants need synchronising, load sharing and clear maintenance bypass.",
          ar: "محطات المولدات بتصميم N+1 أو 2N تحتاج إلى تزامن وتوزيع أحمال وطريق تجاوز واضح للصيانة.",
        },
      },
      {
        title: { en: "Remote, unmanned sites", ar: "مواقع نائية بلا طاقم" },
        body: {
          en: "Telecom shelters need long fuel autonomy, remote monitoring and fewer engine hours.",
          ar: "محطات الاتصالات تحتاج إلى استقلالية وقود طويلة ومراقبة عن بُعد وساعات تشغيل أقل للمحرك.",
        },
      },
    ],
    solution: [
      { en: "Standby sets with oversized alternators for UPS and harmonic loads", ar: "مولدات احتياطية بدينامو أكبر حجماً لأحمال UPS والتوافقيات" },
      { en: "Synchronising panels for N+1 plants and planned maintenance", ar: "لوحات تزامن لمحطات N+1 والصيانة المخططة" },
      { en: "Hybrid generator-plus-battery systems that cut run hours on telecom sites", ar: "أنظمة مولد مع بطاريات تقلل ساعات التشغيل في محطات الاتصالات" },
      { en: "Controllers with remote monitoring (Deep Sea / ComAp)", ar: "وحدات تحكم بمراقبة عن بُعد (Deep Sea / ComAp)" },
    ],
    products: ["hybrid-battery-generator-20-200kva", "perkins-diesel-generator-250-2500kva", "generator-synchronizing-panel"],
    faq: [
      {
        q: { en: "How do you size a generator for a UPS?", ar: "كيف يُحدد حجم المولد المناسب لنظام UPS؟" },
        a: {
          en: "As a rule of thumb the generator is 1.5–2× the UPS rating depending on rectifier type and battery recharge. Send us the UPS datasheet and we size it exactly.",
          ar: "كقاعدة تقريبية يكون المولد من 1.5 إلى 2 ضعف قدرة UPS حسب نوع المقوّم وشحن البطاريات. أرسل لنا النشرة الفنية للـ UPS ونحدد الحجم بدقة.",
        },
      },
      {
        q: { en: "Can a telecom site run on solar and batteries?", ar: "هل يمكن تشغيل محطة الاتصالات بالطاقة الشمسية والبطاريات؟" },
        a: {
          en: "Yes — a hybrid system runs mostly on batteries and solar, starting the generator only to recharge. Fuel and maintenance visits drop sharply.",
          ar: "نعم، النظام الهجين يعمل غالباً على البطاريات والطاقة الشمسية ويشغّل المولد فقط لإعادة الشحن، فتنخفض زيارات التزود بالوقود والصيانة بشكل كبير.",
        },
      },
    ],
  },
  {
    slug: "construction-sites",
    icon: "hardhat",
    name: { en: "Construction sites", ar: "مواقع الإنشاءات" },
    h1: { en: "Prime-power generators for construction sites in the UAE, KSA and Iraq", ar: "مولدات قدرة أساسية لمواقع الإنشاءات في الإمارات والسعودية والعراق" },
    intro: {
      en: "Before the grid arrives, the generator is the site's power station: tower cranes, batching plants, welding and site offices. We supply prime-rated, canopied sets with the fuel autonomy and distribution to match.",
      ar: "قبل وصول الشبكة يكون المولد هو محطة كهرباء الموقع: الرافعات البرجية ومحطات الخرسانة واللحام ومكاتب الموقع. نورّد مولدات بقدرة أساسية وكبائن مع استقلالية وقود ولوحات توزيع مناسبة.",
    },
    seo: {
      title: { en: "Construction Site Generators UAE & KSA | 4U Power", ar: "مولدات مواقع الإنشاءات في الإمارات والسعودية | فور يو باور" },
      description: {
        en: "Prime-rated diesel generators, site distribution boards and sync panels for construction projects in the UAE, Saudi Arabia and Iraq. Stock in Sharjah, fast delivery.",
        ar: "مولدات ديزل بقدرة أساسية ولوحات توزيع للموقع ولوحات تزامن لمشاريع الإنشاءات في الإمارات والسعودية والعراق. مخزون في الشارقة وتسليم سريع.",
      },
    },
    range: { en: "Typical: 100–1000 kVA per site, scaled as the project grows", ar: "النطاق المعتاد: 100–1000 ك.ف.أ لكل موقع، ويتوسع مع تقدم المشروع" },
    challenges: [
      {
        title: { en: "Motor starting", ar: "بدء تشغيل المحركات" },
        body: {
          en: "Tower cranes and concrete pumps pull 5–7× their running current at start.",
          ar: "الرافعات البرجية ومضخات الخرسانة تسحب من 5 إلى 7 أضعاف تيارها التشغيلي عند البدء.",
        },
      },
      {
        title: { en: "24/7 in the heat", ar: "تشغيل متواصل في الحرارة" },
        body: {
          en: "Continuous duty at 45–50 °C needs prime ratings, derated honestly, and cooling built for the Gulf.",
          ar: "التشغيل المتواصل في 45–50 درجة يحتاج إلى قدرة أساسية بخفض قدرة محسوب بدقة وتبريد مصمم للخليج.",
        },
      },
      {
        title: { en: "Load changes with each phase", ar: "الحمل يتغير مع كل مرحلة" },
        body: {
          en: "Early works need little power, fit-out needs a lot; paralleled sets follow the load.",
          ar: "الأعمال الأولى تحتاج قدرة قليلة والتشطيبات تحتاج الكثير؛ والمولدات المتوازية تتبع الحمل.",
        },
      },
    ],
    solution: [
      { en: "Prime-rated canopied sets with 12–24 h base fuel tanks", ar: "مولدات بقدرة أساسية وكبائن مع خزانات وقود في القاعدة تكفي 12–24 ساعة" },
      { en: "Site MDBs with RCD protection for temporary supplies", ar: "لوحات توزيع للموقع مع حماية من التسرب الأرضي للتغذية المؤقتة" },
      { en: "Two smaller synchronised sets instead of one oversized set", ar: "مولدان أصغر على التزامن بدلاً من مولد واحد كبير أكثر من اللازم" },
      { en: "Overland delivery to Saudi Arabia and Iraq with export documents", ar: "شحن بري إلى السعودية والعراق مع مستندات التصدير" },
    ],
    products: ["cummins-diesel-generator-20-500kva", "chinese-engine-generator-series-20-1000kva", "main-distribution-board-mdb"],
    faq: [
      {
        q: { en: "Standby or prime rating for a construction site?", ar: "قدرة احتياطية أم أساسية لموقع الإنشاءات؟" },
        a: {
          en: "Prime. The generator is the main supply and runs daily for long hours; a standby rating would overload the engine and void its warranty terms.",
          ar: "أساسية؛ فالمولد هو المصدر الرئيسي ويعمل يومياً لساعات طويلة، والقدرة الاحتياطية ستُحمّل المحرك فوق طاقته وتخالف شروط الضمان.",
        },
      },
      {
        q: { en: "How do I size for a tower crane?", ar: "كيف أحدد حجم المولد لرافعة برجية؟" },
        a: {
          en: "Size for the crane's starting kVA, not only its running kW. Our calculator adds the largest-motor start; share the crane datasheet for a firm figure.",
          ar: "احسب حسب قدرة بدء تشغيل الرافعة بالكيلو فولت أمبير وليس قدرتها التشغيلية فقط. حاسبتنا تضيف بدء أكبر محرك، وأرسل النشرة الفنية للرافعة للحصول على رقم دقيق.",
        },
      },
    ],
  },
  {
    slug: "factories-manufacturing",
    icon: "factory",
    name: { en: "Factories & manufacturing", ar: "المصانع والإنتاج" },
    h1: { en: "Industrial generators, switchgear and sync panels for factories", ar: "مولدات صناعية ولوحات جهد منخفض ولوحات تزامن للمصانع" },
    intro: {
      en: "A stopped line costs more than the generator. We supply industrial sets, LV switchgear, capacitor banks and synchronising panels for plants that cannot afford downtime.",
      ar: "توقف خط الإنتاج يكلّف أكثر من المولد نفسه. نورّد المولدات الصناعية ولوحات الجهد المنخفض ولوحات المكثفات ولوحات التزامن للمصانع التي لا تحتمل التوقف.",
    },
    seo: {
      title: { en: "Industrial Generators & Switchgear for Factories | 4U Power", ar: "مولدات صناعية ولوحات كهرباء للمصانع | فور يو باور" },
      description: {
        en: "Industrial diesel and gas generators, LV switchgear, MDB and synchronising panels for factories in the UAE, KSA and Iraq. Heavy motor loads, 24/7 duty, fast quotes.",
        ar: "مولدات ديزل وغاز صناعية ولوحات جهد منخفض ولوحات توزيع وتزامن للمصانع في الإمارات والسعودية والعراق، لأحمال المحركات الثقيلة والتشغيل المتواصل، مع عروض أسعار سريعة.",
      },
    },
    range: { en: "Typical: 250–2500 kVA, multi-set plants above that", ar: "النطاق المعتاد: 250–2500 ك.ف.أ، ومحطات متعددة المولدات لما فوق ذلك" },
    challenges: [
      {
        title: { en: "Large motors and VFDs", ar: "محركات كبيرة ومغيّرات سرعة" },
        body: {
          en: "Compressors, extruders and drives create step loads and harmonics the set must absorb.",
          ar: "الضواغط وآلات البثق ومغيّرات السرعة تولّد أحمالاً مفاجئة وتوافقيات يجب أن يتحملها المولد.",
        },
      },
      {
        title: { en: "Fuel cost over years", ar: "تكلفة الوقود على مدى السنوات" },
        body: {
          en: "Where the set runs daily, efficiency and gas options decide the real cost of ownership.",
          ar: "عندما يعمل المولد يومياً، تحدد الكفاءة وخيارات الغاز التكلفة الحقيقية للملكية.",
        },
      },
      {
        title: { en: "Grid parallel operation", ar: "التشغيل على التوازي مع الشبكة" },
        body: {
          en: "Peak shaving and closed-transition transfer need proper sync and protection.",
          ar: "خفض أحمال الذروة والتحويل دون انقطاع يحتاجان إلى تزامن وحماية مناسبين.",
        },
      },
    ],
    solution: [
      { en: "Heavy-duty Perkins and Cummins sets, 250–2500 kVA", ar: "مولدات بيركنز وكمنز للخدمة الشاقة من 250 إلى 2500 ك.ف.أ" },
      { en: "Gas generators where piped gas is available", ar: "مولدات غاز حيث يتوفر الغاز عبر الأنابيب" },
      { en: "LV switchgear to IEC 61439 with ACB incomers and power-factor correction", ar: "لوحات جهد منخفض وفق IEC 61439 بمداخل ACB وتصحيح معامل القدرة" },
      { en: "Synchronising panels for multi-set plants and grid parallel", ar: "لوحات تزامن لمحطات متعددة المولدات والتوازي مع الشبكة" },
    ],
    products: ["perkins-diesel-generator-250-2500kva", "low-voltage-switchgear-panel", "gas-generator-50-1000kva"],
    faq: [
      {
        q: { en: "Diesel or gas for a factory?", ar: "ديزل أم غاز للمصنع؟" },
        a: {
          en: "Diesel for standby and fast load acceptance; gas when the set runs many hours a year and piped gas is available. We quote both side by side.",
          ar: "الديزل للطاقة الاحتياطية وقبول الأحمال بسرعة، والغاز عندما يعمل المولد ساعات طويلة سنوياً ويتوفر الغاز عبر الأنابيب. نقدّم عرضين جنباً إلى جنب.",
        },
      },
      {
        q: { en: "Can the generator run in parallel with the grid?", ar: "هل يمكن تشغيل المولد على التوازي مع الشبكة؟" },
        a: {
          en: "Yes, with a grid-parallel synchronising panel and the protection your utility requires. Approval is site-specific; we prepare the documents.",
          ar: "نعم، عبر لوحة تزامن مع الشبكة والحمايات التي تطلبها شركة الكهرباء. الموافقة تختلف حسب الموقع، ونجهز المستندات اللازمة.",
        },
      },
    ],
  },
  {
    slug: "hotels-malls-buildings",
    icon: "building",
    name: { en: "Hotels, malls & towers", ar: "الفنادق والمولات والأبراج" },
    h1: { en: "Silent standby generators for hotels, malls and commercial towers", ar: "مولدات احتياطية صامتة للفنادق والمولات والأبراج التجارية" },
    intro: {
      en: "Guests and tenants should never notice an outage. We supply low-noise standby sets, ATS panels and MDBs for hotels, malls, residential towers and offices across the UAE.",
      ar: "لا يجب أن يلاحظ النزلاء أو المستأجرون انقطاع الكهرباء. نورّد مولدات احتياطية منخفضة الضوضاء ولوحات ATS ولوحات توزيع للفنادق والمولات والأبراج السكنية والمكاتب في الإمارات.",
    },
    seo: {
      title: { en: "Hotel & Building Standby Generators UAE | 4U Power", ar: "مولدات احتياطية للفنادق والمباني في الإمارات | فور يو باور" },
      description: {
        en: "Silent canopy generators, ATS panels and MDBs for hotels, malls and towers in Dubai, Sharjah and Abu Dhabi. Lifts, fire pumps and life safety covered.",
        ar: "مولدات بكبائن صامتة ولوحات ATS ولوحات توزيع للفنادق والمولات والأبراج في دبي والشارقة وأبوظبي، تغطي المصاعد ومضخات الحريق وأنظمة السلامة.",
      },
    },
    range: { en: "Typical: 200–1500 kVA per building", ar: "النطاق المعتاد: 200–1500 ك.ف.أ لكل مبنى" },
    challenges: [
      {
        title: { en: "Noise limits", ar: "حدود الضوضاء" },
        body: {
          en: "Sets near rooms and neighbours need sound-attenuated canopies and good exhaust routing.",
          ar: "المولدات القريبة من الغرف والجيران تحتاج إلى كبائن عازلة للصوت وتوجيه جيد للعادم.",
        },
      },
      {
        title: { en: "Life-safety loads first", ar: "أحمال السلامة أولاً" },
        body: {
          en: "Fire pumps, smoke extract and lifts must transfer reliably and in the right order.",
          ar: "مضخات الحريق وشفط الدخان والمصاعد يجب أن تتحول بشكل موثوق وبالترتيب الصحيح.",
        },
      },
      {
        title: { en: "Tight plant rooms", ar: "غرف معدات ضيقة" },
        body: {
          en: "Basement and rooftop plant rooms limit dimensions, ventilation and fuel storage.",
          ar: "غرف المعدات في القبو أو السطح تحدّ من الأبعاد والتهوية وتخزين الوقود.",
        },
      },
    ],
    solution: [
      { en: "Volvo Penta and Perkins sets in sound-attenuated canopies", ar: "مولدات فولفو بنتا وبيركنز في كبائن عازلة للصوت" },
      { en: "ATS panels with load-shed and priority transfer", ar: "لوحات ATS مع فصل الأحمال والتحويل حسب الأولوية" },
      { en: "MDB and SMDB sets prepared for DEWA / SEWA / ADDC inspection", ar: "لوحات توزيع رئيسية وفرعية مجهزة لفحص ديوا وسيوا وأدك" },
      { en: "Dimension drawings for plant-room coordination", ar: "رسومات الأبعاد للتنسيق مع غرف المعدات" },
    ],
    products: ["volvo-penta-generator-80-700kva", "ats-panel-630a-4000a", "main-distribution-board-mdb"],
    faq: [
      {
        q: { en: "How quiet can a building generator be?", ar: "إلى أي درجة يمكن أن يكون مولد المبنى هادئاً؟" },
        a: {
          en: "Super-silent canopies typically reach about 65–75 dB(A) at 7 m depending on size. Tell us the limit and location and we select the enclosure.",
          ar: "الكبائن فائقة العزل تصل عادةً إلى نحو 65–75 ديسيبل على بُعد 7 أمتار حسب الحجم. أخبرنا بالحد المطلوب والموقع ونختار الكابينة المناسبة.",
        },
      },
      {
        q: { en: "Do you supply panels ready for authority inspection?", ar: "هل تورّدون لوحات جاهزة لفحص الهيئة؟" },
        a: {
          en: "On request we build MDBs and ATS panels to DEWA, SEWA or ADDC requirements, with test certificates and labelling.",
          ar: "عند الطلب نجهّز لوحات التوزيع ولوحات ATS حسب متطلبات ديوا أو سيوا أو أدك، مع شهادات الاختبار والتعليم الواضح.",
        },
      },
    ],
  },
  {
    slug: "farms-water-pumping",
    icon: "sprout",
    name: { en: "Farms & water pumping", ar: "المزارع وضخ المياه" },
    h1: { en: "Generators and solar-hybrid power for farms and water pumps", ar: "مولدات وأنظمة شمسية هجينة للمزارع ومضخات المياه" },
    intro: {
      en: "Off-grid farms, wells and irrigation pumps need power that is simple to run and cheap to fuel. We supply compact diesel sets and solar-hybrid systems for agriculture across the UAE, Iraq and Africa.",
      ar: "المزارع البعيدة عن الشبكة والآبار ومضخات الري تحتاج إلى طاقة سهلة التشغيل ومنخفضة تكلفة الوقود. نورّد مولدات ديزل مدمجة وأنظمة شمسية هجينة للقطاع الزراعي في الإمارات والعراق وأفريقيا.",
    },
    seo: {
      title: { en: "Farm & Water Pump Generators | Solar-Hybrid | 4U Power", ar: "مولدات المزارع ومضخات المياه | أنظمة شمسية هجينة | فور يو باور" },
      description: {
        en: "Compact diesel generators and solar-hybrid systems for farms, wells and irrigation pumps in the UAE, Iraq, Kenya and South Africa. Lower fuel cost, simple maintenance.",
        ar: "مولدات ديزل مدمجة وأنظمة شمسية هجينة للمزارع والآبار ومضخات الري في الإمارات والعراق وكينيا وجنوب أفريقيا، بتكلفة وقود أقل وصيانة بسيطة.",
      },
    },
    range: { en: "Typical: 10–200 kVA per farm or pump station", ar: "النطاق المعتاد: 10–200 ك.ف.أ لكل مزرعة أو محطة ضخ" },
    challenges: [
      {
        title: { en: "Pump starting", ar: "بدء تشغيل المضخات" },
        body: {
          en: "Submersible pumps need a set sized for their starting current, or a soft starter / VFD.",
          ar: "المضخات الغاطسة تحتاج إلى مولد بحجم يناسب تيار البدء، أو بادئ تشغيل ناعم أو مغيّر سرعة.",
        },
      },
      {
        title: { en: "Fuel logistics", ar: "صعوبة توصيل الوقود" },
        body: {
          en: "Remote sites pay heavily for every diesel delivery.",
          ar: "المواقع النائية تدفع تكلفة عالية مقابل كل عملية توصيل للديزل.",
        },
      },
      {
        title: { en: "Simple to maintain", ar: "صيانة بسيطة" },
        body: {
          en: "Engines with local parts and service keep the farm running.",
          ar: "المحركات التي تتوفر قطعها وخدمتها محلياً تُبقي المزرعة تعمل.",
        },
      },
    ],
    solution: [
      { en: "Kubota and Perkins compact sets, 10–200 kVA", ar: "مولدات كوبوتا وبيركنز المدمجة من 10 إلى 200 ك.ف.أ" },
      { en: "Solar-hybrid systems that run pumps by day on the sun", ar: "أنظمة شمسية هجينة تشغّل المضخات نهاراً بالطاقة الشمسية" },
      { en: "AMF controllers for automatic start on schedule or level switch", ar: "وحدات تحكم AMF للتشغيل التلقائي حسب الجدول أو مفتاح المنسوب" },
      { en: "Export to Iraq, Kenya and South Africa with documents", ar: "تصدير إلى العراق وكينيا وجنوب أفريقيا مع المستندات" },
    ],
    products: ["solar-hybrid-power-system-10-100kva", "kubota-silent-generator-10-40kva", "perkins-diesel-generator-10-200kva"],
    faq: [
      {
        q: { en: "What size generator for a 30 HP pump?", ar: "ما حجم المولد لمضخة 30 حصاناً؟" },
        a: {
          en: "Roughly 60–80 kVA for direct-on-line starting, or about 45 kVA with a soft starter or VFD. Share the pump nameplate for an exact figure.",
          ar: "تقريباً 60–80 ك.ف.أ للتشغيل المباشر، أو نحو 45 ك.ف.أ مع بادئ ناعم أو مغيّر سرعة. أرسل لوحة بيانات المضخة للحصول على رقم دقيق.",
        },
      },
      {
        q: { en: "Is solar-hybrid worth it for a farm?", ar: "هل النظام الشمسي الهجين مجدٍ للمزرعة؟" },
        a: {
          en: "Where pumps run mostly in daylight, solar can cover most of the energy and the generator becomes the backup — fuel cost falls sharply.",
          ar: "عندما تعمل المضخات غالباً في النهار، يمكن للطاقة الشمسية تغطية معظم الاستهلاك ويصبح المولد احتياطياً، فتنخفض تكلفة الوقود بشكل كبير.",
        },
      },
    ],
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
