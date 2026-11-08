"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Globe, Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { InstallMenuButton } from "./install-app";
import { company, telUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "./cta-buttons";
import { buttonVariants } from "./ui/button";
import { QuoteCart } from "./quote-cart";
import { ThemeToggle } from "./theme-toggle";
import { PROJECTS_LIVE } from "@/lib/site-flags";

const NAV = [
  { href: "/", key: "home", top: true },
  { href: "/generators", key: "generators", top: true },
  { href: "/models", key: "models", top: true },
  { href: "/ats-panels", key: "ats", top: true },
  { href: "/switchgear", key: "switchgear", top: true },
  { href: "/products", key: "products", top: true },
  { href: "/calculator", key: "calculator", top: true },
  { href: "/configurator", key: "configurator", top: true },
  { href: "/industries", key: "industries" },
  { href: "/services", key: "services", top: true },
  { href: "/spare-parts", key: "parts" },
  ...(PROJECTS_LIVE ? [{ href: "/projects", key: "projects" }] : []),
  { href: "/markets", key: "markets" },
  { href: "/news", key: "news", top: true },
  { href: "/about", key: "about", top: true },
  { href: "/contact", key: "contact", top: true },
] as const;

/** Site wordmark: the main 4U POWER logo in its own yellow + "Generation FZC". Always sits on charcoal (header, footer, menu). */
export function Brand({ className, adaptive = false }: { className?: string; adaptive?: boolean }) {
  const locale = useLocale();
  const ar = locale === "ar";
  return (
    <span className={cn("flex items-center gap-3", className)} dir="ltr">
      <Image src="/brand/logo-full-dark.png" alt="4U Power" width={208} height={104} className={cn("h-11 w-auto shrink-0 lg:h-[3.25rem]", adaptive && "light:hidden")} priority />
      {/* the header follows the theme: on the light (see-through) header the logo's white parts are black */}
      {adaptive && <Image src="/brand/logo-full-light.png" alt="4U Power" width={208} height={104} className="hidden h-11 w-auto shrink-0 light:block lg:h-[3.25rem]" priority />}
      <span className="h-8 w-px bg-white/20" aria-hidden />
      <span className="leading-none" dir={ar ? "rtl" : "ltr"}>
        <span className="block font-[family-name:var(--font-heading)] text-[0.82rem] font-bold uppercase tracking-[0.16em] text-white rtl:font-[family-name:var(--font-arabic-display)] rtl:text-[0.95rem] rtl:tracking-normal">
          {ar ? "جينيريشن" : "Generation"}
        </span>
        <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-400 rtl:tracking-normal">{ar ? "ش.م.ح" : "FZC"}</span>
      </span>
    </span>
  );
}

function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";
  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      aria-label={t("switchLangLabel")}
      className={cn("inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-bold text-white/90 hover:bg-white/10", className)}
    >
      <Globe className="size-4" aria-hidden />
      <span lang={other}>{t("switchLang")}</span>
    </Link>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        // charcoal on the night theme; on the light theme a see-through glass bar (theme tokens, so text flips dark)
        "sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur-xl transition-[background-color,box-shadow] duration-500 light:backdrop-saturate-150",
        // light theme: fully see-through at the top of the page, frosted glass once the page scrolls under it
        scrolled ? "shadow-[0_18px_40px_-18px_rgb(0_0_0/0.85)] light:bg-navy-950/60 light:shadow-[0_12px_30px_-18px_rgb(20_20_24/0.3)]" : "light:bg-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950">
        {t("skip")}
      </a>
      {/* top bar: logo · tagline · language, theme, quote */}
      <div className={cn("container-x flex items-center justify-between gap-4 transition-[height] duration-500", scrolled ? "h-16" : "h-16 lg:h-[4.5rem]")}>
        <div className="flex items-center gap-6">
          <Link href="/" className="rounded-lg">
            <Brand adaptive />
          </Link>
          <p className="hidden border-s border-white/15 ps-6 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.18em] text-white/60 rtl:text-sm rtl:normal-case lg:block">
            {locale === "ar" ? (
              <>حلول طاقة<br />لغدٍ موثوق</>
            ) : (
              <>Power solutions<br />for a reliable tomorrow</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <QuoteCart />
          <ThemeToggle />
          <LanguageSwitch className="hidden sm:inline-flex" />
          <a
            href={telUrl}
            data-call-location="header"
            onClick={() => trackEvent("call_click", { location: "header" })}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-bold text-white hover:bg-white/10 2xl:inline-flex"
          >
            <Phone className="size-4 text-brand-400" aria-hidden />
            <span dir="ltr">{company.phone}</span>
          </a>
          <WhatsAppButton location="header" size="sm" className="hidden sm:inline-flex lg:hidden" />
          <Link href="/contact" className={cn(buttonVariants({ variant: "primary", size: "md" }), "hidden lg:inline-flex")}>
            <Mail aria-hidden />
            {cta("quote")}
          </Link>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid size-11 place-items-center rounded-lg text-white hover:bg-white/10 xl:hidden" aria-label={t("menu")}>
              <Menu className="size-6" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
              <Dialog.Content className="stage-dark fixed inset-y-0 end-0 z-50 flex w-[88%] max-w-sm flex-col border-s border-white/10 bg-navy-950 p-5 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="sr-only">{t("menu")}</Dialog.Title>
                  <Dialog.Description className="sr-only">{company.brand}</Dialog.Description>
                  <Brand />
                  <Dialog.Close className="grid size-11 place-items-center rounded-lg hover:bg-white/10" aria-label={t("close")}>
                    <X className="size-6" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav aria-label={t("primary")} className="mt-6 flex-1 overflow-y-auto">
                  <ul className="space-y-1">
                    {NAV.map((n) => (
                      <li key={n.href}>
                        <Link
                          href={n.href}
                          aria-current={isActive(n.href) ? "page" : undefined}
                          className={cn(
                            "block rounded-lg px-4 py-3 text-lg font-semibold hover:bg-white/5",
                            isActive(n.href) ? "bg-white/5 text-brand-400" : "text-white/90",
                          )}
                        >
                          {t(n.key)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                  <LanguageSwitch className="justify-center" />
                  <InstallMenuButton onDone={() => setOpen(false)} />
                  <Link href="/contact" className={buttonVariants({ variant: "primary", size: "lg" })}>
                    <Mail aria-hidden />
                    {cta("quote")}
                  </Link>
                  <WhatsAppButton location="mobile_menu" size="lg" />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* nav bar (desktop): every section a click away, the current one on a gold tab */}
      <div className="relative hidden border-t border-white/[0.07] bg-black/30 light:bg-transparent xl:block">
        <div aria-hidden className="gold-rule absolute inset-x-0 top-0 h-px opacity-60" />
        <nav aria-label={t("primary")} className="container-x">
          <ul className="flex items-stretch justify-between">
            {NAV.filter((n) => "top" in n).map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={cn(
                    "relative flex h-11 items-center whitespace-nowrap px-3 text-[0.88rem] 2xl:px-4 font-semibold text-white/80 transition hover:text-brand-300 light:hover:text-brand-700",
                    isActive(n.href) && "bg-gold text-ink-950 hover:text-ink-950",
                  )}
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
