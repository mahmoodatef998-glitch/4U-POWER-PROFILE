"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Download, FileText, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { LeadForm } from "./lead-form";
import { buttonVariants } from "./ui/button";

const UNLOCK_KEY = "4u-datasheets-unlocked";

/**
 * Datasheet download behind a light lead gate (name + WhatsApp). Returning visitors who already
 * shared their details skip the form. The sheet itself is a printable page (or a real PDF when set).
 */
export function DatasheetGate({ slug, productName, href }: { slug: string; productName: string; href: string }) {
  const t = useTranslations("datasheet");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const url = href.startsWith("/") ? `/${locale}${href}` : href;

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
    } catch {}
  }, []);

  const openSheet = () => {
    trackEvent("datasheet_download", { product: slug });
    window.open(url, "_blank", "noopener");
  };

  const card = "flex w-full items-center gap-4 rounded-2xl border border-line p-5 text-start transition hover:border-brand-500 hover:bg-brand-50";
  const inner = (
    <>
      <span className="grid size-12 place-items-center rounded-xl bg-navy-950 text-brand-400">
        <FileText className="size-6" aria-hidden />
      </span>
      <span className="flex-1 font-bold text-ink">{t("cta")}</span>
      <Download className="size-5 text-brand-700" aria-hidden />
    </>
  );

  // once unlocked (and the gate dialog is closed) the card opens the sheet directly
  if (unlocked && !open)
    return (
      <button type="button" onClick={openSheet} className={card}>
        {inner}
      </button>
    );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={card}>{inner}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed start-1/2 top-1/2 z-50 max-h-[92svh] w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-navy-950 p-6 text-white shadow-2xl sm:p-8 rtl:translate-x-1/2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-2xl font-bold">{t("title")}</Dialog.Title>
              <p className="mt-1 text-sm font-semibold text-brand-400">{productName}</p>
            </div>
            <Dialog.Close className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Close">
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-3 text-sm leading-6 text-white/65">{t("body")}</Dialog.Description>
          <div className="mt-6">
            <LeadForm
              source="datasheet"
              productSlug={slug}
              productName={productName}
              minimal
              compact
              submitLabel={t("submit")}
              onSuccess={() => {
                try {
                  localStorage.setItem(UNLOCK_KEY, "1");
                } catch {}
                setUnlocked(true);
              }}
              success={
                <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
                  <CheckCircle2 className="size-8" aria-hidden />
                  <p className="mt-3 font-semibold">{t("ready")}</p>
                  <button type="button" onClick={openSheet} className={cn(buttonVariants({ variant: "primary" }), "mt-4")}>
                    <Download aria-hidden />
                    {t("open")}
                  </button>
                </div>
              }
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
