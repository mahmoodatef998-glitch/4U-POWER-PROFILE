"use client";

import { useEffect } from "react";

/** A4 page width in CSS px (210 mm). */
const A4 = 793.7;
const fit = () => document.documentElement.style.setProperty("--ds-zoom", String(Math.min(1, (document.documentElement.clientWidth - 16) / A4)));
/** Same as `fit`, inline so the pages are sized before first paint on a direct visit. */
const SCRIPT = `(function(){var e=document.documentElement;e.style.setProperty("--ds-zoom",String(Math.min(1,(e.clientWidth-16)/${A4})))})()`;

/**
 * Phones and small tablets: sets --ds-zoom on <html> so each A4 datasheet page is scaled to the screen width
 * (the CSS applies it with `zoom` on screen only; print stays 1:1). Runs inline for a direct visit and again
 * on mount / resize for client-side navigation.
 */
export function FitPages() {
  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
