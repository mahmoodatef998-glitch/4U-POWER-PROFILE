import { Building2, Clock, MapPin, ShieldCheck, ThermometerSun } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { sizeSlug } from "@/content/generator-sizes";
import { cities, cityFaq, getCity } from "@/content/locations";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => cities.map((c) => ({ locale, city: c.slug })));
}

type Props = { params: Promise<{ locale: Locale; city: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const n = pick(c.name, locale);
  const full = `مولدات كهربائية للبيع في ${n} | أسعار وتوريد | فور يو باور`;
  const title = locale === "ar" ? (full.length > 65 ? `مولدات كهربائية للبيع في ${n} | فور يو باور` : full) : `Diesel Generators for Sale in ${n} | 4U Power`;
  const description =
    locale === "ar"
      ? `مولدات ديزل كمنز وبيركنز ولوحات ATS في ${n} من 10 إلى 2500 ك.ف.أ، توصيل من الشارقة وضمان سنة. اطلب السعر عبر واتساب.`
      : `Cummins & Perkins generators, ATS panels and switchgear in ${n}, 10–2500 kVA. Delivered from Sharjah, 12-month warranty. Price on WhatsApp.`;
  return buildMetadata({ locale, path: `/locations/${c.slug}`, title, description });
}

export default async function CityPage({ params }: Props) {
  const { locale, city } = await params;
  setRequestLocale(locale);
  const c = getCity(city);
  if (!c) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const n = L(c.name);
  const faq = cityFaq(c);
  const wa = ar ? `مرحباً، أحتاج عرض سعر لمولد في ${n} — القدرة المطلوبة: ` : `Hi, I need a generator quotation in ${n} — required kVA: `;
  const siblings = cities.filter((o) => o.market === c.market && o.slug !== c.slug);

  const facts = [
    { icon: Clock, label: ar ? "التوصيل" : "Delivery", value: L(c.delivery) },
    { icon: Building2, label: ar ? "جهة الكهرباء" : "Utility", value: L(c.authority) },
    { icon: ThermometerSun, label: ar ? "ظروف الموقع" : "Site conditions", value: L(c.climate) },
    { icon: ShieldCheck, label: ar ? "الضمان" : "Warranty", value: ar ? "12 شهراً على كل منتج + عقود صيانة" : "12 months on every product + service contracts" },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: ar ? `توريد مولدات ديزل في ${n}` : `Diesel generator supply in ${n}`,
    serviceType: ar ? "توريد وتركيب مولدات كهربائية ولوحات ATS" : "Generator, ATS and switchgear supply",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: c.name.en, containedInPlace: { "@type": "Country", name: c.region.en.split(", ").pop() } },
    url: localeUrl(locale, `/locations/${c.slug}`),
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: ar ? "المواقع" : "Locations", path: "/locations" },
          { name: n, path: `/locations/${c.slug}` },
        ]}
        eyebrow={L(c.region)}
        title={ar ? `مولدات كهربائية للبيع في ${n}` : `Diesel generators for sale in ${n}`}
        intro={L(c.angle)}
        aside={
          <ul className="spotlight grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            {facts.slice(0, 2).map((f) => (
              <li key={f.label} className="flex gap-3">
                <f.icon className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-white/55 uppercase rtl:tracking-normal">{f.label}</span>
                  <span className="mt-1 block text-sm leading-6 font-semibold text-white">{f.value}</span>
                </span>
              </li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`city_${c.slug}`} message={wa} size="lg" />
          <CallButton location={`city_${c.slug}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section" aria-labelledby="facts-title">
        <div className="container-x">
          <SectionHeading
            id="facts-title"
            eyebrow={n}
            title={ar ? `ما يجب معرفته قبل شراء مولد في ${n}` : `What to know before buying a generator in ${n}`}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <li key={f.label} className="spotlight rounded-[1.75rem] border border-line bg-navy-900/70 p-6">
                <f.icon className="size-6 text-brand-400" aria-hidden />
                <h3 className="mt-4 text-lg text-ink">{f.label}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{f.value}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl leading-8 text-muted">
            {ar
              ? `نورّد في ${n} لقطاعات: ${c.sectors.ar}. نقدم مولدات ديزل بمحركات كمنز وبيركنز من 10 إلى 2500 ك.ف.أ، ولوحات تحويل أوتوماتيكي ATS، ولوحات توزيع ومفاتيح كهربائية، وأنظمة طاقة شمسية وخزانات وقود وأبراج إنارة.`
              : `In ${n} we supply ${c.sectors.en}. Our range covers Cummins and Perkins diesel generators from 10 to 2500 kVA, automatic transfer switch (ATS) panels, LV and MV switchgear, solar-hybrid systems, fuel tanks and light towers.`}
          </p>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="sizes-title">
        <div className="container-x rounded-[2rem] border border-line bg-white/[0.025] p-7 sm:p-10">
          <SectionHeading id="sizes-title" eyebrow={ar ? "الأكثر طلباً" : "Most requested"} title={ar ? `أحجام المولدات الشائعة في ${n}` : `Popular generator sizes in ${n}`} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.popular.map((k) => (
              <li key={k}>
                <Link
                  href={`/generators/${sizeSlug(k)}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-navy-900/60 p-5 transition hover:-translate-y-0.5 hover:border-brand-500/50"
                >
                  <span className="font-display text-3xl font-extrabold text-ink" dir="ltr">
                    {k} kVA
                  </span>
                  <span className="mt-1 text-sm text-muted">{ar ? `≈ ${Math.round(k * 0.8)} ك.و · المواصفات واستهلاك الوقود` : `≈ ${Math.round(k * 0.8)} kW · specs & fuel use`}</span>
                  <span className="mt-4 text-sm font-semibold text-brand-400 group-hover:underline">{ar ? "عرض التفاصيل ←" : "View details →"}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link href="/generators/sizes" className="text-brand-400 hover:underline">{ar ? "جدول كل الأحجام" : "Full size chart"}</Link>
            <Link href="/calculator" className="text-brand-400 hover:underline">{t("cta.tryCalculator")}</Link>
            <Link href="/ats-panels" className="text-brand-400 hover:underline">{ar ? "لوحات ATS" : "ATS panels"}</Link>
            <Link href={`/markets/${c.market}`} className="text-brand-400 hover:underline">{ar ? "تفاصيل التصدير والسوق" : "Market & export details"}</Link>
          </div>
        </div>
      </section>

      <FaqBlock locale={locale} items={faq} title={ar ? `أسئلة شائعة عن المولدات في ${n}` : `Generator FAQs for ${n}`} eyebrow={n} dark />

      {siblings.length > 0 && (
        <section className="section pt-0" aria-labelledby="more-title">
          <div className="container-x">
            <h2 id="more-title" className="text-2xl text-ink">{ar ? "مدن أخرى نخدمها" : "Other cities we serve"}</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {siblings.map((o) => (
                <li key={o.slug}>
                  <Link href={`/locations/${o.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand-500/50 hover:bg-white/5">
                    <MapPin className="size-4 text-brand-400" aria-hidden />
                    {L(o.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner
        title={ar ? `اطلب سعر مولد في ${n} الآن` : `Get a generator price in ${n} today`}
        body={ar ? "أرسل القدرة أو قائمة الأحمال وموقع المشروع، ويرد مهندس المبيعات بالخيارات والسعر ومدة التسليم." : "Send the kVA or load list and site location — a sales engineer replies with options, price and lead time."}
        message={wa}
        location={`city_cta_${c.slug}`}
      />
    </>
  );
}
