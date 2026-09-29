import type { Project, Testimonial } from "@/lib/types";

/**
 * CONTENT_TODO: these are REPRESENTATIVE project scopes (typical supply packages), written so the
 * gallery structure is ready. Replace each with a real delivered project + real photos before
 * promoting them as case studies. Do not add client names without written permission.
 */
export const projects: Project[] = [
  {
    slug: "logistics-warehouse-standby-sharjah",
    title_en: "Standby power package for a logistics warehouse",
    title_ar: "حزمة طاقة احتياطية لمستودع لوجستي",
    country: "uae",
    sector: "industrial",
    kva: 500,
    summary_en:
      "500 kVA Perkins canopy set with a 800 A 4-pole ATS panel and 24-hour base tank, sized for racking lights, dock levellers and cold-room compressors.",
    summary_ar:
      "مولد بيركنز 500 ك.ف.أ بكابينة عازلة مع لوحة ATS بسعة 800 أمبير 4 أقطاب وخزان يكفي 24 ساعة، لتغذية الإنارة وأبواب التحميل وضواغط غرف التبريد.",
    images: ["/images/projects/warehouse.svg"],
    is_published: true,
  },
  {
    slug: "residential-tower-backup-dubai",
    title_en: "Life-safety backup for a residential tower",
    title_ar: "طاقة احتياطية لأنظمة السلامة في برج سكني",
    country: "uae",
    sector: "residential",
    kva: 750,
    summary_en:
      "750 kVA Cummins set feeding fire pumps, lifts and stair pressurisation through an ACB changeover panel, with remote monitoring for the facility team.",
    summary_ar:
      "مولد كمنز 750 ك.ف.أ يغذي مضخات الحريق والمصاعد وضغط السلالم عبر لوحة تحويل بقواطع ACB، مع مراقبة عن بُعد لفريق إدارة المبنى.",
    images: ["/images/projects/tower.svg"],
    is_published: true,
  },
  {
    slug: "construction-site-prime-power-riyadh",
    title_en: "Prime power for a construction site",
    title_ar: "طاقة أساسية لموقع إنشاءات",
    country: "saudi-arabia",
    sector: "construction",
    kva: 400,
    summary_en:
      "Two 200 kVA sets with a synchronising panel so one unit can be serviced while the other keeps tower cranes and site offices running.",
    summary_ar:
      "مولدان بقدرة 200 ك.ف.أ مع لوحة تزامن، بحيث يمكن صيانة أحدهما بينما يواصل الآخر تشغيل الرافعات البرجية ومكاتب الموقع.",
    images: ["/images/projects/construction.svg"],
    is_published: true,
  },
  {
    slug: "clinic-standby-jeddah",
    title_en: "Silent standby set for a medical clinic",
    title_ar: "مولد احتياطي صامت لعيادة طبية",
    country: "saudi-arabia",
    sector: "healthcare",
    kva: 100,
    summary_en:
      "100 kVA super-silent Perkins set with a 200 A ATS panel, transfer time under 10 seconds for imaging and refrigeration loads.",
    summary_ar:
      "مولد بيركنز صامت جداً 100 ك.ف.أ مع لوحة ATS بسعة 200 أمبير وزمن تحويل أقل من 10 ثوانٍ لأجهزة الأشعة والتبريد.",
    images: ["/images/projects/clinic.svg"],
    is_published: true,
  },
  {
    slug: "factory-power-plant-baghdad",
    title_en: "Multi-generator plant for a factory",
    title_ar: "محطة مولدات متعددة لمصنع",
    country: "iraq",
    sector: "industrial",
    kva: 2000,
    summary_en:
      "Four 500 kVA containerised sets synchronised on a common bus with load-demand control — sized for long daily grid outages.",
    summary_ar:
      "أربعة مولدات 500 ك.ف.أ داخل حاويات متزامنة على قضيب مشترك مع تحكم حسب الطلب، مصممة لساعات انقطاع الشبكة اليومية الطويلة.",
    images: ["/images/projects/factory.svg"],
    is_published: true,
  },
  {
    slug: "hotel-backup-erbil",
    title_en: "Hotel backup power with MDB upgrade",
    title_ar: "طاقة احتياطية لفندق مع تحديث لوحة التوزيع",
    country: "iraq",
    sector: "hospitality",
    kva: 630,
    summary_en:
      "630 kVA Volvo Penta set, ATS and a new 1600 A main distribution board to separate essential and non-essential loads.",
    summary_ar:
      "مولد فولفو بنتا 630 ك.ف.أ مع لوحة ATS ولوحة توزيع رئيسية جديدة 1600 أمبير لفصل الأحمال الأساسية عن غير الأساسية.",
    images: ["/images/projects/hotel.svg"],
    is_published: true,
  },
  {
    slug: "telecom-sites-doha",
    title_en: "Hybrid power for telecom shelters",
    title_ar: "طاقة هجينة لمحطات الاتصالات",
    country: "qatar",
    sector: "telecom",
    kva: 30,
    summary_en: "30 kVA hybrid generator + battery units that cut engine run-hours on low-load telecom shelters.",
    summary_ar: "وحدات هجينة 30 ك.ف.أ (مولد + بطاريات) تقلل ساعات تشغيل المحرك في محطات الاتصالات منخفضة الحمل.",
    images: ["/images/projects/telecom.svg"],
    is_published: true,
  },
  {
    slug: "farm-solar-hybrid-kenya",
    title_en: "Solar-hybrid system for an agricultural estate",
    title_ar: "نظام شمسي هجين لمزرعة",
    country: "kenya",
    sector: "commercial",
    kva: 60,
    summary_en: "PV, battery storage and a 60 kVA diesel backup powering irrigation pumps and cold storage off-grid.",
    summary_ar: "ألواح شمسية وبطاريات مع مولد ديزل احتياطي 60 ك.ف.أ لتشغيل مضخات الري والتخزين المبرد بعيداً عن الشبكة.",
    images: ["/images/projects/farm.svg"],
    is_published: true,
  },
  {
    slug: "mine-site-prime-south-africa",
    title_en: "Prime power for a remote mining camp",
    title_ar: "طاقة أساسية لمخيم تعدين نائٍ",
    country: "south-africa",
    sector: "oil_gas",
    kva: 1250,
    summary_en: "1250 kVA Cummins containerised set with bulk fuel tank and remote telemetry for load-shedding-proof camp power.",
    summary_ar: "مولد كمنز 1250 ك.ف.أ داخل حاوية مع خزان وقود كبير ومراقبة عن بُعد لتأمين كهرباء المخيم أثناء فترات تخفيف الأحمال.",
    images: ["/images/projects/mine.svg"],
    is_published: true,
  },
];

