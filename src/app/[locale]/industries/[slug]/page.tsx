import { CheckCircle2, Gauge } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { FaqBlock } from "@/components/faq-block";
import { IndustryIcon } from "@/components/industry-icon";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getIndustry, industries } from "@/content/industries";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => industries.map((i) => ({ locale, slug: i.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({ locale, path: `/industries/${slug}`, title: ind.seo.title[locale], description: ind.seo.description[locale] });
}

export default async function IndustryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const name = L(ind.name);
  const all = await getProducts();
  const featured = ind.products.map((s) => all.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const waMessage = t("cta.whatsappPage", { topic: ar ? `حلول الطاقة لقطاع ${name}` : `power for ${name.toLowerCase()}` });

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.industries"), path: "/industries" },
          { name, path: `/industries/${ind.slug}` },
        ]}
        eyebrow={name}
        title={L(ind.h1)}
        intro={L(ind.intro)}
        aside={
          <div className="spotlight rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
              <IndustryIcon icon={ind.icon} className="size-7" />
            </span>
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/60">
              <Gauge className="size-4" aria-hidden />
              {ar ? "الأحجام المعتادة" : "Typical sizing"}
            </p>
            <p className="mt-2 text-xl font-bold leading-snug text-white">{L(ind.range)}</p>
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location={`industry_${ind.slug}`} message={waMessage} size="lg" />
          <CallButton location={`industry_${ind.slug}`} size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section" aria-labelledby="ch-title">
        <div className="container-x">
          <SectionHeading id="ch-title" eyebrow={ar ? "التحديات" : "The challenge"} title={ar ? `ما الذي يميز أحمال ${name}` : `What makes ${name.toLowerCase()} different`} />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {ind.challenges.map((c, i) => (
              <Reveal as="li" key={c.title.en} delay={i * 0.08} from="scale" className="spotlight rounded-[1.75rem] border border-line bg-navy-900/70 p-7">
                <span className="font-display text-4xl font-extrabold text-brand-400/80">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl text-ink">{L(c.title)}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{L(c.body)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="sol-title">
        <div className="container-x grid gap-10 rounded-[2rem] border border-line bg-white/[0.025] p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading id="sol-title" eyebrow={ar ? "الحل" : "Our solution"} title={ar ? "ما نورّده لهذا القطاع" : "What we supply for it"} />
            <Link href="/calculator" className="mt-6 inline-flex font-semibold text-brand-400 hover:underline">
              {t("cta.tryCalculator")} →
            </Link>
          </div>
          <ul className="grid gap-4 lg:col-span-7">
            {ind.solution.map((s) => (
              <li key={s.en} className="flex gap-3 rounded-2xl border border-line bg-navy-900/60 p-4 text-ink">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden />
                <span>{L(s)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section pt-0" aria-labelledby="rec-title">
          <div className="container-x">
            <SectionHeading id="rec-title" eyebrow={ar ? "منتجات مقترحة" : "Recommended"} title={ar ? "ابدأ من هذه المنتجات" : "Start from these products"} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FaqBlock locale={locale} items={ind.faq} title={ar ? "أسئلة شائعة" : "Common questions"} eyebrow={name} dark />

      <section className="section pt-0" aria-labelledby="more-title">
        <div className="container-x">
          <h2 id="more-title" className="text-2xl text-ink">{ar ? "قطاعات أخرى" : "Other industries"}</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {industries
              .filter((o) => o.slug !== ind.slug)
              .map((o) => (
                <li key={o.slug}>
                  <Link href={`/industries/${o.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand-500/50 hover:bg-white/5">
                    <IndustryIcon icon={o.icon} className="size-4 text-brand-400" />
                    {L(o.name)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        title={ar ? `اطلب عرض سعر لمشروع ${name}` : `Get a quotation for your ${name.toLowerCase()} project`}
        body={ar ? "أرسل قائمة الأحمال أو القدرة المطلوبة، وسيرد مهندس المبيعات بالخيارات والأسعار." : "Send the load list or the kVA — a sales engineer replies with options and pricing."}
        message={waMessage}
        location={`industry_cta_${ind.slug}`}
      />
    </>
  );
}
