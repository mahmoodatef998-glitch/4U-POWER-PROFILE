"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { brandModels, gensetModels, type GensetModel } from "@/lib/genset-models";
import { PRICE_LISTS, defaultOption, listRef, optionLabel, type PriceBook, type PriceListId, type PriceOption } from "@/lib/price-book";
import {
  COUNTRIES,
  CURRENCIES,
  DELIVERY_OPTIONS,
  FX_SOURCE,
  EXTRA_ITEMS,
  STATUSES,
  VAT_RATES,
  VOLTS_60,
  alternatorPhrase,
  amps,
  check60,
  checkLine,
  deliveryText,
  enclosureOptions,
  country,
  defaultHz,
  defaultVolts60,
  generatorItem,
  inCurrency,
  listPrice,
  money,
  ratingSearch,
  searchModels,
  sixtyHz,
  totals,
  withAlternator,
  type At60,
  type CountryId,
  type Currency,
  type Enclosure,
  type Hz,
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
  country: CountryId;
  currency: Currency;
  fx_rate: number;
  fx_at: string | null;
  discount_pct: number;
  vat_rate: number;
  items: QuoteItem[];
};

const SOURCE_60 = {
  baudouin: "Baudouin 60 Hz datasheet",
  lister: "Lister Petter 1800 rpm sheet",
  perkins: "Perkins power selector, 1800 rpm",
  cummins: "Cummins G-Drive ratings card, 60 Hz",
  kubota: "Kubota SQ generator, 60 Hz",
} as const;

/** Today's rates (AED per unit) from src/lib/fx.ts, for a currency picked in the editor. */
export type EditorFx = { EUR: number | null; USD: number; SAR: number; source: keyof typeof FX_SOURCE; at: string };
const fxTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" }) : "");

const input = "w-full rounded-lg border border-line px-3 py-2";
const label = "grid gap-1 text-sm font-semibold";
const money0 = (n: number) => n.toLocaleString("en", { maximumFractionDigits: 1 });

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

