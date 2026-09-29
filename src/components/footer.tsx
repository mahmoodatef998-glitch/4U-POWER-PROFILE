import { MapPin, Phone, Mail, BadgeCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company, telUrl } from "@/lib/site";
import type { Locale } from "@/lib/utils";
import { Brand } from "./header";
import { SocialLinks } from "./social-links";

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
        { href: "/calculator", label: nav("calculator") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: nav("about") },
        { href: "/projects", label: nav("projects") },
        { href: "/markets", label: nav("markets") },
        { href: "/news", label: nav("news") },
        { href: "/contact", label: nav("contact") },
      ],
    },
  ];

  return (
    <footer className="on-dark bg-ink-950 pb-24 text-white/80 md:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={nav("home")} className="inline-block">
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
