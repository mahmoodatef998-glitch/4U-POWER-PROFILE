"use client";

import { useEffect } from "react";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;

/** Persists ad-click attribution for the session so leads can be tied back to Google Ads campaigns. */
export function UtmCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      for (const k of UTM_KEYS) {
        const v = params.get(k);
        if (v) sessionStorage.setItem(k, v.slice(0, 300));
      }
    } catch {
      /* storage blocked */
    }
  }, []);
  return null;
}

export function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (const k of UTM_KEYS) out[k] = sessionStorage.getItem(k) ?? "";
  } catch {
    /* storage blocked */
  }
  return out;
}