export function QuoteEditor({ initial, initialSearch = "", prices = null, fx = null }: { initial: EditorInitial; initialSearch?: string; prices?: PriceBook | null; fx?: EditorFx | null }) {
  const [customer, setCustomer] = useState(initial.customer);
  const [sales, setSales] = useState(initial.sales);
  const [quoteDate, setQuoteDate] = useState(initial.quote_date);
  const [validity, setValidity] = useState(initial.validity);
  const [delivery, setDelivery] = useState(initial.delivery);
  const [notes, setNotes] = useState(initial.notes);
  const [status, setStatus] = useState(initial.status);
  const [countryId, setCountryId] = useState<CountryId>(initial.country);
  const priceList = country(countryId).list;
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [fxRate, setFxRate] = useState(initial.fx_rate);
  const [fxAt, setFxAt] = useState(initial.fx_at);
  const [discountPct, setDiscountPct] = useState(initial.discount_pct);
  const [vatRate, setVatRate] = useState(initial.vat_rate);
  const [items, setItems] = useState<QuoteItem[]>(initial.items);
  const [q, setQ] = useState(initialSearch);
  const [state, action, pending] = useActionState<SaveState, FormData>(saveQuote, null);

  // what the price lists call each model ("CP1400", "KU-14 / 18", "KTA50G8"), so a search by list code finds it;
  // labels that are only a rating ("100 KVA") are left to the kVA search
  const listAliases = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const [code, lists] of Object.entries(prices?.models ?? {}))
      out[code] = [...new Set(Object.values(lists).flatMap((opts) => (opts ?? []).flatMap((o) => [o.listLabel, o.listEngine])))].filter((w) => !/^\d+(\.\d+)?\s*kva$/i.test(w));
    return out;
  }, [prices]);
  // a rating ("150", "cummins 1500") lists the closest models at or above it from every brand; anything else
  // (a code, an engine, a list code) is a text search
  const rating = useMemo(() => ratingSearch(q), [q]);
  const results = useMemo(() => rating?.hits ?? searchModels(q, gensetModels, 8, listAliases).map((m) => ({ m, gap: 0 })), [q, rating, listAliases]);
  // the price option each search result will be added with (default: the Leroy-Somer one, as on the datasheets)
  const [picked, setPicked] = useState<Record<string, string>>({});
  // frequency and 60 Hz voltage of the lines added next (a Saudi customer starts at 60 Hz), and 60 Hz ratings typed
  // in for sets with no 60 Hz datasheet on file
  const [hz, setHz] = useState<Hz>(() => defaultHz(initial.country));
  const [volts, setVolts] = useState(() => defaultVolts60(initial.country));
  const [typed60, setTyped60] = useState<Record<string, { prime: string; standby: string }>>({});
  const t = totals(items, vatRate, discountPct);
  // the same totals in the quotation's currency, as the PDF prints them
  const tc = inCurrency({ items, vat_rate: vatRate, discount_pct: discountPct, currency, fx_rate: fxRate });
  const todayRate = (c: Currency) => (c === "AED" ? 1 : (fx?.[c] ?? null));
  const pickCurrency = (c: Currency) => {
    setCurrency(c);
    setFxRate(todayRate(c) ?? 1);
    setFxAt(c === "AED" ? null : (fx?.at ?? null));
  };
  const payload = JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: quoteDate, status, customer, sales, validity, delivery, notes, price_list: priceList, country: countryId, currency, fx_rate: fxRate, fx_at: fxAt, discount_pct: discountPct, vat_rate: vatRate, items });
  // what was last saved (or the empty form): anything else is an unsaved change
  const [savedPayload] = useState(() =>
    JSON.stringify({ id: initial.id, lead_id: initial.lead_id, quote_date: initial.quote_date, status: initial.status, customer: initial.customer, sales: initial.sales, validity: initial.validity, delivery: initial.delivery, notes: initial.notes, price_list: initial.price_list, country: initial.country, currency: initial.currency, fx_rate: initial.fx_rate, fx_at: initial.fx_at, discount_pct: initial.discount_pct, vat_rate: initial.vat_rate, items: initial.items }),
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
  // a set at 60 Hz: its datasheet ratings, or the typed-in ones; `problem` blocks adding when there is no `at`
  const at60For = (m: GensetModel): { at?: At60; problem?: string } => {
    const s = sixtyHz(m);
    if (s.kind === "fifty-only") return { problem: s.reason };
    if (s.kind === "datasheet") return { at: { prime: s.rating.prime, standby: s.rating.standby, volts, ratedVolts: s.rating.volts, engine: s.rating.engine } };
    const t = typed60[m.code];
    const prime = Number(t?.prime) || 0;
    const standby = t?.standby ? Number(t.standby) : null;
    const problem = check60(m, prime, standby) ?? undefined;
    return { at: prime > 0 && !(standby != null && standby < prime) ? { prime, standby, volts } : undefined, problem };
  };
  const addGenerator = (m: GensetModel, enclosure: Enclosure, key?: string) => {
    const opts = optionsFor(m.code);
    const opt = opts?.find((o) => o.key === key) ?? defaultOption(opts);
    const at60 = hz === 60 ? at60For(m).at : undefined;
    if (hz === 60 && !at60) return;
    if (hz === 50 && m.ratedHz === 60) return;
    const item = generatorItem(m, enclosure, opt?.alternator, at60);
    setItems((list) => [...list, opt ? { ...item, unit_price: listPrice(opt.aed), price_key: opt.key } : item]);
    setQ("");
  };
  // a line still on its list price (for this customer country)
  const onList = (it: QuoteItem, o: PriceOption) => o.key === it.price_key && listPrice(o.aed) === it.unit_price;
  // switching country re-prices the lines that came from the list (typed-in prices stay) and sets its usual VAT
  const switchCountry = (id: CountryId) => {
    const c = country(id);
    setCountryId(id);
    setVatRate(c.vat);
    setHz(defaultHz(id));
    setVolts(defaultVolts60(id));
    setItems((list) =>
      list.map((it) => {
        const opt = it.price_key ? optionsFor(it.code, c.list)?.find((o) => o.key === it.price_key) : undefined;
        return opt ? { ...it, unit_price: listPrice(opt.aed) } : it;
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
        <p className="mt-1 text-sm text-muted">Type the model code (4U-P500, p500), the kVA (500) or the engine. The standard description is filled in from the datasheet and the price from the price list.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="country" className="font-semibold">Customer in</label>
          <select id="country" value={countryId} onChange={(e) => switchCountry(e.target.value as CountryId)} className="rounded-lg border border-line px-3 py-1.5 font-semibold">
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <span className="text-xs text-muted">
            {listLabel}{prices ? ` ${prices.edition}` : ""} · VAT {country(countryId).vat}%.{" "}
            {prices ? "Switching re-prices the lines taken from the list and sets the VAT." : "No price list loaded yet: type the prices."}
            {prices?.gbpSource ? ` Perkins (GBP) at 1 GBP = ${prices.gbpRate} AED, ${FX_SOURCE[prices.gbpSource]}${prices.gbpAt ? ` ${fxTime(prices.gbpAt)}` : ""}.` : ""}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">Frequency</span>
          <span role="radiogroup" aria-label="Frequency" className="inline-flex overflow-hidden rounded-lg border border-line">
            {([50, 60] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={hz === f}
                onClick={() => setHz(f)}
                className={`px-3 py-1.5 font-semibold ${hz === f ? "bg-navy-950 text-white" : "text-muted hover:text-ink"}`}
              >
                {f} Hz · {f === 50 ? 1500 : 1800} rpm
              </button>
            ))}
          </span>
          {hz === 60 && (
            <>
              <label htmlFor="volts" className="ms-2 font-semibold">Voltage</label>
              <select id="volts" value={volts} onChange={(e) => setVolts(e.target.value)} className="rounded-lg border border-line px-3 py-1.5 font-semibold">
                {VOLTS_60.map((v) => (
                  <option key={v} value={v}>{v} V</option>
                ))}
              </select>
            </>
          )}
          <span className="text-xs text-muted">
            {hz === 60
              ? "For the lines you add next. Same price as 50 Hz. 60 Hz ratings from the datasheets that give them; for other sets type the supplier's 60 Hz figures."
              : "For the lines you add next: 50 Hz, 1500 rpm, 400/230 V."}
          </span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder="Search all datasheets: 4U-P500, 500, Cummins 200…"
          aria-label="Search generator models"
          className={`${input} mt-4 text-base`}
          autoFocus={!initial.id}
        />
        {q.trim() && (
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
            {rating && results.length > 0 && (
              <li className={`px-4 py-2 text-sm font-semibold ${rating.exact ? "bg-surface text-muted" : "bg-amber-50 text-amber-800"}`}>
                {rating.exact ? `${rating.kva} kVA prime` : `No ${rating.kva} kVA prime model`}: exact first, then within ±10 kVA. Engine and alternator origin as on the {listLabel} (not printed on the quotation).
              </li>
            )}
            {results.map(({ m, gap }) => {
              // cheapest first, so the choice is made on origin and price
              const opts = [...(optionsFor(m.code) ?? [])].sort((a, b) => a.aed - b.aed);
              const chosen = opts.find((o) => o.key === picked[m.code]) ?? defaultOption(optionsFor(m.code));
              const s60 = hz === 60 ? sixtyHz(m) : null;
              const a60 = hz === 60 ? at60For(m) : null;
              return (
              <li key={m.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-bold">
                    {m.code} <span className="font-normal text-muted">· {m.brand} {m.engine}</span>
                    {gap !== 0 && <span className="ms-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">{gap > 0 ? "+" : "−"}{Math.abs(gap)} kVA</span>}
                  </p>
                  <p className="text-sm text-muted">
                    {hz === 60 && !m.ratedHz && "50 Hz: "}{m.ratedHz === 60 && "60 Hz: "}{m.primeKva} kVA prime · {m.standbyKva} kVA standby{hz === 50 && m.fuelLph ? ` · ${m.fuelLph.p75} L/h @ 75%` : ""}
                  </p>
                  {s60?.kind === "datasheet" && (
                    <p className="text-sm font-semibold text-ink">
                      60 Hz: {s60.rating.prime} kVA prime · {s60.rating.standby} kVA standby{s60.rating.volts ? ` (rated at ${s60.rating.volts} V)` : ""} · {amps(s60.rating.prime, volts)} A at {volts} V
                      <span className="font-normal text-muted"> · {SOURCE_60[s60.rating.source]}{s60.rating.engine ? ` · 60 Hz engine build ${s60.rating.engine}` : ""}</span>
                      {s60.rating.volts && s60.rating.volts !== volts && <span className="block text-xs font-normal text-amber-700">Rated at {s60.rating.volts} V: confirm the {volts} V output with the customer.</span>}
                    </p>
                  )}
                  {s60?.kind === "fifty-only" && <p className="text-sm font-semibold text-red-700">{s60.reason}</p>}
                  {hz === 50 && m.ratedHz === 60 && <p className="text-sm font-semibold text-red-700">60 Hz build only ({m.brand} rates this engine at 1800 rpm) — switch the quotation to 60 Hz.</p>}
                  {s60?.kind === "manual" && (
                    <div className="mt-1 flex flex-wrap items-end gap-2 text-xs">
                      <span className="w-full font-semibold text-amber-700">No 60 Hz datasheet on file: type the supplier&apos;s 60 Hz figures.</span>
                      {(["prime", "standby"] as const).map((k) => (
                        <label key={k} className="grid gap-0.5 font-semibold text-muted">
                          60 Hz {k} kVA
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={typed60[m.code]?.[k] ?? ""}
                            onChange={(e) => setTyped60((t) => ({ ...t, [m.code]: { prime: t[m.code]?.prime ?? "", standby: t[m.code]?.standby ?? "", [k]: e.target.value } }))}
                            placeholder={k === "standby" ? "optional" : ""}
                            className="w-24 rounded-lg border border-line px-2 py-1 text-sm font-semibold text-ink"
                          />
                        </label>
                      ))}
                      {a60?.at && <span className="pb-1.5 font-semibold text-ink">{amps(a60.at.prime, volts)} A at {volts} V</span>}
                      {a60?.problem && <span className="w-full text-amber-700">{a60.problem}</span>}
                    </div>
                  )}
                  {prices && !opts.length && <p className="text-sm font-semibold text-amber-700">Not on the {listLabel}: type the price</p>}
                  {opts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${m.code} price options`}>
                      {opts.map((o) => (
                        <button
                          key={o.key}
                          type="button"
                          role="radio"
                          aria-checked={o === chosen}
                          onClick={() => setPicked((p) => ({ ...p, [m.code]: o.key }))}
                          title={listRef(o)}
                          className={`rounded-lg border px-2.5 py-1 text-start text-xs ${o === chosen ? "border-brand-600 bg-brand-50 font-bold text-ink" : "border-line text-muted hover:border-ink"}`}
                        >
                          {optionLabel(o)} · AED {money(listPrice(o.aed))}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {enclosureOptions(m).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      disabled={(hz === 60 && !a60?.at) || (hz === 50 && m.ratedHz === 60)}
                      onClick={() => addGenerator(m, o.value, chosen?.key)}
                      className="rounded-lg bg-navy-950 px-3 py-1.5 text-sm font-bold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      + {o.label}
                    </button>
                  ))}
                </div>
              </li>
              );
            })}
            {!results.length && <li className="px-4 py-3 text-sm text-muted">No model matches “{q}”{rating ? ` (no prime rating within ±10 kVA of ${rating.kva})` : ""}. Models: {(["Perkins", "Cummins", "Kubota", "Baudouin", "Lister Petter"] as const).map((b) => `${b} ${brandModels(b).length}`).join(" · ")}</li>}
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
              {(() => {
                const chk = checkLine(it);
                if (!chk) return null;
                const bad = chk.sixtyOnlyAt50 != null || chk.otherEngine;
                const kva = (p: number, sb: number | null) => `${money0(p)}${sb != null ? ` / ${money0(sb)}` : ""} kVA`;
                return (
                  <div className={`mt-3 rounded-lg border px-3 py-2.5 text-sm ${bad ? "border-red-300 bg-red-50 text-red-800" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
                    <p className="font-bold">This line does not match today&apos;s {chk.model.code} datasheet</p>
                    <ul className="mt-1 list-disc space-y-0.5 ps-5">
                      {chk.oldCode && <li>Written as {chk.oldCode}; the model is now {chk.model.code} (codes follow the prime kVA since 1 Nov).</li>}
                      {chk.ratingsDiffer && chk.quoted && chk.current && (
                        <li>Quoted {kva(chk.quoted.prime, chk.quoted.standby)} (prime / standby) at {chk.quoted.hz} Hz; the datasheet gives {kva(chk.current.prime, chk.current.standby)}.</li>
                      )}
                      {chk.sixtyOnlyAt50 != null && (
                        <li>
                          {chk.model.brand} rates the {chk.model.engine} at 60 Hz (1800 rpm) only, so no 50 Hz datasheet matches this line.
                          {chk.sixtyOnlyAt50 ? ` For a 50 Hz site quote ${chk.sixtyOnlyAt50} instead (search it above); for a 60 Hz site make it a 60 Hz line.` : " For a 60 Hz site make it a 60 Hz line."}
                        </li>
                      )}
                      {chk.otherEngine && <li>The engine in the text is not the {chk.model.code} engine ({chk.model.engine}): no datasheet matches it. Replace the line with the right model.</li>}
                    </ul>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chk.refreshed && (
                        <button type="button" onClick={() => update(i, chk.refreshed!)} className="rounded-lg bg-[#141518] px-3 py-1.5 text-xs font-bold text-[#fff] hover:bg-black">
                          Update title &amp; description to the datasheet
                        </button>
                      )}
                      {chk.refreshed60 && (
                        <button type="button" onClick={() => update(i, chk.refreshed60!)} className="rounded-lg bg-[#141518] px-3 py-1.5 text-xs font-bold text-[#fff] hover:bg-black">
                          Make it a 60 Hz line ({chk.model.code} datasheet)
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs opacity-80">Price and quantity stay as they are; check the price if the rating changes.</p>
                  </div>
                );
              })()}
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
                    value={it.price_key && opts.some((o) => onList(it, o)) ? it.price_key : ""}
                    onChange={(e) => {
                      const o = opts.find((x) => x.key === e.target.value);
                      const m = gensetModels.find((x) => x.code === it.code);
                      // the description names the alternator of the chosen option (Leroy-Somer frame or 4U Power)
                      update(i, o ? { unit_price: listPrice(o.aed), price_key: o.key, ...(m && { description: withAlternator(it.description, alternatorPhrase(m, o.alternator)) }) } : { price_key: undefined });
                    }}
                    className={`${input} font-normal`}
                  >
                    <option value="">Own price (typed in above)</option>
                    {opts.map((o) => (
                      <option key={o.key} value={o.key}>
                        {optionLabel(o)} · AED {money(listPrice(o.aed))}{o.currency === "GBP" ? ` (£${money(o.price)})` : ""} · {listRef(o)}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const cur = opts.find((o) => onList(it, o));
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
          {currency !== "AED" && (
            <div className="flex justify-between rounded-lg bg-surface px-2 py-1 text-base font-extrabold">
              <dt>On the quotation</dt>
              <dd>{currency} {money(tc.total)}</dd>
            </div>
          )}
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
          <label className={label}>
            Currency
            <select value={currency} onChange={(e) => pickCurrency(e.target.value as Currency)} className={`${input} font-normal`}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c} disabled={todayRate(c) === null && c !== currency}>
                  {c === "AED" ? "AED (UAE dirham)" : c === "USD" ? "USD (US dollar)" : c === "EUR" ? "EUR (euro)" : "SAR (Saudi riyal)"}
                </option>
              ))}
            </select>
          </label>
          {currency !== "AED" && (
            <div className="grid gap-1 rounded-lg bg-surface p-3 text-xs sm:col-span-2">
              <p>
                <span className="font-semibold">1 {currency} = {fxRate} AED</span>
                {fxAt ? ` · rate of ${fxTime(fxAt)}` : ""} · prices are entered in AED and printed in {currency}.
              </p>
              {todayRate(currency) !== null && todayRate(currency) !== fxRate && (
                <p>
                  Today: 1 {currency} = {todayRate(currency)} AED ({fx ? FX_SOURCE[fx.source] : ""}).{" "}
                  <button type="button" onClick={() => pickCurrency(currency)} className="font-bold text-brand-700 underline">
                    Use today&apos;s rate
                  </button>
                </p>
              )}
            </div>
          )}
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
          <p className="font-extrabold tabular-nums">
            Total AED {money(t.total)}
            {currency !== "AED" && ` · ${currency} ${money(tc.total)}`} <span className="text-sm font-normal text-muted">incl. {vatRate}% VAT · {items.length} item{items.length === 1 ? "" : "s"}</span>
          </p>
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