/**
 * CONTENT_TODO: PLACEHOLDER testimonials. They are seeded as UNPUBLISHED and never render in
 * production unless NEXT_PUBLIC_SHOW_PLACEHOLDER_TESTIMONIALS=true (preview only).
 * Replace with real, attributable client quotes, then set is_published = true in Supabase.
 */
export const testimonials: Testimonial[] = [
  {
    client_name: "Operations Manager",
    client_company: "Logistics company, Sharjah",
    country: "uae",
    quote_en:
      "They sized the generator and ATS together and delivered from SAIF Zone within days. The WhatsApp updates meant we always knew where the order stood.",
    quote_ar: "قاموا باختيار المولد ولوحة ATS معاً وسلّموا من المنطقة الحرة خلال أيام، ومتابعة الواتساب جعلتنا نعرف حالة الطلب دائماً.",
    rating: 5,
    is_published: false,
  },
  {
    client_name: "Project Engineer",
    client_company: "Contractor, Riyadh",
    country: "saudi-arabia",
    quote_en: "Clear datasheets, realistic lead times and a synchronising panel that worked first time on site.",
    quote_ar: "مواصفات واضحة ومواعيد تسليم واقعية ولوحة تزامن عملت من أول تشغيل في الموقع.",
    rating: 5,
    is_published: false,
  },
  {
    client_name: "Procurement Lead",
    client_company: "Manufacturer, Baghdad",
    country: "iraq",
    quote_en: "Export paperwork to Iraq was handled end-to-end. The sets arrived tested and ready for commissioning.",
    quote_ar: "تم التعامل مع أوراق التصدير إلى العراق بالكامل، ووصلت المولدات مختبرة وجاهزة للتشغيل.",
    rating: 5,
    is_published: false,
  },
];
