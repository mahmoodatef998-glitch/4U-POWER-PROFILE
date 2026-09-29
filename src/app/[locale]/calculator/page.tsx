import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calculator } from "@/components/calculator/calculator";
import { FaqBlock } from "@/components/faq-block";
import { PageHero } from "@/components/page-hero";
import { homeFaq, generatorsFaq, atsFaq } from "@/content/faq";
import { pageSeo } from "@/content/seo";
import { getProducts } from "@/lib/data";
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
        ["أدخل الحمل", "بالكيلوواط أو الأمبير، أو اختر نوع الموقع وعدّل أعداد الأجهزة."],
        ["معامل القدرة", "0.8 هو المعيار للأحمال المختلطة، ويمكنك تعديله إن كانت لديك قياسات."],
        ["هامش الأمان", "من 20 إلى 25% لبدء المحركات وحرارة الخليج والتوسع المستقبلي."],
        ["التوصية", "أقرب قدرة قياسية أعلى، مع لوحة ATS المناسبة والمولدات المطابقة من الكتالوج."],
      ]
    : [
        ["Enter your load", "In kW or amps — or pick a site type and adjust equipment quantities."],
        ["Power factor", "0.8 is standard for mixed loads; adjust it if you have measured data."],
        ["Safety margin", "20–25% for motor starting, Gulf heat derating and future growth."],
        ["Recommendation", "Next standard rating up, the matching ATS panel and catalog units that fit."],
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
          <div className="lg:col-span-8">
            <Calculator products={products} />
          </div>
          <aside className="lg:col-span-4">
            <h2 className="text-xl">{ar ? "كيف تعمل الحاسبة" : "How the calculator works"}</h2>
            <ol className="mt-6 space-y-5">
              {steps.map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-900 font-extrabold text-amber-400">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-ink">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-2xl border border-line bg-white p-5 text-sm leading-6 text-muted">
              <p className="font-bold text-ink">{ar ? "المعادلات المستخدمة" : "Formulas used"}</p>
              <p className="mt-2" dir="ltr">kVA = kW ÷ PF</p>
              <p dir="ltr">kVA = √3 × V × I ÷ 1000 (3-phase)</p>
              <p dir="ltr">I @ 400 V ≈ kVA × 1.443</p>
            </div>
          </aside>
        </div>
      </section>
      <FaqBlock locale={locale} items={[homeFaq[0]!, homeFaq[5]!, generatorsFaq[1]!, atsFaq[0]!]} title={ar ? "أسئلة حول اختيار الحجم" : "Sizing questions"} eyebrow="FAQ" className="bg-white" />
    </>
  );
}
