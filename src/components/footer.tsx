import { MapPin, Phone, Mail, BadgeCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { sizeSlug } from "@/content/generator-sizes";
import { cities } from "@/content/locations";
import { Link } from "@/i18n/navigation";
import { company, telUrl } from "@/lib/site";
import { pick, type Locale } from "@/lib/utils";
import { Brand } from "./header";
import { SocialLinks } from "./social-links";

const POPULAR = [20, 30, 50, 100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000];

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const ar = locale === "ar";
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t("productsTitle"),
      links: [
        { href: "/generators", label: nav("generators") },
        { href: "/ats-panels", label: nav("ats") },
        { href: "/switchgear", label: nav("switchgear") },
        { href: "/products", label: nav("products") },
        { href: "/generators/sizes", label: ar ? "جدول أحجام المولدات" : "Generator size chart" },
        { href: "/calculator", label: nav("calculator") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/industries", label: nav("industries") },
        { href: "/services", label: nav("services") },
        { href: "/projects", label: nav("projects") },
        { href: "/markets", label: nav("markets") },
        { href: "/locations", label: ar ? "مناطق التوريد" : "Locations" },
        { href: "/news", label: nav("news") },
        { href: "/contact", label: nav("contact") },
      ],
    },
  ];

  return (
    <footer className="on-dark border-t border-white/10 bg-navy-950 pb-24 text-white/80 md:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-block">
            <Brand />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">{t("tagline")}</p>
          <p className="mt-6 text-sm font-bold text-white">{t("follow")}</p>
          <SocialLinks className="mt-3" emptyLabel={t("socialSoon")} />
        </div>

        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="lg:col-span-2">
            <p className="text-sm font-bold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-4">
          <p className="text-sm font-bold text-white">{t("contactTitle")}</p>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              <span>
                {ar ? company.address.streetAr : company.address.street}, {company.address.poBox},{" "}
                {ar ? company.address.cityAr : company.address.city}, {ar ? company.address.countryAr : company.address.country}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              <a href={telUrl} dir="ltr" className="hover:text-brand-400">{company.phone}</a>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              <a href={`mailto:${company.email}`} className="hover:text-brand-400">{company.email}</a>
            </p>
          </address>
        </div>
      </div>

      {/* crawlable link band: popular sizes + cities (internal linking for long-tail search) */}
      <div className="border-t border-white/10">
        <div className="container-x grid gap-6 py-8 text-sm lg:grid-cols-2">
          <nav aria-label={ar ? "أحجام شائعة" : "Popular sizes"}>
            <p className="font-bold text-white">{ar ? "أحجام المولدات الشائعة" : "Popular generator sizes"}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {POPULAR.map((k) => (
                <li key={k}>
                  <Link href={`/generators/${sizeSlug(k)}`} className="hover:text-brand-400" dir="ltr">
                    {ar ? `${k} ك.ف.أ` : `${k} kVA`}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={ar ? "مناطق التوريد" : "Locations"}>
            <p className="font-bold text-white">{ar ? "مولدات للبيع في" : "Generators for sale in"}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/locations/${c.slug}`} className="hover:text-brand-400">
                    {pick(c.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Legal identity block — required trust signal; must match the trade licence and schema.org NAP. */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs leading-5 text-white/70 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex gap-2">
            <BadgeCheck className="size-4 shrink-0 text-brand-400" aria-hidden />
            <span>
              <strong className="font-semibold text-white/90">{ar ? company.legalNameAr : company.legalName}</strong>
              {" · "}
              {t("license", { no: company.licenseNo })}
              {" · "}
              {ar ? company.licenseAuthorityAr : company.licenseAuthority}
              {" · "}
              {ar ? company.address.streetAr : company.address.street}, {company.address.poBox}, {ar ? company.address.cityAr : company.address.city},{" "}
              {ar ? company.address.countryAr : company.address.country}
            </span>
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {year} {company.legalName}. {t("rights")}</span>
            <Link href="/privacy" className="hover:text-brand-400">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-brand-400">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
