import type { L10n } from "@/lib/utils";

export type Faq = { q: L10n; a: L10n };

export const homeFaq: Faq[] = [
  {
    q: { en: "What size generator do I need?", ar: "ما حجم المولد الذي أحتاجه؟" },
    a: {
      en: "Add up the running load in kW, divide by the power factor (usually 0.8) to get kVA, then add a 20–25% margin for motor starting and future growth. Our free kVA calculator does this for you and suggests matching models.",
      ar: "اجمع الحمل التشغيلي بالكيلوواط، ثم اقسمه على معامل القدرة (عادةً 0.8) لتحصل على الكيلو فولت أمبير، ثم أضف هامشاً من 20 إلى 25% لتيار بدء المحركات والتوسع المستقبلي. حاسبة القدرة المجانية لدينا تقوم بذلك وتقترح الموديلات المناسبة.",
    },
  },
  {
    q: { en: "Which generator sizes do you supply?", ar: "ما أحجام المولدات التي توفرونها؟" },
    a: {
      en: "Diesel generator sets from 10 kVA to 2500 kVA with Perkins, Cummins, Kubota, Volvo Penta and Chinese engine options, plus gas, hybrid and solar-hybrid systems. Larger plants are built by synchronising several units.",
      ar: "مولدات ديزل من 10 إلى 2500 ك.ف.أ بمحركات بيركنز وكمنز وكوبوتا وفولفو بنتا والمحركات الصينية، إضافة إلى أنظمة الغاز والهجينة والشمسية الهجينة. المحطات الأكبر تُبنى بتزامن عدة مولدات.",
    },
  },
  {
    q: { en: "Do I need an ATS panel with my generator?", ar: "هل أحتاج لوحة ATS مع المولد؟" },
    a: {
      en: "If you want the generator to take over automatically when mains power fails, yes. An automatic transfer switch detects the outage, starts the generator, transfers the load and switches back when mains returns — with no one on site.",
      ar: "إذا كنت تريد أن يتولى المولد التغذية تلقائياً عند انقطاع الكهرباء فنعم. لوحة التحويل الأوتوماتيكي تكتشف الانقطاع وتشغّل المولد وتنقل الحمل ثم تعيده عند عودة الكهرباء دون الحاجة لوجود أحد في الموقع.",
    },
  },
  {
    q: { en: "Do you export to Saudi Arabia and Iraq?", ar: "هل تصدّرون إلى السعودية والعراق؟" },
    a: {
      en: "Yes. From our SAIF Zone warehouse in Sharjah we ship to Saudi Arabia, Iraq, Qatar, Kenya and South Africa, and prepare the commercial invoice, packing list and certificate of origin for customs.",
      ar: "نعم. من مستودعنا في المنطقة الحرة لمطار الشارقة نشحن إلى السعودية والعراق وقطر وكينيا وجنوب أفريقيا، ونجهز الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ للتخليص الجمركي.",
    },
  },
  {
    q: { en: "How fast can you deliver?", ar: "ما هي مدة التسليم؟" },
    a: {
      en: "Popular ratings are often available from stock for UAE delivery within days. Built-to-order sets and large panels typically take 3–8 weeks depending on engine and switchgear lead times — we confirm dates in writing with every quote.",
      ar: "القدرات الشائعة غالباً متوفرة في المخزون والتسليم داخل الإمارات خلال أيام. المولدات المصنعة حسب الطلب واللوحات الكبيرة تستغرق عادةً من 3 إلى 8 أسابيع حسب توفر المحركات والمفاتيح، ونؤكد المواعيد كتابياً مع كل عرض سعر.",
    },
  },
  {
    q: { en: "What is the difference between kVA and kW?", ar: "ما الفرق بين الكيلو فولت أمبير والكيلوواط؟" },
    a: {
      en: "kW is the real power your equipment uses; kVA is the apparent power the generator must supply. kW = kVA × power factor, so a 100 kVA generator at 0.8 power factor delivers 80 kW.",
      ar: "الكيلوواط هو القدرة الفعلية التي تستهلكها الأجهزة، والكيلو فولت أمبير هو القدرة الظاهرية التي يجب أن يوفرها المولد. الكيلوواط = ك.ف.أ × معامل القدرة، فالمولد 100 ك.ف.أ عند معامل 0.8 يعطي 80 كيلوواط.",
    },
  },
  {
    q: { en: "How do I get a price?", ar: "كيف أحصل على السعر؟" },
    a: {
      en: "Send us your required kVA (or your load list) on WhatsApp at +971 52 336 7694, or use the quote form. We usually reply the same working day with options and a written quotation.",
      ar: "أرسل لنا القدرة المطلوبة (أو قائمة الأحمال) على الواتساب ‎+971 52 336 7694 أو استخدم نموذج طلب السعر. نرد عادةً في نفس يوم العمل بالخيارات وعرض سعر مكتوب.",
    },
  },
];

