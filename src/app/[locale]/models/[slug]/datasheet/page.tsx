import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrintButton } from "@/components/print-button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { gensetModels, getModel, modelImage, modelName, modelPath, modelSpecSections, ratingNotes } from "@/lib/genset-models";
import { buildMetadata } from "@/lib/seo";
import { company } from "@/lib/site";
import { formatDate, type Locale } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => gensetModels.map((m) => ({ locale, slug: m.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const m = getModel(slug);
  if (!m) return {};
  const t = await getTranslations({ locale, namespace: "datasheet" });
  // gated asset: the indexable version is the model page
  return buildMetadata({ locale, path: `${modelPath(m)}/datasheet`, title: `${m.code} — ${t("docTitle")}`, description: modelName(m, locale), noindex: true });
}

/** Printable A4 model datasheet in fixed light colours (see products/[slug]/datasheet for the same pattern). */
export default async function ModelDatasheetPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const m = getModel(slug);
  if (!m) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const sections = modelSpecSections(m, locale);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="px-2 py-8 sm:px-4 print:p-0">
      <div className="no-print mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-3">
        <Link href={modelPath(m)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="flip-rtl size-4" aria-hidden />
          {t("datasheet.back")}
        </Link>
        <PrintButton label={t("datasheet.print")} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-bold text-ink-950 hover:bg-brand-400" />
      </div>

      <article className="sheet mx-auto max-w-[210mm] overflow-hidden rounded-2xl bg-[#fff] text-[#111827] shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
        <header className="flex items-center justify-between gap-6 bg-[#0b1022] px-8 py-6 text-[#fff]">
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-mark-dark.png" alt="" width={275} height={375} className="h-12 w-auto" />
            <div className="leading-tight">
              <p className="text-lg font-extrabold">{ar ? company.brandAr : company.brand}</p>
              <p className="text-xs text-[#ffdf58]">{ar ? "بيانات فنية لمجموعة التوليد" : "Generating set — technical data sheet"}</p>
            </div>
          </div>
          <div className="text-end text-xs text-[#c9cfdc]" dir="ltr">
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>4ugenerators.com</p>
          </div>
        </header>
        <div className="h-1.5 bg-[repeating-linear-gradient(-45deg,#ffdf58_0_12px,#0b1022_12px_24px)]" />

        <div className="grid gap-8 px-8 pt-8 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a5900]">{ar ? "مولد ديزل · بيركنز · 50 هرتز" : "Diesel generator · Perkins · 50 Hz"}</p>
            <h1 className="mt-2 text-4xl leading-tight font-extrabold tracking-tight text-[#0b1022]" dir="ltr">{m.code}</h1>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              {[
                { k: ar ? "احتياطي (Standby)" : "Standby (ESP)", v: `${m.standbyKva} kVA · ${m.standbyKw} kW` },
                { k: ar ? "أساسي (Prime)" : "Prime (PRP)", v: `${m.primeKva} kVA · ${m.primeKw} kW` },
                { k: ar ? "المحرك" : "Engine", v: `Perkins ${m.engine}` },
                { k: ar ? "الجهد" : "Voltage", v: "400/230 V · 3ph · 50 Hz" },
              ].map((f) => (
                <div key={f.k} className="rounded-xl border border-[#e5e7eb] p-3">
                  <dt className="text-[0.7rem] font-semibold text-[#6b7280]">{f.k}</dt>
                  <dd className="mt-0.5 text-sm font-bold text-[#0b1022]" dir="ltr">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="sm:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0b1022]">
              <Image src={modelImage(m)} alt={modelName(m, locale)} fill sizes="(min-width:640px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-6 px-8 py-8 sm:grid-cols-2">
          {sections.map((s) => (
            <section key={s.title} className="break-inside-avoid">
              <h2 className="border-b-2 border-[#ffd426] pb-1.5 text-base font-bold text-[#0b1022]">{s.title}</h2>
              <table className="mt-2 w-full text-[0.8rem]">
                <tbody>
                  {s.rows.map((r, i) => (
                    <tr key={r.k} className={i % 2 ? "bg-[#f8fafc]" : undefined}>
                      <th scope="row" className="w-[45%] px-2 py-1.5 text-start align-top font-semibold text-[#4b5563]">{r.k}</th>
                      <td className="px-2 py-1.5 align-top font-semibold text-[#111827]">{r.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        <section className="break-inside-avoid px-8 pb-8">
          <ul className="space-y-1 rounded-xl bg-[#f8fafc] p-4 text-[0.72rem] leading-5 text-[#4b5563]">
            {ratingNotes(locale).map((n) => (
              <li key={n}>• {n}</li>
            ))}
            <li>• {t("datasheet.note")}</li>
          </ul>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] bg-[#f8fafc] px-8 py-4 text-[0.7rem] text-[#6b7280]">
          <p>
            {ar ? company.legalNameAr : company.legalName} · {t("footer.license", { no: company.licenseNo })} · {ar ? company.address.streetAr : company.address.street}, {ar ? company.address.cityAr : company.address.city}
          </p>
          <p>
            {t("datasheet.issued")}: {formatDate(today, locale)}
          </p>
        </footer>
      </article>
    </div>
  );
}
