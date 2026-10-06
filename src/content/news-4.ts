import type { NewsPost } from "@/lib/types";

/** Content calendar — batch 1 (weeks 1–2). Future-dated posts stay hidden until their date (see getNews). */
export const newsPart4: NewsPost[] = [
  {
    slug: "generator-for-hospitals-clinics-uae",
    title_en: "Generators for Hospitals and Clinics: Sizing, Transfer Time and Redundancy",
    title_ar: "مولدات المستشفيات والعيادات: الحجم وزمن التحويل والاحتياط",
    meta_title_en: "Generator for Hospitals & Clinics in the UAE | 4U Power",
    meta_title_ar: "مولد للمستشفيات والعيادات في الإمارات | فور يو باور",
    excerpt_en:
      "In healthcare a power cut is a patient-safety event. How to size a hospital or clinic generator, meet 10-second transfer, and plan N+1 redundancy.",
    excerpt_ar:
      "في الرعاية الصحية انقطاع الكهرباء حدث يمس سلامة المرضى. كيف تختار مولد المستشفى أو العيادة، وتحقق التحويل خلال 10 ثوانٍ، وتخطط للاحتياط N+1.",
    cover_image: "/images/products/cummins-containerized-generator-4u.webp",
    published_at: "2026-10-12T06:00:00Z",
    is_published: true,
    body_en: `In a hospital, a power cut is not an inconvenience — it is a patient-safety event. Healthcare standby power is designed differently from an office or a villa, and consultants in the UAE will check it closely.

## Which loads go on the generator?

Healthcare electrical design splits loads into branches:

- **life-safety** — exit lighting, fire alarm, emergency communications
- **critical** — operating theatres, ICU, emergency department, critical-care outlets, nurse call
- **equipment** — medical gas systems, sterilisation, key HVAC, lifts, kitchen and cold storage

All of these must transfer to the generator automatically. Many facilities also put the rest of the building on the generator so departments keep running normally during an outage.

## Transfer time: the 10-second rule

Many UAE healthcare consultants specify to **NFPA 110**, where a Level 1 emergency power system must restore power to emergency loads within **10 seconds**. That means:

- an **AMF controller** that starts the set instantly on mains failure
- a generator that reaches rated voltage and frequency quickly — jacket-water heaters keep the engine ready
- a fast, reliable [automatic transfer switch](/en/ats-panels) for each branch

Some loads cannot tolerate even 10 seconds — anaesthesia machines, ICU monitoring, IT and the PACS server. These sit on a **UPS**, which bridges the gap until the generator takes over.

## Redundancy: N+1

A single generator is a single point of failure. Hospitals usually run **two or more sets in parallel** with a [synchronising panel](/en/products/generator-synchronizing-panel), sized so the critical load is still covered if one set fails or is in maintenance (N+1). Synchronised sets also share load efficiently, so engines are not running at a wasteful low load.

## Sizing examples

| Facility | Typical generator |
| --- | --- |
| Small clinic or dental centre | 30–80 kVA |
| Polyclinic or day-surgery centre | 150–400 kVA |
| Mid-size hospital | 2 × 500 kVA to 2 × 1000 kVA |
| Large hospital | 3 or more sets, 1000–2000 kVA each |

These are starting points — the real number comes from the load schedule. Our [kVA calculator](/en/calculator) and [size chart](/en/generators/sizes) help with a first estimate.

## Fuel autonomy

Healthcare specifications usually require the set to run for **24 hours or more** without refuelling. Size the base tank or external [fuel tank](/en/products/generator-fuel-tanks) on the expected load, not on the nameplate.

## Testing is part of the design

Emergency generators in healthcare are typically exercised **monthly under load** — for example 30 minutes at not less than 30% of rating — with the transfer switches operated, and load-bank tested at least annually. Plan access for a [load bank](/en/products/load-banks) from day one.

## How we help

We supply Cummins, Perkins and Baudouin sets from 10 to 2500 kVA with AMF controllers, ATS and synchronising panels, plus [maintenance contracts](/en/services) and load-bank testing. Send us your consultant's specification and load schedule on WhatsApp and we will propose a compliant configuration.`,
    body_ar: `في المستشفى، انقطاع الكهرباء ليس مجرد إزعاج بل حدث يمس سلامة المرضى. لذلك تُصمم الطاقة الاحتياطية في المنشآت الصحية بشكل مختلف عن المكاتب أو الفلل، ويدققها الاستشاريون في الإمارات بعناية.

## أي الأحمال توضع على المولد؟

يقسم التصميم الكهربائي للمنشآت الصحية الأحمال إلى فروع:

- **سلامة الأرواح**: إنارة المخارج وإنذار الحريق واتصالات الطوارئ
- **الحرجة**: غرف العمليات والعناية المركزة والطوارئ ومقابس العناية الحرجة ونداء التمريض
- **المعدات**: أنظمة الغازات الطبية والتعقيم والتكييف الأساسي والمصاعد والمطبخ والتبريد

كل هذه الأحمال يجب أن تتحول إلى المولد تلقائياً. وكثير من المنشآت تضع باقي المبنى أيضاً على المولد حتى تستمر الأقسام بالعمل بشكل طبيعي أثناء الانقطاع.

## زمن التحويل: قاعدة العشر ثوانٍ

يعتمد كثير من استشاريي الرعاية الصحية في الإمارات على معيار **NFPA 110**، الذي يشترط في أنظمة الطوارئ من المستوى الأول إعادة الكهرباء لأحمال الطوارئ خلال **10 ثوانٍ**. وهذا يعني:

- **وحدة تحكم AMF** تشغّل المولد فور انقطاع الكهرباء
- مولد يصل إلى الجهد والتردد المقننين بسرعة، وسخانات مياه التبريد تبقي المحرك جاهزاً
- [لوحة تحويل أوتوماتيكي](/ar/ats-panels) سريعة وموثوقة لكل فرع

بعض الأحمال لا تتحمل حتى 10 ثوانٍ، مثل أجهزة التخدير ومراقبة العناية المركزة وأنظمة تقنية المعلومات وخادم الأشعة. هذه توضع على **UPS** يغطي الفجوة حتى يتولى المولد التغذية.

## الاحتياط: N+1

المولد الواحد نقطة فشل واحدة. لذلك تشغّل المستشفيات عادةً **مولدين أو أكثر على التوازي** عبر [لوحة تزامن](/ar/products/generator-synchronizing-panel)، بحجم يغطي الحمل الحرج حتى لو تعطل أحد المولدات أو كان في الصيانة (N+1). كما أن المولدات المتزامنة تتقاسم الحمل بكفاءة فلا تعمل المحركات بحمل منخفض مُهدر.

## أمثلة على الأحجام

| المنشأة | المولد المعتاد |
| --- | --- |
| عيادة صغيرة أو مركز أسنان | 30–80 ك.ف.أ |
| مجمع عيادات أو مركز جراحة يومية | 150–400 ك.ف.أ |
| مستشفى متوسط | 2 × 500 حتى 2 × 1000 ك.ف.أ |
| مستشفى كبير | 3 مولدات أو أكثر، 1000–2000 ك.ف.أ لكل منها |

هذه نقاط بداية، والرقم الحقيقي يأتي من جدول الأحمال. تساعدك [حاسبة القدرة](/ar/calculator) و[جدول الأحجام](/ar/generators/sizes) في التقدير الأولي.

## مدة التشغيل بالوقود

تشترط مواصفات المنشآت الصحية عادةً تشغيل المولد **24 ساعة أو أكثر** دون إعادة تعبئة. اختر سعة الخزان القاعدي أو [خزان الوقود الخارجي](/ar/products/generator-fuel-tanks) حسب الحمل المتوقع وليس حسب لوحة البيانات.

## الاختبار جزء من التصميم

تُشغَّل مولدات الطوارئ في المنشآت الصحية عادةً **شهرياً تحت حمل**، مثلاً 30 دقيقة بحمل لا يقل عن 30% من القدرة مع تشغيل لوحات التحويل، وتُختبر بحمل اختباري سنوياً على الأقل. خطط لمكان توصيل [حمل الاختبار](/ar/products/load-banks) من البداية.

## كيف نساعدك

نورّد مولدات كمنز وبيركنز وبودوان من 10 إلى 2500 ك.ف.أ مع وحدات تحكم AMF ولوحات ATS والتزامن، إضافة إلى [عقود الصيانة](/ar/services) واختبار الحمل. أرسل لنا مواصفات الاستشاري وجدول الأحمال على الواتساب وسنقترح تجهيزاً مطابقاً.`,
  },
  {
    slug: "generator-installation-requirements-dubai",
    title_en: "Installing a Generator in Dubai: Approvals and Site Checklist",
    title_ar: "تركيب مولد في دبي: الموافقات وقائمة متطلبات الموقع",
    meta_title_en: "Generator Installation in Dubai: Approvals Checklist | 4U Power",
    meta_title_ar: "تركيب مولد في دبي: قائمة الموافقات والمتطلبات | فور يو باور",
    excerpt_en:
      "Who needs to approve a generator in Dubai, and what inspectors check: changeover interlocks, fuel storage, exhaust, ventilation and noise. A practical checklist.",
    excerpt_ar:
      "من يوافق على تركيب مولد في دبي وماذا يفحص المفتشون: أقفال التحويل وتخزين الوقود والعادم والتهوية والضوضاء. قائمة عملية قبل التركيب.",
    cover_image: "/images/products/volvo-penta-containerized-generator-4u.webp",
    published_at: "2026-10-15T06:00:00Z",
    is_published: true,
    body_en: `A generator is not just delivered and switched on. In Dubai, a permanent standby set touches the electricity network, fuel storage, fire safety and the neighbours — so several parties have a say. Requirements change and differ by project type, so always confirm the current rules with your consultant and the authorities. This checklist covers what is typically reviewed.

## Who is usually involved

- **DEWA** — anything connected to the building's electrical installation, especially the changeover arrangement
- **Dubai Civil Defence** — fuel storage, fire safety and the generator room
- **Dubai Municipality** — location, exhaust and environmental aspects such as noise and emissions
- **The developer or community management** — many master communities and free zones have their own rules for placement and noise
- **Your MEP consultant** — prepares the drawings and submissions

## 1. No back-feed into the grid

The most important electrical rule: the generator must **never** be able to feed power back into the DEWA network. That is why the changeover must be done by a proper [ATS panel](/en/ats-panels) with **mechanical and electrical interlocking**, so mains and generator can never be connected at the same time. DIY changeover switches and plug-in arrangements are not acceptable for a permanent installation.

## 2. Fuel storage

Diesel is a fire risk, so expect checks on:

- tank capacity and location — larger volumes trigger more requirements
- **bunding** (a spill containment wall), commonly sized for at least 110% of the tank volume
- vents, fill points, level gauges and leak detection
- separation from ignition sources and building openings

Our [fuel tanks](/en/products/generator-fuel-tanks) are built with bunding and the fittings consultants expect.

## 3. Generator room or outdoor location

- adequate **ventilation** for combustion and cooling air — engines need a lot of it at 50 °C
- access for maintenance and for bringing in a load bank
- fire rating of walls and doors where the set is indoors
- a solid, level plinth with anti-vibration mounts

## 4. Exhaust

The exhaust should discharge where fumes cannot enter windows, air intakes or neighbouring buildings, usually above roof level with a suitable silencer and rain cap. Long exhaust runs need the right pipe size to avoid back-pressure.

## 5. Noise

In residential areas noise is the most common complaint. A **silent canopy** or an acoustically treated room, plus careful placement away from bedrooms, prevents problems with neighbours and community management. Ask for the canopy's dB(A) rating at 7 m.

## 6. Earthing and protection

The generator neutral and frame must be earthed according to the building's earthing system, with protection coordinated with the main distribution board.

## 7. Testing and handover

Expect a witnessed test: start-up, transfer on simulated mains failure, load test and protection checks. Keep the test report and as-built drawings for the inspectors.

## Let us prepare the package

We supply generators, ATS and distribution panels, fuel tanks and canopies with the datasheets, drawings and test certificates your consultant needs for submission — and we deliver across [Dubai](/en/locations/dubai). Send us your project details on WhatsApp.`,
    body_ar: `المولد لا يُسلَّم ويُشغَّل فقط. في دبي يرتبط المولد الاحتياطي الدائم بشبكة الكهرباء وتخزين الوقود والسلامة من الحريق والجيران، لذلك تشارك فيه عدة جهات. المتطلبات تتغير وتختلف حسب نوع المشروع، فتأكد دائماً من القواعد الحالية مع استشاريك والجهات المختصة. هذه القائمة تغطي ما يُراجع عادةً.

## الجهات المعنية عادةً

- **هيئة كهرباء ومياه دبي (ديوا)**: كل ما يتصل بالتمديدات الكهربائية للمبنى، خاصة ترتيب التحويل
- **الدفاع المدني في دبي**: تخزين الوقود والسلامة من الحريق وغرفة المولد
- **بلدية دبي**: الموقع والعادم والجوانب البيئية مثل الضوضاء والانبعاثات
- **المطور أو إدارة المجتمع السكني**: كثير من المجتمعات والمناطق الحرة لها قواعدها الخاصة للموقع والضوضاء
- **الاستشاري الكهروميكانيكي**: يعد المخططات والمستندات المقدمة

## 1. منع التغذية العكسية للشبكة

أهم قاعدة كهربائية: يجب **ألا يتمكن** المولد أبداً من تغذية الكهرباء عكسياً إلى شبكة ديوا. لذلك يجب أن يتم التحويل عبر [لوحة ATS](/ar/ats-panels) مناسبة مع **أقفال ميكانيكية وكهربائية** تمنع توصيل الشبكة والمولد في نفس الوقت. مفاتيح التحويل المرتجلة وترتيبات القابس غير مقبولة في التركيب الدائم.

## 2. تخزين الوقود

الديزل خطر حريق، لذا توقع فحص:

- سعة الخزان وموقعه، فالكميات الأكبر تستدعي متطلبات أكثر
- **الحوض الواقي** (جدار احتواء التسرب)، ويكون عادةً بسعة 110% على الأقل من حجم الخزان
- فتحات التهوية ونقاط التعبئة ومؤشرات المستوى وكشف التسرب
- الابتعاد عن مصادر الاشتعال وفتحات المبنى

[خزانات الوقود](/ar/products/generator-fuel-tanks) لدينا مصنّعة بحوض واقٍ وبالتجهيزات التي يتوقعها الاستشاريون.

## 3. غرفة المولد أو الموقع الخارجي

- **تهوية** كافية لهواء الاحتراق والتبريد، فالمحركات تحتاج كمية كبيرة منه في حرارة 50 درجة
- مدخل للصيانة ولإدخال حمل الاختبار
- مقاومة الجدران والأبواب للحريق إذا كان المولد داخل المبنى
- قاعدة خرسانية مستوية مع مساند ماصة للاهتزاز

## 4. العادم

يجب أن يخرج العادم في مكان لا تدخل منه الأبخرة إلى النوافذ أو مداخل الهواء أو المباني المجاورة، وغالباً فوق مستوى السطح مع كاتم صوت وغطاء مطر مناسبين. مسارات العادم الطويلة تحتاج قطر أنبوب صحيح لتجنب الضغط العكسي.

## 5. الضوضاء

في المناطق السكنية تكون الضوضاء أكثر الشكاوى شيوعاً. **الكابينة الصامتة** أو الغرفة المعالجة صوتياً، مع اختيار موقع بعيد عن غرف النوم، تمنع المشاكل مع الجيران وإدارة المجتمع. اطلب مستوى الديسيبل للكابينة على بعد 7 أمتار.

## 6. التأريض والحماية

يجب تأريض محايد المولد وهيكله حسب نظام التأريض في المبنى، مع تنسيق الحمايات مع لوحة التوزيع الرئيسية.

## 7. الاختبار والتسليم

توقع اختباراً بحضور الجهات: التشغيل والتحويل عند محاكاة انقطاع الكهرباء واختبار الحمل وفحص الحمايات. احتفظ بتقرير الاختبار والمخططات النهائية للمفتشين.

## دعنا نجهز لك الملف

نورّد المولدات ولوحات ATS والتوزيع وخزانات الوقود والكبائن مع النشرات الفنية والمخططات وشهادات الاختبار التي يحتاجها استشاريك للتقديم، ونوصل إلى كل أنحاء [دبي](/ar/locations/dubai). أرسل لنا تفاصيل مشروعك على الواتساب.`,
  },
  {
    slug: "generator-fuel-consumption-chart",
    title_en: "Generator Fuel Consumption Chart: Litres per Hour from 20 to 2000 kVA",
    title_ar: "جدول استهلاك المولد للديزل: لتر في الساعة من 20 إلى 2000 ك.ف.أ",
    meta_title_en: "Generator Fuel Consumption Chart (L/h) 20–2000 kVA | 4U Power",
    meta_title_ar: "جدول استهلاك المولد للديزل باللتر في الساعة | فور يو باور",
    excerpt_en:
      "How much diesel does a generator use per hour? A consumption chart from 20 to 2000 kVA at 50%, 75% and full load, plus how to size the fuel tank.",
    excerpt_ar:
      "كم لتر ديزل يستهلك المولد في الساعة؟ جدول استهلاك من 20 إلى 2000 ك.ف.أ عند حمل 50% و75% والحمل الكامل، مع طريقة حساب سعة خزان الوقود.",
    cover_image: "/images/products/baudouin-diesel-generator-4u.webp",
    published_at: "2026-10-19T06:00:00Z",
    is_published: true,
    body_en: `Fuel is the biggest running cost of a generator, and it decides how big the tank must be. Here is how much diesel a set uses, and how to work out your own numbers.

## The quick rule

A modern diesel generator uses roughly **0.26 litres of diesel per kWh** produced at 75% load. Efficiency drops at light load and is slightly worse at full load.

**Litres per hour ≈ kW of load × 0.26**

So a 200 kVA set (160 kW) running at 75% load (120 kW) burns about 31 litres an hour.

## Consumption chart

Typical values for modern diesel sets at 0.8 power factor. Exact figures depend on engine model and site conditions — always check the datasheet for the unit quoted.

| Generator (kVA) | Prime kW | 50% load (L/h) | 75% load (L/h) | 100% load (L/h) |
| --- | --- | --- | --- | --- |
| 20 | 16 | 2.2 | 3.1 | 4.3 |
| 30 | 24 | 3.4 | 4.7 | 6.5 |
| 50 | 40 | 5.6 | 7.8 | 10.8 |
| 60 | 48 | 6.7 | 9.4 | 13.0 |
| 80 | 64 | 9.0 | 12.5 | 17.3 |
| 100 | 80 | 11.2 | 15.6 | 21.6 |
| 150 | 120 | 16.8 | 23.4 | 32.4 |
| 200 | 160 | 22.4 | 31.2 | 43.2 |
| 250 | 200 | 28.0 | 39.0 | 54.0 |
| 300 | 240 | 33.6 | 46.8 | 64.8 |
| 400 | 320 | 44.8 | 62.4 | 86.4 |
| 500 | 400 | 56.0 | 78.0 | 108.0 |
| 650 | 520 | 72.8 | 101.4 | 140.4 |
| 750 | 600 | 84.0 | 117.0 | 162.0 |
| 1000 | 800 | 112.0 | 156.0 | 216.0 |
| 1250 | 1000 | 140.0 | 195.0 | 270.0 |
| 1500 | 1200 | 168.0 | 234.0 | 324.0 |
| 2000 | 1600 | 224.0 | 312.0 | 432.0 |

Each size has its own page with the full specs — for example the [100 kVA](/en/generators/100-kva), [500 kVA](/en/generators/500-kva) and [1000 kVA](/en/generators/1000-kva) generators.

## What makes consumption go up

- **light loading** — a set at 20% load burns more fuel per kWh and suffers wet stacking
- **heat** — at 50 °C the radiator fan works harder and output is derated
- **dirty air filters and poor maintenance** — see our [maintenance checklist](/en/news/generator-maintenance-checklist-gulf)
- **oversizing** — a set far bigger than the load wastes fuel every hour it runs

## How to size the fuel tank

**Tank (litres) = L/h at expected load × hours of autonomy × 1.1**

The 10% covers the unusable fuel at the bottom of the tank. Example: a 500 kVA set at 75% load for 24 hours → 78 × 24 × 1.1 ≈ 2,060 litres. Standard base tanks usually give around 8 hours; longer autonomy needs a bigger base tank or an external [fuel tank](/en/products/generator-fuel-tanks).

## Running cost per hour

Multiply the litres per hour by the current diesel price. Over a year, 1–2 litres per hour saved by correct sizing adds up to thousands of litres — which is why getting the size right with our [kVA calculator](/en/calculator) pays for itself.`,
    body_ar: `الوقود هو أكبر تكلفة تشغيل للمولد، وهو ما يحدد حجم الخزان المطلوب. إليك كمية الديزل التي يستهلكها المولد، وكيف تحسب أرقامك بنفسك.

## القاعدة السريعة

يستهلك مولد الديزل الحديث نحو **0.26 لتر ديزل لكل كيلوواط ساعة** عند حمل 75%. تقل الكفاءة عند الحمل الخفيف وتسوء قليلاً عند الحمل الكامل.

**اللتر في الساعة ≈ الحمل بالكيلوواط × 0.26**

فمولد 200 ك.ف.أ (160 كيلوواط) يعمل بحمل 75% (120 كيلوواط) يحرق نحو 31 لتراً في الساعة.

## جدول الاستهلاك

قيم نموذجية لمولدات الديزل الحديثة عند معامل قدرة 0.8. الأرقام الدقيقة تعتمد على موديل المحرك وظروف الموقع، فراجع دائماً النشرة الفنية للوحدة المعروضة.

| المولد (ك.ف.أ) | كيلوواط | حمل 50% (لتر/ساعة) | حمل 75% (لتر/ساعة) | حمل 100% (لتر/ساعة) |
| --- | --- | --- | --- | --- |
| 20 | 16 | 2.2 | 3.1 | 4.3 |
| 30 | 24 | 3.4 | 4.7 | 6.5 |
| 50 | 40 | 5.6 | 7.8 | 10.8 |
| 60 | 48 | 6.7 | 9.4 | 13.0 |
| 80 | 64 | 9.0 | 12.5 | 17.3 |
| 100 | 80 | 11.2 | 15.6 | 21.6 |
| 150 | 120 | 16.8 | 23.4 | 32.4 |
| 200 | 160 | 22.4 | 31.2 | 43.2 |
| 250 | 200 | 28.0 | 39.0 | 54.0 |
| 300 | 240 | 33.6 | 46.8 | 64.8 |
| 400 | 320 | 44.8 | 62.4 | 86.4 |
| 500 | 400 | 56.0 | 78.0 | 108.0 |
| 650 | 520 | 72.8 | 101.4 | 140.4 |
| 750 | 600 | 84.0 | 117.0 | 162.0 |
| 1000 | 800 | 112.0 | 156.0 | 216.0 |
| 1250 | 1000 | 140.0 | 195.0 | 270.0 |
| 1500 | 1200 | 168.0 | 234.0 | 324.0 |
| 2000 | 1600 | 224.0 | 312.0 | 432.0 |

لكل حجم صفحة خاصة بالمواصفات الكاملة، مثل مولد [100 ك.ف.أ](/ar/generators/100-kva) و[500 ك.ف.أ](/ar/generators/500-kva) و[1000 ك.ف.أ](/ar/generators/1000-kva).

## ما الذي يرفع الاستهلاك

- **الحمل الخفيف**: المولد عند حمل 20% يحرق وقوداً أكثر لكل كيلوواط ساعة ويعاني من تراكم الوقود في العادم
- **الحرارة**: في 50 درجة تعمل مروحة المبرد بجهد أكبر وتنخفض القدرة
- **فلاتر الهواء المتسخة وضعف الصيانة**: راجع [قائمة الصيانة](/ar/news/generator-maintenance-checklist-gulf)
- **الحجم الزائد**: المولد الأكبر بكثير من الحمل يهدر الوقود في كل ساعة تشغيل

## كيف تحسب سعة خزان الوقود

**سعة الخزان (لتر) = اللتر في الساعة عند الحمل المتوقع × ساعات التشغيل المطلوبة × 1.1**

نسبة 10% تغطي الوقود غير القابل للاستخدام في قاع الخزان. مثال: مولد 500 ك.ف.أ بحمل 75% لمدة 24 ساعة ← 78 × 24 × 1.1 ≈ 2,060 لتراً. الخزانات القاعدية القياسية تعطي عادةً نحو 8 ساعات، والتشغيل الأطول يحتاج خزاناً قاعدياً أكبر أو [خزان وقود خارجي](/ar/products/generator-fuel-tanks).

## تكلفة التشغيل في الساعة

اضرب اللترات في الساعة في سعر الديزل الحالي. على مدار سنة، توفير لتر أو لترين في الساعة بالحجم الصحيح يصل إلى آلاف اللترات، ولهذا فإن اختيار الحجم الصحيح عبر [حاسبة القدرة](/ar/calculator) يغطي تكلفته بنفسه.`,
  },
  {
    slug: "ats-panel-types-motorized-contactor-acb",
    title_en: "ATS Panel Types: Contactor, Motorised Switch or ACB?",
    title_ar: "أنواع لوحات ATS: كونتاكتور أم مفتاح موتورايزد أم ACB؟",
    meta_title_en: "ATS Panel Types: Contactor vs Motorised vs ACB | 4U Power",
    meta_title_ar: "أنواع لوحات ATS: كونتاكتور أم موتورايزد أم ACB | فور يو باور",
    excerpt_en:
      "Not all automatic transfer switches are built the same. Contactor, motorised and ACB-based ATS panels compared, plus 3-pole vs 4-pole and sizing.",
    excerpt_ar:
      "لوحات التحويل الأوتوماتيكي ليست كلها متشابهة. مقارنة بين لوحات ATS بالكونتاكتور والمفتاح الموتورايزد والقاطع الهوائي ACB، مع 3 و4 أقطاب والسعة.",
    cover_image: "/images/products/perkins-containerized-generator-4u.webp",
    published_at: "2026-10-22T06:00:00Z",
    is_published: true,
    body_en: `Every automatic transfer switch does the same job — move the load from mains to generator and back — but the switching device inside decides how big, how robust and how expensive the panel is. For the basics of how an ATS works, see [ATS panels explained](/en/news/ats-panels-explained). This guide compares the three main types.

## 1. Contactor-based ATS

Two electrically and mechanically interlocked **contactors**, one for mains and one for the generator.

- **Best for:** small and medium loads — villas, shops, telecom sites, small buildings
- **Pros:** fast switching, simple, economical, easy to maintain
- **Watch out for:** contactor rating must cover the full load current with margin; not the choice for very high fault levels

## 2. Motorised changeover switch (load-break switch)

A single **motor-operated changeover switch** with three positions: mains – off – generator. The mechanism itself makes it impossible to close both sides together.

- **Best for:** medium to large buildings, commercial and industrial sites
- **Pros:** inherent mechanical interlock, compact, wide range of ratings, can often be operated manually in an emergency
- **Watch out for:** the switch must be rated for the prospective fault current at the board

## 3. ACB-based ATS

Two **air circuit breakers** with motor operators and mechanical interlock — the heavy-duty option.

- **Best for:** large loads and main distribution boards, typically from around 800 A up to several thousand amps
- **Pros:** switching and protection in one device, high fault ratings, withdrawable for maintenance, adjustable protection settings
- **Watch out for:** larger panel and higher cost; justified at high currents

## 3-pole or 4-pole?

- **4-pole** switches the neutral as well. It is usually needed where the generator neutral is earthed separately, where there are multiple sources, or to avoid neutral currents flowing through the wrong path
- **3-pole** keeps a common, solid neutral — common in simple installations

The correct choice follows the building's earthing system; your consultant will specify it, and we build to that specification.

## Open or closed transition?

Standard ATS panels use **open transition**: the load is briefly disconnected while switching (break-before-make). **Closed transition** briefly parallels the two sources so the return to mains has no interruption; it needs synchronising control and utility approval, and is used for sensitive loads.

## Sizing the ATS

Rate the ATS to the generator's full-load current: at 400 V, **amps ≈ kVA × 1.44**. A 500 kVA generator needs about 720 A, so an 800 A ATS. Each [generator size page](/en/generators/sizes) shows the matching ATS rating.

## What we build

We supply [ATS panels](/en/ats-panels) from 63 A to 4000 A — contactor, motorised and ACB types, 3- or 4-pole — built and tested in Sharjah with AMF controllers and full documentation. Send us your generator size and single-line diagram on WhatsApp for a quote.`,
    body_ar: `كل لوحة تحويل أوتوماتيكي تؤدي نفس المهمة، وهي نقل الحمل من الشبكة إلى المولد والعكس، لكن جهاز التحويل بداخلها هو ما يحدد حجم اللوحة ومتانتها وتكلفتها. لفهم أساسيات عمل اللوحة راجع [شرح لوحات ATS](/ar/news/ats-panels-explained). هذا الدليل يقارن الأنواع الثلاثة الرئيسية.

## 1. لوحة ATS بالكونتاكتور

**كونتاكتوران** بينهما قفل كهربائي وميكانيكي، واحد للشبكة وواحد للمولد.

- **الأنسب لـ:** الأحمال الصغيرة والمتوسطة، مثل الفلل والمحلات ومواقع الاتصالات والمباني الصغيرة
- **المزايا:** تحويل سريع وبسيط واقتصادي وسهل الصيانة
- **انتبه إلى:** يجب أن تغطي سعة الكونتاكتور تيار الحمل الكامل مع هامش، وهو ليس الخيار المناسب لمستويات القصر العالية جداً

## 2. مفتاح التحويل الموتورايزد

**مفتاح تحويل واحد يعمل بمحرك** بثلاثة أوضاع: الشبكة – إيقاف – المولد. تصميم الآلية نفسه يمنع توصيل الجانبين معاً.

- **الأنسب لـ:** المباني المتوسطة والكبيرة والمواقع التجارية والصناعية
- **المزايا:** قفل ميكانيكي مدمج وحجم صغير ونطاق واسع من السعات، وغالباً يمكن تشغيله يدوياً في الطوارئ
- **انتبه إلى:** يجب أن يكون المفتاح مقنناً لتيار القصر المتوقع في اللوحة

## 3. لوحة ATS بالقاطع الهوائي ACB

**قاطعان هوائيان** بمشغلات كهربائية وقفل ميكانيكي، وهو الخيار للخدمة الشاقة.

- **الأنسب لـ:** الأحمال الكبيرة ولوحات التوزيع الرئيسية، عادةً من نحو 800 أمبير حتى عدة آلاف من الأمبيرات
- **المزايا:** التحويل والحماية في جهاز واحد، وتحمل عالٍ لتيار القصر، وإمكانية السحب للصيانة، وإعدادات حماية قابلة للضبط
- **انتبه إلى:** لوحة أكبر وتكلفة أعلى، ويكون مبرراً عند التيارات العالية

## 3 أقطاب أم 4 أقطاب؟

- **4 أقطاب** تفصل المحايد أيضاً، وتكون مطلوبة عادةً عندما يُؤرَّض محايد المولد بشكل منفصل، أو عند وجود عدة مصادر، أو لمنع مرور تيارات المحايد في مسار خاطئ
- **3 أقطاب** تُبقي محايداً مشتركاً ثابتاً، وهي شائعة في التركيبات البسيطة

الاختيار الصحيح يتبع نظام التأريض في المبنى، ويحدده الاستشاري ونصنّع حسب مواصفاته.

## تحويل مفتوح أم مغلق؟

تستخدم لوحات ATS القياسية **التحويل المفتوح**، حيث ينقطع الحمل لحظياً أثناء التحويل (فصل قبل توصيل). أما **التحويل المغلق** فيوصل المصدرين على التوازي لحظياً فلا يحدث انقطاع عند العودة للشبكة، ويحتاج تحكماً بالتزامن وموافقة جهة الكهرباء، ويُستخدم للأحمال الحساسة.

## اختيار سعة اللوحة

اختر سعة اللوحة حسب تيار الحمل الكامل للمولد: على 400 فولت، **الأمبير ≈ ك.ف.أ × 1.44**. مولد 500 ك.ف.أ يحتاج نحو 720 أمبير، أي لوحة ATS سعة 800 أمبير. تعرض كل [صفحة من صفحات أحجام المولدات](/ar/generators/sizes) سعة اللوحة المناسبة.

## ما نصنّعه

نورّد [لوحات ATS](/ar/ats-panels) من 63 إلى 4000 أمبير، بالكونتاكتور أو الموتورايزد أو ACB، بـ 3 أو 4 أقطاب، مصنّعة ومختبرة في الشارقة مع وحدات تحكم AMF ومستندات كاملة. أرسل لنا حجم المولد والمخطط الأحادي على الواتساب لعرض سعر.`,
  },
];
