/**
 * Conversion-event helper. Safe to call anywhere on the client: every sink no-ops when its
 * tag is not installed. Event names map 1:1 to the Google Ads conversions to create later:
 *   whatsapp_click · call_click · generate_lead (quote form) · calculator_quote_click · calculator_complete
 */
export type ConversionEvent =
  | "whatsapp_click"
  | "call_click"
  | "generate_lead"
  | "calculator_complete"
  | "calculator_quote_click"
  | "add_to_quote"
  | "rfq_submit"
  | "datasheet_download";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Partial<Record<ConversionEvent, string>> = {
  whatsapp_click: "Contact",
  call_click: "Contact",
  generate_lead: "Lead",
  add_to_quote: "AddToCart",
  calculator_quote_click: "Lead",
};

export function trackEvent(event: ConversionEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, page_path: window.location.pathname };
  try {
    window.gtag?.("event", event, payload);
    // GTM: push even when gtag is absent so container triggers can fire on `event`.
    if (!window.gtag) (window.dataLayer ??= []).push({ event, ...payload });
    const metaEvent = META_EVENTS[event];
    if (metaEvent) window.fbq?.("track", metaEvent, { content_name: event, ...params });
  } catch {
    /* analytics must never break the UI */
  }
}
