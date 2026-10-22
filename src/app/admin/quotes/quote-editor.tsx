"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { brandModels } from "@/lib/genset-models";
import {
  EXTRA_ITEMS,
  STATUSES,
  VAT_RATE,
  enclosureOptions,
  generatorItem,
  money,
  searchModels,
  totals,
  type QuoteCustomer,
  type QuoteItem,
  type QuoteSales,
  type QuoteStatus,
} from "@/lib/quote";
import { saveQuote, type SaveState } from "./actions";

export type EditorInitial = {
  id: string | null;
  lead_id: string | null;
  quote_date: string;
  status: QuoteStatus;
  customer: QuoteCustomer;
  sales: QuoteSales;
  validity: string;
  notes: string;
  items: QuoteItem[];
};

const input = "w-full rounded-lg border border-line px-3 py-2";
const label = "grid gap-1 text-sm font-semibold";

const CUSTOMER_FIELDS: [keyof QuoteCustomer, string, string?][] = [
  ["name", "Customer (company)", "e.g. Technomak Process Systems"],
  ["attention", "Attention", "Mr. …"],
  ["contact", "Contact", "+971 …"],
  ["email", "Email"],
  ["address", "Address", "City, country"],
  ["project", "Project"],
  ["trn", "Customer TRN"],
  ["ref", "Customer ref"],
];

