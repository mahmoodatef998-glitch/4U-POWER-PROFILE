"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { brandModels, type GensetModel } from "@/lib/genset-models";
import { PRICE_LISTS, defaultOption, listRef, optionLabel, type PriceBook, type PriceListId } from "@/lib/price-book";
import {
  DELIVERY_OPTIONS,
  EXTRA_ITEMS,
  STATUSES,
  VAT_RATES,
  deliveryText,
  enclosureOptions,
  generatorItem,
  money,
  searchModels,
  totals,
  type Enclosure,
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
  delivery: string;
  notes: string;
  price_list: PriceListId;
  discount_pct: number;
  vat_rate: number;
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

export function QuoteEditor({ initial, initialSearch = "", prices = null }: { initial: EditorInitial; initialSearch?: string; prices?: PriceBook | null }) {
  const [customer, setCustomer] = useState(initial.customer);
  const [sales, setSales] = useState(initial.sales);
  const [quoteDate, setQuoteDate] = useState(initial.quote_date);
  const [validity, setValidity] = useState(initial.validity);
  const [delivery, setDelivery] = useState(initial.delivery);
  const [notes, setNotes] = useState(initial.notes);
  const [status, setStatus] = useState(initial.status);
  const [priceList, setPriceList] = useState(initial.price_list);
  const [discountPct, setDiscountPct] = useState(initial.discount_pct);
  const [vatRate, setVatRate] = useState(initial.vat_rate);
  const [items, setItems] = useState<QuoteItem[]>(initial.items);
  const [q, setQ] = useState(initialSearch);
  const [state, action, pending] = useActionState<SaveState, FormData>(saveQuote, null);

  const results = useMemo(() => searchModels(q), [q]);
  const t = totals(items, vatRate, discountPct);
  const payload = JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: quoteDate, status, customer, sales, validity, delivery, notes, price_list: priceList, discount_pct: discountPct, vat_rate: vatRate, items });
  // what was last saved (or the empty form): anything else is an unsaved change
  const [savedPayload] = useState(() =>
    JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: initial.quote_date, status: initial.status, customer: initial.customer, sales: initial.sales, validity: initial.validity, delivery: initial.delivery, notes: initial.notes, price_list: initial.price_list, discount_pct: initial.discount_pct, vat_rate: initial.vat_rate, items: initial.items }),
  );
  const dirty = payload !== savedPayload;

  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  const listLabel = PRICE_LISTS.find((l) => l.id === priceList)!.label;
  const optionsFor = (code: string, list: PriceListId = priceList) => (code ? prices?.models[code]?.[list] : undefined);
  // a new generator line starts at its list price (Leroy-Somer alternator where the list has it)
  const addGenerator = (m: GensetModel, enclosure: Enclosure) => {
    const item = generatorItem(m, enclosure);
    const opt = defaultOption(optionsFor(m.code));
    setItems((list) => [...list, opt ? { ...item, unit_price: opt.aed, price_key: opt.key } : item]);
    setQ("");
  };
  // switching list re-prices the lines that came from the list (typed-in prices stay) and sets its usual VAT
  const switchList = (id: PriceListId) => {
    setPriceList(id);
    setVatRate(PRICE_LISTS.find((l) => l.id === id)!.vat);
    setItems((list) =>
      list.map((it) => {
        const opt = it.price_key ? optionsFor(it.code, id)?.find((o) => o.key === it.price_key) : undefined;
        return opt ? { ...it, unit_price: opt.aed } : it;
      }),
    );
  };

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
        <p className="mt-1 text-sm text-muted">Type the model code (4U-P550, p550), the kVA (550) or the engine. The standard description is filled in from the datasheet and the price from the price list.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="price-list" className="font-semibold">Prices from</label>
          <select id="price-list" value={priceList} onChange={(e) => switchList(e.target.value as PriceListId)} className="rounded-lg border border-line px-3 py-1.5 font-semibold">
            {PRICE_LISTS.map((l) => (
              <option key={l.id} value={l.id}>{l.label}{prices ? ` ${prices.edition}` : ""} · VAT {l.vat}%</option>
            ))}
          </select>
          <span className="text-xs text-muted">{prices ? "Switching re-prices the lines taken from the list and sets the VAT." : "No price list loaded yet: type the prices."}</span>
        </div>
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
            {results.map((m) => {
              const listed = defaultOption(optionsFor(m.code));
              return (
              <li key={m.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-bold">
                    {m.code} <span className="font-normal text-muted">· {m.brand} {m.engine}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {m.standbyKva} kVA standby · {m.primeKva} kVA prime{m.fuelLph ? ` · ${m.fuelLph.p75} L/h @ 75%` : ""}
                  </p>
                  {prices && <p className={`text-sm font-semibold ${listed ? "" : "text-amber-700"}`}>{listed ? `${listLabel}: AED ${money(listed.aed)} · ${optionLabel(listed)} · ${listRef(listed)}` : `Not on the ${listLabel}: type the price`}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {enclosureOptions(m).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => addGenerator(m, o.value)}
                      className="rounded-lg bg-navy-950 px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-800"
                    >
                      + {o.label}
                    </button>
                  ))}
                </div>
              </li>
              );
            })}
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
          {items.map((it, i) => {
            const opts = optionsFor(it.code);
            return (
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
                  <input type="number" min="0" step="0.01" value={it.unit_price || ""} onChange={(e) => update(i, { unit_price: Number(e.target.value), price_key: undefined })} placeholder="0.00" required className={`${input} font-bold`} />
                </label>
                <div className={label}>
                  Line total
                  <p className="rounded-lg bg-surface px-3 py-2 font-bold tabular-nums">AED {money(it.qty * it.unit_price)}</p>
                </div>
              </div>
              {opts?.length ? (
                <label className={`${label} mt-3`}>
                  Price from the {listLabel}
                  <select
                    value={it.price_key && opts.some((o) => o.key === it.price_key && o.aed === it.unit_price) ? it.price_key : ""}
                    onChange={(e) => {
                      const o = opts.find((x) => x.key === e.target.value);
                      update(i, o ? { unit_price: o.aed, price_key: o.key } : { price_key: undefined });
                    }}
                    className={`${input} font-normal`}
                  >
                    <option value="">Own price (typed in above)</option>
                    {opts.map((o) => (
                      <option key={o.key} value={o.key}>
                        {optionLabel(o)} · AED {money(o.aed)}{o.currency === "GBP" ? ` (£${money(o.price)})` : ""} · {listRef(o)}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const cur = opts.find((o) => o.key === it.price_key && o.aed === it.unit_price);
                    return cur ? <span className="text-xs font-normal text-muted">{listRef(cur)}, check it matches {it.code}. Shown here only, never on the PDF.</span> : null;
                  })()}
                </label>
              ) : it.code && prices ? (
                <p className="mt-3 text-xs font-semibold text-amber-700">Not on the {listLabel}: type the price.</p>
              ) : null}
            </li>
            );
          })}
        </ol>
        <dl className="ms-auto mt-5 grid max-w-sm gap-1 text-sm tabular-nums">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>AED {money(t.subtotal)}</dd></div>
          <div className="flex items-center justify-between gap-3">
            <dt><label htmlFor="discount" className="text-muted">Discount %</label></dt>
            <dd><input id="discount" type="number" min="0" max="100" step="0.01" value={discountPct} onChange={(e) => setDiscountPct(Math.min(100, Math.max(0, e.target.valueAsNumber || 0)))} className="w-24 rounded-lg border border-line px-2 py-1 text-end" /></dd>
          </div>
          {t.discount > 0 && (
            <>
              <div className="flex justify-between"><dt className="text-muted">Discount {discountPct}%</dt><dd>- AED {money(t.discount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Net amount</dt><dd>AED {money(t.subtotal - t.discount)}</dd></div>
            </>
          )}
          <div className="flex justify-between"><dt className="text-muted">VAT {vatRate}%</dt><dd>AED {money(t.vat)}</dd></div>
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
            Delivery
            <input list="delivery-options" value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="e.g. 10 days" className={`${input} font-normal`} />
            <datalist id="delivery-options">
              {DELIVERY_OPTIONS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </label>
          <label className={label}>
            VAT
            <select value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} className={`${input} font-normal`}>
              {VAT_RATES.map((r) => (
                <option key={r} value={r}>{r ? `${r}% (standard)` : "0% (zero-rated / export)"}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-2 rounded-lg bg-surface p-3 text-xs sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-muted">Delivery:</span>
              {DELIVERY_OPTIONS.map((d) => (
                <button key={d} type="button" onClick={() => setDelivery(d)} className={`rounded-full border px-2.5 py-1 font-semibold ${delivery === d ? "border-brand-500 bg-brand-100" : "border-line"}`}>
                  {d}
                </button>
              ))}
            </div>
            <p className="text-muted">{delivery.trim() ? <>Prints on page 1: <span className="font-semibold text-ink">{deliveryText(delivery)}</span></> : "Empty: no delivery term on the quotation."}</p>
          </div>
          <label className={label}>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)} className={`${input} font-normal capitalize`}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Sales person
            <input value={sales.person} onChange={(e) => setSales((s) => ({ ...s, person: e.target.value }))} className={`${input} font-normal`} />
          </label>
          <label className={label}>
            Sales contact
            <input value={sales.contact} onChange={(e) => setSales((s) => ({ ...s, contact: e.target.value }))} dir="ltr" className={`${input} font-normal`} />
          </label>
          <label className={label}>
            Sales email
            <input value={sales.email} onChange={(e) => setSales((s) => ({ ...s, email: e.target.value }))} dir="ltr" className={`${input} font-normal`} />
          </label>
          <label className={`${label} sm:col-span-2 lg:col-span-4`}>
            Notes on the quotation (optional)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} placeholder="e.g. Prices ex-warehouse SAIF Zone. Offloading by client." className={`${input} font-normal`} />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">Payment, warranty and VAT terms print on page 2 from the 4U Terms &amp; Conditions sheet; delivery prints on page 1 from the field above.</p>
      </section>

      {state?.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800">{state.error}</p>}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="font-extrabold tabular-nums">Total AED {money(t.total)} <span className="text-sm font-normal text-muted">incl. {vatRate}% VAT · {items.length} item{items.length === 1 ? "" : "s"}</span></p>
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
