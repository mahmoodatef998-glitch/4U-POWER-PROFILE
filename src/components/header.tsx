"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Phone, X, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { company, telUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LogoMark } from "./icons";
import { WhatsAppButton } from "./cta-buttons";

const NAV = [
  { href: "/generators", key: "generators", top: true },
  { href: "/ats-panels", key: "ats", top: true },
  { href: "/switchgear", key: "switchgear", top: true },
  { href: "/products", key: "products", top: true },
  { href: "/calculator", key: "calculator", top: true },
  { href: "/projects", key: "projects" },
  { href: "/markets", key: "markets" },
  { href: "/news", key: "news", top: true },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Brand({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className="leading-none">
        <span className="block text-[1.05rem] font-extrabold tracking-tight text-white">
          {locale === "ar" ? "فوريو باور" : "4U Power"}
        </span>
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-400 rtl:tracking-normal">
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
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-white/10 bg-navy-950/95 backdrop-blur" : "border-transparent bg-navy-950",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-amber-500 focus:px-4 focus:py-2 focus:font-bold focus:text-navy-950">
        {t("skip")}
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-18">
        <Link href="/" aria-label={t("home")} className="rounded-lg">
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
                    "whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white",
                    isActive(n.href) && "text-amber-400 hover:text-amber-400",
                  )}
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <a
            href={telUrl}
            onClick={() => trackEvent("call_click", { location: "header" })}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-bold text-white hover:bg-white/10 2xl:inline-flex"
          >
            <Phone className="size-4 text-amber-400" aria-hidden />
            <span dir="ltr">{company.phone}</span>
          </a>
          <WhatsAppButton location="header" size="sm" className="hidden sm:inline-flex" />

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label={t("menu")}>
              <Menu className="size-6" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 end-0 z-50 flex w-[88%] max-w-sm flex-col bg-navy-950 p-5 text-white shadow-2xl">
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
                            isActive(n.href) ? "bg-white/5 text-amber-400" : "text-white/90",
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
