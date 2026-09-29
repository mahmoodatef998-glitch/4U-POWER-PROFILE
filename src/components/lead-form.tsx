"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useState } from "react";
import { submitLead, type LeadState } from "@/app/actions/leads";
import { marketNames } from "@/content/taxonomy";
import { trackEvent } from "@/lib/analytics";
import { MARKETS } from "@/lib/types";
import { cn, type Locale } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { readUtm } from "./utm-capture";
import { Button } from "./ui/button";
import { WhatsAppButton } from "./cta-buttons";

type Props = {
  source?: "contact_form" | "quote_form" | "calculator" | "product";
  productSlug?: string;
  productName?: string;
  calculatedKva?: number;
  calcSubmissionId?: string | null;
  defaultMessage?: string;
  compact?: boolean;
  /** slug → localized name; when set, a `?product=` URL param pre-fills the form (keeps the page static). */
  productNames?: Record<string, string>;
};

const initial: LeadState = { status: "idle" };

export function LeadForm({ source: sourceProp = "contact_form", productSlug: slugProp, productName: nameProp, calculatedKva, calcSubmissionId, defaultMessage, compact, productNames }: Props) {
  const t = useTranslations("form");
  const locale = useLocale() as Locale;
  const [state, action, pending] = useActionState(submitLead, initial);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [page, setPage] = useState("");
  const uid = useId();
  const [urlProduct, setUrlProduct] = useState<string | null>(null);

  useEffect(() => {
    setUtm(readUtm());
    setPage(window.location.pathname);
    if (productNames) {
      const slug = new URLSearchParams(window.location.search).get("product");
      if (slug && productNames[slug]) setUrlProduct(slug);
    }
  }, [productNames]);

  const productSlug = slugProp ?? urlProduct ?? undefined;
  const productName = nameProp ?? (urlProduct && productNames ? productNames[urlProduct] : undefined);
  const source = urlProduct && sourceProp === "contact_form" ? "quote_form" : sourceProp;

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("generate_lead", { source, product: productSlug, kva: calculatedKva });
    }
  }, [state.status, source, productSlug, calculatedKva]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckCircle2 className="size-8 text-emerald-600" aria-hidden />
        <p className="mt-3 font-semibold leading-7">{t("success")}</p>
        <WhatsAppButton location="form_success" className="mt-5" />
      </div>
    );
  }

  const err = (k: "name" | "phone" | "email") => (state.errors?.[k] ? t(state.errors[k] as "errName") : null);
  const field = "mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-ink placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 aria-[invalid=true]:border-red-600";
  const label = "text-sm font-bold text-ink";

  return (
    <form action={action} noValidate className="grid gap-4" aria-describedby={state.status === "error" ? `${uid}-err` : undefined}>
      {state.status === "error" && !state.errors && (
        <p id={`${uid}-err`} role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">
          {t("error")}
        </p>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            {t("name")} <span className="text-red-700" aria-hidden>*</span>
          </label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required aria-required aria-invalid={!!err("name")} aria-describedby={err("name") ? `${uid}-name-e` : undefined} className={field} />
          {err("name") && <p id={`${uid}-name-e`} className="mt-1 text-sm font-semibold text-red-700">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>
            {t("phone")} <span className="text-red-700" aria-hidden>*</span>
          </label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required aria-required aria-invalid={!!err("phone")} aria-describedby={err("phone") ? `${uid}-phone-e` : undefined} placeholder="+971 5X XXX XXXX" className={cn(field, "rtl:text-right")} />
          {err("phone") && <p id={`${uid}-phone-e`} className="mt-1 text-sm font-semibold text-red-700">{err("phone")}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={label}>{t("email")}</label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!err("email")} aria-describedby={err("email") ? `${uid}-email-e` : undefined} className={cn(field, "rtl:text-right")} />
          {err("email") && <p id={`${uid}-email-e`} className="mt-1 text-sm font-semibold text-red-700">{err("email")}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-country`} className={label}>{t("country")}</label>
          <select id={`${uid}-country`} name="country" defaultValue="uae" className={field}>
            {MARKETS.map((m) => (
              <option key={m} value={m}>{marketNames[m][locale]}</option>
            ))}
            <option value="other">{t("otherCountry")}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className={label}>{t("message")}</label>
        <textarea
          key={productName ?? "none"}
          id={`${uid}-message`}
          name="message"
          rows={compact ? 3 : 4}
          defaultValue={defaultMessage ?? (productName ? `${productName}` : "")}
          placeholder={t("messagePlaceholder")}
          className={field}
        />
      </div>

      {/* hidden context */}
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source_page" value={page} />
      {productSlug && <input type="hidden" name="product_slug" value={productSlug} />}
      {calculatedKva ? <input type="hidden" name="calculated_kva" value={calculatedKva} /> : null}
      {calcSubmissionId ? <input type="hidden" name="calc_submission_id" value={calcSubmissionId} /> : null}
      {Object.entries(utm).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        {pending ? t("submitting") : t("submit")}
      </Button>
      <p className="text-xs text-muted">
        <Link href="/privacy" className="underline decoration-zinc-300 underline-offset-2 hover:text-brand-700">
          {t("privacy")}
        </Link>
      </p>
    </form>
  );
}
