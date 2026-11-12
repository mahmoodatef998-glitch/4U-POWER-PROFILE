import { Calculator, MessageSquareText } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import type { Faq } from "@/content/faq";
import { GENERATOR_SIZES, sizeData, sizeSlug, typicalUse } from "@/content/generator-sizes";
import { home } from "@/content/pages";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { buildMetadata, localeUrl } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

const COPY = {
  title: { en: "Standard generator sizes in kVA: size chart with kW, amps & fuel", ar: "أحجام المولدات الكهربائية القياسية: جدول الكيلو فولت أمبير والكيلوواط والوقود" },
  intro: {
    en: "Every standard diesel generator size from 10 to 2500 kVA in one chart: running kW, typical use, full-load current at 400 V, matching ATS panel and diesel use per hour — click a size for specs and a quote within 24 hours.",
    ar: "كل أحجام مولدات الديزل القياسية من 10 إلى 2500 ك.ف.أ في جدول واحد: القدرة بالكيلوواط والاستخدام المعتاد وتيار الحمل الكامل عند 400 فولت ولوحة ATS المناسبة واستهلاك الديزل في الساعة. اختر الحجم لترى المواصفات وتحصل على عرض سعر خلال 24 ساعة.",
  },
  faqTitle: { en: "What are the standard generator sizes?", ar: "ما هي أحجام المولدات القياسية؟" },
  seoTitle: { en: "Generator Sizes in kVA: Standard kVA List & Size Chart | UAE", ar: "أحجام المولدات الكهربائية بالكيلو فولت أمبير: جدول المقاسات" },
  seoDesc: {
    en: "Standard diesel generator sizes 10–2500 kVA: full kVA list and size chart with kW, amps, ATS and fuel L/h. UAE generator supplier, quote in 24 hours.",
    ar: "جدول أحجام مولدات الديزل القياسية من 10 إلى 2500 ك.ف.أ مع الكيلوواط والأمبير ولوحة ATS واستهلاك الديزل بالساعة. مورد في الإمارات وعرض سعر خلال 24 ساعة.",
  },
};

