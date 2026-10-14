import Link from "next/link";
import { money, quoteNumber, ukDate, type QuoteStatus } from "@/lib/quote";
import { assetStatus } from "@/lib/quote-assets";
import { listQuotes } from "@/lib/quote-data";
import { setQuoteStatus } from "./actions";

const BADGE: Record<QuoteStatus, string> = {
  draft: "bg-zinc-200 text-zinc-700",
  sent: "bg-sky-100 text-sky-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ assets?: string }> }) {
  const [{ data: quotes, error }, files, { assets: uploadMsg }] = await Promise.all([listQuotes(), assetStatus(), searchParams]);
  const missing = !files.letterhead || !files.terms;
  const sum = (s: QuoteStatus) => (quotes ?? []).filter((q) => q.status === s).reduce((t, q) => t + q.subtotal, 0);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Quotations</h1>
          <p className="mt-1 text-sm text-muted">Pick a model from the datasheets, add the price, download the PDF on the 4U letterhead. VAT 5% is added automatically.</p>
        </div>
        <Link href="/admin/quotes/new" className="rounded-xl bg-brand-500 px-5 py-3 font-extrabold text-ink-950">+ New quotation</Link>
      </div>

      <details open={missing || !!uploadMsg} className={`rounded-2xl border p-5 ${missing ? "border-red-300 bg-red-50" : "border-line bg-navy-900"}`}>
        <summary className="cursor-pointer font-bold">
          Letterhead &amp; terms PDFs: {missing ? "upload both before the first quotation" : "ready"}
        </summary>
        <p className="mt-2 text-sm text-muted">
          Kept in private storage (not on the website or in the code). Letterhead: {files.letterhead ? `uploaded ${files.letterhead === "local" ? "(local copy)" : new Date(files.letterhead).toLocaleDateString("en-GB")}` : "missing"} ·
          Terms &amp; conditions: {files.terms ? `uploaded ${files.terms === "local" ? "(local copy)" : new Date(files.terms).toLocaleDateString("en-GB")}` : "missing"}. Upload a new file any time to replace it.
        </p>
        {uploadMsg && <p className="mt-2 text-sm font-semibold">{uploadMsg}</p>}
        <form action="/admin/quotes/assets" method="post" encType="multipart/form-data" className="mt-4 flex flex-wrap items-end gap-4 text-sm">
          <label className="grid gap-1 font-semibold">
            Blank letterhead (1 page PDF)
            <input type="file" name="letterhead" accept="application/pdf" className="font-normal" />
          </label>
          <label className="grid gap-1 font-semibold">
            Terms &amp; conditions page (PDF)
            <input type="file" name="terms" accept="application/pdf" className="font-normal" />
          </label>
          <button className="rounded-lg bg-navy-950 px-4 py-2 font-bold text-white">Upload</button>
        </form>
      </details>

      {error ? (
        <p className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-4">
            {(["sent", "won", "lost", "draft"] as QuoteStatus[]).map((s) => (
              <div key={s} className="rounded-2xl border border-line bg-navy-900 p-4">
                <dt className="text-sm capitalize text-muted">{s} ({quotes!.filter((q) => q.status === s).length})</dt>
                <dd className="mt-1 text-xl font-extrabold tabular-nums">AED {money(sum(s))}</dd>
                <p className="text-xs text-muted">excl. VAT</p>
              </div>
            ))}
          </dl>
          <div className="overflow-x-auto rounded-2xl border border-line bg-navy-900">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-surface text-xs uppercase text-muted">
                <tr>
                  {["No.", "Date", "Customer", "Items", "Total (incl. VAT)", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {quotes!.map((q) => (
                  <tr key={q.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-bold"><Link href={`/admin/quotes/${q.id}`} className="hover:text-brand-700">{quoteNumber(q.number)}</Link></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{ukDate(q.quote_date)}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold">{q.customer.name}</p>
                      <p className="text-muted">{[q.customer.attention, q.customer.contact].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate">{q.items[0]?.title}</p>
                      {q.items.length > 1 && <p className="text-muted">+ {q.items.length - 1} more</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums">AED {money(q.total)}</td>
                    <td className="px-4 py-3">
                      <form action={setQuoteStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={q.id} />
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${BADGE[q.status]}`}>{q.status}</span>
                        <select key={q.status} name="status" defaultValue={q.status} aria-label="Change status" className="rounded-lg border border-line px-2 py-1 text-xs capitalize">
                          {(["draft", "sent", "won", "lost"] as QuoteStatus[]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button className="rounded-lg border border-line px-2 py-1 text-xs font-bold">Set</button>
                      </form>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-end">
                      <a href={`/admin/quotes/${q.id}/pdf`} target="_blank" rel="noreferrer" className="rounded-lg bg-navy-950 px-3 py-1.5 text-xs font-bold text-white">PDF</a>{" "}
                      <Link href={`/admin/quotes/${q.id}`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold">Edit</Link>
                    </td>
                  </tr>
                ))}
                {!quotes!.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted">No quotations yet. <Link href="/admin/quotes/new" className="font-bold text-brand-700">Make the first one →</Link></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
