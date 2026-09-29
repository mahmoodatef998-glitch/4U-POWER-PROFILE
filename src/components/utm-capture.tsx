"use client";

import { useEffect } from "react";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;

function captureFromUrl(): Record<string, string> {
  const found: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (!v) continue;
    found[k] = v.slice(0, 300);
    try {
      sessionStorage.setItem(k, found[k]);
    } catch {
      /* storage blocked */
    }
  }
  return found;
}

/** Persists ad-click attribution for the session so leads can be tied back to Google Ads campaigns. */
export function UtmCapture() {
  useEffect(() => {
    captureFromUrl();
  }, []);
  return null;
}

/** Current URL params win (landing page), then values stored earlier in the session. */
export function readUtm(): Record<string, string> {
  const fromUrl = captureFromUrl();
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    let stored = "";
    try {
      stored = sessionStorage.getItem(k) ?? "";
    } catch {
      /* storage blocked */
    }
    out[k] = fromUrl[k] ?? stored;
  }
  return out;
}
