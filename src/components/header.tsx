"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Phone, X, Globe } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { company, telUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "./cta-buttons";
import { QuoteCart } from "./quote-cart";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/generators", key: "generators", top: true },
  { href: "/ats-panels", key: "ats", top: true },
  { href: "/switchgear", key: "switchgear", top: true },
  { href: "/products", key: "products", top: true },
  { href: "/calculator", key: "calculator", top: true },
  { href: "/industries", key: "industries" },
  { href: "/services", key: "services" },
  { href: "/spare-parts", key: "parts" },
  { href: "/projects", key: "projects" },
  { href: "/markets", key: "markets" },
  { href: "/news", key: "news", top: true },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/** Site wordmark: the 4U gear mark (white gear on the night theme, black on light) + "4U Power / Generation". */
export function Brand({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image src="/brand/logo-mark-dark.png" alt="" width={275} height={375} className="h-10 w-auto shrink-0 light:hidden" priority />
      <Image src="/brand/logo-mark-light.png" alt="" width={275} height={375} className="hidden h-10 w-auto shrink-0 light:block" priority />
      <span className="leading-none">
        <span className="block text-[1.05rem] font-extrabold tracking-tight text-white">{locale === "ar" ? "فور يو باور" : "4U Power"}</span>
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-400 rtl:tracking-normal">
          {locale === "ar" ? "جينيريشن" : "Generation"}
        </span>
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
      className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-white/90 hover:bg-white/10", className)}
    >
      <Globe className="size-4" aria-hidden />
      <span lang={other}>{t("switchLang")}</span>
    </Link>
  );
}

export function Header() {
  const t = useTranslations("nav");
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 px-2 pt-2 transition-colors duration-500 sm:px-4 lg:pt-3",
        scrolled ? "bg-transparent" : "bg-navy-950",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950">
        {t("skip")}
      </a>
      <div
        className={cn(
          "dots mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-full border ps-4 pe-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:ps-5 lg:h-15",
          scrolled ? "border-white/15 bg-navy-900/75 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)]" : "border-white/10 bg-white/[0.04]",
        )}
      >
        <Link href="/" className="rounded-lg">
          <Brand />
        </Link>

        <nav aria-label={t("primary")} className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAV.filter((n) => "top" in n).map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-2 text-[0.94rem] font-medium text-white/75 transition hover:bg-white/5 hover:text-white",
                    isActive(n.href) && "text-brand-400 hover:text-brand-400",
                  )}
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <QuoteCart />
          <ThemeToggle />
          <LanguageSwitch className="hidden sm:inline-flex" />
          <a
            href={telUrl}
            onClick={() => trackEvent("call_click", { location: "header" })}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-bold text-white hover:bg-white/10 2xl:inline-flex"
          >
            <Phone className="size-4 text-brand-400" aria-hidden />
            <span dir="ltr">{company.phone}</span>
          </a>
          <WhatsAppButton location="header" size="sm" className="hidden sm:inline-flex" />

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label={t("menu")}>
              <Menu className="size-6" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 end-0 z-50 flex w-[88%] max-w-sm flex-col border-s border-white/10 bg-navy-950 p-5 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="sr-only">{t("menu")}</Dialog.Title>
                  <Dialog.Description className="sr-only">{company.brand}</Dialog.Description>
                  <Brand />
                  <Dialog.Close className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label={t("close")}>
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
                            "block rounded-xl px-4 py-3 text-lg font-semibold hover:bg-white/5",
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
                  <WhatsAppButton location="mobile_menu" size="lg" />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
