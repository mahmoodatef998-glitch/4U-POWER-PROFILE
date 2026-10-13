"use client";

import { useEffect } from "react";
import { newWaRef } from "@/lib/wa-ref";
import { readUtm } from "./utm-capture";

/** a repeat tap on the same call button within this window is the same enquiry */
const CALL_DEDUPE_MS = 10 * 60 * 1000;

const pageHeading = () => document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 90) || undefined;

function send(url: string, payload: object) {
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  if (!navigator.sendBeacon?.(url, blob)) void fetch(url, { method: "POST", body: blob, keepalive: true });
}

/** Page, campaign and referrer shared by every contact click. */
function context(a: HTMLAnchorElement, attr: "waLocation" | "callLocation") {
  const name = attr === "waLocation" ? "data-wa-location" : "data-call-location";
  return {
    page: location.pathname,
    page_title: pageHeading(),
    location: (a.dataset[attr] ?? a.closest<HTMLElement>(`[${name}]`)?.dataset[attr])?.slice(0, 80),
    locale: document.documentElement.lang === "ar" ? "ar" : "en",
    referrer: document.referrer.slice(0, 300) || undefined,
    ...readUtm(),
  };
}

/**
 * Append a short reference code (plus the page heading) to the pre-filled message and log page +
 * campaign to /api/wa-click. Sales search the code in /admin/whatsapp to see where the chat came from.
 */
function onWhatsApp(a: HTMLAnchorElement) {
  // rebuild from the original link each time so repeat clicks never stack codes
  const base = a.dataset.waBase ?? a.href;
  a.dataset.waBase = base;
  const ref = newWaRef();
  const ar = document.documentElement.lang === "ar";
  // the page's heading (e.g. "4U-P500 — 500 kVA Perkins diesel generator") so sales see the context in the chat itself
  const heading = pageHeading();
  try {
    const url = new URL(base);
    const text = url.searchParams.get("text");
    const tail = `Ref: ${ref}${heading ? `\n${ar ? "الصفحة" : "Page"}: ${heading}` : ""}`;
    // encodeURIComponent (not URLSearchParams) so spaces stay %20 — WhatsApp can show "+" literally
    a.href = `${url.origin}${url.pathname}?text=${encodeURIComponent(`${text ? `${text}\n\n` : ""}${tail}`)}`;
  } catch {
    return;
  }
  send("/api/wa-click", { ref, ...context(a, "waLocation") });
}

/** A phone call cannot carry a code, so log the tap (once per button per 10 min) for /admin/calls. */
function onCall(a: HTMLAnchorElement) {
  const ctx = context(a, "callLocation");
  const key = `4u-call:${ctx.page}:${ctx.location ?? ""}`;
  try {
    const last = Number(sessionStorage.getItem(key));
    if (last && Date.now() - last < CALL_DEDUPE_MS) return;
    sessionStorage.setItem(key, String(Date.now()));
  } catch {
    /* storage blocked: log every tap */
  }
  send("/api/call-click", ctx);
}

/** Site-wide attribution for every WhatsApp and call link, without touching the individual buttons. */
export function ContactTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const wa = el?.closest?.<HTMLAnchorElement>("a[href^='https://wa.me/']");
      if (wa) return onWhatsApp(wa);
      const tel = el?.closest?.<HTMLAnchorElement>("a[href^='tel:']");
      if (tel) onCall(tel);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
