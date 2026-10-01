import { MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { cities } from "@/content/locations";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/locations",
    title: locale === "ar" ? "مولدات للبيع في الإمارات والسعودية والعراق | فور يو باور" : "Generator Supplier in UAE, Saudi Arabia & Iraq | 4U Power",
    description:
      locale === "ar"
        ? "نوصّل مولدات الديزل ولوحات ATS من الشارقة إلى دبي وأبوظبي وكل الإمارات والرياض وجدة والدمام وبغداد وأربيل والبصرة. اختر مدينتك واطلب السعر."
        : "We deliver diesel generators and ATS panels from Sharjah to Dubai, Abu Dhabi, every emirate, Riyadh, Jeddah, Dammam, Baghdad, Erbil and Basra. Pick your city.",
  });
}

const GROUPS = [
  { market: "uae", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  { market: "saudi-arabia", en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  { market: "iraq", en: "Iraq", ar: "العراق" },
] as const;

export default async function LocationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: ar ? "المواقع" : "Locations", path: "/locations" },
        ]}
        eyebrow={ar ? "مناطق التوريد" : "Where we deliver"}
        title={ar ? "مولدات ولوحات كهرباء في مدينتك" : "Generators and panels delivered to your city"}
        intro={
          ar
            ? "من مستودعنا في المنطقة الحرة لمطار الشارقة نورّد إلى كل الإمارات ونصدّر إلى السعودية والعراق مع مستندات التصدير كاملة."
            : "From our SAIF Zone warehouse in Sharjah we supply every emirate and export to Saudi Arabia and Iraq with complete export documents."
        }
      />
      <section className="section" aria-label={ar ? "المدن" : "Cities"}>
        <div className="container-x grid gap-12">
          {GROUPS.map((g) => (
            <div key={g.market}>
              <h2 className="text-2xl text-ink">{ar ? g.ar : g.en}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cities
                  .filter((c) => c.market === g.market)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/locations/${c.slug}`}
                        className="spotlight group flex h-full flex-col rounded-2xl border border-line bg-navy-900/60 p-5 transition hover:-translate-y-0.5 hover:border-brand-500/50"
                      >
                        <span className="flex items-center gap-2 text-lg font-bold text-ink">
                          <MapPin className="size-5 text-brand-400" aria-hidden />
                          {pick(c.name, locale)}
                        </span>
                        <span className="mt-2 text-sm leading-6 text-muted">{pick(c.delivery, locale)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner
        title={ar ? "مدينتك غير موجودة في القائمة؟" : "Your city not listed?"}
        body={ar ? "نشحن إلى دول الخليج والشرق الأوسط وأفريقيا. أرسل موقع المشروع ونرد بخيارات الشحن والسعر." : "We ship across the GCC, Middle East and Africa. Send your site location and we reply with shipping options and price."}
        location="locations_cta"
      />
    </>
  );
}
