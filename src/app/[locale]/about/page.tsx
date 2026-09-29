import { Award, CheckCircle2, UserRound } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { about, home } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";
import { formatDate, pick, type Locale } from "@/lib/utils";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/about", title: pageSeo.about.title[locale], description: pageSeo.about.description[locale] });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const ar = locale === "ar";
  const L = <T,>(v: { en: T; ar: T }) => pick(v, locale);
  const lic = about.licence.labels;
  const rows: [string, string][] = [
    [L(lic.legalName), ar ? `${company.legalNameAr} — ${company.legalName}` : company.legalName],
    [L(lic.licenceNo), company.licenseNo],
    [L(lic.authority), ar ? company.licenseAuthorityAr : company.licenseAuthority],
    [L(lic.status), ar ? company.legalStatusAr : company.legalStatus],
    [L(lic.activity), ar ? company.activityAr : company.activity],
    [L(lic.incorporated), formatDate(company.foundingDate, locale)],
    [
      L(lic.address),
      `${ar ? company.address.streetAr : company.address.street}, ${company.address.poBox}, ${ar ? company.address.cityAr : company.address.city}, ${ar ? company.address.countryAr : company.address.country}`,
    ],
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.about"), path: "/about" },
        ]}
        eyebrow={L(home.who.eyebrow)}
        title={L(about.h1)}
        intro={L(about.intro)}
      />

      <section className="section bg-navy-900">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionHeading title={L(about.story.title)} />
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-8 text-zinc-700">
              {about.story.body.map((p) => (
                <p key={p.en}>{L(p)}</p>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border-s-4 border-brand-500 bg-brand-50 p-6">
              <h2 className="text-xl">{L(about.mission.title)}</h2>
              <p className="mt-2 leading-7 text-zinc-800">{L(about.mission.body)}</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <section aria-labelledby="lic-title" className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h2 id="lic-title" className="text-xl">{L(about.licence.title)}</h2>
              <dl className="mt-6 divide-y divide-line text-sm">
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-5 gap-3 py-3">
                    <dt className="col-span-2 font-semibold text-muted">{k}</dt>
                    <dd className="col-span-3 font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-5 text-muted">{L(about.licence.note)}</p>
            </section>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="lead-title">
        <div className="container-x">
          <SectionHeading id="lead-title" title={L(about.leadership.title)} intro={L(about.leadership.intro)} />
          {/* CONTENT_TODO: add owner headshots and short bios. */}
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
            {company.owners.map((o) => (
              <li key={o} className="flex items-center gap-4 rounded-2xl border border-line bg-navy-900 p-6">
                <span className="grid size-14 place-items-center rounded-full bg-navy-950 text-brand-400">
                  <UserRound className="size-7" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg text-ink">{o}</h3>
                  <p className="text-sm text-muted">{L(about.leadership.role)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-navy-900" aria-labelledby="why-title">
        <div className="container-x">
          <SectionHeading id="why-title" title={L(about.why.title)} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.why.items.map((w, i) => (
              <Reveal as="li" key={w.title.en} delay={i * 0.05} className="rounded-2xl border border-line p-6">
                <CheckCircle2 className="size-6 text-brand-600" aria-hidden />
                <h3 className="mt-4 text-lg text-ink">{L(w.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{L(w.body)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-surface" aria-labelledby="cert-title">
        <div className="container-x">
          <div className="flex flex-col gap-6 rounded-3xl border border-dashed border-zinc-300 bg-navy-900 p-8 sm:flex-row sm:items-center">
            <Award className="size-12 shrink-0 text-zinc-400" aria-hidden />
            <div>
              <h2 id="cert-title" className="text-xl">{L(about.certs.title)}</h2>
              <p className="mt-2 max-w-3xl leading-7 text-muted">{L(about.certs.body)}</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner title={L(home.cta.title)} body={L(home.cta.body)} location="about_cta" />
    </>
  );
}
