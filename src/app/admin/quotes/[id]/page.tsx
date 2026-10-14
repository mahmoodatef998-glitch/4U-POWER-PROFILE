import Link from "next/link";
import { notFound } from "next/navigation";
import { money, quoteNumber } from "@/lib/quote";
import { loadQuote } from "@/lib/quote-data";
import { deleteQuote } from "../actions";
import { DeleteButton } from "../delete-button";
import { QuoteEditor } from "../quote-editor";

export default async function EditQuotePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const q = await loadQuote(id);
  if (!q) notFound();
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/quotes" className="text-sm font-semibold text-muted hover:text-ink">← Quotations</Link>
          <h1 className="mt-1 text-2xl font-extrabold">{quoteNumber(q.number)} · {q.customer.name}</h1>
          <p className="text-sm text-muted tabular-nums">AED {money(q.total)} incl. VAT</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`/admin/quotes/${q.id}/pdf`} target="_blank" rel="noreferrer" className="rounded-xl bg-navy-950 px-5 py-3 font-extrabold text-white">Open PDF</a>
          <a href={`/admin/quotes/${q.id}/pdf?download=1`} className="rounded-xl bg-brand-500 px-5 py-3 font-extrabold text-ink-950">Download PDF</a>
        </div>
      </div>
      {saved && <p className="rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-800">Saved. The PDF is ready: open it to check, then download and send it to the customer.</p>}
      <QuoteEditor
        key={`${q.id}-${saved ?? ""}-${q.total}`}
        initial={{
          id: q.id,
          lead_id: q.lead_id,
          quote_date: q.quote_date,
          status: q.status,
          customer: q.customer,
          sales: q.sales,
          validity: q.validity ?? "",
          notes: q.notes ?? "",
          items: q.items,
        }}
      />
      <form action={deleteQuote} className="justify-self-start">
        <input type="hidden" name="id" value={q.id} />
        <DeleteButton label={quoteNumber(q.number)} />
      </form>
    </div>
  );
}