function sizesFaq(): Faq[] {
  const list = GENERATOR_SIZES.join(", ");
  const listAr = GENERATOR_SIZES.join("، ");
  const d100 = sizeData(100);
  return [
    {
      q: { en: "What are the standard generator sizes in kVA?", ar: "ما هي أحجام المولدات القياسية بالكيلو فولت أمبير؟" },
      a: {
        en: `The common standby sizes are ${list} kVA. Every size in the chart above links to its own page with specifications, engine options and fuel use.`,
        ar: `الأحجام الاحتياطية الشائعة هي ${listAr} ك.ف.أ، ولكل حجم في الجدول صفحة خاصة بالمواصفات وخيارات المحركات واستهلاك الوقود.`,
      },
    },
    {
      q: { en: "How do I convert generator kVA to kW?", ar: "كيف أحوّل قدرة المولد من ك.ف.أ إلى كيلوواط؟" },
      a: {
        en: "Multiply by the power factor, normally 0.8 for diesel generators: kW = kVA × 0.8. A 100 kVA generator gives about 80 kW, a 500 kVA set about 400 kW.",
        ar: "اضرب في معامل القدرة، وهو عادةً 0.8 لمولدات الديزل: الكيلوواط = ك.ف.أ × 0.8. مولد 100 ك.ف.أ يعطي نحو 80 كيلوواط، ومولد 500 ك.ف.أ نحو 400 كيلوواط.",
      },
    },
    {
      q: { en: "What size generator do I need?", ar: "ما حجم المولد الذي أحتاجه؟" },
      a: {
        en: "Add up the loads that run at the same time in kW, divide by 0.8 to get kVA, add 20–25 % for motor starting and Gulf heat, then pick the next standard size. Our free kVA calculator does this for you and also checks the largest motor start.",
        ar: "اجمع الأحمال التي تعمل في نفس الوقت بالكيلوواط، واقسم على 0.8 لتحصل على ك.ف.أ، وأضف 20 إلى 25% لبدء المحركات وحرارة الخليج، ثم اختر الحجم القياسي التالي. حاسبة القدرة المجانية لدينا تقوم بذلك وتراجع بدء أكبر محرك أيضاً.",
      },
    },
    {
      q: { en: "How much diesel does a generator use per hour?", ar: "كم لتر ديزل يستهلك المولد في الساعة؟" },
      a: {
        en: `Roughly 0.26 litres per kWh at 75 % load. A 100 kVA generator uses about ${Math.round(d100.fuel50)} L/h at half load, ${Math.round(d100.fuel75)} L/h at 75 % and ${Math.round(d100.fuel100)} L/h at full load. The chart gives all three figures for every size; the datasheet of each model has its measured curve.`,
        ar: `تقريباً 0.26 لتر لكل كيلوواط ساعة عند 75% حمل. مولد 100 ك.ف.أ يستهلك نحو ${Math.round(d100.fuel50)} لتر/ساعة عند نصف الحمل و${Math.round(d100.fuel75)} لتر/ساعة عند 75% و${Math.round(d100.fuel100)} لتر/ساعة عند الحمل الكامل. الجدول يعطي الأرقام الثلاثة لكل حجم، والداتا شيت لكل موديل فيها منحنى الاستهلاك المقاس.`,
      },
    },
    {
      q: { en: "What is the full-load current of a generator?", ar: "ما تيار الحمل الكامل للمولد؟" },
      a: {
        en: "At 400 V three-phase, amps ≈ kVA × 1.44 (kVA × 1000 ÷ (√3 × 400)). A 250 kVA set carries about 361 A, so it needs a 400 A ATS panel — the chart lists the matching ATS for each size.",
        ar: "عند 400 فولت ثلاثي الأطوار، الأمبير ≈ ك.ف.أ × 1.44 (ك.ف.أ × 1000 ÷ (√3 × 400)). مولد 250 ك.ف.أ يحمل نحو 361 أمبير، لذلك يحتاج لوحة ATS بسعة 400 أمبير، والجدول يذكر لوحة ATS المناسبة لكل حجم.",
      },
    },
    {
      q: { en: "Are these standby or prime ratings?", ar: "هل هذه قدرات احتياطية أم أساسية؟" },
      a: {
        en: "The chart uses standby kVA, the rating most buyers search for. The prime rating, for sets that run every day, is about 10 % lower; our model codes follow the prime kVA, so a set sold as 4U-P100 is 100 kVA prime and about 110 kVA standby.",
        ar: "الجدول يستخدم القدرة الاحتياطية، وهي القدرة التي يبحث عنها أغلب المشترين. القدرة الأساسية للمولدات التي تعمل يومياً أقل بنحو 10%، وأكواد موديلاتنا تتبع القدرة الأساسية، فالموديل 4U-P100 قدرته 100 ك.ف.أ أساسية ونحو 110 ك.ف.أ احتياطية.",
      },
    },
    {
      q: { en: "How quickly can I get a generator quotation in the UAE?", ar: "متى أحصل على عرض سعر مولد في الإمارات؟" },
      a: {
        en: "Send the size or your load list and the delivery city on WhatsApp or through the contact form: we reply with a written quotation within 24 hours, usually with two or three engine options, delivered from our warehouse in SAIF Zone, Sharjah.",
        ar: "أرسل الحجم أو قائمة الأحمال ومدينة التسليم على الواتساب أو من نموذج التواصل، ونرد بعرض سعر مكتوب خلال 24 ساعة، غالباً بخيارين أو ثلاثة من المحركات، مع التوصيل من مستودعنا في المنطقة الحرة لمطار الشارقة.",
      },
    },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/generators/sizes", title: COPY.seoTitle[locale], description: COPY.seoDesc[locale] });
}

export default async function SizesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const lh = ar ? "لتر/س" : "L/h";
  // one decimal for small sets, so 10–20 kVA rows don't all round to the same litre
  const L1 = (v: number) => (v < 10 ? v.toFixed(1) : String(Math.round(v)));
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: L(COPY.title),
    itemListElement: GENERATOR_SIZES.map((k, i) => ({ "@type": "ListItem", position: i + 1, name: `${k} kVA`, url: localeUrl(locale, `/generators/${sizeSlug(k)}`) })),
  };
  const heads = ar
    ? ["الحجم", "الكيلوواط", "الاستخدام المعتاد", "التيار عند 400 فولت", "لوحة ATS", "ديزل 50%", "ديزل 75%", "ديزل 100%"]
    : ["Size", "kW", "Typical use", "Current @ 400 V", "ATS panel", "Diesel @ 50%", "Diesel @ 75%", "Diesel @ 100%"];

  return (
    <>
      <JsonLd data={list} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.generators"), path: "/generators" },
          { name: ar ? "أحجام المولدات" : "Generator sizes", path: "/generators/sizes" },
        ]}
        eyebrow={ar ? "10 – 2500 ك.ف.أ" : "10 – 2500 kVA"}
        title={L(COPY.title)}
        intro={L(COPY.intro)}
      />
      <section className="section" aria-labelledby="chart-title">
        <div className="container-x">
          <h2 id="chart-title" className="text-2xl text-ink sm:text-3xl">{ar ? "جدول أحجام مولدات الديزل" : "Diesel generator size chart"}</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[56rem] text-start text-sm sm:text-base">
              <caption className="sr-only">{L(COPY.title)}</caption>
              <thead className="bg-surface text-muted">
                <tr>
                  {heads.map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {GENERATOR_SIZES.map((k) => {
                  const d = sizeData(k);
                  return (
                    <tr key={k} className="hover:bg-surface">
                      <th scope="row" className="px-4 py-3 text-start whitespace-nowrap">
                        <Link href={`/generators/${sizeSlug(k)}`} className="font-bold text-brand-400 hover:underline">
                          {ar ? `مولد ${k} ك.ف.أ` : `${k} kVA generator`}
                        </Link>
                      </th>
                      <td className="px-4 py-3 text-ink">{d.kw}</td>
                      <td className="px-4 py-3 text-muted">{L(typicalUse(k))}</td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{Math.round(d.amps)} A</td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{d.ats} A</td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{L1(d.fuel50)} {lh}</td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{L1(d.fuel75)} {lh}</td>
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{L1(d.fuel100)} {lh}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            {ar
              ? "قدرات احتياطية، قيم تقريبية عند معامل قدرة 0.8 وجهد 400 فولت؛ تُؤكَّد الأرقام حسب موديل المحرك في عرض السعر."
              : "Standby ratings; approximate values at 0.8 pf and 400 V, confirmed for the chosen engine model in your quotation."}
          </p>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="which-size">
        <div className="container-x">
          <div className="grid gap-6 rounded-[2rem] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 id="which-size" className="text-2xl text-ink sm:text-3xl">{ar ? "ما حجم المولد الذي أحتاجه؟" : "Which size do I need?"}</h2>
              <p className="mt-3 leading-7 text-muted">
                {ar
                  ? "أدخل أحمالك في الحاسبة لتحصل على الحجم الموصى به مع هامش الأمان، أو أرسل قائمة الأحمال لمهندس المبيعات ونرد بعرض سعر خلال 24 ساعة."
                  : "Enter your loads in the calculator for a recommended size with safety margin, or send your load list to a sales engineer and get a quotation within 24 hours."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <Link href="/calculator" className={buttonVariants({ size: "lg" })}>
                <Calculator className="size-5" aria-hidden />
                {ar ? "حاسبة حجم المولد" : "Generator size calculator"}
              </Link>
              <Link href="/contact" className="inline-flex h-13 items-center justify-center gap-2 rounded-[0.6rem] border border-line px-7 font-bold text-ink hover:border-brand-500/60">
                <MessageSquareText className="size-5" aria-hidden />
                {ar ? "اطلب عرض سعر" : "Request a quote"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="standard-sizes">
        <div className="container-x max-w-3xl">
          <h2 id="standard-sizes" className="text-2xl sm:text-3xl">{L(COPY.faqTitle)}</h2>
          <p className="mt-4 leading-8 text-muted">
            {ar
              ? `أحجام مولدات الديزل القياسية المتوفرة لدينا: ${GENERATOR_SIZES.join("، ")} ك.ف.أ. هذه هي القدرات الاحتياطية الشائعة التي يصنّعها كل مُجمّعي المولدات، ولكل حجم محرك ومولّد تيار ولوحة ATS مناسبة.`
              : `The standard diesel generator sizes we supply are ${GENERATOR_SIZES.join(", ")} kVA. These are the standby ratings built by every major genset assembler, each with a matching engine, alternator and ATS panel.`}
          </p>
          <p className="mt-4 leading-8 text-muted">
            {ar
              ? "kVA هي القدرة الظاهرية، والكيلوواط = kVA × 0.8 تقريباً. اختر الحجم بحيث يعمل المولد بين 50% و80% من قدرته مع هامش لبدء المحركات والتوسعات المستقبلية. "
              : "kVA is the apparent power; kW is about kVA × 0.8. Choose the size so the generator runs at 50–80% of its rating, with headroom for motor starting and future loads. "}
            <Link href="/calculator" className="font-semibold text-brand-700 underline">{ar ? "احسب الحجم المناسب بالحاسبة" : "Work out your size with the kVA calculator"}</Link>
            {ar ? "، أو راجع " : ", see the "}
            <Link href="/news/generator-fuel-consumption-chart" className="font-semibold text-brand-700 underline">{ar ? "جدول استهلاك الديزل للمولدات" : "generator fuel consumption chart"}</Link>
            {ar ? " أو " : " or "}
            <Link href="/models" className="font-semibold text-brand-700 underline">{ar ? "تصفّح كل الموديلات" : "browse every model"}</Link>.
          </p>
        </div>
      </section>
      <FaqBlock locale={locale} items={sizesFaq()} eyebrow={ar ? "أحجام المولدات" : "Generator sizes"} title={ar ? "أسئلة شائعة عن أحجام المولدات" : "Generator size FAQs"} dark />
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="sizes_cta" />
    </>
  );
}
