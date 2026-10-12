import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { modelPath, type GensetModel } from "@/lib/genset-models";
import type { Locale } from "@/lib/utils";

const fmt = (n: number, locale: Locale) => new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", { maximumFractionDigits: 1 }).format(n);

/** Model ladder (standby / prime / engine / fuel) with a link to each model's datasheet page. */
export function ModelTable({ models, locale, highlight }: { models: GensetModel[]; locale: Locale; highlight?: string }) {
  const ar = locale === "ar";
  return (
    <div className="relative overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[34rem] text-start text-sm">
        <caption className="sr-only">{ar ? "موديلات مولدات فور يو" : "4U generator models"}</caption>
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-start">{ar ? "الموديل" : "Model"}</th>
            <th scope="col" className="px-4 py-3 text-start">{ar ? "احتياطي ك.ف.أ" : "Standby kVA"}</th>
            <th scope="col" className="px-4 py-3 text-start">{ar ? "أساسي ك.ف.أ" : "Prime kVA"}</th>
            <th scope="col" className="px-4 py-3 text-start">{ar ? "المحرك" : "Engine"}</th>
            <th scope="col" className="px-4 py-3 text-start">{ar ? "وقود 100% (لتر/س)" : "Fuel 100% (L/h)"}</th>
            <th scope="col" className="px-4 py-3 text-start"><span className="sr-only">{ar ? "الداتا شيت" : "Datasheet"}</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {models.map((m) => (
            <tr key={m.slug} className={m.slug === highlight ? "bg-brand-50" : "even:bg-surface"}>
              <th scope="row" className="px-4 py-3 text-start font-bold text-ink" dir="ltr">
                <Link href={modelPath(m)} className="hover:text-brand-700 hover:underline">{m.code}</Link>
              </th>
              <td className="px-4 py-3 font-semibold tabular-nums text-ink">{fmt(m.standbyKva, locale)}</td>
              <td className="px-4 py-3 tabular-nums text-muted">{fmt(m.primeKva, locale)}</td>
              <td className="px-4 py-3 text-muted" dir="ltr">{`${m.brand} ${m.engine}`}</td>
              <td className="px-4 py-3 tabular-nums text-muted">{m.fuelLph ? fmt(m.fuelLph.p100, locale) : "—"}</td>
              <td className="px-4 py-3 text-end">
                <Link href={modelPath(m)} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
                  <FileText className="size-4" aria-hidden />
                  {ar ? "الداتا شيت" : "Datasheet"}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
