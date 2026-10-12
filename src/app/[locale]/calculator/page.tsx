import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { FaqBlock } from "@/components/faq-block";
import { PageHero } from "@/components/page-hero";
import { homeFaq, generatorsFaq, atsFaq } from "@/content/faq";
import { pageSeo } from "@/content/seo";
import { getProducts } from "@/lib/data";
import { sizingModels } from "@/lib/genset-models";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/calculator", title: pageSeo.calculator.title[locale], description: pageSeo.calculator.description[locale] });
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const products = (await getProducts()).filter((p) => p.category === "generator" || p.category === "ats_panel");
  const ar = locale === "ar";

  const steps = ar
    ? [
        ["الحمل", "إجمالي الحمل أو جدول أحمال تفصيلي: المحركات وطريقة تشغيلها، والـ UPS والإنفرتر."],
        ["الموقع ونوع التشغيل", "احتياطي أو أساسي حسب ISO 8528-1، مع خفض القدرة للحرارة والارتفاع."],
        ["بدء التشغيل والجودة", "أقصى هبوط مسموح في الجهد عند بدء أكبر محرك، وتشغيل الأحمال بالتتابع أو مرة واحدة."],
        ["التوصية", "أقل قدرة مطلوبة والعامل المحدد لها، ثم كل موديلات 4U التي تحقق الشروط مع نسبة التحميل والوقود ومدة الخزان."],
      ]
    : [
        ["Load", "Total load or a full schedule — motors and how they start, UPS and drives."],
        ["Site & duty", "Standby or prime per ISO 8528-1, derated for site temperature and altitude."],
        ["Starting & quality", "Maximum voltage dip when the largest motor starts, and whether loads switch on in sequence."],
        ["Recommendation", "Minimum rating and what sets it, then every 4U model that passes — with load %, fuel use and tank autonomy."],
      ];
  const method = ar
    ? [
        "قدرات ISO 8528-1: الاحتياطي (ESP) والأساسي (PRP) بمتوسط حمل 24 ساعة 70–80% حسب داتا شيت كل ماركة.",
        "قدرة بدء المحرك من جدول NEC 430.7(B) — الحرف G (حتى 6.29 ك.ف.أ لكل حصان) بمعامل قدرة 0.35 أثناء البدء.",
        "طرق البدء المخفض: ستار-دلتا ≈ 33%، محول ذاتي 65% ≈ 42%، سوفت ستارتر 300% ≈ 50%، الإنفرتر بدون تيار بدء.",
        "هبوط الجهد = X·SkVA ÷ (kVA + X·SkVA) بمفاعلة نموذجية للدينامو X ≈ 0.12. الحدود: 15% لمضخات الحريق، 20–30% للمحركات العامة.",
        "الأحمال غير الخطية: الدينامو × 1.15 (12 نبضة)، × 1.2 (IGBT)، × 2 (6 نبضات بدون فلتر).",
        "خفض القدرة: كاملة حتى 40°م و1000 م، ثم ≈ 1% لكل °م و≈ 4% لكل 300 م (قيم نموذجية من داتا شيت المصنعين).",
        "الحد الأدنى للتحميل 30% لتجنب الترسبات (NFPA 110). استهلاك الوقود من داتا شيت موديلات 4U.",
      ]
    : [
        "ISO 8528-1 ratings: standby (ESP) and prime (PRP), with the 24 h average load limit of each brand's datasheet (70–80 %).",
        "Motor locked-rotor kVA from NEC Table 430.7(B), code G (up to 6.29 kVA/hp), at 0.35 power factor while starting.",
        "Reduced-voltage starting: star-delta ≈ 33 %, autotransformer 65 % tap ≈ 42 %, soft starter at 300 % ≈ 50 %; VFDs draw no inrush.",
        "Voltage dip = X·SkVA ÷ (kVA + X·SkVA), typical alternator reactance X ≈ 0.12. Limits: 15 % for fire pumps, 20–30 % for general motor loads.",
        "Non-linear loads: alternator × 1.15 (12-pulse), × 1.2 (IGBT), × 2 (unfiltered 6-pulse).",
        "Derating: full output to 40 °C and 1000 m, then ≈ 1 %/°C and ≈ 4 %/300 m (typical manufacturer datasheet values).",
        "Minimum 30 % load to avoid wet stacking (NFPA 110). Fuel use from the 4U model datasheets.",
      ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.calculator"), path: "/calculator" },
        ]}
        eyebrow={ar ? "أداة مجانية" : "Free sizing tool"}
        title={ar ? "حاسبة حجم المولد بالكيلو فولت أمبير" : "Generator kVA Calculator"}
        intro={
          ar
            ? "اعرف قدرة المولد المناسبة لموقعك خلال دقيقة، مع هامش الأمان الصحيح ولوحة ATS المطابقة، ثم أرسل النتيجة لمهندسنا على الواتساب."
            : "Find the right generator size for your site in under a minute — with the correct safety margin and matching ATS panel — then send the result to our engineer on WhatsApp."
        }
      />
      <section className="section bg-surface">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <Calculator products={products} models={sizingModels()} />
          </div>
          <aside className="lg:col-span-4">
            <h2 className="text-xl">{ar ? "كيف تعمل الحاسبة" : "How the calculator works"}</h2>
            <ol className="mt-6 space-y-5">
              {steps.map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-950 font-extrabold text-brand-400">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl border border-line bg-navy-900 p-5 text-sm leading-6 text-muted">
              <p className="font-bold text-ink">{ar ? "المعادلات المستخدمة" : "Formulas used"}</p>
              <p className="mt-2" dir="ltr">kVA = √(kW² + kVAr²)</p>
              <p dir="ltr">SkVA = hp × 6.29 × starter factor</p>
              <p dir="ltr">Dip ≈ X·SkVA ÷ (kVA + X·SkVA)</p>
              <p dir="ltr">I @ 400 V = kVA × 1.443</p>
            </div>
            <details className="mt-4 rounded-2xl border border-line bg-navy-900 p-5 text-sm leading-6 text-muted">
              <summary className="cursor-pointer font-bold text-ink">{ar ? "المنهجية والمعايير" : "Method & standards"}</summary>
              <ul className="mt-3 list-disc space-y-2 ps-5">
                {method.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </details>
          </aside>
        </div>
      </section>
      <FaqBlock locale={locale} items={[homeFaq[0]!, homeFaq[5]!, generatorsFaq[1]!, atsFaq[0]!]} title={ar ? "أسئلة حول اختيار الحجم" : "Sizing questions"} eyebrow={locale === "ar" ? "أسئلة وأجوبة" : "FAQ"} className="bg-navy-900" />
    </>
  );
}
