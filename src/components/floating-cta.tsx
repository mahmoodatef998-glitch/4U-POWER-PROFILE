"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";
import { telUrl, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/**
 * Sticky conversion bar. Mobile: full-width bottom bar (body gets matching bottom padding so it never
 * covers content). Desktop: stacked round buttons in the end corner.
 */
export function FloatingCta() {
  const t = useTranslations("cta");
  const wa = whatsappUrl(t("whatsappDefault"));
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-navy-950/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a
          href={telUrl}
          onClick={() => trackEvent("call_click", { location: "sticky_mobile" })}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 font-bold text-white"
        >
          <Phone className="size-5" aria-hidden />
          {t("call")}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-location="sticky_mobile"
          onClick={() => trackEvent("whatsapp_click", { location: "sticky_mobile" })}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B7038] font-bold text-[#fff]"
        >
          <WhatsAppIcon className="size-5" />
          {t("whatsapp")}
        </a>
      </div>

      <div className="fixed bottom-6 end-6 z-40 hidden flex-col gap-3 md:flex">
        <a
          href={telUrl}
          aria-label={t("callUs")}
          onClick={() => trackEvent("call_click", { location: "sticky_desktop" })}
          className="grid size-14 place-items-center rounded-full bg-navy-950 text-white shadow-xl ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-navy-800"
        >
          <Phone className="size-6" aria-hidden />
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-location="sticky_desktop"
          aria-label={t("whatsappUs")}
          onClick={() => trackEvent("whatsapp_click", { location: "sticky_desktop" })}
          className="group relative grid size-14 place-items-center rounded-full bg-[#0B7038] text-[#fff] shadow-xl transition hover:-translate-y-0.5"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-iteration-count:3]" aria-hidden />
          <WhatsAppIcon className="relative size-7" />
        </a>
      </div>
    </>
  );
}
