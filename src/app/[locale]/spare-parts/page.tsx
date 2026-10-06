import { Camera, Cog, Filter, Gauge, Hash, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PartsForm } from "@/components/parts-form";
import { SectionHeading } from "@/components/section-heading";
import type { Faq } from "@/content/faq";
import { Link } from "@/i18n/navigation";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/spare-parts",
    title: locale === "ar" ? "قطع غيار المولدات في الإمارات | فلاتر وAVR ووحدات تحكم" : "Generator Spare Parts in UAE | Filters, AVR & Controllers",
    description:
      locale === "ar"
        ? "قطع غيار مولدات بيركنز وكمنز وفولفو وبودوان وغيرها: فلاتر وسيور وAVR ووحدات تحكم ومارشات. أرسل رقم القطعة أو صورتها واحصل على السعر في نفس اليوم."
        : "Spare parts for Perkins, Cummins, Volvo, Baudouin and more: filters, belts, AVRs, controllers, starters. Send a part number or photo for a same-day price.",
  });
}

const CATEGORIES: { icon: typeof Filter; title: { en: string; ar: string }; items: { en: string; ar: string } }[] = [
  { icon: Filter, title: { en: "Filters & service kits", ar: "الفلاتر وأطقم الصيانة" }, items: { en: "Oil, fuel, air and water-separator filters; 250 h / 500 h service kits", ar: "فلاتر الزيت والوقود والهواء وفاصل المياه، وأطقم صيانة 250 و500 ساعة" } },
  { icon: Gauge, title: { en: "Controllers & AVRs", ar: "وحدات التحكم والـ AVR" }, items: { en: "Deep Sea and ComAp controllers, AVRs, sensors, relays and battery chargers", ar: "وحدات تحكم ديب سي وكوم آب، ومنظمات الجهد، والحساسات، والريليهات، وشواحن البطاريات" } },
  { icon: Cog, title: { en: "Engine parts", ar: "قطع المحرك" }, items: { en: "Starter motors, alternators (charging), belts, hoses, thermostats, injectors, gaskets", ar: "المارشات، ودينامو الشحن، والسيور، والخراطيم، والثرموستات، والبخاخات، والجوانات" } },
  { icon: PackageCheck, title: { en: "Cooling & electrical", ar: "التبريد والكهرباء" }, items: { en: "Radiators, fan belts, coolant, jacket-water heaters, breakers, contactors, ATS spares", ar: "المبردات، وسيور المروحة، وسائل التبريد، وسخانات المياه، والقواطع، والكونتاكتورات، وقطع لوحات ATS" } },
];

const STEPS = [
  { icon: Camera, en: ["Send the part", "Part number, a photo of the part, or the generator nameplate."], ar: ["أرسل القطعة", "رقم القطعة أو صورتها أو صورة لوحة بيانات المولد."] },
  { icon: Hash, en: ["We identify it", "A parts engineer cross-checks the model and confirms the correct part."], ar: ["نحدد القطعة", "يتحقق مهندس قطع الغيار من الموديل ويؤكد القطعة الصحيحة."] },
  { icon: MessageCircle, en: ["Price & lead time", "You get price, availability and delivery time — usually the same working day."], ar: ["السعر والتوصيل", "تحصل على السعر والتوفر ومدة التوصيل، عادةً في نفس يوم العمل."] },
  { icon: Truck, en: ["Delivered", "Collection from SAIF Zone, delivery across the UAE, or export by courier."], ar: ["التسليم", "استلام من سيف زون أو توصيل لكل الإمارات أو شحن دولي."] },
];

const FAQ: Faq[] = [
  {
    q: { en: "Which generator brands do you supply parts for?", ar: "لأي ماركات مولدات توفرون قطع الغيار؟" },
    a: {
      en: "Perkins, Cummins, Volvo Penta, Baudouin, Kubota, Lister Petter and Chinese engine series, plus common alternator and controller brands such as Stamford, Leroy-Somer, Deep Sea and ComAp. Send the nameplate and we will confirm.",
      ar: "بيركنز وكمنز وفولفو بنتا وبودوان وكوبوتا وليستر بيتر والمحركات الصينية، إضافة إلى ماركات الدينامو ووحدات التحكم الشائعة مثل ستامفورد وليروي سومر وديب سي وكوم آب. أرسل لوحة البيانات وسنؤكد لك.",
    },
  },
  {
    q: { en: "I don't know the part number. Can you still help?", ar: "لا أعرف رقم القطعة، هل يمكنكم المساعدة؟" },
    a: {
      en: "Yes. A clear photo of the part plus the generator or engine nameplate (model and serial number) is usually enough for us to identify it.",
      ar: "نعم. صورة واضحة للقطعة مع لوحة بيانات المولد أو المحرك (الموديل والرقم التسلسلي) تكفي عادةً لتحديدها.",
    },
  },
  {
    q: { en: "Do you supply genuine parts?", ar: "هل توفرون قطعاً أصلية؟" },
    a: {
      en: "We quote genuine parts and, where you prefer, quality-equivalent alternatives — always clearly labelled in the quotation so you can choose.",
      ar: "نقدم أسعار القطع الأصلية، وبدائل مكافئة الجودة عند رغبتك، مع توضيح ذلك دائماً في عرض السعر لتختار بنفسك.",
    },
  },
  {
    q: { en: "How fast can you deliver?", ar: "ما مدة التوصيل؟" },
    a: {
      en: "Common service parts are often available for collection or UAE delivery within days; other items are ordered in and the lead time is confirmed with your quotation.",
      ar: "قطع الصيانة الشائعة غالباً متوفرة للاستلام أو التوصيل داخل الإمارات خلال أيام، وباقي القطع تُطلب ونؤكد مدتها مع عرض السعر.",
    },
  },
];

