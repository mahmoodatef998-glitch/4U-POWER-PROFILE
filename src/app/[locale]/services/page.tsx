import { CalendarCheck, CheckCircle2, Cog, FlaskConical, Gauge, PlugZap, ShieldCheck, Siren, Sun, Wrench } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { services, servicesFaq, warranty, type Service } from "@/content/services";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

const ICONS: Record<Service["icon"], typeof Wrench> = { wrench: Wrench, calendar: CalendarCheck, siren: Siren, gauge: Gauge, flask: FlaskConical, sun: Sun, cog: Cog, plug: PlugZap };

const COPY = {
  h1: { en: "Maintenance, service & a 1-year warranty on everything we supply", ar: "صيانة وخدمة وضمان سنة على كل ما نورّده" },
  intro: {
    en: "Installation, preventive maintenance, repairs, testing and spare parts for generators, ATS, switchgear and solar systems — backed by a 12-month warranty on every product.",
    ar: "تركيب وصيانة وقائية وإصلاح واختبار وقطع غيار للمولدات ولوحات ATS والجهد المنخفض والأنظمة الشمسية، مع ضمان 12 شهراً على كل منتج.",
  },
  seoTitle: { en: "Generator Maintenance, AMC & 1-Year Warranty | 4U Power UAE", ar: "صيانة المولدات وعقود الصيانة وضمان سنة | فور يو باور" },
  seoDesc: {
    en: "Generator maintenance contracts, repairs, load-bank testing, commissioning and solar O&M in the UAE, KSA and Iraq. 12-month warranty on every product we supply.",
    ar: "عقود صيانة المولدات والإصلاح واختبار الأحمال والتشغيل الأولي وصيانة الأنظمة الشمسية في الإمارات والسعودية والعراق، مع ضمان 12 شهراً على كل منتج.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/services", title: COPY.seoTitle[locale], description: COPY.seoDesc[locale] });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const wa = ar ? "مرحباً فور يو باور، أحتاج خدمة صيانة لـ: " : "Hi 4U Power, I need maintenance / service for: ";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: ar ? "صيانة وخدمات المولدات واللوحات الكهربائية" : "Generator & switchgear maintenance services",
          provider: { "@id": ORG_ID },
          areaServed: ["AE", "SA", "IQ"].map((c) => ({ "@type": "Country", name: c })),
          url: localeUrl(locale, "/services"),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: ar ? "الخدمات" : "Services",
            itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: pick(s.title, locale), description: pick(s.body, locale) } })),
          },
        }}
      />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.services"), path: "/services" },
        ]}
        eyebrow={t("nav.services")}
        title={L(COPY.h1)}
        intro={L(COPY.intro)}
        aside={
          <div className="spotlight rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
            <span className="grid size-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="size-7" aria-hidden />
            </span>
            <p className="mt-6 text-4xl font-bold tracking-tight text-white">
              12 <span className="text-xl font-semibold text-white/70">{ar ? "شهراً" : "months"}</span>
            </p>
            <p className="mt-1 text-sm text-white/60">{t("common.warrantyLong")}</p>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="services_hero" message={wa} size="lg" />
          <CallButton location="services_hero" size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      {/* warranty */}
      <section className="section" aria-labelledby="warranty-title">
        <div className="container-x grid gap-10 rounded-[2rem] border border-line bg-white/[0.025] p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="warranty-title" eyebrow={ar ? "الضمان" : "Warranty"} title={L(warranty.title)} intro={L(warranty.body)} />
          </div>
          <ul className="grid gap-3 lg:col-span-6">
            {warranty.points.map((p) => (
              <li key={p.en} className="flex gap-3 rounded-2xl border border-line bg-navy-900/60 p-4 text-ink">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden />
                <span>{L(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* services grid */}
      <section className="section pt-0" aria-labelledby="svc-title">
        <div className="container-x">
          <SectionHeading id="svc-title" eyebrow={ar ? "الخدمات" : "Services"} title={ar ? "خدمات تغطي **دورة حياة** المعدات كاملة" : "Services for the **whole life** of your equipment"} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => {
              const I = ICONS[s.icon];
              return (
                <Reveal as="li" key={s.title.en} delay={(i % 4) * 0.06} from="scale" className="spotlight flex flex-col rounded-[1.75rem] border border-line bg-navy-900/70 p-6">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                    <I className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug text-ink">{L(s.title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{L(s.body)}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* request form */}
      <section className="section pt-0" aria-labelledby="req-title">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="req-title"
              eyebrow={ar ? "اطلب خدمة" : "Request service"}
              title={ar ? "احجز زيارة صيانة أو فحص" : "Book a maintenance or inspection visit"}
              intro={ar ? "أخبرنا بماركة المعدات وقدرتها والموقع، وسنرد بموعد الزيارة وعرض عقد الصيانة." : "Tell us the equipment brand, rating and location — we reply with a visit slot and an AMC proposal."}
            />
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:col-span-7">
            <LeadForm source="quote_form" defaultMessage={ar ? "خدمة صيانة: " : "Maintenance service: "} />
          </div>
        </div>
      </section>

      <FaqBlock locale={locale} items={servicesFaq} title={ar ? "أسئلة عن الصيانة والضمان" : "Service & warranty questions"} eyebrow={t("nav.services")} dark />
      <CtaBanner
        title={ar ? "عقد صيانة سنوي لمولداتك؟" : "Need an annual maintenance contract?"}
        body={ar ? "أرسل عدد المولدات وقدراتها ومواقعها، ونرسل لك عرض عقد الصيانة." : "Send the number of sets, their ratings and locations — we send an AMC proposal."}
        message={wa}
        location="services_cta"
      />
    </>
  );
}
