"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, ClipboardList, Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { quoteItemFor } from "@/lib/product-meta";
import { quoteSummary, useQuoteCart } from "@/lib/quote-cart";
import { whatsappUrl } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";
import { LeadForm } from "./lead-form";
import { buttonVariants } from "./ui/button";

/** Toggle-style "Add to quote" button used on product cards and product pages. */
export function AddToQuoteButton({ product, variant = "card", className }: { product: Product; variant?: "card" | "hero"; className?: string }) {
  const t = useTranslations("rfq");
  const locale = useLocale() as Locale;
  const cart = useQuoteCart();
  const inCart = cart.has(product.slug);
  const name = locale === "ar" ? product.name_ar : product.name_en;

  const onClick = () => {
    if (inCart) {
      window.dispatchEvent(new Event("4u-open-quote"));
      return;
    }
    cart.add(quoteItemFor(product));
    trackEvent("add_to_quote", { product: product.slug, category: product.category });
  };

  if (variant === "hero")
    return (
      <button type="button" onClick={onClick} className={cn(buttonVariants({ variant: inCart ? "ghostDark" : "ring", size: "lg" }), className)} aria-label={inCart ? t("added") : t("addAria", { product: name })}>
        {inCart ? <Check aria-hidden /> : <ClipboardList aria-hidden />}
        {inCart ? t("added") : t("add")}
      </button>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={inCart ? t("added") : t("addAria", { product: name })}
      title={inCart ? t("added") : t("add")}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] duration-300",
        inCart ? "border-brand-500/60 bg-brand-500/15 text-brand-400" : "border-white/15 bg-white/[0.06] text-white hover:bg-white/10",
        className,
      )}
    >
      {inCart ? <Check className="size-5" aria-hidden /> : <ClipboardList className="size-5" aria-hidden />}
    </button>
  );
}

/** Header button with live count + slide-over holding the multi-item request. */
export function QuoteCart() {
  const t = useTranslations("rfq");
  const locale = useLocale() as Locale;
  const cart = useQuoteCart();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  // any "Add to quote" button can ask the drawer to open
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("4u-open-quote", show);
    return () => window.removeEventListener("4u-open-quote", show);
  }, []);

  const list = quoteSummary(cart.items, locale);
  const message = `${t("messageIntro")}\n${list}\n\n${t("notes")}\n`;
  const wa = whatsappUrl(`${t("whatsappIntro")}\n${list}`);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSent(false);
      }}
    >
      <Dialog.Trigger
        className="relative grid size-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
        aria-label={t("openAria", { count: cart.count })}
        title={t("open")}
      >
        <ClipboardList className="size-5" aria-hidden />
        {cart.count > 0 && (
          <span className="absolute -end-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[0.7rem] font-extrabold text-ink-950 tabular-nums" aria-hidden>
            {cart.count}
          </span>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col border-s border-white/10 bg-navy-950 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <Dialog.Title className="text-xl font-bold">{t("title")}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-white/60">{t("subtitle")}</Dialog.Description>
            </div>
            <Dialog.Close className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Close">
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {sent ? (
              <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
                <Check className="size-8" aria-hidden />
                <p className="mt-3 font-semibold leading-7">{t("success")}</p>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-white/15 p-10 text-center">
                <ClipboardList className="size-10 text-white/40" aria-hidden />
                <p className="mt-4 text-lg font-semibold">{t("empty")}</p>
                <p className="mt-2 text-sm text-white/60">{t("emptyBody")}</p>
                <Dialog.Close asChild>
                  <Link href="/products" className={cn(buttonVariants({ variant: "primary" }), "mt-6")}>
                    {t("browse")}
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{t("itemsCount", { count: cart.count })}</span>
                  <button type="button" onClick={cart.clear} className="font-semibold hover:text-white">
                    {t("clear")}
                  </button>
                </div>
                <ul className="mt-3 grid gap-3">
                  {cart.items.map((i) => {
                    const name = locale === "ar" ? i.name_ar : i.name_en;
                    const spec = locale === "ar" ? i.spec_ar : i.spec_en;
                    return (
                      <li key={i.slug} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-navy-900">
                          {i.image && <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Dialog.Close asChild>
                            <Link href={`/products/${i.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand-400">
                              {name}
                            </Link>
                          </Dialog.Close>
                          {spec && <p className="mt-0.5 text-xs text-white/55">{spec}</p>}
                          <div className="mt-2 flex items-center gap-1">
                            <button type="button" onClick={() => cart.setQty(i.slug, i.qty - 1)} className="grid size-8 place-items-center rounded-full border border-white/15 hover:bg-white/10" aria-label={t("dec", { product: name })}>
                              <Minus className="size-3.5" aria-hidden />
                            </button>
                            <span className="w-8 text-center text-sm font-bold tabular-nums" aria-label={t("qty")}>{i.qty}</span>
                            <button type="button" onClick={() => cart.setQty(i.slug, i.qty + 1)} className="grid size-8 place-items-center rounded-full border border-white/15 hover:bg-white/10" aria-label={t("inc", { product: name })}>
                              <Plus className="size-3.5" aria-hidden />
                            </button>
                            <button type="button" onClick={() => cart.remove(i.slug)} className="ms-auto grid size-8 place-items-center rounded-full text-white/55 hover:bg-white/10 hover:text-white" aria-label={t("remove", { product: name })}>
                              <Trash2 className="size-4" aria-hidden />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { location: "quote_cart", items: cart.count })}
                  className={cn(buttonVariants({ variant: "whatsapp" }), "mt-5 w-full")}
                >
                  <WhatsAppIcon />
                  {t("sendWhatsApp")}
                </a>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <LeadForm
                    key={list}
                    source="rfq"
                    compact
                    defaultMessage={message}
                    submitLabel={t("send")}
                    onSuccess={() => {
                      trackEvent("rfq_submit", { items: cart.count });
                      cart.clear();
                      setSent(true);
                    }}
                    success={<span />}
                  />
                </div>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
