import type { NewsPost } from "@/lib/types";

/**
 * Week of 9 Nov 2026: written from real Google searches (Search Console snapshot of 6 Nov) —
 * "standard generator sizes kva" / "diesel generator size chart" / "generator sizes", "300 kva generator",
 * "80 kva generators".
 */
export const newsPart7: NewsPost[] = [
  {
    slug: "diesel-generator-size-chart-kva",
    title_en: "Diesel Generator Size Chart: Standard kVA Sizes from 10 to 2500 kVA",
    title_ar: "جدول أحجام مولدات الديزل: المقاسات القياسية من 10 إلى 2500 ك.ف.أ",
    meta_title_en: "Diesel Generator Size Chart: Standard kVA Sizes | 4U",
    meta_title_ar: "جدول أحجام مولدات الديزل بالكيلو فولت أمبير | فور يو",
    excerpt_en:
      "Diesel generator size chart: the standard generator sizes in kVA from 10 to 2500, with kW, amps, ATS rating and fuel use, and how to pick yours.",
    excerpt_ar:
      "جدول أحجام مولدات الديزل: المقاسات القياسية بالكيلو فولت أمبير من 10 إلى 2500، مع الكيلوواط والأمبير ولوحة ATS والوقود، وكيف تختار الحجم المناسب.",
    cover_image: "/images/products/cummins-diesel-generator-4u.webp",
    published_at: "2026-11-09T06:00:00Z",
    is_published: true,
    body_en: `Generators are sold in a ladder of standard sizes, and almost every quotation, tender and consultant drawing in the Gulf uses the same steps. Knowing the ladder makes it easier to compare offers and to see when a quoted size is really a different rating.

## Standard generator sizes in kVA

The common steps are **10, 15, 20, 30, 40, 50, 60, 80, 100, 125, 150, 200, 250, 300, 400, 500, 650, 750, 1000, 1250, 1500, 2000 and 2500 kVA**. Every size is rated at a **0.8 power factor**, so the real power in kW is the kVA × 0.8, and the current on a 400 V three-phase system is about kVA × 1.44.

## Diesel generator size chart

| Size | Power | Full-load current at 400 V | Typical ATS | Fuel at 75% load |
| --- | --- | --- | --- | --- |
| 10 kVA | 8 kW | 14 A | 63 A | about 1.6 L/h |
| 20 kVA | 16 kW | 29 A | 63 A | about 3.1 L/h |
| 30 kVA | 24 kW | 43 A | 63 A | about 4.7 L/h |
| 50 kVA | 40 kW | 72 A | 100 A | about 7.8 L/h |
| 80 kVA | 64 kW | 115 A | 125 A | about 12.5 L/h |
| 100 kVA | 80 kW | 144 A | 160 A | about 15.6 L/h |
| 150 kVA | 120 kW | 217 A | 250 A | about 23 L/h |
| 200 kVA | 160 kW | 289 A | 315 A | about 31 L/h |
| 250 kVA | 200 kW | 361 A | 400 A | about 39 L/h |
| 300 kVA | 240 kW | 433 A | 630 A | about 47 L/h |
| 500 kVA | 400 kW | 722 A | 800 A | about 78 L/h |
| 750 kVA | 600 kW | 1,083 A | 1,250 A | about 117 L/h |
| 1000 kVA | 800 kW | 1,443 A | 1,600 A | about 156 L/h |
| 1500 kVA | 1,200 kW | 2,165 A | 2,500 A | about 234 L/h |
| 2000 kVA | 1,600 kW | 2,887 A | 3,200 A | about 312 L/h |
| 2500 kVA | 2,000 kW | 3,608 A | 4,000 A | about 390 L/h |

Fuel figures are planning values (about 0.25 litres per kWh at load); each model's datasheet gives its own measured curve. The full chart for every step, with tank sizes for 8 and 24 hours, is on our [generator sizes](/en/generators/sizes) page, and the [fuel consumption chart](/en/news/generator-fuel-consumption-chart) shows real datasheet figures — for example the [200 kva generator fuel consumption per hour](/en/news/generator-fuel-consumption-chart).

## What each size band is used for

- **10–40 kVA** — villas, shops, site cabins, telecom shelters and pumps. Usually a compact silent canopy; our sets in this range run on Kubota, Perkins and Lister Petter engines.
- **50–150 kVA** — small office buildings, clinics, restaurants, workshops and large villas with many air-conditioning units. See what a [100 kva generator load capacity](/en/generators/100-kva) really covers.
- **200–500 kVA** — mid-rise buildings, schools, supermarkets, small factories and construction sites with tower cranes. Canopy or open sets with Perkins, Cummins or Baudouin engines.
- **650–1250 kVA** — hospitals, malls, large factories and hotels, often as open sets in a plant room or in a container.
- **1500–2500 kVA** — data centres, utilities and heavy industry, normally containerised and often synchronised in parallel.

## How to pick the right size from the chart

1. **Add up the running load in kW** and divide by 0.8 to get kVA.
2. **Check the biggest motor or compressor start.** Direct-on-line starts can need a much larger set than the running load suggests.
3. **Add room for growth** and for the Gulf heat — engines lose output at high ambient temperature and altitude.
4. **Pick prime or standby.** A set that runs daily must cover the load on its prime rating; a backup set can use the standby rating. Read [prime vs standby](/en/news/prime-vs-standby-generator-rating).
5. **Round up to the next standard size**, not down.

Our [kVA calculator](/en/calculator) runs these steps for you and lists the matching models, and the [step-by-step sizing guide](/en/news/how-to-choose-the-right-kva-generator) explains each one.

## Why the same size can mean two ratings

Our model codes follow the **prime** rating: a 4U-P100 is 100 kVA prime and 110 kVA standby. Some suppliers name their sets by the standby figure, so a "110 kVA" offer can be the same machine as our 100 kVA. Always compare prime with prime.

## Get the size confirmed

We supply sets across the whole chart on Perkins, Cummins, Baudouin, Kubota and Lister Petter engines, with Deep Sea controllers, 4U · Leroy-Somer | Stamford alternators and a 12-month / 1,000-hour warranty. Send your load list on WhatsApp and we will confirm the size and the model for your site.`,
    body_ar: `تُباع المولدات بسلّم من المقاسات القياسية، وتستخدم معظم عروض الأسعار والمناقصات ومخططات الاستشاريين في الخليج نفس هذه الدرجات. معرفة هذا السلّم تسهّل مقارنة العروض، وتكشف لك متى يكون المقاس المكتوب في العرض قدرةً مختلفة في الحقيقة.

## أحجام المولدات القياسية بالكيلو فولت أمبير

الدرجات الشائعة هي **10 و15 و20 و30 و40 و50 و60 و80 و100 و125 و150 و200 و250 و300 و400 و500 و650 و750 و1000 و1250 و1500 و2000 و2500 ك.ف.أ**. كل مقاس مُقنَّن عند **معامل قدرة 0.8**، فالقدرة الفعلية بالكيلوواط = ك.ف.أ × 0.8، والتيار على نظام ثلاثي الفاز 400 فولت يساوي تقريباً ك.ف.أ × 1.44.

## جدول أحجام مولدات الديزل

| المقاس | القدرة | تيار الحمل الكامل على 400 فولت | لوحة ATS المعتادة | الوقود عند حمل 75% |
| --- | --- | --- | --- | --- |
| 10 ك.ف.أ | 8 ك.و | 14 أمبير | 63 أمبير | حوالي 1.6 لتر/ساعة |
| 20 ك.ف.أ | 16 ك.و | 29 أمبير | 63 أمبير | حوالي 3.1 لتر/ساعة |
| 30 ك.ف.أ | 24 ك.و | 43 أمبير | 63 أمبير | حوالي 4.7 لتر/ساعة |
| 50 ك.ف.أ | 40 ك.و | 72 أمبير | 100 أمبير | حوالي 7.8 لتر/ساعة |
| 80 ك.ف.أ | 64 ك.و | 115 أمبير | 125 أمبير | حوالي 12.5 لتر/ساعة |
| 100 ك.ف.أ | 80 ك.و | 144 أمبير | 160 أمبير | حوالي 15.6 لتر/ساعة |
| 150 ك.ف.أ | 120 ك.و | 217 أمبير | 250 أمبير | حوالي 23 لتر/ساعة |
| 200 ك.ف.أ | 160 ك.و | 289 أمبير | 315 أمبير | حوالي 31 لتر/ساعة |
| 250 ك.ف.أ | 200 ك.و | 361 أمبير | 400 أمبير | حوالي 39 لتر/ساعة |
| 300 ك.ف.أ | 240 ك.و | 433 أمبير | 630 أمبير | حوالي 47 لتر/ساعة |
| 500 ك.ف.أ | 400 ك.و | 722 أمبير | 800 أمبير | حوالي 78 لتر/ساعة |
| 750 ك.ف.أ | 600 ك.و | 1,083 أمبير | 1,250 أمبير | حوالي 117 لتر/ساعة |
| 1000 ك.ف.أ | 800 ك.و | 1,443 أمبير | 1,600 أمبير | حوالي 156 لتر/ساعة |
| 1500 ك.ف.أ | 1,200 ك.و | 2,165 أمبير | 2,500 أمبير | حوالي 234 لتر/ساعة |
| 2000 ك.ف.أ | 1,600 ك.و | 2,887 أمبير | 3,200 أمبير | حوالي 312 لتر/ساعة |
| 2500 ك.ف.أ | 2,000 ك.و | 3,608 أمبير | 4,000 أمبير | حوالي 390 لتر/ساعة |

أرقام الوقود قيم تخطيطية (حوالي 0.25 لتر لكل كيلوواط ساعة تحت الحمل)، ولكل موديل منحنى مقاس في الداتاشيت الخاص به. الجدول الكامل لكل الدرجات، مع سعة الخزان لـ 8 و24 ساعة، موجود في صفحة [أحجام المولدات](/ar/generators/sizes)، ويعرض [جدول استهلاك الوقود](/ar/news/generator-fuel-consumption-chart) أرقام الداتاشيت الفعلية، ومنها [استهلاك وقود مولد 200 ك.ف.أ في الساعة](/ar/news/generator-fuel-consumption-chart).

## استخدامات كل فئة من الأحجام

- **10–40 ك.ف.أ**: الفلل والمحلات وكبائن المواقع وغرف الاتصالات والمضخات. غالباً بكانوبي صامت صغير، ومولداتنا في هذه الفئة تعمل بمحركات كوبوتا وبيركنز وليستر بيتر.
- **50–150 ك.ف.أ**: مباني المكاتب الصغيرة والعيادات والمطاعم والورش والفلل الكبيرة ذات وحدات التكييف الكثيرة. اقرأ ما الذي تغطيه فعلاً [قدرة الحمل لمولد 100 ك.ف.أ](/ar/generators/100-kva).
- **200–500 ك.ف.أ**: المباني متوسطة الارتفاع والمدارس والسوبرماركت والمصانع الصغيرة ومواقع البناء التي فيها رافعات برجية. بكانوبي أو مفتوحة، بمحركات بيركنز وكمنز وبودوان.
- **650–1250 ك.ف.أ**: المستشفيات والمولات والمصانع الكبيرة والفنادق، غالباً مولدات مفتوحة في غرفة محركات أو داخل حاوية.
- **1500–2500 ك.ف.أ**: مراكز البيانات والمرافق والصناعات الثقيلة، عادةً داخل حاويات وكثيراً ما تعمل على التوازي بالتزامن.

## كيف تختار الحجم المناسب من الجدول

1. **اجمع حمل التشغيل بالكيلوواط** واقسمه على 0.8 لتحصل على الكيلو فولت أمبير.
2. **راجع إقلاع أكبر محرك أو كمبروسر.** الإقلاع المباشر قد يحتاج مولداً أكبر بكثير مما يوحي به حمل التشغيل.
3. **اترك هامشاً للتوسع ولحرارة الخليج**، فالمحركات تفقد جزءاً من قدرتها في الحرارة العالية وعلى الارتفاعات.
4. **اختر Prime أو Standby.** المولد الذي يعمل يومياً يجب أن يغطي الحمل بقدرته الأساسية، أما مولد الطوارئ فيمكن الاعتماد على قدرته الاحتياطية. اقرأ [الفرق بين Prime وStandby](/ar/news/prime-vs-standby-generator-rating).
5. **قرّب إلى المقاس القياسي الأعلى** وليس الأدنى.

تنفّذ [حاسبة القدرة](/ar/calculator) هذه الخطوات وتعرض الموديلات المناسبة، ويشرح [دليل اختيار المقاس خطوة بخطوة](/ar/news/how-to-choose-the-right-kva-generator) كل خطوة بالتفصيل.

## لماذا قد يعني نفس المقاس قدرتين مختلفتين

أكواد موديلاتنا تتبع القدرة **الأساسية (Prime)**: فموديل 4U-P100 قدرته 100 ك.ف.أ Prime و110 ك.ف.أ Standby. بعض الموردين يسمّون مولداتهم بالقدرة الاحتياطية، فيكون عرض "110 ك.ف.أ" هو نفس الماكينة التي نسميها 100 ك.ف.أ. قارن دائماً القدرة الأساسية بالقدرة الأساسية.

## تأكد من المقاس قبل الشراء

نورّد مولدات على كامل هذا الجدول بمحركات بيركنز وكمنز وبودوان وكوبوتا وليستر بيتر، مع وحدات تحكم Deep Sea ومولدات تيار 4U · Leroy-Somer | Stamford وضمان 12 شهراً أو 1,000 ساعة. أرسل لنا قائمة الأحمال على الواتساب، وسنؤكد لك المقاس والموديل المناسب لموقعك.`,
  },
  {
    slug: "300-kva-generator-guide",
    title_en: "300 kVA Generator: Specifications, Amps, Fuel Use and Size",
    title_ar: "مولد 300 ك.ف.أ: المواصفات والأمبير واستهلاك الوقود والأبعاد",
    meta_title_en: "300 kVA Generator: Specs, Amps & Fuel Use | 4U Power",
    meta_title_ar: "مولد 300 كيلو فولت أمبير: المواصفات والوقود | فور يو",
    excerpt_en:
      "300 kVA generator guide: kW and amps, the Perkins, Cummins and Baudouin engines behind it, fuel use per hour, canopy size, weight and what drives cost.",
    excerpt_ar:
      "دليل مولد 300 ك.ف.أ: القدرة بالكيلوواط والأمبير، محركات بيركنز وكمنز وبودوان، استهلاك الوقود بالساعة، أبعاد الكانوبي والوزن، وما الذي يحدد التكلفة.",
    cover_image: "/images/products/perkins-diesel-generator-250-1000kva-4u.webp",
    published_at: "2026-11-10T06:00:00Z",
    is_published: true,
    body_en: `A 300 kVA generator is the step above the popular 250 kVA and a common choice for mid-rise towers, schools, cold stores, factories and construction sites with heavy cranes. Here is what the size really delivers and how the engines compare.

## 300 kVA generator in kW and amps

At the standard **0.8 power factor**, 300 kVA gives **240 kW**. On our datasheets a 300 kVA set is **300 kVA prime / 330 kVA standby** (264 kW standby).

| Rating | Power | Full-load current at 400 V |
| --- | --- | --- |
| 300 kVA prime | 240 kW | about 433 A |
| 330 kVA standby | 264 kW | about 476 A |

That current is above a 400 A panel, so a 300 kVA set normally feeds a 500 A breaker and an [ATS panel from the 630 A range](/en/products/ats-panel-630a-4000a). Every size's current is in our [generator sizes](/en/generators/sizes) chart.

If your load list says **300 kW**, you need 300 ÷ 0.8 = **375 kVA** — look at the [400 kVA generators](/en/generators/400-kva) instead.

## Engines for a 300 kVA generator

All four of our 300 kVA models run at 1500 rpm on six-cylinder, turbocharged and charge-cooled engines:

| Model | Engine | Alternator | Controller |
| --- | --- | --- | --- |
| [4U-P300](/en/models/4u-p300) | Perkins 1506A-E88TAG5 | 4U Power alternator (Leroy-Somer TAL-A46-F on request) | Deep Sea DSE6110 MKII |
| [4U-P300B](/en/models/4u-p300b) | Perkins 1706A-E93TAG1 | 4U Power alternator (Leroy-Somer TAL-A46-F on request) | Deep Sea DSE6110 MKII |
| [4U-C300](/en/models/4u-c300) | Cummins 6LTAA9.5-G1 | Leroy-Somer TAL-A46-F | Deep Sea DSE6120 |
| [4U-B300](/en/models/4u-b300) | Baudouin 6M16G350/5 | Leroy-Somer TAL-A46-F | Deep Sea DSE6120 MKII |

Perkins and Cummins are the best-known engine brands in the Gulf, with wide parts and service support; Baudouin is a strong option where budget matters. Our [engine brand comparison](/en/news/perkins-vs-cummins-vs-kubota-engine-brand-uae) explains the trade-offs.

## Fuel consumption of a 300 kVA generator

From our datasheets:

- **Perkins 4U-P300:** about **48 L/h** at 75% load, **65 L/h** at full prime load, 73 L/h at standby.
- **Cummins 4U-C300:** about **52 L/h** at 75% load, **70 L/h** at full prime load, 78 L/h at standby.

So a set running 10 hours a day at 75% load uses roughly 480–520 litres of diesel a day. Compare other sizes in the [fuel consumption chart](/en/news/generator-fuel-consumption-chart).

## Size, weight and tank

| Silent canopy | Length × width × height | Weight | Base tank | Run time at 75% |
| --- | --- | --- | --- | --- |
| Perkins 4U-P300 | 4,414 × 1,614 × 2,235 mm | 3,440 kg | 760 L | about 15 h |
| Cummins 4U-C300 | 5,205 × 1,625 × 2,620 mm | 4,000 kg | 625 L | about 12 h |
| Baudouin 4U-B300 | 4,300 × 1,700 × 2,500 mm | 4,500 kg | 700 L | — |

Plan a concrete plinth, crane access for 3.5–4.5 tonnes and clear space around the canopy for airflow and service. For longer autonomy, add an [external fuel tank](/en/products/generator-fuel-tanks).

## What decides the cost of a 300 kVA generator

The engine brand and series, the alternator, open set or silent canopy, the controller (manual start or automatic mains failure), the tank size, the ATS and the delivery and installation scope all move the figure. Our guide to [generator prices](/en/news/generator-price-uae-cost-factors) walks through each factor, so you can compare quotations line by line.

## Order a 300 kVA generator

Every set comes with a Deep Sea controller, 4U · Leroy-Somer | Stamford alternator options and a 12-month / 1,000-hour warranty. See all [300 kVA generators](/en/generators/300-kva), or send your load list on WhatsApp and we will confirm the right model.`,
    body_ar: `مولد 300 ك.ف.أ هو الدرجة التي تلي مولد 250 ك.ف.أ الشائع، وهو اختيار معتاد للأبراج متوسطة الارتفاع والمدارس والمخازن المبردة والمصانع ومواقع البناء ذات الرافعات الثقيلة. إليك ما يعطيه هذا المقاس فعلاً، وكيف تختلف المحركات المتاحة له.

## مولد 300 ك.ف.أ بالكيلوواط والأمبير

عند **معامل القدرة القياسي 0.8** يعطي مولد 300 ك.ف.أ **240 كيلوواط**. وفي الداتاشيت لدينا، مولد 300 ك.ف.أ قدرته **300 ك.ف.أ Prime و330 ك.ف.أ Standby** (أي 264 كيلوواط احتياطي).

| القدرة | الكيلوواط | تيار الحمل الكامل على 400 فولت |
| --- | --- | --- |
| 300 ك.ف.أ Prime | 240 ك.و | حوالي 433 أمبير |
| 330 ك.ف.أ Standby | 264 ك.و | حوالي 476 أمبير |

هذا التيار أعلى من لوحة 400 أمبير، لذلك يُغذّي مولد 300 ك.ف.أ عادةً قاطعاً 500 أمبير و[لوحة ATS من فئة 630 أمبير فما فوق](/ar/products/ats-panel-630a-4000a). وتجد تيار كل مقاس في جدول [أحجام المولدات](/ar/generators/sizes).

وإذا كانت قائمة أحمالك **300 كيلوواط**، فأنت تحتاج 300 ÷ 0.8 = **375 ك.ف.أ**، أي انظر إلى [مولدات 400 ك.ف.أ](/ar/generators/400-kva).

## محركات مولد 300 ك.ف.أ

كل موديلات 300 ك.ف.أ لدينا تعمل على 1500 لفة في الدقيقة بمحركات سداسية الأسطوانات بشاحن توربيني وتبريد لهواء الشحن:

| الموديل | المحرك | مولد التيار | وحدة التحكم |
| --- | --- | --- | --- |
| [4U-P300](/ar/models/4u-p300) | بيركنز 1506A-E88TAG5 | مولد تيار 4U Power (أو Leroy-Somer TAL-A46-F عند الطلب) | Deep Sea DSE6110 MKII |
| [4U-P300B](/ar/models/4u-p300b) | بيركنز 1706A-E93TAG1 | مولد تيار 4U Power (أو Leroy-Somer TAL-A46-F عند الطلب) | Deep Sea DSE6110 MKII |
| [4U-C300](/ar/models/4u-c300) | كمنز 6LTAA9.5-G1 | Leroy-Somer TAL-A46-F | Deep Sea DSE6120 |
| [4U-B300](/ar/models/4u-b300) | بودوان 6M16G350/5 | Leroy-Somer TAL-A46-F | Deep Sea DSE6120 MKII |

بيركنز وكمنز أشهر ماركات المحركات في الخليج مع توفر واسع لقطع الغيار والصيانة، وبودوان خيار قوي عندما تكون الميزانية هي الأهم. وتشرح [مقارنة ماركات المحركات](/ar/news/perkins-vs-cummins-vs-kubota-engine-brand-uae) الفروق بينها.

## استهلاك الوقود لمولد 300 ك.ف.أ

حسب الداتاشيت لدينا:

- **بيركنز 4U-P300:** حوالي **48 لتراً/ساعة** عند حمل 75%، و**65 لتراً/ساعة** عند الحمل الأساسي الكامل، و73 لتراً/ساعة على القدرة الاحتياطية.
- **كمنز 4U-C300:** حوالي **52 لتراً/ساعة** عند حمل 75%، و**70 لتراً/ساعة** عند الحمل الأساسي الكامل، و78 لتراً/ساعة على القدرة الاحتياطية.

أي أن مولداً يعمل 10 ساعات يومياً عند حمل 75% يستهلك تقريباً 480–520 لتر ديزل في اليوم. قارن مع المقاسات الأخرى في [جدول استهلاك الوقود](/ar/news/generator-fuel-consumption-chart).

## الأبعاد والوزن والخزان

| الكانوبي الصامت | الطول × العرض × الارتفاع | الوزن | الخزان القاعدي | التشغيل عند حمل 75% |
| --- | --- | --- | --- | --- |
| بيركنز 4U-P300 | 4,414 × 1,614 × 2,235 مم | 3,440 كجم | 760 لتراً | حوالي 15 ساعة |
| كمنز 4U-C300 | 5,205 × 1,625 × 2,620 مم | 4,000 كجم | 625 لتراً | حوالي 12 ساعة |
| بودوان 4U-B300 | 4,300 × 1,700 × 2,500 مم | 4,500 كجم | 700 لتر | — |

جهّز قاعدة خرسانية، ومدخلاً لرافعة تحمل 3.5–4.5 طن، ومساحة حول الكانوبي لدخول الهواء وأعمال الصيانة. ولمدة تشغيل أطول أضف [خزان وقود خارجياً](/ar/products/generator-fuel-tanks).

## ما الذي يحدد تكلفة مولد 300 ك.ف.أ

ماركة المحرك وفئته، ومولد التيار، والمولد المفتوح أو بالكانوبي الصامت، ووحدة التحكم (تشغيل يدوي أو تشغيل تلقائي عند انقطاع الكهرباء)، وسعة الخزان، ولوحة ATS، ونطاق التوصيل والتركيب، كلها تغيّر الرقم النهائي. ويشرح دليلنا عن [أسعار المولدات](/ar/news/generator-price-uae-cost-factors) كل عامل منها، لتقارن عروض الأسعار بنداً بنداً.

## اطلب مولد 300 ك.ف.أ

كل مولد يأتي مع وحدة تحكم Deep Sea وخيارات مولد تيار 4U · Leroy-Somer | Stamford وضمان 12 شهراً أو 1,000 ساعة. اطلع على كل [مولدات 300 ك.ف.أ](/ar/generators/300-kva)، أو أرسل قائمة الأحمال على الواتساب وسنؤكد لك الموديل المناسب.`,
  },
  {
    slug: "80-kva-generator-guide",
    title_en: "80 kVA Generators: kW, Amps, Fuel Use and What They Can Run",
    title_ar: "مولدات 80 ك.ف.أ: الكيلوواط والأمبير واستهلاك الوقود وماذا تشغّل",
    meta_title_en: "80 kVA Generator: kW, Amps & Fuel Use | 4U Power",
    meta_title_ar: "مولد 80 كيلو فولت أمبير: القدرة والوقود | فور يو",
    excerpt_en:
      "80 kVA generators explained: 64 kW and 115 A, Perkins, Cummins and Baudouin engines, fuel per hour, canopy size, and when you need 100 kVA instead.",
    excerpt_ar:
      "كل ما تحتاجه عن مولدات 80 ك.ف.أ: 64 كيلوواط و115 أمبير، محركات بيركنز وكمنز وبودوان، الوقود بالساعة، أبعاد الكانوبي، ومتى تحتاج 100 ك.ف.أ بدلاً منها.",
    cover_image: "/images/products/baudouin-diesel-generator-4u.webp",
    published_at: "2026-11-12T06:00:00Z",
    is_published: true,
    body_en: `80 kVA generators fill the gap between small standby sets and the 100 kVA class. They suit shops, small offices, clinics, restaurants, workshops and villas with a lot of air conditioning, and they still fit on a small plinth or a trailer.

## 80 kVA generators: kW and amps

At a **0.8 power factor** an 80 kVA generator gives **64 kW**. On our datasheets the 80 kVA sets are rated **80 kVA prime** and **88–92 kVA standby**, depending on the engine.

| Rating | Power | Full-load current at 400 V |
| --- | --- | --- |
| 80 kVA prime | 64 kW | about 115 A |
| 88 kVA standby (Perkins, Baudouin) | 70 kW | about 127 A |
| 92 kVA standby (Cummins) | 74 kW | about 133 A |

That usually means a 125 A breaker and an [ATS panel in the 63–400 A range](/en/products/ats-panel-63a-400a). The [generator sizes](/en/generators/sizes) chart gives the current for every size.

## Generator 80 kVA: the engines

| Model | Engine | Alternator | Controller |
| --- | --- | --- | --- |
| [4U-P80](/en/models/4u-p80) | Perkins 1104A-44TG2 | Leroy-Somer TAL-A44-B or 4U Power alternator | Deep Sea DSE4520 MKII |
| [4U-C80](/en/models/4u-c80) | Cummins 4BTAA3.9-G11 | Leroy-Somer TAL-A44-B or 4U Power alternator | Deep Sea DSE4520 |
| [4U-B80](/en/models/4u-b80) | Baudouin 4M10G4D0/S | Leroy-Somer TAL-A44-B | Deep Sea DSE4520 MKII |

All three are four-cylinder, turbocharged diesel engines running at 1500 rpm. The Deep Sea DSE4520 is an automatic mains failure controller, so with an ATS the set starts and takes the load by itself when the grid fails.

## What can an 80 kVA generator run?

As a guide, 64 kW of running load covers the lighting, sockets, IT, a cold room and several split or packaged air-conditioning units of a small commercial building. What limits an 80 kVA set is usually **starting current**, not running power:

- **Air-conditioning compressors** draw several times their running current when they start. Restarting all units together after an outage is the hardest moment for the set.
- **Pumps and motors** started direct-on-line need far more than their kW; a soft starter or VFD makes a big difference.

List your loads with how they start and run them through our [kVA calculator](/en/calculator).

## Need 80 kW? Then look at 100 kVA

A load of **80 kW** needs 80 ÷ 0.8 = **100 kVA**. See what a [100 kva generator load capacity](/en/generators/100-kva) covers before you decide; it is the next step on the size ladder.

## Fuel use and run time

From our datasheets:

- **Perkins 4U-P80:** about **10.8 L/h** at 75% load and **14 L/h** at full prime load.
- **Cummins 4U-C80:** about **13.2 L/h** at 75% load and **17.6 L/h** at full prime load.

With the 269-litre base tank of the canopy, that is roughly **25 hours** (Perkins) or **20 hours** (Cummins) at 75% load. Other sizes are in the [fuel consumption chart](/en/news/generator-fuel-consumption-chart).

## Size, weight and noise

| Silent canopy | Length × width × height | Weight | Base tank | Noise |
| --- | --- | --- | --- | --- |
| Perkins 4U-P80 / Cummins 4U-C80 | 2,977 × 1,155 × 1,693 mm | 1,360 kg | 269 L | 73 dB(A) |
| Baudouin 4U-B80 | 2,400 × 1,100 × 1,650 mm | 1,480 kg | 185 L | 79 dB(A) |

Open sets are smaller (about 2.2 m long for the Perkins and Cummins versions) for plant rooms with their own sound treatment.

## Choose your 80 kVA generator

Prices depend on the engine, alternator, canopy, controller and installation scope — our [generator prices](/en/news/generator-price-uae-cost-factors) guide explains each factor. Every set carries 4U · Leroy-Somer | Stamford alternator options, a Deep Sea controller and a 12-month / 1,000-hour warranty. Browse the [80 kva generators](/en/generators/80-kva) or send your load list on WhatsApp for a quotation.`,
    body_ar: `تملأ مولدات 80 ك.ف.أ الفجوة بين مولدات الطوارئ الصغيرة وفئة 100 ك.ف.أ. وهي مناسبة للمحلات والمكاتب الصغيرة والعيادات والمطاعم والورش والفلل التي فيها تكييف كثير، ولا تزال تكفيها قاعدة صغيرة أو مقطورة.

## مولدات 80 ك.ف.أ: الكيلوواط والأمبير

عند **معامل قدرة 0.8** يعطي مولد 80 ك.ف.أ **64 كيلوواط**. وفي الداتاشيت لدينا، مولدات 80 ك.ف.أ قدرتها **80 ك.ف.أ Prime** و**88–92 ك.ف.أ Standby** حسب المحرك.

| القدرة | الكيلوواط | تيار الحمل الكامل على 400 فولت |
| --- | --- | --- |
| 80 ك.ف.أ Prime | 64 ك.و | حوالي 115 أمبير |
| 88 ك.ف.أ Standby (بيركنز وبودوان) | 70 ك.و | حوالي 127 أمبير |
| 92 ك.ف.أ Standby (كمنز) | 74 ك.و | حوالي 133 أمبير |

وهذا يعني عادةً قاطعاً 125 أمبير و[لوحة ATS من فئة 63–400 أمبير](/ar/products/ats-panel-63a-400a). ويعطيك جدول [أحجام المولدات](/ar/generators/sizes) تيار كل مقاس.

## مولد 80 ك.ف.أ: المحركات المتاحة

| الموديل | المحرك | مولد التيار | وحدة التحكم |
| --- | --- | --- | --- |
| [4U-P80](/ar/models/4u-p80) | بيركنز 1104A-44TG2 | Leroy-Somer TAL-A44-B أو مولد تيار 4U Power | Deep Sea DSE4520 MKII |
| [4U-C80](/ar/models/4u-c80) | كمنز 4BTAA3.9-G11 | Leroy-Somer TAL-A44-B أو مولد تيار 4U Power | Deep Sea DSE4520 |
| [4U-B80](/ar/models/4u-b80) | بودوان 4M10G4D0/S | Leroy-Somer TAL-A44-B | Deep Sea DSE4520 MKII |

الثلاثة محركات ديزل رباعية الأسطوانات بشاحن توربيني تعمل على 1500 لفة في الدقيقة. ووحدة Deep Sea DSE4520 تدعم التشغيل التلقائي عند انقطاع الكهرباء، فمع لوحة ATS يعمل المولد ويستلم الحمل وحده عند انقطاع الشبكة.

## ماذا يمكن لمولد 80 ك.ف.أ أن يشغّل؟

كقاعدة عامة، يغطي حمل تشغيل 64 كيلوواط إنارة ومقابس وأجهزة كمبيوتر وغرفة تبريد وعدة وحدات تكييف سبليت أو باكيج في مبنى تجاري صغير. وما يحدّ مولد 80 ك.ف.أ عادةً هو **تيار الإقلاع** وليس قدرة التشغيل:

- **كمبروسرات التكييف** تسحب عدة أضعاف تيارها عند الإقلاع، وإعادة تشغيل كل الوحدات معاً بعد الانقطاع هي أصعب لحظة على المولد.
- **المضخات والمحركات** التي تُقلع مباشرةً تحتاج أكثر بكثير من قدرتها بالكيلوواط، ووجود سوفت ستارتر أو VFD يُحدث فرقاً كبيراً.

اكتب أحمالك مع طريقة إقلاعها، وأدخلها في [حاسبة القدرة](/ar/calculator).

## تحتاج 80 كيلوواط؟ إذن انظر إلى 100 ك.ف.أ

حمل **80 كيلوواط** يحتاج 80 ÷ 0.8 = **100 ك.ف.أ**. اطلع على ما تغطيه [قدرة الحمل لمولد 100 ك.ف.أ](/ar/generators/100-kva) قبل أن تقرر، فهو الدرجة التالية في سلّم المقاسات.

## استهلاك الوقود ومدة التشغيل

حسب الداتاشيت لدينا:

- **بيركنز 4U-P80:** حوالي **10.8 لتر/ساعة** عند حمل 75%، و**14 لتراً/ساعة** عند الحمل الأساسي الكامل.
- **كمنز 4U-C80:** حوالي **13.2 لتر/ساعة** عند حمل 75%، و**17.6 لتر/ساعة** عند الحمل الأساسي الكامل.

ومع الخزان القاعدي للكانوبي بسعة 269 لتراً، يعني ذلك حوالي **25 ساعة** (بيركنز) أو **20 ساعة** (كمنز) عند حمل 75%. وتجد المقاسات الأخرى في [جدول استهلاك الوقود](/ar/news/generator-fuel-consumption-chart).

## الأبعاد والوزن ومستوى الصوت

| الكانوبي الصامت | الطول × العرض × الارتفاع | الوزن | الخزان القاعدي | الصوت |
| --- | --- | --- | --- | --- |
| بيركنز 4U-P80 / كمنز 4U-C80 | 2,977 × 1,155 × 1,693 مم | 1,360 كجم | 269 لتراً | 73 ديسيبل |
| بودوان 4U-B80 | 2,400 × 1,100 × 1,650 مم | 1,480 كجم | 185 لتراً | 79 ديسيبل |

أما المولدات المفتوحة فهي أصغر (حوالي 2.2 م طولاً لنسختي بيركنز وكمنز)، وتناسب غرف المحركات المعزولة صوتياً.

## اختر مولد 80 ك.ف.أ المناسب

يعتمد السعر على المحرك ومولد التيار والكانوبي ووحدة التحكم ونطاق التركيب، ويشرح دليل [أسعار المولدات](/ar/news/generator-price-uae-cost-factors) كل عامل منها. كل مولد يأتي مع خيارات مولد تيار 4U · Leroy-Somer | Stamford ووحدة تحكم Deep Sea وضمان 12 شهراً أو 1,000 ساعة. تصفّح [مولدات 80 ك.ف.أ](/ar/generators/80-kva) أو أرسل قائمة الأحمال على الواتساب لنرسل لك عرض السعر.`,
  },
];
