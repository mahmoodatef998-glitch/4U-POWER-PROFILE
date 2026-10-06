import type { NewsPost } from "@/lib/types";

/**
 * Buyer-intent guides (price, villa sizing, ratings, maintenance, rent vs buy). Publishing is staggered:
 * posts dated in the future stay hidden until their date (see getNews), then appear on the next revalidation.
 */
export const newsPart3: NewsPost[] = [
  {
    slug: "generator-price-uae-cost-factors",
    title_en: "Generator Price in the UAE: What Really Decides the Cost",
    title_ar: "سعر المولد الكهربائي في الإمارات: ما الذي يحدد التكلفة فعلاً؟",
    meta_title_en: "Generator Price in UAE: 9 Factors That Decide Cost | 4U Power",
    meta_title_ar: "سعر المولد في الإمارات: 9 عوامل تحدد التكلفة | فور يو باور",
    excerpt_en:
      "Two quotes for the same kVA can differ widely. The nine factors that really set a generator's price in the UAE, and how to compare quotations fairly.",
    excerpt_ar:
      "قد يختلف عرضا سعر لنفس القدرة كثيراً. إليك العوامل التسعة التي تحدد سعر المولد الكهربائي فعلاً في الإمارات، وكيف تقارن عروض الأسعار بشكل عادل.",
    cover_image: "/images/products/perkins-diesel-generator-4u.webp",
    published_at: "2026-10-06T06:00:00Z",
    is_published: true,
    body_en: `"How much is a 200 kVA generator?" is the most common question we get on WhatsApp — and the honest answer is: it depends on nine things. Two quotations for the same kVA can be far apart because they are not quoting the same machine. Here is what actually moves the price, so you can compare offers like for like.

## 1. The kVA rating — and whether it is standby or prime

Size is the biggest driver: a 500 kVA set costs far more than a 100 kVA one. But check **which rating** the quote uses. A "500 kVA" standby set delivers roughly 450 kVA on prime duty. If one supplier quotes standby and another quotes prime, the cheaper offer may simply be a smaller machine. Our guide to [prime vs standby ratings](/en/news/prime-vs-standby-generator-rating) explains the difference.

## 2. Engine brand

Perkins, Cummins, Volvo Penta, Baudouin, Kubota, Lister Petter and Chinese engine series all sit at different price points. Premium brands cost more up front but usually win on parts availability across the GCC, resale value and service network. See how they compare in [Perkins vs Cummins vs Kubota](/en/news/perkins-vs-cummins-vs-kubota-engine-brand-uae).

## 3. The alternator

The alternator turns engine power into electricity. Brand, insulation class (H is standard for the Gulf), winding pitch and the quality of the voltage regulator (AVR) all matter — especially if you feed sensitive IT equipment or VFDs.

## 4. Enclosure: open, silent canopy or container

- **Open frame** — cheapest, for plant rooms.
- **Silent canopy** — weatherproof and sound-attenuated; essential for villas, hospitals and residential areas.
- **Container** — for large sets and remote sites, with fuel and switchgear inside.

The quieter the canopy (measured in dB(A) at 7 m), the more steel and insulation it needs.

## 5. Controller and monitoring

A manual start panel is cheap. An **AMF controller** (Deep Sea or ComAp) that starts the set automatically on mains failure, with remote monitoring and alarms, costs more and is worth it for any standby application.

## 6. ATS and distribution panels

A generator only takes over automatically with an **automatic transfer switch**. Some quotes include it, many do not. Check the ATS rating matches the generator's full-load current — see [ATS panels explained](/en/news/ats-panels-explained).

## 7. Fuel tank size

A standard base tank typically gives around 8 hours at 75% load. Longer autonomy needs a bigger base tank or an external [fuel tank](/en/products/generator-fuel-tanks) — more steel, more cost.

## 8. Site conditions

At 50 °C ambient, engines and alternators lose output. A set specified for Gulf conditions needs a larger radiator and sometimes a bigger engine to deliver the same kVA. A quote that ignores derating is cheaper on paper only.

## 9. Delivery, installation, commissioning and warranty

Transport, offloading, cabling, exhaust extension, commissioning, load-bank testing and warranty can add a meaningful amount. Every product we supply carries a **12-month warranty**, and we quote installation and testing as separate, clear lines.

## How to compare two quotations

Put them side by side and check:

- the same **rating basis** (standby or prime) and the same kVA at your site temperature
- engine **and** alternator make and model
- enclosure type and noise level
- controller model and whether an ATS is included
- fuel tank capacity in hours
- what is included: delivery, installation, testing, warranty length

## Get an exact price

Use the [generator size chart](/en/generators/sizes) or the [kVA calculator](/en/calculator) to find your size, then send it to us on WhatsApp. We reply with options and a clear price breakdown — usually the same working day.`,
    body_ar: `"بكم سعر مولد 200 ك.ف.أ؟" هو أكثر سؤال يصلنا على الواتساب، والإجابة الصادقة أنه يعتمد على تسعة عوامل. قد يختلف عرضا سعر لنفس القدرة كثيراً لأنهما لا يقدمان نفس الماكينة أصلاً. إليك ما يحرك السعر فعلاً حتى تقارن العروض بشكل عادل.

## 1. القدرة بالكيلو فولت أمبير، وهل هي احتياطية أم أساسية

الحجم هو العامل الأكبر؛ فمولد 500 ك.ف.أ أغلى بكثير من مولد 100 ك.ف.أ. لكن تأكد من **نوع التقنين** المذكور في العرض. المولد الاحتياطي "500 ك.ف.أ" يعطي نحو 450 ك.ف.أ في التشغيل الأساسي. إذا قدّم مورد قدرة احتياطية وآخر قدرة أساسية، فقد يكون العرض الأرخص مجرد ماكينة أصغر. مقالنا عن [الفرق بين القدرة الأساسية والاحتياطية](/ar/news/prime-vs-standby-generator-rating) يشرح ذلك.

## 2. ماركة المحرك

بيركنز وكمنز وفولفو بنتا وبودوان وكوبوتا وليستر بيتر والمحركات الصينية لكل منها مستوى سعري مختلف. الماركات الأعلى تكلف أكثر في البداية، لكنها غالباً تتفوق في توفر قطع الغيار في الخليج وقيمة إعادة البيع وشبكة الصيانة. اطلع على المقارنة في [بيركنز أم كمنز أم كوبوتا](/ar/news/perkins-vs-cummins-vs-kubota-engine-brand-uae).

## 3. الدينامو (المولّد الكهربائي)

الدينامو يحوّل قدرة المحرك إلى كهرباء. الماركة وفئة العزل (فئة H هي المعيار في الخليج) وجودة منظم الجهد (AVR) كلها مهمة، خاصة إذا كنت تغذي أجهزة حساسة أو مغيرات سرعة.

## 4. الهيكل: مفتوح أم كابينة صامتة أم حاوية

- **إطار مفتوح**: الأرخص، لغرف المولدات.
- **كابينة صامتة**: مقاومة للعوامل الجوية وعازلة للصوت، ضرورية للفلل والمستشفيات والمناطق السكنية.
- **حاوية**: للمولدات الكبيرة والمواقع البعيدة، مع الوقود واللوحات بداخلها.

كلما كانت الكابينة أهدأ (تقاس بالديسيبل على بعد 7 أمتار) احتاجت حديداً وعزلاً أكثر.

## 5. وحدة التحكم والمراقبة

لوحة التشغيل اليدوي رخيصة. أما **وحدة التحكم AMF** (ديب سي أو كوم آب) التي تشغّل المولد تلقائياً عند انقطاع الكهرباء مع مراقبة وإنذارات عن بُعد، فتكلف أكثر وتستحق ذلك في أي استخدام احتياطي.

## 6. لوحة ATS ولوحات التوزيع

لا يتولى المولد التغذية تلقائياً إلا مع **لوحة تحويل أوتوماتيكي**. بعض العروض تشملها وكثير منها لا. تأكد أن سعة اللوحة تناسب تيار الحمل الكامل للمولد. راجع [شرح لوحات ATS](/ar/news/ats-panels-explained).

## 7. سعة خزان الوقود

الخزان القاعدي القياسي يعطي عادةً نحو 8 ساعات عند حمل 75%. التشغيل الأطول يحتاج خزاناً قاعدياً أكبر أو [خزان وقود خارجي](/ar/products/generator-fuel-tanks)، أي حديداً وتكلفة أكثر.

## 8. ظروف الموقع

في حرارة 50 درجة يفقد المحرك والدينامو جزءاً من قدرتهما. المولد المجهز لظروف الخليج يحتاج مبرداً أكبر وأحياناً محركاً أكبر ليعطي نفس القدرة. العرض الذي يتجاهل خفض القدرة أرخص على الورق فقط.

## 9. التوصيل والتركيب والتشغيل والضمان

النقل والتنزيل والكابلات وتمديد العادم والتشغيل الأولي واختبار الحمل والضمان قد تضيف مبلغاً ملحوظاً. كل منتج نورّده مشمول **بضمان 12 شهراً**، ونقدم التركيب والاختبار كبنود منفصلة وواضحة.

## كيف تقارن بين عرضَي سعر

ضع العرضين جنباً إلى جنب وتأكد من:

- نفس **أساس التقنين** (احتياطي أم أساسي) ونفس القدرة عند حرارة موقعك
- ماركة وموديل المحرك **والدينامو**
- نوع الهيكل ومستوى الضوضاء
- موديل وحدة التحكم وهل لوحة ATS مشمولة
- سعة خزان الوقود بالساعات
- ما يشمله العرض: التوصيل والتركيب والاختبار ومدة الضمان

## احصل على سعر دقيق

استخدم [جدول أحجام المولدات](/ar/generators/sizes) أو [حاسبة القدرة](/ar/calculator) لتحديد الحجم، ثم أرسله لنا على الواتساب. نرد بالخيارات وتفصيل واضح للسعر، عادةً في نفس يوم العمل.`,
  },
  {
    slug: "generator-size-for-villa-uae",
    title_en: "What Size Generator Does a Villa Need in the UAE?",
    title_ar: "ما حجم المولد المناسب للفيلا في الإمارات؟",
    meta_title_en: "Generator Size for a Villa in the UAE: kVA Guide | 4U Power",
    meta_title_ar: "حجم مولد الفيلا في الإمارات: دليل اختيار القدرة | فور يو باور",
    excerpt_en:
      "In the Gulf, air-conditioning sizes a villa generator. How to count split units, pumps and kitchen loads, with a worked example and typical kVA ranges.",
    excerpt_ar:
      "في الخليج، التكييف هو ما يحدد حجم مولد الفيلا. كيف تحسب وحدات السبليت والمضخات وأحمال المطبخ، مع مثال محسوب وأحجام القدرة المعتادة للفلل.",
    cover_image: "/images/products/kubota-diesel-generator-4u.webp",
    published_at: "2026-10-06T06:00:00Z",
    is_published: true,
    body_en: `In a UAE villa the generator is sized by one thing above all: **air-conditioning**. Lighting, sockets and the fridge are small. Ten split units starting on a 46 °C afternoon are not. Here is how to size it properly.

## First decide: whole house or essential loads?

- **Essential loads only** — a few AC units (bedrooms), lighting, fridge, water pump, internet and CCTV. Smaller, cheaper and quieter.
- **Whole house** — everything runs as normal during an outage, including all AC and the kitchen. Larger set, bigger fuel tank.

Most families choose essential loads plus the master bedroom and living room AC.

## Step 1: Count the air-conditioning

A 2-ton split unit draws roughly **2.4 kW** while running. Count your units and their tonnage:

- 1.5-ton unit ≈ 1.8 kW
- 2-ton unit ≈ 2.4 kW
- 3-ton unit ≈ 3.6 kW

Inverter units start gently; older fixed-speed units draw a short surge when the compressor starts, so leave headroom.

## Step 2: Add the other loads

- water pumps and pressure sets: 1–2 kW
- lighting and sockets: 3–5 kW
- kitchen (oven, cooktop, microwave — not all at once): 4–6 kW
- water heaters: 2–3 kW each if left on
- pool pump, lift or EV charger if you have them

## Step 3: Convert to kVA and add margin

kVA = kW ÷ 0.8, then add about **25%** for motor starting and Gulf heat.

## Worked example: a 5-bedroom villa, whole house

| Load | kW |
| --- | --- |
| 8 split units × 2 tons | 19.2 |
| water pump | 1.5 |
| lighting and sockets | 4 |
| kitchen | 5 |
| water heaters | 3 |
| **Total** | **32.7** |

32.7 kW ÷ 0.8 = 41 kVA, plus 25% ≈ 51 kVA → a **[60 kVA generator](/en/generators/60-kva)**.

The same villa on essential loads only (4 AC units, pump, lighting, fridge) lands around a **[30 kVA set](/en/generators/30-kva)**.

## Typical ranges we supply

- essential loads, apartment or small villa: **15–30 kVA**
- full villa with 6–10 split units: **40–80 kVA**
- large villa or palace with ducted AC, pool and lift: **100–200 kVA**

## Three things villa owners often forget

1. **Noise.** Choose a silent canopy and check the dB(A) rating; your neighbours and community will thank you. Compact [Kubota](/en/products/kubota-silent-generator-10-40kva) and [Lister Petter](/en/products/lister-petter-generator-7-60kva) sets are built for this.
2. **Automatic changeover.** Without an [ATS panel](/en/ats-panels) someone has to start the set and switch over by hand — usually at 3 am.
3. **Single or three phase.** Most UAE villas have a three-phase 400/230 V supply; the generator must match.

## Get it right first time

Run your own numbers in the [kVA calculator](/en/calculator), or send us a photo of your DB board and a list of AC units on WhatsApp. We will recommend the size, canopy and ATS — and deliver across [Dubai](/en/locations/dubai), [Abu Dhabi](/en/locations/abu-dhabi) and the northern emirates.`,
    body_ar: `في فيلا بالإمارات يُحدَّد حجم المولد بعامل واحد قبل كل شيء: **التكييف**. الإنارة والمقابس والثلاجة أحمال صغيرة، أما عشر وحدات سبليت تبدأ العمل في ظهيرة حرارتها 46 درجة فليست كذلك. إليك طريقة اختيار الحجم الصحيح.

## أولاً: الفيلا كلها أم الأحمال الأساسية فقط؟

- **الأحمال الأساسية فقط**: بعض وحدات التكييف (غرف النوم) والإنارة والثلاجة ومضخة المياه والإنترنت والكاميرات. مولد أصغر وأرخص وأهدأ.
- **الفيلا كلها**: كل شيء يعمل كالمعتاد أثناء الانقطاع بما فيه كل التكييف والمطبخ. مولد أكبر وخزان وقود أكبر.

معظم العائلات تختار الأحمال الأساسية مع تكييف غرفة النوم الرئيسية والصالة.

## الخطوة 1: احسب التكييف

وحدة السبليت 2 طن تسحب نحو **2.4 كيلوواط** أثناء التشغيل. احسب عدد وحداتك وقدرتها:

- وحدة 1.5 طن ≈ 1.8 كيلوواط
- وحدة 2 طن ≈ 2.4 كيلوواط
- وحدة 3 طن ≈ 3.6 كيلوواط

وحدات الإنفرتر تبدأ بهدوء، أما الوحدات القديمة ثابتة السرعة فتسحب تياراً لحظياً عند بدء الكمبروسر، لذا اترك هامشاً.

## الخطوة 2: أضف الأحمال الأخرى

- مضخات المياه ومجموعات الضغط: 1–2 كيلوواط
- الإنارة والمقابس: 3–5 كيلوواط
- المطبخ (فرن وموقد وميكروويف، ليست كلها معاً): 4–6 كيلوواط
- سخانات المياه: 2–3 كيلوواط لكل سخان إذا تُركت تعمل
- مضخة المسبح أو المصعد أو شاحن السيارة الكهربائية إن وُجدت

## الخطوة 3: حوّل إلى ك.ف.أ وأضف الهامش

ك.ف.أ = الكيلوواط ÷ 0.8، ثم أضف نحو **25%** لبدء المحركات وحرارة الخليج.

## مثال محسوب: فيلا 5 غرف، تغذية كاملة

| الحمل | كيلوواط |
| --- | --- |
| 8 وحدات سبليت × 2 طن | 19.2 |
| مضخة المياه | 1.5 |
| الإنارة والمقابس | 4 |
| المطبخ | 5 |
| سخانات المياه | 3 |
| **الإجمالي** | **32.7** |

32.7 كيلوواط ÷ 0.8 = 41 ك.ف.أ، مع 25% ≈ 51 ك.ف.أ ← **[مولد 60 ك.ف.أ](/ar/generators/60-kva)**.

نفس الفيلا مع الأحمال الأساسية فقط (4 وحدات تكييف ومضخة وإنارة وثلاجة) تحتاج نحو **[مولد 30 ك.ف.أ](/ar/generators/30-kva)**.

## الأحجام المعتادة التي نوردها

- أحمال أساسية لشقة أو فيلا صغيرة: **15–30 ك.ف.أ**
- فيلا كاملة بها 6–10 وحدات سبليت: **40–80 ك.ف.أ**
- فيلا كبيرة أو قصر بتكييف مركزي ومسبح ومصعد: **100–200 ك.ف.أ**

## ثلاثة أمور ينساها أصحاب الفلل

1. **الضوضاء.** اختر كابينة صامتة وتأكد من مستوى الديسيبل، وسيشكرك جيرانك. مولدات [كوبوتا](/ar/products/kubota-silent-generator-10-40kva) و[ليستر بيتر](/ar/products/lister-petter-generator-7-60kva) الصغيرة مصممة لذلك.
2. **التحويل التلقائي.** بدون [لوحة ATS](/ar/ats-panels) يجب أن يشغّل أحدهم المولد ويحوّل التغذية يدوياً، وغالباً في الثالثة فجراً.
3. **طور واحد أم ثلاثة أطوار.** معظم فلل الإمارات بها تغذية ثلاثية الأطوار 400/230 فولت، ويجب أن يطابقها المولد.

## اختر الحجم الصحيح من أول مرة

احسب بنفسك في [حاسبة القدرة](/ar/calculator)، أو أرسل لنا على الواتساب صورة لوحة التوزيع وقائمة وحدات التكييف. سنقترح الحجم والكابينة ولوحة ATS، ونوصل إلى [دبي](/ar/locations/dubai) و[أبوظبي](/ar/locations/abu-dhabi) والإمارات الشمالية.`,
  },
  {
    slug: "prime-vs-standby-generator-rating",
    title_en: "Prime vs Standby Generator Ratings: Which One Do You Need?",
    title_ar: "القدرة الأساسية أم الاحتياطية للمولد: أيهما تحتاج؟",
    meta_title_en: "Prime vs Standby Generator Rating Explained | 4U Power UAE",
    meta_title_ar: "الفرق بين القدرة الأساسية والاحتياطية للمولد | فور يو باور",
    excerpt_en:
      "A 500 kVA standby set is not a 500 kVA prime set. What ISO 8528 standby, prime and continuous ratings mean, and why it matters on Gulf sites.",
    excerpt_ar:
      "مولد 500 ك.ف.أ احتياطي ليس مولد 500 ك.ف.أ أساسي. ما معنى التقنين الاحتياطي والأساسي والمستمر حسب ISO 8528، ولماذا يهم ذلك في مواقع الخليج.",
    cover_image: "/images/products/baudouin-containerized-generator-4u.webp",
    published_at: "2026-10-06T06:00:00Z",
    is_published: true,
    body_en: `Every generator datasheet shows two or three power figures. Mixing them up is the most common — and most expensive — mistake in generator buying. Here is what each rating means under **ISO 8528-1**, and which one your project needs.

## Emergency standby power (ESP)

The highest number on the datasheet. It is the power the set can deliver **when the mains has failed**, for a limited number of hours per year (typically up to around 200), with an average load over 24 hours of no more than about 70% of the standby rating. There is **no overload capability** above it.

Use standby when the generator is a backup for a reliable grid: offices, towers, villas, schools, hotels in the UAE.

## Prime power (PRP)

Prime is the power the set can deliver for an **unlimited number of hours** per year with a varying load, again with the 24-hour average kept to about 70% of the prime rating. Most manufacturers allow a **10% overload for one hour in every twelve** on prime.

Prime is typically about **10% lower** than standby for the same machine. A set sold as "500 kVA standby" is roughly a 450 kVA prime set.

Use prime when the generator **is** the power supply — or runs many hours a day:

- construction sites and camps with no grid connection
- farms, quarries and remote sites
- markets with long daily outages, such as [Baghdad](/en/locations/baghdad) or [Basra](/en/locations/basra)

## Continuous power (COP)

A lower rating again, for a **constant 100% load** running without limit — base-load power plants and some industrial processes. Data centres often ask for a data-centre continuous rating; tell us if your consultant specifies one.

## Why it matters when you compare quotes

If supplier A quotes 500 kVA standby and supplier B quotes 500 kVA prime, supplier B is offering a **bigger machine** — so it will cost more. Always ask which rating a price refers to, and compare like with like. It is one of the [nine factors that decide generator price](/en/news/generator-price-uae-cost-factors).

## Heat changes the numbers too

Ratings are given at standard reference conditions. At 45–50 °C the engine and alternator must be derated, so in the Gulf we check the **site rating** at your real ambient temperature, not just the catalogue figure.

## Quick rule

- **Grid is reliable, generator is backup** → size on standby.
- **Generator runs daily or is the only supply** → size on prime, and allow for heat.

Our [generator size pages](/en/generators/sizes) show both the standby kVA and the matching prime figure for every size from 10 to 2500 kVA. Not sure which applies? Send us your run hours and load list on WhatsApp.`,
    body_ar: `كل نشرة فنية لمولد تعرض رقمين أو ثلاثة للقدرة، والخلط بينها هو أكثر الأخطاء شيوعاً وتكلفة عند شراء المولد. إليك معنى كل تقنين حسب المعيار **ISO 8528-1**، وأيها يحتاجه مشروعك.

## القدرة الاحتياطية للطوارئ (ESP)

أعلى رقم في النشرة الفنية. هي القدرة التي يعطيها المولد **عند انقطاع الكهرباء العمومية**، لعدد محدود من الساعات سنوياً (عادةً حتى نحو 200 ساعة)، على ألا يتجاوز متوسط الحمل خلال 24 ساعة نحو 70% من القدرة الاحتياطية. **لا توجد قدرة تحميل زائد** فوقها.

استخدم التقنين الاحتياطي عندما يكون المولد بديلاً لشبكة كهرباء موثوقة: المكاتب والأبراج والفلل والمدارس والفنادق في الإمارات.

## القدرة الأساسية (PRP)

هي القدرة التي يعطيها المولد **لعدد غير محدود من الساعات** سنوياً مع حمل متغير، مع بقاء متوسط الحمل خلال 24 ساعة عند نحو 70% من القدرة الأساسية. تسمح معظم الشركات المصنعة **بحمل زائد 10% لمدة ساعة كل اثنتي عشرة ساعة** في التشغيل الأساسي.

القدرة الأساسية أقل عادةً **بنحو 10%** من الاحتياطية لنفس الماكينة. فالمولد المباع على أنه "500 ك.ف.أ احتياطي" هو تقريباً مولد 450 ك.ف.أ أساسي.

استخدم القدرة الأساسية عندما يكون المولد **هو** مصدر الكهرباء، أو يعمل ساعات طويلة يومياً:

- مواقع البناء والمخيمات غير المتصلة بالشبكة
- المزارع والمحاجر والمواقع البعيدة
- الأسواق ذات الانقطاعات اليومية الطويلة مثل [بغداد](/ar/locations/baghdad) و[البصرة](/ar/locations/basra)

## القدرة المستمرة (COP)

تقنين أقل أيضاً، لحمل **ثابت 100%** يعمل دون حد زمني، مثل محطات توليد الحمل الأساسي وبعض العمليات الصناعية. مراكز البيانات تطلب غالباً تقنيناً مستمراً خاصاً بها، فأخبرنا إذا كان استشاريك يحدده.

## لماذا يهم ذلك عند مقارنة العروض

إذا قدّم المورد (أ) 500 ك.ف.أ احتياطي وقدّم المورد (ب) 500 ك.ف.أ أساسي، فالمورد (ب) يعرض **ماكينة أكبر** وبالتالي أغلى. اسأل دائماً عن نوع التقنين الذي يشير إليه السعر وقارن المتماثل. وهو أحد [العوامل التسعة التي تحدد سعر المولد](/ar/news/generator-price-uae-cost-factors).

## الحرارة تغيّر الأرقام أيضاً

تُعطى القدرات عند ظروف مرجعية قياسية. في حرارة 45–50 درجة يجب خفض قدرة المحرك والدينامو، لذا نتحقق في الخليج من **قدرة الموقع** عند حرارتك الفعلية، لا من رقم الكتالوج فقط.

## قاعدة سريعة

- **الشبكة موثوقة والمولد احتياطي** ← اختر الحجم حسب القدرة الاحتياطية.
- **المولد يعمل يومياً أو هو المصدر الوحيد** ← اختر حسب القدرة الأساسية واحسب الحرارة.

[صفحات أحجام المولدات](/ar/generators/sizes) تعرض القدرة الاحتياطية والقدرة الأساسية المقابلة لكل حجم من 10 إلى 2500 ك.ف.أ. غير متأكد أيهما ينطبق عليك؟ أرسل لنا ساعات التشغيل وقائمة الأحمال على الواتساب.`,
  },
  {
    slug: "generator-maintenance-checklist-gulf",
    title_en: "Generator Maintenance Checklist for Gulf Heat and Dust",
    title_ar: "قائمة صيانة المولدات لحرارة وغبار الخليج",
    meta_title_en: "Generator Maintenance Checklist for UAE Heat & Dust | 4U Power",
    meta_title_ar: "قائمة صيانة المولد في حرارة وغبار الخليج | فور يو باور",
    excerpt_en:
      "Heat, sand and long idle periods are what kill standby generators in the Gulf. A weekly, monthly and yearly checklist your facility team can follow.",
    excerpt_ar:
      "الحرارة والرمال وفترات التوقف الطويلة هي ما يُتلف المولدات الاحتياطية في الخليج. قائمة صيانة أسبوعية وشهرية وسنوية يمكن لفريق المنشأة اتباعها.",
    cover_image: "/images/products/volvo-penta-diesel-generator-4u.webp",
    published_at: "2026-10-13T06:00:00Z",
    is_published: true,
    body_en: `A standby generator can sit idle for months and then must start within seconds and carry the full load on the hottest day of the year. In the Gulf, the usual reasons it fails are a flat battery, a blocked radiator, a clogged air filter or stale fuel. This checklist prevents all four.

## Weekly (10 minutes)

- walk round the set: look for oil, fuel and coolant leaks
- check fuel level and that the day tank is full
- check **battery voltage** and the charger is working — a weak battery is the number-one cause of failed starts
- confirm the controller is in **AUTO** with no active alarms
- check coolant level and that the jacket-water heater is warm (where fitted)

## Monthly

- **exercise run under load** for at least 30 minutes, ideally at 40% load or more; a no-load run does little good and encourages wet stacking
- check the air-filter restriction indicator; in dusty areas filters may need cleaning or changing far more often than the hours suggest
- clean the **radiator fins** — sand and dust packed between the fins are the main cause of overheating in summer
- inspect belts, hoses and clamps for cracks
- test the [ATS](/en/news/ats-panels-explained) by simulating a mains failure

## Every 250 hours or 6 months (whichever comes first)

- change engine oil and oil filter to the manufacturer's specification
- change fuel filters and drain water from the water separator
- check exhaust system, mounts and earthing

## Yearly

- **load-bank test** at up to full rated load to prove the set can carry its rating and to burn off carbon from light-load running — see our [load banks](/en/products/load-banks)
- coolant test and replacement as needed; check antifreeze/inhibitor concentration
- **fuel sampling** and, if needed, fuel polishing — diesel stored for long periods in heat degrades and grows bacteria
- check alternator insulation resistance and tighten electrical terminals
- full controller and protection check

## Warning signs to act on immediately

- black smoke under load (overload, injectors or air restriction)
- white smoke or oil around the exhaust (wet stacking from running lightly loaded)
- high coolant temperature alarms in summer (blocked radiator or fan belt)
- slow cranking (battery or starter)

## Let us do it for you

Our [maintenance contracts](/en/services) cover scheduled visits, filters and oil, load-bank testing and breakdown response across the UAE — for any brand, not only the sets we supply. Every new generator from us also carries a **12-month warranty**.`,
    body_ar: `قد يبقى المولد الاحتياطي متوقفاً لشهور، ثم يُطلب منه أن يعمل خلال ثوانٍ ويحمل الحمل الكامل في أشد أيام السنة حرارة. في الخليج تكون أسباب تعطله المعتادة بطارية فارغة أو مبرد مسدود أو فلتر هواء متسخ أو وقود قديم. هذه القائمة تمنع الأسباب الأربعة.

## أسبوعياً (10 دقائق)

- تجول حول المولد وابحث عن تسريب زيت أو وقود أو سائل تبريد
- تأكد من مستوى الوقود وامتلاء الخزان اليومي
- افحص **جهد البطارية** وعمل الشاحن، فالبطارية الضعيفة هي السبب الأول لفشل التشغيل
- تأكد أن وحدة التحكم على وضع **AUTO** دون إنذارات نشطة
- افحص مستوى سائل التبريد ودفء سخان المياه إن وُجد

## شهرياً

- **تشغيل تجريبي تحت حمل** لمدة 30 دقيقة على الأقل، ويفضل بحمل 40% أو أكثر؛ التشغيل بدون حمل لا يفيد كثيراً ويسبب تراكم الوقود في العادم
- افحص مؤشر انسداد فلتر الهواء؛ في المناطق المغبرة قد تحتاج الفلاتر للتنظيف أو التغيير أسرع بكثير مما تشير إليه الساعات
- نظّف **زعانف المبرد**؛ فالرمال والغبار بين الزعانف هي السبب الرئيسي للسخونة الزائدة صيفاً
- افحص السيور والخراطيم والمرابط بحثاً عن تشققات
- اختبر [لوحة ATS](/ar/news/ats-panels-explained) بمحاكاة انقطاع الكهرباء

## كل 250 ساعة أو 6 أشهر (أيهما أقرب)

- غيّر زيت المحرك وفلتر الزيت حسب مواصفات الشركة المصنعة
- غيّر فلاتر الوقود واسحب الماء من فاصل المياه
- افحص نظام العادم والمساند والتأريض

## سنوياً

- **اختبار بحمل اختباري** حتى القدرة الكاملة لإثبات أن المولد يحمل قدرته المقننة ولحرق الكربون الناتج عن التشغيل بحمل خفيف. اطلع على [أحمال الاختبار](/ar/products/load-banks)
- فحص سائل التبريد واستبداله عند الحاجة، والتأكد من تركيز مانع التجمد والتآكل
- **أخذ عينة من الوقود** وتنقيته عند الحاجة، فالديزل المخزن طويلاً في الحرارة يتدهور وتنمو فيه البكتيريا
- فحص مقاومة عزل الدينامو وإحكام التوصيلات الكهربائية
- فحص شامل لوحدة التحكم والحمايات

## علامات تحذير تستدعي التدخل فوراً

- دخان أسود تحت الحمل (حمل زائد أو مشكلة في البخاخات أو انسداد الهواء)
- دخان أبيض أو زيت حول العادم (تراكم الوقود من التشغيل بحمل خفيف)
- إنذارات ارتفاع حرارة سائل التبريد صيفاً (مبرد مسدود أو سير مروحة)
- بطء دوران المحرك عند التشغيل (البطارية أو المارش)

## دعنا نتولاها عنك

[عقود الصيانة](/ar/services) لدينا تشمل زيارات مجدولة والفلاتر والزيت واختبار الحمل والاستجابة للأعطال في كل الإمارات، لأي ماركة وليس فقط المولدات التي نوردها. وكل مولد جديد من عندنا مشمول **بضمان 12 شهراً**.`,
  },
  {
    slug: "rent-or-buy-generator-uae",
    title_en: "Rent or Buy a Generator in the UAE? How to Decide",
    title_ar: "استئجار المولد أم شراؤه في الإمارات؟ كيف تقرر",
    meta_title_en: "Rent or Buy a Generator in the UAE? Cost & Risk Guide | 4U Power",
    meta_title_ar: "استئجار المولد أم شراؤه في الإمارات؟ دليل التكلفة | فور يو باور",
    excerpt_en:
      "Renting wins for short jobs; buying wins once a set is needed for longer. How to decide using duration, run hours, resale value and service needs.",
    excerpt_ar:
      "الاستئجار أفضل للأعمال القصيرة، والشراء أفضل عندما تحتاج المولد لفترة أطول. كيف تقرر بناءً على المدة وساعات التشغيل وقيمة إعادة البيع والصيانة.",
    cover_image: "/images/products/cummins-containerized-generator-4u.webp",
    published_at: "2026-10-20T06:00:00Z",
    is_published: true,
    body_en: `Contractors, event organisers and facility managers ask the same question: is it cheaper to rent a generator or to buy one? The answer depends on four numbers you already know.

## 1. How long do you need it?

Rental is priced per day, week or month. Purchase is a one-off cost that you partly recover when you sell the set or move it to the next project. The longer the need, the more buying wins.

**Break-even check:** monthly rental × number of months versus purchase price − expected resale value + your service costs. Once the rental total passes that figure, buying is cheaper — and on multi-month construction projects it often does.

## 2. How many hours will it run?

Rental contracts often include a set number of hours per month, with extra hours charged. A set running 20 hours a day on a construction site or camp uses those hours quickly. If you own the set, extra hours only cost fuel and maintenance.

## 3. Will you need it again?

Contractors with a pipeline of projects can move an owned set from site to site. A [generator trailer](/en/products/generator-trailers) and a [fuel tank](/en/products/generator-fuel-tanks) make that easy. One-off events rarely justify buying.

## 4. Who handles service and breakdowns?

Rental usually includes maintenance and a replacement if the set fails. When you buy, you take that on — or cover it with a [maintenance contract](/en/services). Every set we supply carries a **12-month warranty**, which covers the most uncertain first year.

## When renting makes sense

- events, shutdowns and short emergencies
- a temporary gap while a permanent set is on order
- you are not sure yet what size the site will need

## When buying makes sense

- permanent standby for a building, villa, factory or farm
- construction projects lasting many months
- sites where the generator is the main supply, running long hours
- you can reuse the set on future projects or resell it

## A middle path: buy the right size once

The costliest outcome is buying the wrong size. Use the [kVA calculator](/en/calculator) or the [generator size chart](/en/generators/sizes), then ask us for a quotation with delivery, installation and warranty listed clearly. We supply sets from 7 to 2500 kVA from our Sharjah warehouse, with delivery across the UAE and export to Saudi Arabia and Iraq.`,
    body_ar: `يسأل المقاولون ومنظمو الفعاليات ومديرو المنشآت نفس السؤال: هل استئجار المولد أرخص أم شراؤه؟ الإجابة تعتمد على أربعة أرقام تعرفها بالفعل.

## 1. ما المدة التي تحتاجه فيها؟

الإيجار يُسعّر باليوم أو الأسبوع أو الشهر، أما الشراء فتكلفة لمرة واحدة تسترد جزءاً منها عند بيع المولد أو نقله للمشروع التالي. كلما طالت المدة كان الشراء أفضل.

**اختبار نقطة التعادل:** الإيجار الشهري × عدد الأشهر مقابل سعر الشراء − قيمة إعادة البيع المتوقعة + تكاليف الصيانة. عندما يتجاوز مجموع الإيجار هذا الرقم يصبح الشراء أرخص، وهذا يحدث غالباً في مشاريع البناء التي تمتد لعدة أشهر.

## 2. كم ساعة سيعمل؟

عقود الإيجار تشمل غالباً عدداً محدداً من الساعات شهرياً وتُحتسب الساعات الإضافية. المولد الذي يعمل 20 ساعة يومياً في موقع بناء أو مخيم يستهلك هذه الساعات بسرعة. أما إذا كنت تملك المولد فالساعات الإضافية تكلفك الوقود والصيانة فقط.

## 3. هل ستحتاجه مرة أخرى؟

المقاولون الذين لديهم مشاريع متتالية يمكنهم نقل مولدهم من موقع لآخر، و[مقطورة المولد](/ar/products/generator-trailers) و[خزان الوقود](/ar/products/generator-fuel-tanks) يسهّلان ذلك. أما الفعاليات لمرة واحدة فنادراً ما تبرر الشراء.

## 4. من يتولى الصيانة والأعطال؟

الإيجار يشمل عادةً الصيانة واستبدال المولد إذا تعطل. عند الشراء تتولى أنت ذلك، أو تغطيه [بعقد صيانة](/ar/services). كل مولد نورّده مشمول **بضمان 12 شهراً** يغطي السنة الأولى الأكثر عرضة للمفاجآت.

## متى يكون الاستئجار منطقياً

- الفعاليات وفترات الإغلاق والطوارئ القصيرة
- فجوة مؤقتة حتى يصل مولد دائم تحت الطلب
- عندما لا تعرف بعد الحجم الذي يحتاجه الموقع

## متى يكون الشراء منطقياً

- طاقة احتياطية دائمة لمبنى أو فيلا أو مصنع أو مزرعة
- مشاريع بناء تستمر لأشهر طويلة
- مواقع يكون المولد فيها المصدر الرئيسي ويعمل ساعات طويلة
- عندما يمكنك إعادة استخدامه في مشاريع قادمة أو بيعه

## الحل الوسط: اشترِ الحجم الصحيح من أول مرة

أغلى نتيجة هي شراء حجم خاطئ. استخدم [حاسبة القدرة](/ar/calculator) أو [جدول أحجام المولدات](/ar/generators/sizes)، ثم اطلب منا عرض سعر يوضح التوصيل والتركيب والضمان. نورّد مولدات من 7 إلى 2500 ك.ف.أ من مستودعنا في الشارقة، مع التوصيل في كل الإمارات والتصدير إلى السعودية والعراق.`,
  },
];
