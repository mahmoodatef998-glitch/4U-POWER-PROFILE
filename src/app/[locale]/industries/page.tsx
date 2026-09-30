import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { IndustryIcon } from "@/components/industry-icon";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { home } from "@/content/pages";
import { industries } from "@/content/industries";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

const COPY = {
  title: { en: "Power solutions by industry", ar: "حلول الطاقة حسب القطاع" },
  intro: {
    en: "Every sector loads a generator differently. Pick yours to see the typical sizing, the problems we solve and the equipment we recommend.",
    ar: "كل قطاع يحمّل المولد بطريقة مختلفة. اختر قطاعك لترى الأحجام المعتادة والمشكلات التي نحلها والمعدات التي نوصي بها.",
  },
  seoTitle: { en: "Generators & Switchgear by Industry | 4U Power UAE", ar: "المولدات ولوحات الكهرباء حسب القطاع | فور يو باور" },
  seoDesc: {
    en: "Generator, ATS and switchgear solutions for hospitals, data centres, construction, factories, hotels and farms in the UAE, Saudi Arabia and Iraq.",
    ar: "حلول المولدات ولوحات ATS والجهد المنخفض للمستشفيات ومراكز البيانات والإنشاءات والمصانع والفنادق والمزارع في الإمارات والسعودية والعراق.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/industries", title: COPY.seoTitle[locale], description: COPY.seoDesc[locale] });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.industries"), path: "/industries" },
        ]}
        eyebrow={t("nav.industries")}
        title={L(COPY.title)}
        intro={L(COPY.intro)}
      />
      <section className="section">
        <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.slug} delay={(i % 3) * 0.08} from="scale">
              <Link
                href={`/industries/${ind.slug}`}
                className="spotlight group flex h-full flex-col rounded-[1.75rem] border border-line bg-navy-900/70 p-7 transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-brand-500/50"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
                  <IndustryIcon icon={ind.icon} className="size-6" />
                </span>
                <h2 className="mt-6 text-2xl leading-tight text-ink">{L(ind.name)}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{L(ind.intro)}</p>
                <p className="mt-5 text-xs font-semibold text-brand-400">{L(ind.range)}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-ink">
                  {t("cta.learnMore")}
                  <span className="sr-only"> — {L(ind.name)}</span>
                  <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="industries_cta" />
    </>
  );
}
