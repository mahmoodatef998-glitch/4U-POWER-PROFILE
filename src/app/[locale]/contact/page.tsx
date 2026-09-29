import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallButton, WhatsAppButton } from "@/components/cta-buttons";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { pageSeo } from "@/content/seo";
import { products } from "@/content/products";
import { buildMetadata } from "@/lib/seo";
import { company, telUrl } from "@/lib/site";
import type { Locale } from "@/lib/utils";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/contact", title: pageSeo.contact.title[locale], description: pageSeo.contact.description[locale] });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { product: productSlug } = await searchParams;
  const t = await getTranslations();
  const ar = locale === "ar";
  const product = products.find((p) => p.slug === productSlug);
  const productName = product ? (ar ? product.name_ar : product.name_en) : undefined;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&ll=${company.geo.lat},${company.geo.lng}&z=14&output=embed&hl=${locale}`;

  const nap: { icon: typeof MapPin; label: string; value: React.ReactNode }[] = [
    {
      icon: MapPin,
      label: ar ? "العنوان" : "Address",
      value: (
        <>
          <strong className="block text-ink">{ar ? company.legalNameAr : company.legalName}</strong>
          {ar ? company.address.streetAr : company.address.street}
          <br />
          {company.address.poBox}, {ar ? company.address.cityAr : company.address.city}, {ar ? company.address.countryAr : company.address.country}
        </>
      ),
    },
    { icon: Phone, label: ar ? "الهاتف / واتساب" : "Phone / WhatsApp", value: <a href={telUrl} dir="ltr" className="font-bold text-ink hover:text-amber-700">{company.phone}</a> },
    { icon: Mail, label: ar ? "البريد الإلكتروني" : "Email", value: <a href={`mailto:${company.email}`} className="font-bold text-ink hover:text-amber-700">{company.email}</a> },
    { icon: Clock, label: ar ? "ساعات العمل" : "Working hours", value: ar ? "الاثنين – السبت، 8:00 ص – 6:00 م (بتوقيت الإمارات)" : "Monday – Saturday, 8:00 am – 6:00 pm (GST)" },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.contact"), path: "/contact" },
        ]}
        eyebrow={ar ? "تواصل معنا" : "Get in touch"}
        title={ar ? "اتصل بفوريو باور جينيريشن — سيف زون، الشارقة" : "Contact 4U Power Generation — SAIF Zone, Sharjah"}
        intro={
          ar
            ? "أسرع طريقة للحصول على سعر هي الواتساب. نرد عادةً خلال ساعة عمل، وخلال نفس اليوم كحد أقصى."
            : "WhatsApp is the fastest way to get a price. We usually reply within the working hour — and always the same working day."
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton location="contact_hero" size="lg" />
          <CallButton location="contact_hero" size="lg" variant="ghostDark" />
        </div>
      </PageHero>

      <section className="section bg-surface">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="text-2xl">{t("form.title")}</h2>
              <p className="mt-2 text-sm text-muted">{t("common.responseTime")}</p>
              <div className="mt-6">
                <LeadForm source={product ? "quote_form" : "contact_form"} productSlug={product?.slug} productName={productName} />
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <section aria-labelledby="nap-title" className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 id="nap-title" className="text-xl">{ar ? "بيانات الشركة" : "Company details"}</h2>
              <ul className="mt-6 space-y-5">
                {nap.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-900 text-amber-400">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="text-sm leading-6 text-slate-700">
                      <p className="font-semibold text-muted">{label}</p>
                      <div>{value}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
                {t("footer.license", { no: company.licenseNo })} · {ar ? company.licenseAuthorityAr : company.licenseAuthority}
              </p>
            </section>
            <div className="overflow-hidden rounded-3xl border border-line bg-white">
              <iframe
                title={ar ? "خريطة موقع فوريو باور جينيريشن في سيف زون الشارقة" : "Map: 4U Power Generation, SAIF Zone, Sharjah"}
                src={mapSrc}
                className="aspect-[4/3] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
