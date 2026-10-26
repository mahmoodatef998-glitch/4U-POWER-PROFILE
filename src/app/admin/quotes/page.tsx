import Link from "next/link";
import { money, quoteNumber, ukDate, type QuoteStatus } from "@/lib/quote";
import { assetStatus } from "@/lib/quote-assets";
import { listQuotes } from "@/lib/quote-data";
import { describeFilters, filterQuery, filterQuotes, hasFilters, netValue, parseFilters, salesPeople, salesSummary } from "@/lib/quote-report";
import { setQuoteStatus } from "./actions";

const BADGE: Record<QuoteStatus, string> = {
  draft: "bg-zinc-200 text-zinc-700",
  sent: "bg-sky-100 text-sky-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

const field = "rounded-lg border border-line px-3 py-2 font-normal";
const pct = (n: number | null) => (n === null ? "–" : `${Math.round(n * 100)}%`);

export default async function QuotesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ data: all, error }, files, sp] = await Promise.all([listQuotes(), assetStatus(), searchParams]);
  const uploadMsg = typeof sp.assets === "string" ? sp.assets : undefined;
  const missing = !files.letterhead || !files.terms;
  const f = parseFilters(sp);
  const quotes = all ? filterQuotes(all, f) : null;
  const people = salesPeople(all ?? []);
  const report = salesSummary(quotes ?? []);
  const qs = filterQuery(f);
  const sum = (s: QuoteStatus) => (quotes ?? []).filter((q) => q.status === s).reduce((t, q) => t + netValue(q), 0);
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Quotations</h1>
          <p className="mt-1 text-sm text-muted">Pick a model from the datasheets: the price comes from the UAE or Export price list, with any discount and VAT on top. Download the PDF on the 4U letterhead.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/quotes/prices" className="rounded-xl border border-line px-5 py-3 font-extrabold">Price list</Link>
          <Link href="/admin/quotes/new" className="rounded-xl bg-brand-500 px-5 py-3 font-extrabold text-ink-950">+ New quotation</Link>
        </div>
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
          {/* filters: a plain GET form, so a filtered view is a link that can be bookmarked or shared */}
          <form action="/admin/quotes" className="grid gap-3 rounded-2xl border border-line bg-navy-900 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1 font-semibold lg:col-span-2">
              Customer
              <input name="q" defaultValue={f.q} placeholder="Company, attention, phone, email or QT number" className={field} />
            </label>
            <label className="grid gap-1 font-semibold">
              Sales person
              <select name="sales" defaultValue={f.sales} className={field}>
                <option value="">All</option>
                {people.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 font-semibold">
              Status
              <select name="status" defaultValue={f.status} className={`${field} capitalize`}>
                <option value="">All</option>
                {(["draft", "sent", "won", "lost"] as QuoteStatus[]).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 font-semibold">
              Total from (AED)
              <input name="min" type="number" min="0" step="any" defaultValue={f.min ?? ""} placeholder="0" className={field} />
            </label>
            <label className="grid gap-1 font-semibold">
              Total to (AED)
              <input name="max" type="number" min="0" step="any" defaultValue={f.max ?? ""} placeholder="Any" className={field} />
            </label>
            <label className="grid gap-1 font-semibold">
              Date from
              <input name="from" type="date" defaultValue={f.from} className={field} />
            </label>
            <label className="grid gap-1 font-semibold">
              Date to
              <input name="to" type="date" defaultValue={f.to} className={field} />
            </label>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-4">
              <button className="rounded-lg bg-navy-950 px-4 py-2 font-bold text-white">Filter</button>
              {hasFilters(f) && <Link href="/admin/quotes" className="rounded-lg border border-line px-4 py-2 font-bold">Clear</Link>}
              <a href={`/admin/quotes/export${qs ? `?${qs}` : ""}`} className="rounded-lg bg-brand-500 px-4 py-2 font-bold text-ink-950">Download Excel</a>
              <span className="text-muted">
                {hasFilters(f) ? `${describeFilters(f)}: ${quotes!.length} of ${all!.length} quotations` : `${all!.length} quotations`}. The Excel has these quotations with every line offered.
              </span>
            </div>
          </form>

          {report.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-line bg-navy-900">
              <table className="w-full min-w-[760px] text-left text-sm">
                <caption className="px-4 pt-4 text-left font-extrabold">By sales person</caption>
                <thead className="bg-surface text-xs uppercase text-muted">
                  <tr>
                    {["Sales person", "Quotations", "Draft", "Sent", "Won", "Lost", "Win rate", "Quoted (excl. VAT)", "Won (excl. VAT)"].map((h) => (
                      <th key={h} className="px-4 py-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line tabular-nums">
                  {report.map((r) => (
                    <tr key={r.person}>
                      <td className="px-4 py-2 font-bold">
                        <Link href={`/admin/quotes?${filterQuery(f, { sales: r.person })}`} className="hover:text-brand-700">{r.person}</Link>
                      </td>
                      <td className="px-4 py-2 font-bold">{r.quotes}</td>
                      <td className="px-4 py-2">{r.draft}</td>
                      <td className="px-4 py-2">{r.sent}</td>
                      <td className="px-4 py-2 text-emerald-700">{r.won}</td>
                      <td className="px-4 py-2 text-red-700">{r.lost}</td>
                      <td className="px-4 py-2">{pct(r.winRate)}</td>
                      <td className="whitespace-nowrap px-4 py-2">AED {money(r.quoted)}</td>
                      <td className="whitespace-nowrap px-4 py-2 font-bold">AED {money(r.wonValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 pb-3 pt-1 text-xs text-muted">Win rate = won ÷ (won + lost). Values after discount, before VAT. Click a name to see only their quotations.</p>
            </div>
          )}

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
                  {["No.", "Date", "Customer", "Sales", "Items", "Total (incl. VAT)", "Status", ""].map((h) => (
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
                    <td className="whitespace-nowrap px-4 py-3">{q.sales.person}</td>
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
                    <td colSpan={8} className="px-4 py-10 text-center text-muted">
                      {hasFilters(f) ? (
                        <>No quotation matches these filters. <Link href="/admin/quotes" className="font-bold text-brand-700">Clear filters</Link></>
                      ) : (
                        <>No quotations yet. <Link href="/admin/quotes/new" className="font-bold text-brand-700">Make the first one →</Link></>
                      )}
                    </td>
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
