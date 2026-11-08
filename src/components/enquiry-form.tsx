"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useState } from "react";
import type { LeadState } from "@/app/actions/leads";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { submitLeadForm } from "@/lib/api-client";
import { cn, type Locale } from "@/lib/utils";
import { WhatsAppButton } from "./cta-buttons";
import { Button } from "./ui/button";
import { readUtm } from "./utm-capture";

export type EnquiryKind = "service" | "callback" | "expert";

type Opt = { v: string; en: string; ar: string };
const SERVICE_TYPES: Opt[] = [
  { v: "maintenance", en: "Scheduled maintenance visit", ar: "زيارة صيانة دورية" },
  { v: "repair", en: "Breakdown / repair", ar: "عطل أو إصلاح" },
  { v: "amc", en: "Annual maintenance contract (AMC) offer", ar: "عرض عقد صيانة سنوي (AMC)" },
  { v: "commissioning", en: "Testing & commissioning", ar: "اختبار وتشغيل أولي" },
  { v: "other", en: "Something else", ar: "أخرى" },
];
const EMIRATES: Opt[] = [
  { v: "Dubai", en: "Dubai", ar: "دبي" },
  { v: "Abu Dhabi", en: "Abu Dhabi", ar: "أبوظبي" },
  { v: "Sharjah", en: "Sharjah", ar: "الشارقة" },
  { v: "Ajman", en: "Ajman", ar: "عجمان" },
  { v: "Umm Al Quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
  { v: "Ras Al Khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { v: "Fujairah", en: "Fujairah", ar: "الفجيرة" },
  { v: "Outside the UAE", en: "Outside the UAE", ar: "خارج الإمارات" },
];
const CALL_TIMES: Opt[] = [
  { v: "as soon as possible", en: "As soon as possible", ar: "في أقرب وقت" },
  { v: "morning (08:00–12:00)", en: "Morning (08:00–12:00)", ar: "صباحاً (8–12)" },
  { v: "afternoon (12:00–18:00)", en: "Afternoon (12:00–18:00)", ar: "بعد الظهر (12–6)" },
];

const initial: LeadState = { status: "idle" };

/**
 * Short enquiry forms that go into the same leads pipeline as the contact form (/api/lead):
 * - service: book a maintenance / repair visit or ask for an AMC offer (AMC is priced per site, by contact)
 * - callback: name + phone + a time to call
 * - expert: a technical question for an engineer
 * The extra fields are written into the lead's message so sales sees them in /admin and in the e-mail.
 */
export function EnquiryForm({ kind, topic, className }: { kind: EnquiryKind; topic?: string; className?: string }) {
  const t = useTranslations("form");
  const locale = useLocale() as Locale;
  const ar = locale === "ar";
  const uid = useId();
  const [state, action, pending] = useActionState(submitLeadForm, initial);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [page, setPage] = useState("");
  const [parts, setParts] = useState<Record<string, string>>({});

  useEffect(() => {
    setUtm(readUtm());
    setPage(window.location.pathname);
  }, []);
  useEffect(() => {
    if (state.status === "success") trackEvent("generate_lead", { source: kind });
  }, [state.status, kind]);

  const L = (o: Opt) => (ar ? o.ar : o.en);
  const set = (k: string) => (e: { target: { value: string } }) => setParts((p) => ({ ...p, [k]: e.target.value }));

  // everything beyond name / phone / email is folded into one readable message
  const lines =
    kind === "service"
      ? [
          `Service request: ${parts.type ?? SERVICE_TYPES[0]!.v}`,
          parts.unit && `Generator (brand / model / kVA): ${parts.unit}`,
          `Location: ${parts.emirate ?? EMIRATES[0]!.v}`,
          parts.date && `Preferred date: ${parts.date}`,
          parts.details && `Details: ${parts.details}`,
        ]
      : kind === "callback"
        ? [`Call back: ${parts.time ?? CALL_TIMES[0]!.v}`, parts.about && `About: ${parts.about}`]
        : [`Question for an engineer${topic ? ` (${topic})` : ""}:`, parts.question ?? ""];
  const message = lines.filter(Boolean).join("\n");

  if (state.status === "success") {
    return (
      <div role="status" className={cn("rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900", className)}>
        <CheckCircle2 className="size-8 text-emerald-600" aria-hidden />
        <p className="mt-3 font-semibold leading-7">
          {kind === "callback"
            ? ar ? "تم. سيتصل بك أحد مهندسينا في الوقت الذي اخترته." : "Done. One of our engineers will call you at the time you chose."
            : kind === "service"
              ? ar ? "استلمنا طلب الصيانة، وسنتواصل معك لتأكيد الموعد." : "We have your service request and will contact you to confirm the visit."
              : ar ? "وصل سؤالك، وسيرد عليك مهندس على الهاتف أو الإيميل." : "Your question is in. An engineer will reply by phone or e-mail."}
        </p>
        <WhatsAppButton location={`${kind}_success`} className="mt-5" />
      </div>
    );
  }

  const err = (k: "name" | "phone" | "email") => (state.errors?.[k] ? t(state.errors[k] as "errName") : null);
  const field =
    "mt-1.5 block w-full rounded-xl border border-zinc-300 bg-navy-900 px-4 py-3 text-base text-ink placeholder:text-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 aria-[invalid=true]:border-red-600";
  const label = "text-sm font-bold text-ink";
  const req = <span className="text-red-700" aria-hidden>*</span>;

  return (
    <form action={action} noValidate className={cn("grid gap-4", className)}>
      {state.status === "error" && !state.errors && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{t("error")}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>{t("name")} {req}</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required aria-invalid={!!err("name")} className={field} />
          {err("name") && <p className="mt-1 text-sm font-semibold text-red-700">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>{t("phone")} {req}</label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required aria-invalid={!!err("phone")} placeholder="+971 5X XXX XXXX" className={cn(field, "rtl:text-right")} />
          {err("phone") && <p className="mt-1 text-sm font-semibold text-red-700">{err("phone")}</p>}
        </div>
      </div>

      {kind === "service" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-type`} className={label}>{ar ? "نوع الخدمة" : "What do you need?"}</label>
              <select id={`${uid}-type`} onChange={set("type")} className={field}>
                {SERVICE_TYPES.map((o) => <option key={o.v} value={o.v}>{L(o)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-emirate`} className={label}>{ar ? "موقع المولد" : "Generator location"}</label>
              <select id={`${uid}-emirate`} onChange={set("emirate")} className={field}>
                {EMIRATES.map((o) => <option key={o.v} value={o.v}>{L(o)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-unit`} className={label}>{ar ? "المولد (الماركة / الموديل / القدرة)" : "Generator (brand / model / kVA)"}</label>
              <input id={`${uid}-unit`} onChange={set("unit")} maxLength={160} placeholder={ar ? "مثال: بيركنز 250 ك.ف.أ" : "e.g. Perkins 250 kVA"} className={field} />
            </div>
            <div>
              <label htmlFor={`${uid}-date`} className={label}>{ar ? "الموعد المفضل" : "Preferred date"}</label>
              <input id={`${uid}-date`} type="date" onChange={set("date")} className={field} />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-details`} className={label}>{ar ? "التفاصيل" : "Details"}</label>
            <textarea id={`${uid}-details`} onChange={set("details")} rows={3} maxLength={1500} placeholder={ar ? "ساعات التشغيل، رسالة العطل على الشاشة، آخر صيانة…" : "Run hours, the fault shown on the controller, last service…"} className={field} />
          </div>
          {parts.type === "amc" && (
            <p className="text-sm text-muted">{ar ? "عقد الصيانة يُسعَّر حسب عدد المولدات وساعات التشغيل والموقع، لذلك نرسل لك عرضاً مخصصاً بعد التواصل." : "An AMC is priced on the number of sets, their run hours and the site, so we send a tailored offer after a short call."}</p>
          )}
        </>
      )}

      {kind === "callback" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-time`} className={label}>{ar ? "متى نتصل بك؟" : "When should we call?"}</label>
            <select id={`${uid}-time`} onChange={set("time")} className={field}>
              {CALL_TIMES.map((o) => <option key={o.v} value={o.v}>{L(o)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-about`} className={label}>{ar ? "بخصوص (اختياري)" : "About (optional)"}</label>
            <input id={`${uid}-about`} onChange={set("about")} maxLength={160} placeholder={ar ? "مثال: مولد 500 ك.ف.أ لمصنع" : "e.g. a 500 kVA set for a factory"} className={field} />
          </div>
        </div>
      )}

      {kind === "expert" && (
        <>
          <div>
            <label htmlFor={`${uid}-email`} className={label}>{t("email")}</label>
            <input id={`${uid}-email`} name="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!err("email")} className={cn(field, "rtl:text-right")} />
            {err("email") && <p className="mt-1 text-sm font-semibold text-red-700">{err("email")}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-q`} className={label}>{ar ? "سؤالك" : "Your question"} {req}</label>
            <textarea id={`${uid}-q`} onChange={set("question")} rows={4} maxLength={2000} required placeholder={ar ? "مثال: هل يكفي مولد 250 ك.ف.أ لتشغيل مصعدين ومضخة حريق؟" : "e.g. Will a 250 kVA set start two lifts and a fire pump?"} className={field} />
          </div>
        </>
      )}

      {kind !== "expert" && <input type="hidden" name="email" value="" />}
      <input type="hidden" name="message" value={message} />
      <input type="hidden" name="source" value={kind} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source_page" value={page} />
      {Object.entries(utm).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending || (kind === "expert" && !(parts.question ?? "").trim())} className="w-full sm:w-auto">
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        {pending
          ? t("submitting")
          : kind === "service"
            ? ar ? "احجز زيارة الصيانة" : "Book a service visit"
            : kind === "callback"
              ? ar ? "اطلب اتصالاً" : "Request a call back"
              : ar ? "أرسل السؤال لمهندس" : "Ask an engineer"}
      </Button>
      <p className="text-xs text-muted">
        <Link href="/privacy" className="underline decoration-zinc-300 underline-offset-2 hover:text-brand-700">{t("privacy")}</Link>
      </p>
    </form>
  );
}