export default async function SparePartsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const wa = ar
    ? "مرحباً، أحتاج قطعة غيار لمولد. سأرسل صورة القطعة ولوحة البيانات."
    : "Hi, I need a generator spare part. I'll send a photo of the part and the nameplate.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: ar ? "توريد قطع غيار المولدات" : "Generator spare parts supply",
    serviceType: ar ? "قطع غيار المولدات واللوحات" : "Generator and switchgear spare parts",
    provider: { "@id": ORG_ID },
    areaServed: ["AE", "SA", "IQ", "OM", "QA", "KW", "BH"].map((c) => ({ "@type": "Country", name: c })),
    url: localeUrl(locale, "/spare-parts"),
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: ar ? "قطع الغيار" : "Spare parts", path: "/spare-parts" },
        ]}
        eyebrow={ar ? "قطع غيار المولدات" : "Generator spare parts"}
        title={ar ? "صوّر القطعة، ونرسل لك السعر" : "Snap the part. We'll send the price."}
        intro={
          ar
            ? "فلاتر وأطقم صيانة ووحدات تحكم وAVR ومارشات ومبردات لمولدات بيركنز وكمنز وفولفو وبودوان وغيرها. أرسل رقم القطعة أو صورتها، ويرد مهندس بالسعر ومدة التوصيل."
            : "Filters, service kits, controllers, AVRs, starters and radiators for Perkins, Cummins, Volvo, Baudouin and more. Send a part number or a photo — an engineer replies with price and delivery."
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="parts_hero" message={wa} size="lg" label={ar ? "أرسل الصورة على واتساب" : "Send a photo on WhatsApp"} />
          <CallButton location="parts_hero" size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeading id="how-title" eyebrow={ar ? "كيف تعمل" : "How it works"} title={ar ? "من الصورة إلى عرض السعر" : "From photo to quotation"} />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const [title, body] = ar ? s.ar : s.en;
              return (
                <li key={title} className="spotlight rounded-[1.75rem] border border-line bg-navy-900/70 p-6">
                  <span className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-500/15 text-brand-500">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-display text-3xl font-extrabold text-brand-500/70">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <h3 className="mt-4 text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="form-title">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="form-title" eyebrow={ar ? "اطلب قطعة" : "Request a part"} title={ar ? "أرسل طلب قطع الغيار" : "Send a parts request"} />
            <p className="mt-4 leading-8 text-muted">
              {ar
                ? "املأ ما تعرفه فقط. رقم القطعة أو صورة واحدة واضحة تكفي للبدء، ونتواصل معك على الواتساب لتأكيد التفاصيل."
                : "Fill in only what you know. One part number or one clear photo is enough to start — we'll confirm the details with you on WhatsApp."}
            </p>
            <ul className="mt-8 grid gap-4">
              {CATEGORIES.map((c) => (
                <li key={c.title.en} className="flex gap-3 rounded-2xl border border-line bg-navy-900/60 p-4">
                  <c.icon className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden />
                  <span>
                    <span className="block font-bold text-ink">{L(c.title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{L(c.items)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-line bg-navy-900/70 p-6 sm:p-8 lg:col-span-7">
            <PartsForm />
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-label={ar ? "خدمات مرتبطة" : "Related"}>
        <div className="container-x flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <Link href="/services" className="text-brand-700 hover:underline">{ar ? "عقود الصيانة والإصلاح" : "Maintenance & repair contracts"}</Link>
          <Link href="/products/load-banks" className="text-brand-700 hover:underline">{ar ? "اختبار الحمل" : "Load-bank testing"}</Link>
          <Link href="/ats-panels" className="text-brand-700 hover:underline">{ar ? "لوحات ATS" : "ATS panels"}</Link>
          <Link href="/generators" className="text-brand-700 hover:underline">{ar ? "مولدات جديدة" : "New generators"}</Link>
        </div>
      </section>

      <FaqBlock locale={locale} items={FAQ} title={ar ? "أسئلة عن قطع الغيار" : "Spare parts FAQ"} eyebrow={ar ? "قطع الغيار" : "Spare parts"} />
    </>
  );
}
