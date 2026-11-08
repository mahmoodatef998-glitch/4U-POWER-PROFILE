import { ArrowRight, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/utils";

const EMIRATES = [
  ["dubai", "Dubai", "دبي"],
  ["abu-dhabi", "Abu Dhabi", "أبوظبي"],
  ["sharjah", "Sharjah", "الشارقة"],
  ["ajman", "Ajman", "عجمان"],
  ["ras-al-khaimah", "Ras Al Khaimah", "رأس الخيمة"],
  ["fujairah", "Fujairah", "الفجيرة"],
  ["al-ain", "Al Ain", "العين"],
] as const;

/**
 * "Buy in four steps" + emirate coverage, shared by the brand hubs and size pages (same facts as the
 * generators pillar: stock in SAIF Zone, same-day written quote, 12-month / 1,000-hour warranty).
 */
export function BuySteps({ locale, what }: { locale: Locale; what: { en: string; ar: string } }) {
  const ar = locale === "ar";
  const steps = ar
    ? [
        "أرسل القدرة أو قائمة الأحمال ومدينة التسليم على الواتساب.",
        "تصلك خيارات من محركين أو ثلاثة مع الداتا شيت لكل منها.",
        "يصلك عرض سعر مكتوب في نفس اليوم، مع لوحة ATS وخزان الوقود إذا احتجتهما.",
        "أكّد الطلب ونسلّم من الشارقة مع ضمان 12 شهراً أو 1,000 ساعة.",
      ]
    : [
        "Send the kVA, or your load list, and the delivery city on WhatsApp.",
        "Get two or three engine options with their datasheets.",
        "Receive a written quotation the same day, with the ATS panel and fuel tank if you need them.",
        "Confirm, and we deliver from Sharjah with a 12-month / 1,000-hour warranty.",
      ];
  return (
    <section className="section bg-surface" aria-labelledby="buy-title">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="buy-title" className="text-2xl sm:text-3xl">{ar ? `شراء ${what.ar} في أربع خطوات` : `Buying ${what.en} in four steps`}</h2>
          <ol className="mt-5 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-zinc-700">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-extrabold text-ink-950">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-6">
          <h2 className="text-2xl sm:text-3xl">{ar ? "التوصيل في كل الإمارات" : "Delivered across the UAE"}</h2>
          <p className="mt-4 leading-7 text-zinc-700">
            {ar
              ? "نحتفظ بمخزون من أكثر القدرات طلباً في مستودعنا بالمنطقة الحرة في الشارقة، ونوصّل إلى المواقع في كل إمارة، مع الاختبار والتشغيل الأولي للتركيبات الجديدة."
              : "We hold stock of the most requested ratings in our SAIF Zone warehouse in Sharjah and deliver to sites in every emirate, with testing and commissioning for new installations."}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {EMIRATES.map(([slug, en, a]) => (
              <li key={slug}>
                <Link href={`/locations/${slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-brand-700 transition hover:border-brand-500/50">
                  {ar ? a : en}
                  <ArrowRight className="flip-rtl size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <Zap className="size-4 text-brand-600" aria-hidden />
            {ar ? "نصدّر أيضاً إلى السعودية والعراق وقطر وأفريقيا." : "We also export to Saudi Arabia, Iraq, Qatar and Africa."}
          </p>
        </div>
      </div>
    </section>
  );
}
