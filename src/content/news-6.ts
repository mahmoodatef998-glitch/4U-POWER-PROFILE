import type { NewsPost } from "@/lib/types";

/**
 * Week of 2 Nov 2026: written from real Google searches (Search Console snapshot of 26 Oct) —
 * "100 kva generator load capacity", "250 kva generator", "generator full load current".
 */
export const newsPart6: NewsPost[] = [
  {
    slug: "100-kva-generator-load-capacity",
    title_en: "100 kVA Generator: Load Capacity, Amps and What It Can Run",
    title_ar: "مولد 100 ك.ف.أ: قدرة الحمل والأمبير وماذا يمكنه أن يشغّل",
    meta_title_en: "100 kVA Generator Load Capacity & Amps | 4U Power",
    meta_title_ar: "مولد 100 كيلو فولت أمبير: قدرة الحمل والأمبير | فور يو",
    excerpt_en:
      "100 kVA generator load capacity explained: how many kW and amps it gives, what it can run, fuel use per hour, and when you need 125 kVA instead.",
    excerpt_ar:
      "قدرة الحمل لمولد 100 ك.ف.أ بالتفصيل: كم كيلوواط وكم أمبير يعطي، ماذا يمكنه أن يشغّل، استهلاك الوقود بالساعة، ومتى تحتاج 125 ك.ف.أ بدلاً منه.",
    cover_image: "/images/products/perkins-diesel-generator-4u.webp",
    published_at: "2026-11-02T06:00:00Z",
    is_published: true,
    body_en: `A 100 kVA generator is one of the most common sizes in the UAE: big enough for a shop, a small office building, a clinic or a large villa, small enough to fit in a car park. But "100 kVA" on a quotation can mean different things, so it pays to know what the number really gives you.

## 100 kVA generator load capacity in kW

Generators are rated in kVA at a **0.8 power factor**, so a 100 kVA generator delivers about **80 kW** of real power. If your load list is in kW, divide by 0.8 to get the kVA you need.

Check which rating the 100 kVA is. On our datasheets a set sold as "100 kVA" is usually **110 kVA standby / 100 kVA prime** — the [4U-P110](/en/models/4u-p110) (Perkins 1104C-44TAG2), [4U-C110A](/en/models/4u-c110a) (Cummins 6BTA5.9-G5) or 4U-B110 (Baudouin 4M10G6D0/S). If the set will run every day, it is the 100 kVA prime that must cover the load. See [prime vs standby](/en/news/prime-vs-standby-generator-rating).

## How many amps does a 100 kVA generator give?

On a 400 V three-phase system:

**Current (A) = kVA × 1000 ÷ (1.732 × 400) ≈ kVA × 1.44**

| Rating | Full-load current at 400 V |
| --- | --- |
| 100 kVA | about 144 A per phase |
| 110 kVA (standby) | about 159 A per phase |

That is why a 100 kVA set usually feeds a 160 A breaker and pairs with an [ATS panel in the 63–400 A range](/en/products/ats-panel-63a-400a). Our [generator full load current chart](/en/generators/sizes) covers every size.

## What can a 100 kVA generator run?

It depends on how the loads start, not only on their running kW:

- **Lighting, IT and sockets** are easy loads — they add up close to their rated kW.
- **Air conditioning** is the big one in the Gulf. Compressors draw several times their running current for a moment when they start; a generator that handles 15 split units running may still dip when ten of them start together after an outage. Stagger the restarts or size up.
- **Motors and pumps** started direct-on-line need a generator several times their kW. A soft starter or VFD reduces this a lot.

A practical method: list every load with its kW and how it starts, add the running kW with a realistic diversity, then check the biggest motor start. Our [kVA calculator](/en/calculator) does this for you, and our [villa generator guide](/en/news/generator-size-for-villa-uae) shows a worked example.

## Need 100 kW? Then it is 125 kVA

A **100 kW** load needs 100 ÷ 0.8 = **125 kVA**. If your consultant writes "100 kW diesel generator", look at the [125 kVA generators](/en/generators/125-kva), not the 100 kVA ones.

## Fuel use and run time

From our datasheets, a 100 kVA-prime set burns roughly:

- **about 16–18 litres per hour** at 75% load
- **about 21–25 litres per hour** at full prime load

With the 185–270 litre base tank of a canopy set, that is roughly 11–15 hours at 75% load. Longer autonomy needs an [external fuel tank](/en/products/generator-fuel-tanks).

## Size and weight

A canopy 100 kVA set is about 2.4–3.0 m long, 1.1–1.2 m wide and 1.65–1.7 m high, and weighs roughly 1.4–1.7 tonnes — it fits on a small concrete plinth and can be placed by a truck-mounted crane.

## Get the right 100 kVA generator

We supply 100 kVA sets on Perkins, Cummins and Baudouin engines, open or in a silent canopy, with Deep Sea controllers, 4U · Leroy-Somer | Stamford alternators and a 12-month / 1,000-hour warranty. See all [100 kVA generators](/en/generators/100-kva) and send us your load list on WhatsApp for a quotation.`,
    body_ar: `مولد 100 ك.ف.أ من أكثر الأحجام انتشاراً في الإمارات: كبير بما يكفي لمحل أو مبنى مكاتب صغير أو عيادة أو فيلا كبيرة، وصغير بما يكفي ليوضع في موقف سيارات. لكن رقم "100 ك.ف.أ" في عرض السعر قد يعني أشياء مختلفة، لذلك من المهم أن تعرف ما الذي يعطيك إياه فعلاً.

## قدرة الحمل لمولد 100 ك.ف.أ بالكيلوواط

تُقنن المولدات بالكيلو فولت أمبير عند **معامل قدرة 0.8**، لذلك يعطي مولد 100 ك.ف.أ حوالي **80 كيلوواط** قدرة فعلية. وإذا كانت قائمة أحمالك بالكيلوواط، فاقسمها على 0.8 لتعرف الكيلو فولت أمبير المطلوب.

انتبه لنوع القدرة. في الداتاشيت لدينا، المولد الذي يُباع على أنه "100 ك.ف.أ" يكون عادةً **110 ك.ف.أ Standby و100 ك.ف.أ Prime**، مثل [4U-P110](/ar/models/4u-p110) بمحرك بيركنز 1104C-44TAG2، و[4U-C110A](/ar/models/4u-c110a) بمحرك كمنز 6BTA5.9-G5، و4U-B110 بمحرك بودوان 4M10G6D0/S. إذا كان المولد سيعمل يومياً، فالقدرة الأساسية 100 ك.ف.أ هي التي يجب أن تغطي الحمل. اقرأ [الفرق بين Prime وStandby](/ar/news/prime-vs-standby-generator-rating).

## كم أمبير يعطي مولد 100 ك.ف.أ؟

على نظام ثلاثي الفاز 400 فولت:

**التيار (أمبير) = ك.ف.أ × 1000 ÷ (1.732 × 400) ≈ ك.ف.أ × 1.44**

| القدرة | تيار الحمل الكامل على 400 فولت |
| --- | --- |
| 100 ك.ف.أ | حوالي 144 أمبير لكل فاز |
| 110 ك.ف.أ (Standby) | حوالي 159 أمبير لكل فاز |

لهذا يُغذّي مولد 100 ك.ف.أ عادةً قاطعاً 160 أمبير، ويُركّب مع [لوحة ATS من فئة 63–400 أمبير](/ar/products/ats-panel-63a-400a). ويغطي [جدول تيار الحمل الكامل للمولدات](/ar/generators/sizes) كل الأحجام.

## ماذا يمكن لمولد 100 ك.ف.أ أن يشغّل؟

الأمر يعتمد على طريقة إقلاع الأحمال، وليس على قدرتها أثناء التشغيل فقط:

- **الإنارة وأجهزة الكمبيوتر والمقابس** أحمال سهلة، مجموعها قريب من قدرتها الاسمية.
- **التكييف** هو الحمل الأكبر في الخليج. الكمبروسر يسحب عدة أضعاف تياره لحظة الإقلاع، فالمولد الذي يشغّل 15 وحدة سبليت أثناء عملها قد ينخفض جهده عندما تُقلع عشر منها معاً بعد انقطاع الكهرباء. وزّع أوقات إعادة التشغيل أو اختر حجماً أكبر.
- **المحركات والمضخات** التي تُقلع مباشرةً تحتاج مولداً بعدة أضعاف قدرتها، ووجود سوفت ستارتر أو VFD يقلل ذلك كثيراً.

الطريقة العملية: اكتب كل حمل بقدرته وطريقة إقلاعه، واجمع قدرات التشغيل مع معامل تزامن واقعي، ثم راجع إقلاع أكبر محرك. تقوم [حاسبة القدرة](/ar/calculator) بذلك عنك، ويعرض [دليل مولد الفيلا](/ar/news/generator-size-for-villa-uae) مثالاً محسوباً.

## تحتاج 100 كيلوواط؟ إذن تحتاج 125 ك.ف.أ

حمل **100 كيلوواط** يحتاج 100 ÷ 0.8 = **125 ك.ف.أ**. إذا كتب الاستشاري "مولد ديزل 100 كيلوواط"، فانظر إلى [مولدات 125 ك.ف.أ](/ar/generators/125-kva) وليس 100 ك.ف.أ.

## استهلاك الوقود ومدة التشغيل

حسب الداتاشيت لدينا، يستهلك مولد بقدرة أساسية 100 ك.ف.أ تقريباً:

- **حوالي 16–18 لتراً في الساعة** عند حمل 75%
- **حوالي 21–25 لتراً في الساعة** عند الحمل الأساسي الكامل

ومع الخزان القاعدي لمولد الكانوبي بسعة 185–270 لتراً، يعني ذلك حوالي 11–15 ساعة تشغيل عند حمل 75%. ولمدة تشغيل أطول تحتاج [خزان وقود خارجي](/ar/products/generator-fuel-tanks).

## الأبعاد والوزن

مولد 100 ك.ف.أ بالكانوبي طوله حوالي 2.4–3.0 م، وعرضه 1.1–1.2 م، وارتفاعه 1.65–1.7 م، ووزنه تقريباً 1.4–1.7 طن، فيكفيه قاعدة خرسانية صغيرة ويمكن وضعه برافعة محمولة على شاحنة.

## اختر مولد 100 ك.ف.أ المناسب

نورّد مولدات 100 ك.ف.أ بمحركات بيركنز وكمنز وبودوان، مفتوحة أو بكانوبي صامت، مع وحدات تحكم Deep Sea ومولدات تيار 4U · Leroy-Somer | Stamford وضمان 12 شهراً أو 1,000 ساعة. اطلع على كل [مولدات 100 ك.ف.أ](/ar/generators/100-kva) وأرسل لنا قائمة الأحمال على الواتساب لنرسل لك عرض السعر.`,
  },
  {
    slug: "250-kva-generator-guide",
    title_en: "250 kVA Generator: Specifications, Fuel Use, Size and Price Factors",
    title_ar: "مولد 250 ك.ف.أ: المواصفات واستهلاك الوقود والأبعاد وعوامل السعر",
    meta_title_en: "250 kVA Generator: Specs, Fuel Use & Price | 4U Power",
    meta_title_ar: "مولد 250 كيلو فولت أمبير: المواصفات والسعر | فور يو",
    excerpt_en:
      "Buying a 250 kVA generator? Its kW and amps, the engines that power it, fuel use per hour, footprint and weight — and what decides the price in the UAE.",
    excerpt_ar:
      "تشتري مولد 250 ك.ف.أ؟ قدرته بالكيلوواط والأمبير، المحركات المستخدمة، استهلاك الوقود بالساعة، الأبعاد والوزن، وما الذي يحدد سعره في الإمارات.",
    cover_image: "/images/products/cummins-diesel-generator-250-1000kva-4u.webp",
    published_at: "2026-11-03T06:00:00Z",
    is_published: true,
    body_en: `The 250 kVA generator sits in the middle of the market: the standard choice for mid-rise buildings, schools, supermarkets, small factories and construction sites with a hoist. Here is what to check before you compare offers.

## 250 kVA generator: kW and amps

- **Real power:** 250 kVA × 0.8 power factor = **200 kW**
- **Current at 400 V, 3-phase:** about **361 A** per phase
- **A 250 kW load** needs 250 ÷ 0.8 ≈ 313 kVA, which means a [300 kVA generator](/en/generators/300-kva), not a 250

## Standby or prime: two kinds of "250 kVA"

On our datasheets the 250 kVA class comes in two flavours:

| Model | Engine | Standby / prime (kVA) |
| --- | --- | --- |
| [4U-P250](/en/models/4u-p250) | Perkins 1206A-E70TAG2 | 250 / 225 |
| 4U-B250 | Baudouin 6M16G2D0/S | 250 / 200 |
| 4U-B250B | Baudouin 6M16G4D0/S | 250 / 230 |
| [4U-P275](/en/models/4u-p275) | Perkins 1206A-E70TTAG3 | 275 / 250 |
| 4U-C275 | Cummins 6LTAA8.9-G2 | 270 / 250 |
| 4U-C283 | Cummins QSL9-G3 | 284 / 250 |

All are six-cylinder in-line engines at 1500 rpm, 50 Hz. For backup a few hours a year, a **250 kVA standby** set is enough. For a site or building that runs on the generator every day, choose **250 kVA prime** — the 270–284 kVA standby sets. See [prime vs standby](/en/news/prime-vs-standby-generator-rating).

## Fuel consumption of a 250 kVA generator

From the same datasheets:

- **about 32–49 litres per hour** at 75% load
- **about 43–59 litres per hour** at full prime load

The spread comes from the engine and its prime rating. Canopy base tanks run from about 380 to over 1,000 litres depending on the model — check the run time you need. Our [generator fuel consumption chart](/en/news/generator-fuel-consumption-chart) covers every size.

## Size and weight

A canopy 250 kVA set is about 3.3–4.4 m long, 1.2–1.6 m wide and 2.0–2.3 m high, and weighs roughly 2.9–3.3 tonnes. Leave clear space around it for cooling air and service, and plan the crane access before the slab is poured.

## 250 kVA generator price in the UAE: what decides it

We don't publish a single price because the offer depends on:

1. **Engine make and origin**
2. **Alternator** make and frame size
3. **Enclosure:** open or silent canopy, and the noise level required
4. **Controller:** AMF, or a synchronising controller for parallel sets
5. **Fuel tank** size and any external tank
6. **ATS** rating — a 250 kVA set usually pairs with a 400 A [ATS panel](/en/ats-panels)
7. **Delivery, installation and commissioning**

Each factor is explained in our guide to [generator prices in the UAE](/en/news/generator-price-uae-cost-factors), and the [250 kva generator price in UAE](/en/generators/250-kva) page lists the models in this size.

## Is 250 kVA the right size?

Before buying, make a load list: running kW, the biggest motor and how it starts, and some headroom for growth. If the result sits between sizes, our [standard generator sizes](/en/generators/sizes) chart and the [kVA calculator](/en/calculator) show the next step up or down.

## Get a 250 kVA quotation

Tell us the load, whether the set is for standby or daily duty, and where it will stand. We will recommend the right engine and enclosure and send a detailed quotation.`,
    body_ar: `مولد 250 ك.ف.أ في منتصف السوق: الخيار المعتاد للمباني متوسطة الارتفاع والمدارس والسوبرماركت والمصانع الصغيرة ومواقع البناء التي فيها مصعد بناء. إليك ما يجب مراجعته قبل مقارنة العروض.

## مولد 250 ك.ف.أ: الكيلوواط والأمبير

- **القدرة الفعلية:** 250 ك.ف.أ × معامل قدرة 0.8 = **200 كيلوواط**
- **التيار على 400 فولت ثلاثي الفاز:** حوالي **361 أمبير** لكل فاز
- **حمل 250 كيلوواط** يحتاج 250 ÷ 0.8 ≈ 313 ك.ف.أ، أي [مولد 300 ك.ف.أ](/ar/generators/300-kva) وليس 250

## Standby أم Prime: نوعان من "250 ك.ف.أ"

في الداتاشيت لدينا تأتي فئة 250 ك.ف.أ بشكلين:

| الموديل | المحرك | Standby / Prime (ك.ف.أ) |
| --- | --- | --- |
| [4U-P250](/ar/models/4u-p250) | بيركنز 1206A-E70TAG2 | 250 / 225 |
| 4U-B250 | بودوان 6M16G2D0/S | 250 / 200 |
| 4U-B250B | بودوان 6M16G4D0/S | 250 / 230 |
| [4U-P275](/ar/models/4u-p275) | بيركنز 1206A-E70TTAG3 | 275 / 250 |
| 4U-C275 | كمنز 6LTAA8.9-G2 | 270 / 250 |
| 4U-C283 | كمنز QSL9-G3 | 284 / 250 |

كلها محركات ست أسطوانات على خط واحد بسرعة 1500 دورة/دقيقة و50 هرتز. للطوارئ لساعات قليلة في السنة يكفي مولد **250 ك.ف.أ Standby**، أما الموقع أو المبنى الذي يعمل على المولد يومياً فاختر **250 ك.ف.أ Prime**، أي المولدات المقننة 270–284 ك.ف.أ Standby. اقرأ [الفرق بين Prime وStandby](/ar/news/prime-vs-standby-generator-rating).

## استهلاك الوقود لمولد 250 ك.ف.أ

حسب نفس الداتاشيت:

- **حوالي 32–49 لتراً في الساعة** عند حمل 75%
- **حوالي 43–59 لتراً في الساعة** عند الحمل الأساسي الكامل

الفرق يأتي من نوع المحرك وقدرته الأساسية. وسعة الخزان القاعدي في مولدات الكانوبي من حوالي 380 إلى أكثر من 1,000 لتر حسب الموديل، فراجع مدة التشغيل التي تحتاجها. يغطي [جدول استهلاك الوقود للمولدات](/ar/news/generator-fuel-consumption-chart) كل الأحجام.

## الأبعاد والوزن

مولد 250 ك.ف.أ بالكانوبي طوله حوالي 3.3–4.4 م، وعرضه 1.2–1.6 م، وارتفاعه 2.0–2.3 م، ووزنه تقريباً 2.9–3.3 أطنان. اترك مساحة حوله لهواء التبريد والصيانة، وخطط لوصول الرافعة قبل صب القاعدة.

## سعر مولد 250 ك.ف.أ في الإمارات: ما الذي يحدده؟

لا ننشر سعراً واحداً لأن العرض يعتمد على:

1. **ماركة المحرك ومنشؤه**
2. **مولد التيار (الألترنيتر)** وماركته وحجمه
3. **الهيكل:** مفتوح أو كانوبي صامت، ومستوى الضوضاء المطلوب
4. **وحدة التحكم:** AMF أو تحكم تزامن للمولدات المتوازية
5. **حجم خزان الوقود** وأي خزان خارجي
6. **قدرة لوحة ATS:** مولد 250 ك.ف.أ يُركّب عادةً مع [لوحة ATS](/ar/ats-panels) بقدرة 400 أمبير
7. **التوصيل والتركيب والتشغيل**

نشرح كل عامل في دليل [أسعار المولدات في الإمارات](/ar/news/generator-price-uae-cost-factors)، وتعرض صفحة [سعر مولد 250 ك.ف.أ في الإمارات](/ar/generators/250-kva) الموديلات المتاحة بهذا الحجم.

## هل 250 ك.ف.أ هو الحجم المناسب؟

قبل الشراء اكتب قائمة الأحمال: قدرة التشغيل، وأكبر محرك وطريقة إقلاعه، وهامشاً للتوسع. وإذا وقعت النتيجة بين حجمين، يوضح [جدول أحجام المولدات القياسية](/ar/generators/sizes) و[حاسبة القدرة](/ar/calculator) الحجم الأعلى أو الأقل.

## احصل على عرض سعر لمولد 250 ك.ف.أ

أخبرنا بالحمل، وهل المولد للطوارئ أم للتشغيل اليومي، وأين سيوضع، وسنرشح المحرك والهيكل المناسبين ونرسل عرض سعر مفصلاً.`,
  },
  {
    slug: "generator-full-load-current-kva-to-amps",
    title_en: "Generator Full Load Current: kVA to Amps Chart (400 V, 3-Phase)",
    title_ar: "تيار الحمل الكامل للمولد: جدول تحويل ك.ف.أ إلى أمبير (400 فولت)",
    meta_title_en: "Generator Full Load Current: kVA to Amps Chart | 4U",
    meta_title_ar: "تيار الحمل الكامل للمولد: ك.ف.أ إلى أمبير | فور يو",
    excerpt_en:
      "Generator full load current for every size from 10 to 2500 kVA, the kVA to amps formula, and how the current decides the breaker, ATS and cables.",
    excerpt_ar:
      "تيار الحمل الكامل للمولدات من 10 إلى 2500 ك.ف.أ، ومعادلة تحويل الكيلو فولت أمبير إلى أمبير، وكيف يحدد التيار القاطع ولوحة ATS والكابلات.",
    cover_image: "/images/products/ats-panel-630-4000a-4u.webp",
    published_at: "2026-11-05T06:00:00Z",
    is_published: true,
    body_en: `"How many amps is a 400 kVA generator?" and "750 kVA generator full load current" are some of the most common questions we get. The answer takes one formula — and it decides the breaker, the ATS panel and the cables.

## The kVA to amps formula

For a three-phase generator:

**Full load current (A) = kVA × 1000 ÷ (√3 × voltage)**

At **400 V** that simplifies to **amps ≈ kVA × 1.443**. At 415 V multiply by 1.391; at 380 V by 1.519.

For a single-phase set: amps = kVA × 1000 ÷ 230.

And to go from kW: **kVA = kW ÷ power factor** (0.8 for generator ratings).

## Generator full load current chart (400 V, 3-phase, 0.8 PF)

| Generator | kW | Full-load current |
| --- | --- | --- |
| 10 kVA | 8 kW | 14 A |
| 20 kVA | 16 kW | 29 A |
| 30 kVA | 24 kW | 43 A |
| 40 kVA | 32 kW | 58 A |
| 60 kVA | 48 kW | 87 A |
| 80 kVA | 64 kW | 115 A |
| 100 kVA | 80 kW | 144 A |
| 125 kVA | 100 kW | 180 A |
| 150 kVA | 120 kW | 217 A |
| 200 kVA | 160 kW | 289 A |
| 250 kVA | 200 kW | 361 A |
| 300 kVA | 240 kW | 433 A |
| 400 kVA | 320 kW | 577 A |
| 500 kVA | 400 kW | 722 A |
| 750 kVA | 600 kW | 1083 A |
| 1000 kVA | 800 kW | 1443 A |
| 1500 kVA | 1200 kW | 2165 A |
| 2000 kVA | 1600 kW | 2887 A |
| 2500 kVA | 2000 kW | 3608 A |

So a [400 kVA DG full load current](/en/generators/400-kva) is about 577 A, and a [750 kVA generator full load current](/en/generators/750-kva) is about 1083 A. Each size page in our [generator kVA list](/en/generators/sizes) shows the models that deliver it.

## Standby or prime current?

The chart uses the rating you put in. A set rated 550 kVA standby and 500 kVA prime gives about 794 A at its standby rating and 722 A at prime. Size the breaker and cables on the **highest current the set can deliver** — normally the standby rating.

## What the current decides

- **Main breaker:** chosen at or just above the full-load current, with the right breaking capacity for the site.
- **ATS panel:** rated for the same current — for example a [63–400 A ATS](/en/products/ats-panel-63a-400a) up to about 250 kVA, and a [630–4000 A ATS](/en/products/ats-panel-630a-4000a) for larger sets.
- **Cables:** sized for the current, the cable run length (voltage drop) and the installation method, by the electrical designer.
- **Paralleling:** two synchronised sets add their currents, so the common busbar and outgoing breaker carry the total.

Breaking capacity, cable sizes and protection settings depend on the site and on the consultant's and authority's requirements — the chart is for first sizing, not for final design.

## From current back to kVA

If you know the current your building draws — from the main breaker or a clamp-meter reading at peak — reverse the formula: **kVA = amps × 400 × 1.732 ÷ 1000**. A building peaking at 300 A on 400 V needs about 208 kVA running; add headroom and motor starting, and a 250 kVA set is the usual answer. Our [kVA calculator](/en/calculator) does the rest.

## Need help matching current to a generator?

Send us the main breaker rating or a load schedule on WhatsApp. We will match it to the right generator, ATS and switchgear and send a quotation.`,
    body_ar: `"كم أمبير يعطي مولد 400 ك.ف.أ؟" و"ما تيار الحمل الكامل لمولد 750 ك.ف.أ؟" من أكثر الأسئلة التي تصلنا. الإجابة تحتاج معادلة واحدة، وهي التي تحدد القاطع ولوحة ATS والكابلات.

## معادلة تحويل ك.ف.أ إلى أمبير

لمولد ثلاثي الفاز:

**تيار الحمل الكامل (أمبير) = ك.ف.أ × 1000 ÷ (√3 × الجهد)**

على **400 فولت** تصبح ببساطة **الأمبير ≈ ك.ف.أ × 1.443**. وعلى 415 فولت اضرب في 1.391، وعلى 380 فولت في 1.519.

لمولد أحادي الفاز: الأمبير = ك.ف.أ × 1000 ÷ 230.

وللتحويل من الكيلوواط: **ك.ف.أ = كيلوواط ÷ معامل القدرة** (0.8 في تقنين المولدات).

## جدول تيار الحمل الكامل للمولدات (400 فولت، ثلاثي الفاز، معامل قدرة 0.8)

| المولد | كيلوواط | تيار الحمل الكامل |
| --- | --- | --- |
| 10 ك.ف.أ | 8 كيلوواط | 14 أمبير |
| 20 ك.ف.أ | 16 كيلوواط | 29 أمبير |
| 30 ك.ف.أ | 24 كيلوواط | 43 أمبير |
| 40 ك.ف.أ | 32 كيلوواط | 58 أمبير |
| 60 ك.ف.أ | 48 كيلوواط | 87 أمبير |
| 80 ك.ف.أ | 64 كيلوواط | 115 أمبير |
| 100 ك.ف.أ | 80 كيلوواط | 144 أمبير |
| 125 ك.ف.أ | 100 كيلوواط | 180 أمبير |
| 150 ك.ف.أ | 120 كيلوواط | 217 أمبير |
| 200 ك.ف.أ | 160 كيلوواط | 289 أمبير |
| 250 ك.ف.أ | 200 كيلوواط | 361 أمبير |
| 300 ك.ف.أ | 240 كيلوواط | 433 أمبير |
| 400 ك.ف.أ | 320 كيلوواط | 577 أمبير |
| 500 ك.ف.أ | 400 كيلوواط | 722 أمبير |
| 750 ك.ف.أ | 600 كيلوواط | 1083 أمبير |
| 1000 ك.ف.أ | 800 كيلوواط | 1443 أمبير |
| 1500 ك.ف.أ | 1200 كيلوواط | 2165 أمبير |
| 2000 ك.ف.أ | 1600 كيلوواط | 2887 أمبير |
| 2500 ك.ف.أ | 2000 كيلوواط | 3608 أمبير |

إذن [تيار الحمل الكامل لمولد 400 ك.ف.أ](/ar/generators/400-kva) حوالي 577 أمبير، و[تيار الحمل الكامل لمولد 750 ك.ف.أ](/ar/generators/750-kva) حوالي 1083 أمبير. وكل صفحة حجم في [قائمة أحجام المولدات](/ar/generators/sizes) تعرض الموديلات التي تعطي هذه القدرة.

## تيار Standby أم Prime؟

الجدول يعتمد على القدرة التي تدخلها. مولد مقنن 550 ك.ف.أ Standby و500 ك.ف.أ Prime يعطي حوالي 794 أمبير على قدرة الاستعداد و722 أمبير على القدرة الأساسية. اختر القاطع والكابلات على **أعلى تيار يمكن أن يعطيه المولد**، وهو عادةً تيار قدرة الاستعداد.

## ماذا يحدد التيار؟

- **القاطع الرئيسي:** يُختار عند تيار الحمل الكامل أو أعلى منه بقليل، مع سعة قطع مناسبة للموقع.
- **لوحة ATS:** بنفس قدرة التيار، مثلاً [لوحة ATS من 63 إلى 400 أمبير](/ar/products/ats-panel-63a-400a) حتى حوالي 250 ك.ف.أ، و[لوحة ATS من 630 إلى 4000 أمبير](/ar/products/ats-panel-630a-4000a) للمولدات الأكبر.
- **الكابلات:** يحدد المصمم الكهربائي مقاطعها حسب التيار وطول المسار (هبوط الجهد) وطريقة التمديد.
- **التشغيل على التوازي:** المولدان المتزامنان تُجمع تياراتهما، فيحمل قضيب التوزيع المشترك والقاطع الخارج التيار الكلي.

سعة القطع ومقاطع الكابلات وإعدادات الحماية تعتمد على الموقع وعلى متطلبات الاستشاري والجهة المختصة، والجدول للتقدير الأولي وليس للتصميم النهائي.

## من التيار إلى ك.ف.أ

إذا كنت تعرف التيار الذي يسحبه المبنى، من قدرة القاطع الرئيسي أو قراءة كلامب ميتر وقت الذروة، اعكس المعادلة: **ك.ف.أ = الأمبير × 400 × 1.732 ÷ 1000**. مبنى يصل في الذروة إلى 300 أمبير على 400 فولت يحتاج حوالي 208 ك.ف.أ أثناء التشغيل، ومع هامش وإقلاع المحركات يكون مولد 250 ك.ف.أ هو الإجابة المعتادة. و[حاسبة القدرة](/ar/calculator) تكمل الباقي.

## تحتاج مساعدة في مطابقة التيار مع المولد؟

أرسل لنا قدرة القاطع الرئيسي أو جدول الأحمال على الواتساب، وسنختار لك المولد ولوحة ATS والتوزيع المناسبة ونرسل عرض السعر.`,
  },
];