export const generatorsFaq: Faq[] = [
  {
    q: { en: "Perkins or Cummins — which is better for the UAE?", ar: "بيركنز أم كمنز — أيهما أفضل للإمارات؟" },
    a: {
      en: "Both are proven in GCC heat. Perkins is very common below 200 kVA and has deep parts availability; Cummins is often chosen for strong load acceptance on construction and industrial sites. We quote both so you can compare price, lead time and service coverage.",
      ar: "كلاهما مجرّب في حرارة الخليج. بيركنز منتشر جداً تحت 200 ك.ف.أ وقطع غياره متوفرة بكثرة، وكمنز يُختار غالباً لقدرته على تحمّل الأحمال المفاجئة في المواقع الصناعية والإنشائية. نقدم عرضاً للاثنين لتقارن السعر ومدة التسليم والخدمة.",
    },
  },
  {
    q: { en: "What is the difference between standby and prime rating?", ar: "ما الفرق بين القدرة الاحتياطية والأساسية؟" },
    a: {
      en: "Standby rating is for emergency use while mains is down, with limited annual hours. Prime rating is for sites where the generator is the main source of power and runs for unlimited hours at variable load. Prime is roughly 10% lower than standby for the same set.",
      ar: "القدرة الاحتياطية للاستخدام الطارئ أثناء انقطاع الكهرباء بعدد ساعات سنوية محدود، والقدرة الأساسية للمواقع التي يكون فيها المولد المصدر الرئيسي ويعمل لساعات غير محدودة بحمل متغير. القدرة الأساسية أقل بحوالي 10% من الاحتياطية لنفس المولد.",
    },
  },
  {
    q: { en: "Are your generators suitable for 50 °C ambient?", ar: "هل مولداتكم مناسبة لحرارة 50 درجة؟" },
    a: {
      en: "Yes — we specify radiators, canopies and derating for Gulf summer conditions and confirm the site-rated output in the quotation.",
      ar: "نعم، نحدد المبردات والكبائن ومعامل خفض القدرة وفق ظروف صيف الخليج، ونوضح القدرة الفعلية في الموقع ضمن عرض السعر.",
    },
  },
];

export const atsFaq: Faq[] = [
  {
    q: { en: "How do I size an ATS panel?", ar: "كيف أختار سعة لوحة ATS؟" },
    a: {
      en: "Match the ATS current rating to the generator's full-load current (or the incoming mains breaker, whichever is higher). At 400 V three-phase, current ≈ kVA × 1.44 — so a 250 kVA generator needs about 360 A, meaning a 400 A ATS.",
      ar: "يجب أن تساوي سعة ATS تيار الحمل الكامل للمولد (أو قاطع التغذية الرئيسي أيهما أكبر). عند 400 فولت ثلاثي الفاز، التيار ≈ ك.ف.أ × 1.44، فالمولد 250 ك.ف.أ يحتاج حوالي 360 أمبير أي لوحة ATS بسعة 400 أمبير.",
    },
  },
  {
    q: { en: "3-pole or 4-pole ATS?", ar: "ATS ثلاثي أم رباعي الأقطاب؟" },
    a: {
      en: "4-pole (switched neutral) is recommended when the generator neutral is separately earthed or when earth-fault protection must work correctly on both sources. We confirm this against your earthing system.",
      ar: "يوصى بالرباعي (مع فصل التعادل) عندما يكون تعادل المولد مؤرضاً بشكل منفصل أو عندما يجب أن تعمل حماية التسرب الأرضي بشكل صحيح على المصدرين. نؤكد ذلك حسب نظام التأريض لديك.",
    },
  },
  {
    q: { en: "How fast does an ATS transfer?", ar: "ما سرعة التحويل في لوحة ATS؟" },
    a: {
      en: "Typically 5–15 seconds from mains failure to load on generator, most of which is engine start and stabilisation. Timers are adjustable to avoid nuisance starts on short dips.",
      ar: "عادةً من 5 إلى 15 ثانية من انقطاع الكهرباء حتى انتقال الحمل للمولد، ومعظمها زمن تشغيل المحرك واستقراره. المؤقتات قابلة للضبط لتجنب التشغيل غير الضروري عند الانقطاعات القصيرة.",
    },
  },
];

export const switchgearFaq: Faq[] = [
  {
    q: { en: "What is the difference between switchgear and an MDB?", ar: "ما الفرق بين لوحة المفاتيح ولوحة التوزيع الرئيسية؟" },
    a: {
      en: "Switchgear is the broad family of panels that switch and protect circuits. An MDB is the specific board that receives the incoming supply and distributes it to sub-boards. On larger sites the main LV switchboard and MDB are often the same assembly.",
      ar: "لوحات المفاتيح هي العائلة الأوسع من اللوحات التي تقوم بالتوصيل والحماية، أما MDB فهي اللوحة التي تستقبل التغذية الرئيسية وتوزعها على اللوحات الفرعية. في المواقع الكبيرة غالباً ما تكون لوحة الجهد المنخفض الرئيسية وMDB نفس اللوحة.",
    },
  },
  {
    q: { en: "Can you build panels to DEWA, SEWA or SEC requirements?", ar: "هل يمكنكم تجهيز لوحات حسب متطلبات ديوا أو سيوا أو الشركة السعودية للكهرباء؟" },
    a: {
      en: "Yes. Send us your single-line diagram and the consultant's specification; we configure breakers, metering and labelling to the relevant utility requirements and supply test documentation.",
      ar: "نعم. أرسل لنا المخطط أحادي الخط ومواصفات الاستشاري، ونجهز القواطع والقياس والتعليم حسب متطلبات الهيئة المعنية مع مستندات الاختبار.",
    },
  },
];