export function QuoteEditor({ initial, initialSearch = "" }: { initial: EditorInitial; initialSearch?: string }) {
  const [customer, setCustomer] = useState(initial.customer);
  const [sales, setSales] = useState(initial.sales);
  const [quoteDate, setQuoteDate] = useState(initial.quote_date);
  const [validity, setValidity] = useState(initial.validity);
  const [notes, setNotes] = useState(initial.notes);
  const [status, setStatus] = useState(initial.status);
  const [items, setItems] = useState<QuoteItem[]>(initial.items);
  const [q, setQ] = useState(initialSearch);
  const [state, action, pending] = useActionState<SaveState, FormData>(saveQuote, null);

  const results = useMemo(() => searchModels(q), [q]);
  const t = totals(items, VAT_RATE);
  const payload = JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: quoteDate, status, customer, sales, validity, notes, items });
  // what was last saved (or the empty form): anything else is an unsaved change
  const [savedPayload] = useState(() =>
    JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: initial.quote_date, status: initial.status, customer: initial.customer, sales: initial.sales, validity: initial.validity, notes: initial.notes, items: initial.items }),
  );
  const dirty = payload !== savedPayload;

  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  const update = (i: number, patch: Partial<QuoteItem>) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: -1 | 1) =>
    setItems((list) => {
      const next = [...list];
      const [it] = next.splice(i, 1);
      next.splice(i + d, 0, it!);
      return next;
    });

  return (
    <form action={action} className="grid gap-8">
      <input type="hidden" name="payload" value={payload} />

      {/* ------------------------------------------------ add a generator */}
      <section className="rounded-2xl border border-line bg-navy-900 p-5">
        <h2 className="text-lg font-extrabold">1 · Add a generator</h2>
        <p className="mt-1 text-sm text-muted">Type the model code (4U-P550, p550), the kVA (550) or the engine. The standard description is filled in from the datasheet.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder="Search all datasheets: 4U-P550, 550, Cummins 200…"
          aria-label="Search generator models"
          className={`${input} mt-4 text-base`}
          autoFocus={!initial.id}
        />
        {q.trim() && (
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
            {results.map((m) => (
              <li key={m.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-bold">
                    {m.code} <span className="font-normal text-muted">· {m.brand} {m.engine}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {m.standbyKva} kVA standby · {m.primeKva} kVA prime{m.fuelLph ? ` · ${m.fuelLph.p75} L/h @ 75%` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enclosureOptions(m).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => {
                        setItems((list) => [...list, generatorItem(m, o.value)]);
                        setQ("");
                      }}
                      className="rounded-lg bg-navy-950 px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-800"
                    >
                      + {o.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
            {!results.length && <li className="px-4 py-3 text-sm text-muted">No model matches “{q}”. Models: {(["Perkins", "Cummins", "Kubota", "Baudouin"] as const).map((b) => `${b} ${brandModels(b).length}`).join(" · ")}</li>}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------ items */}
      <section className="rounded-2xl border border-line bg-navy-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">2 · Items &amp; prices</h2>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Add another item"
              value=""
              onChange={(e) => {
                const title = e.target.value;
                if (title) setItems((list) => [...list, { code: "", title: title === "custom" ? "" : title, description: "", qty: 1, unit: title.startsWith("Delivery") || title.startsWith("Install") || title.startsWith("Offload") ? "Lot" : "Units", unit_price: 0 }]);
              }}
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold"
            >
              <option value="">+ Add other item…</option>
              {EXTRA_ITEMS.map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
              <option value="custom">Blank line</option>
            </select>
          </div>
        </div>
        {!items.length && <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-muted">No items yet: search a generator above or add another item.</p>}
        <ol className="mt-4 grid gap-4">
          {items.map((it, i) => (
            <li key={i} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase text-muted">Item {i + 1}{it.code ? ` · ${it.code}` : ""}</span>
                <span className="flex gap-1 text-sm">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded border border-line px-2 disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded border border-line px-2 disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => setItems((list) => list.filter((_, j) => j !== i))} className="rounded border border-red-300 px-2 font-bold text-red-700">Remove</button>
                </span>
              </div>
              <label className={`${label} mt-3`}>
                Title
                <input value={it.title} onChange={(e) => update(i, { title: e.target.value })} required maxLength={300} className={input} />
              </label>
              <label className={`${label} mt-3`}>
                Description
                <textarea value={it.description} onChange={(e) => update(i, { description: e.target.value })} rows={it.code ? 7 : 3} maxLength={4000} className={`${input} font-normal`} />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <label className={label}>
                  Quantity
                  <input type="number" min="0.01" step="any" value={it.qty} onChange={(e) => update(i, { qty: Number(e.target.value) })} className={input} />
                </label>
                <label className={label}>
                  Unit
                  <input value={it.unit} onChange={(e) => update(i, { unit: e.target.value })} maxLength={20} className={input} />
                </label>
                <label className={label}>
                  Unit price (AED, excl. VAT)
                  <input type="number" min="0" step="0.01" value={it.unit_price || ""} onChange={(e) => update(i, { unit_price: Number(e.target.value) })} placeholder="0.00" required className={`${input} font-bold`} />
                </label>
                <div className={label}>
                  Line total
                  <p className="rounded-lg bg-surface px-3 py-2 font-bold tabular-nums">AED {money(it.qty * it.unit_price)}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <dl className="ms-auto mt-5 grid max-w-sm gap-1 text-sm tabular-nums">
          <div className="flex justify-between"><dt className="text-muted">Untaxed amount</dt><dd>AED {money(t.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">VAT {VAT_RATE}%</dt><dd>AED {money(t.vat)}</dd></div>
          <div className="flex justify-between border-t border-line pt-1 text-base font-extrabold"><dt>Total</dt><dd>AED {money(t.total)}</dd></div>
        </dl>
      </section>

      {/* ------------------------------------------------ customer */}
      <section className="rounded-2xl border border-line bg-navy-900 p-5">
        <h2 className="text-lg font-extrabold">3 · Customer</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_FIELDS.map(([k, l, ph]) => (
            <label key={k} className={label}>
              {l}
              <input
                value={customer[k]}
                onChange={(e) => setCustomer((c) => ({ ...c, [k]: e.target.value }))}
                placeholder={ph}
                required={k === "name"}
                dir={k === "contact" || k === "email" ? "ltr" : undefined}
                className={`${input} font-normal`}
              />
            </label>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ quotation details */}
      <section className="rounded-2xl border border-line bg-navy-900 p-5">
        <h2 className="text-lg font-extrabold">4 · Quotation details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className={label}>
            Date
            <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} required className={`${input} font-normal`} />
          </label>
          <label className={label}>
            Validity
            <input value={validity} onChange={(e) => setValidity(e.target.value)} placeholder="30 days" className={`${input} font-normal`} />
          </label>
          <label className={label}>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)} className={`${input} font-normal capitalize`}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <span />
          <label className={label}>
            Sales person
            <input value={sales.person} onChange={(e) => setSales((s) => ({ ...s, person: e.target.value }))} className={`${input} font-normal`} />
          </label>
          <label className={label}>
            Sales contact
            <input value={sales.contact} onChange={(e) => setSales((s) => ({ ...s, contact: e.target.value }))} dir="ltr" className={`${input} font-normal`} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Sales email
            <input value={sales.email} onChange={(e) => setSales((s) => ({ ...s, email: e.target.value }))} dir="ltr" className={`${input} font-normal`} />
          </label>
          <label className={`${label} sm:col-span-2 lg:col-span-4`}>
            Notes on the quotation (optional)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} placeholder="e.g. Prices ex-warehouse SAIF Zone. Offloading by client." className={`${input} font-normal`} />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">Payment, warranty, delivery and VAT terms print on page 2 from the 4U Terms &amp; Conditions sheet.</p>
      </section>

      {state?.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800">{state.error}</p>}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="font-extrabold tabular-nums">Total AED {money(t.total)} <span className="text-sm font-normal text-muted">incl. {VAT_RATE}% VAT · {items.length} item{items.length === 1 ? "" : "s"}</span></p>
          {dirty && initial.id && <p className="text-xs font-bold text-amber-700">Unsaved changes: Preview shows them, Save keeps them.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* a plain form post to the preview route, in a new tab: the PDF of the form as it is now, nothing saved, no number used */}
          <button type="submit" formAction="/admin/quotes/preview" formMethod="post" formTarget="_blank" formNoValidate disabled={!items.length} className="rounded-xl border border-line px-5 py-3 font-extrabold disabled:opacity-50">
            Preview PDF
          </button>
          <button disabled={pending || !items.length} className="rounded-xl bg-brand-500 px-6 py-3 font-extrabold text-ink-950 disabled:opacity-50">
            {pending ? "Saving…" : initial.id ? "Save changes" : "Save & create quotation"}
          </button>
        </div>
      </div>
    </form>
  );
}
