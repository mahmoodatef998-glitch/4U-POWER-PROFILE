import type { L10n } from "@/lib/utils";

/**
 * Per-industry sizing content for /industries/[slug]: a worked load example (illustrative loads, not a
 * client project), the generator sizes buyers in that sector usually look at, and the guides that go deeper.
 * The page computes the example: running kW × diversity ÷ 0.8 pf = kVA, + 20 % margin, next standard size.
 */
export type IndustryExtra = {
  example: {
    title: L10n;
    loads: { name: L10n; kw: number }[];
    /** share of the connected load running at the same time */
    diversity: number;
    note: L10n;
  };
  sizes: number[];
  guides: string[];
};

const l = (en: string, ar: string): L10n => ({ en, ar });

export const industryExtras: Record<string, IndustryExtra> = {
  "hospitals-healthcare": {
    example: {
      title: l("Example: a 40-bed day hospital", "مثال: مستشفى نهاري بسعة 40 سريراً"),
      loads: [
        { name: l("Lighting and sockets", "الإنارة والمقابس"), kw: 60 },
        { name: l("Medical equipment and imaging", "الأجهزة الطبية والأشعة"), kw: 80 },
        { name: l("Essential cooling (chillers, AHUs)", "التبريد الأساسي (مبردات ووحدات مناولة الهواء)"), kw: 150 },
        { name: l("Two lifts", "مصعدان"), kw: 30 },
        { name: l("Fire pump", "مضخة الحريق"), kw: 45 },
        { name: l("Medical gas plant and cold rooms", "محطة الغازات الطبية وغرف التبريد"), kw: 20 },
        { name: l("IT, nurse call and security", "تقنية المعلومات ونداء التمريض والأمن"), kw: 15 },
      ],
      diversity: 0.8,
      note: l(
        "For a hospital we would usually split this between two synchronised sets, so one can carry the life-safety load while the other is in service, and set the ATS to transfer within the time your consultant specifies.",
        "في المستشفيات نقسّم هذا الحمل عادةً على مولدين متزامنين، ليحمل أحدهما أحمال سلامة الأرواح أثناء صيانة الآخر، ونضبط لوحة ATS لتحويل الحمل خلال الزمن الذي يحدده الاستشاري.",
      ),
    },
    sizes: [100, 250, 500, 1000, 1500],
    guides: ["generator-for-hospitals-clinics-uae", "ats-panels-explained", "prime-vs-standby-generator-rating"],
  },
  "data-centres-telecom": {
    example: {
      title: l("Example: an outdoor telecom shelter", "مثال: غرفة اتصالات خارجية"),
      loads: [
        { name: l("Radio and transmission equipment", "أجهزة الراديو والإرسال"), kw: 4 },
        { name: l("Rectifiers and battery charging", "الموحّدات وشحن البطاريات"), kw: 3 },
        { name: l("Two split air-conditioners", "مكيفان سبليت"), kw: 6 },
        { name: l("Lighting and aviation light", "الإنارة وإنارة الطيران"), kw: 0.5 },
      ],
      diversity: 1,
      note: l(
        "Telecom loads run around the clock, so the set works on its prime rating; a hybrid battery system can cut the run hours a lot on sites without a grid.",
        "أحمال الاتصالات تعمل على مدار الساعة، فيعمل المولد على قدرته الأساسية. وفي المواقع التي ليس بها شبكة، يقلل نظام البطاريات الهجين ساعات تشغيل المولد كثيراً.",
      ),
    },
    sizes: [20, 30, 50, 500, 1000, 2000],
    guides: ["how-to-choose-the-right-kva-generator", "ats-panel-types-motorized-contactor-acb", "generator-fuel-consumption-chart"],
  },
  "construction-sites": {
    example: {
      title: l("Example: a mid-rise building site", "مثال: موقع إنشاء مبنى متوسط الارتفاع"),
      loads: [
        { name: l("Tower crane", "رافعة برجية"), kw: 55 },
        { name: l("Two material hoists", "رافعتا مواد"), kw: 30 },
        { name: l("Site cabins and air-conditioning", "كبائن الموقع والتكييف"), kw: 40 },
        { name: l("Welding sets and power tools", "ماكينات اللحام والعِدد الكهربائية"), kw: 30 },
        { name: l("Concrete pump", "مضخة الخرسانة"), kw: 20 },
        { name: l("Site lighting", "إنارة الموقع"), kw: 10 },
      ],
      diversity: 0.7,
      note: l(
        "Check the tower crane's starting current: started direct-on-line it can need a bigger set than the running load suggests. Our kVA calculator checks the largest motor start for you.",
        "راجع تيار إقلاع الرافعة البرجية: إذا أُقلعت مباشرة قد تحتاج مولداً أكبر مما يوحي به حمل التشغيل. حاسبة القدرة لدينا تراجع إقلاع أكبر محرك عنك.",
      ),
    },
    sizes: [60, 100, 200, 250, 500],
    guides: ["generator-for-construction-site-uae", "250-kva-generator-guide", "generator-fuel-consumption-chart"],
  },
  "factories-manufacturing": {
    example: {
      title: l("Example: a light-industry workshop", "مثال: ورشة صناعية خفيفة"),
      loads: [
        { name: l("Air compressor (soft starter)", "ضاغط هواء (مع سوفت ستارتر)"), kw: 75 },
        { name: l("Production line machines", "ماكينات خط الإنتاج"), kw: 120 },
        { name: l("Process pumps", "مضخات التشغيل"), kw: 30 },
        { name: l("Factory lighting", "إنارة المصنع"), kw: 20 },
        { name: l("Offices and air-conditioning", "المكاتب والتكييف"), kw: 40 },
      ],
      diversity: 0.75,
      note: l(
        "Large motors decide the size more than the running kW: soft starters or VFDs on the compressor and the biggest machines let a smaller set start them.",
        "المحركات الكبيرة تحدد الحجم أكثر من حمل التشغيل: وجود سوفت ستارتر أو VFD على الضاغط وأكبر الماكينات يسمح لمولد أصغر بتشغيلها.",
      ),
    },
    sizes: [250, 400, 500, 1000, 1500, 2000],
    guides: ["1000-kva-generator-specifications", "generator-full-load-current-kva-to-amps", "ats-panel-types-motorized-contactor-acb"],
  },
  "hotels-malls-buildings": {
    example: {
      title: l("Example: a 12-floor hotel or residential tower (essential loads)", "مثال: فندق أو برج سكني من 12 طابقاً (الأحمال الأساسية)"),
      loads: [
        { name: l("Three lifts", "ثلاثة مصاعد"), kw: 45 },
        { name: l("Fire pump", "مضخة الحريق"), kw: 55 },
        { name: l("Water booster pumps", "مضخات رفع المياه"), kw: 15 },
        { name: l("Corridor and emergency lighting", "إنارة الممرات والطوارئ"), kw: 25 },
        { name: l("Essential cooling (pumps, AHUs)", "التبريد الأساسي (مضخات ووحدات مناولة الهواء)"), kw: 120 },
        { name: l("Kitchen and back-of-house", "المطبخ والخدمات"), kw: 40 },
      ],
      diversity: 0.75,
      note: l(
        "Most buildings back up only the essential loads; an MDB with separate essential and non-essential sections keeps the generator size reasonable.",
        "معظم المباني تغذّي الأحمال الأساسية فقط من المولد، ولوحة توزيع رئيسية بأقسام منفصلة للأحمال الأساسية وغير الأساسية تُبقي حجم المولد معقولاً.",
      ),
    },
    sizes: [250, 400, 500, 750, 1000],
    guides: ["generator-installation-requirements-dubai", "ats-panels-explained", "generator-maintenance-checklist-gulf"],
  },
  "farms-water-pumping": {
    example: {
      title: l("Example: a farm with a borehole and irrigation", "مثال: مزرعة ببئر وري"),
      loads: [
        { name: l("Borehole pump", "مضخة البئر"), kw: 30 },
        { name: l("Irrigation pump", "مضخة الري"), kw: 22 },
        { name: l("Cold store", "مخزن مبرد"), kw: 15 },
        { name: l("Farmhouse", "بيت المزرعة"), kw: 15 },
        { name: l("Lighting", "الإنارة"), kw: 3 },
      ],
      diversity: 0.85,
      note: l(
        "Pumps started direct-on-line draw several times their running current; a soft starter, or a solar-hybrid system for daytime pumping, keeps the set smaller and saves fuel.",
        "المضخات التي تُقلع مباشرة تسحب أضعاف تيار تشغيلها، ووجود سوفت ستارتر أو نظام شمسي هجين للضخ نهاراً يُبقي المولد أصغر ويوفر الوقود.",
      ),
    },
    sizes: [30, 60, 100, 125, 200],
    guides: ["how-to-choose-the-right-kva-generator", "generator-fuel-consumption-chart", "prime-vs-standby-generator-rating"],
  },
};
