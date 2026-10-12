"use client";

import { useEffect } from "react";
import { newWaRef } from "@/lib/wa-ref";
import { readUtm } from "./utm-capture";

/**
 * Site-wide WhatsApp attribution. On every click of a wa.me link: create a short reference code,
 * append it (plus the page heading) to the pre-filled message and log page + campaign to /api/wa-click.
 * Sales search the code in /admin/whatsapp to see where the chat came from. Works for every
 * WhatsApp button without touching the individual components.
 */
export function WhatsAppTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='https://wa.me/']") as HTMLAnchorElement | null;
      if (!a) return;
      // rebuild from the original link each time so repeat clicks never stack codes
      const base = a.dataset.waBase ?? a.href;
      a.dataset.waBase = base;
      const ref = newWaRef();
      const ar = document.documentElement.lang === "ar";
      // the page's heading (e.g. "4U-P500 — 500 kVA Perkins diesel generator") so sales see the context in the chat itself
      const heading = document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 90) || undefined;
      try {
        const url = new URL(base);
        const text = url.searchParams.get("text");
        const tail = `Ref: ${ref}${heading ? `\n${ar ? "الصفحة" : "Page"}: ${heading}` : ""}`;
        // encodeURIComponent (not URLSearchParams) so spaces stay %20 — WhatsApp can show "+" literally
        a.href = `${url.origin}${url.pathname}?text=${encodeURIComponent(`${text ? `${text}\n\n` : ""}${tail}`)}`;
      } catch {
        return;
      }
      const payload = {
        ref,
        page: location.pathname,
        page_title: heading,
        location: (a.dataset.waLocation ?? a.closest<HTMLElement>("[data-wa-location]")?.dataset.waLocation)?.slice(0, 80),
        locale: ar ? "ar" : "en",
        referrer: document.referrer.slice(0, 300) || undefined,
        ...readUtm(),
      };
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/wa-click", blob)) {
        void fetch("/api/wa-click", { method: "POST", body: blob, keepalive: true });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
