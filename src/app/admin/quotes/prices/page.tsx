import Link from "next/link";
import { brandModels } from "@/lib/genset-models";
import { PRICE_LISTS, defaultOption, listRef, optionLabel } from "@/lib/price-book";
import { loadPriceBook, priceRows } from "@/lib/price-book-data";
import { money } from "@/lib/quote";
import { setGbpRate } from "./actions";

const BRANDS = ["Perkins", "Cummins", "Kubota", "Baudouin"] as const;

/** Which 4U model gets which list price, to check the price lists against the datasheets. */
export default async function PricesPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const [book, rows, { msg }] = await Promise.all([loadPriceBook(), priceRows(), searchParams]);
  const unlinked = rows.filter((r) => r.list === "uae" && !r.model_codes.length);
  return (
    <div className="grid gap-6">
      <div>
        <Link href="/admin/quotes" className="text-sm font-semibold text-muted hover:text-ink">← Quotations</Link>
        <h1 className="mt-1 text-2xl font-extrabold">Price lists{book ? ` ${book.edition}` : ""}</h1>
        <p className="mt-1 text-sm text-muted">
          UAE and Export consumer prices, kept in the private database (not on the website or in the code). A new generator line on a quotation starts at its list price; the price can still be changed per quotation.
        </p>
      </div>
      {msg && <p className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{msg}</p>}
      {!book ? (
        <p className="rounded-xl bg-amber-50 p-4 font-semibold text-amber-900">No price list loaded yet.</p>
      ) : (
        <>
          <form action={setGbpRate} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-navy-900 p-5 text-sm">
            <label className="grid gap-1 font-semibold">
              Perkins list is in pounds: 1 GBP =
              <span className="flex items-center gap-2">
                <input name="rate" type="number" step="0.0001" min="1" max="20" defaultValue={book.gbpRate} className="w-28 rounded-lg border border-line px-3 py-2" /> AED
              </span>
            </label>
            <button className="rounded-lg bg-navy-950 px-4 py-2 font-bold text-white">Save rate</button>
            <p className="basis-full text-xs text-muted">New Perkins lines use this rate. Saved quotations keep their prices.</p>
          </form>

          {BRANDS.map((brand) => {
            const models = brandModels(brand);
            const priced = models.filter((m) => book.models[m.code]).length;
            return (
              <details key={brand} className="rounded-2xl border border-line bg-navy-900" open={brand === "Perkins"}>
                <summary className="cursor-pointer p-5 font-extrabold">
                  {brand} · {priced} of {models.length} models priced
                </summary>
                <div className="overflow-x-auto border-t border-line">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-surface text-xs uppercase text-muted">
                      <tr>
                        <th className="px-4 py-2">Model</th>
                        <th className="px-4 py-2">Engine</th>
                        {PRICE_LISTS.map((l) => (
                          <th key={l.id} className="px-4 py-2 text-end">{l.label} (AED)</th>
                        ))}
                        <th className="px-4 py-2">Default alternator · other options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {models.map((m) => {
                        const lists = book.models[m.code];
                        const uae = lists?.uae ?? [];
                        const first = defaultOption(uae);
                        return (
                          <tr key={m.code} className={lists ? "" : "bg-amber-50/60"}>
                            <td className="whitespace-nowrap px-4 py-2 font-bold">{m.code} <span className="font-normal text-muted">{m.standbyKva}/{m.primeKva} kVA</span></td>
                            <td className="whitespace-nowrap px-4 py-2 text-muted">{m.engine}</td>
                            {PRICE_LISTS.map((l) => {
                              const o = defaultOption(lists?.[l.id]);
                              return (
                                <td key={l.id} className="whitespace-nowrap px-4 py-2 text-end font-semibold tabular-nums">
                                  {o ? money(o.aed) : <span className="text-amber-700">not on list</span>}
                                  {o?.currency === "GBP" && <span className="block text-xs font-normal text-muted">£{money(o.price)}</span>}
                                </td>
                              );
                            })}
                            <td className="px-4 py-2 text-xs text-muted">
                              {first ? `${optionLabel(first)} · ${listRef(first)}` : "Type the price on the quotation"}
                              {uae.length > 1 && <span className="block">+ {uae.filter((o) => o !== first).map((o) => `${optionLabel(o)} ${money(o.aed)}`).join(" · ")}</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}

          {unlinked.length > 0 && (
            <details className="rounded-2xl border border-line bg-navy-900">
              <summary className="cursor-pointer p-5 font-extrabold">On the price list, no 4U datasheet yet · {unlinked.length}</summary>
              <ul className="grid gap-1 border-t border-line p-5 text-sm sm:grid-cols-2">
                {unlinked.map((r, i) => (
                  <li key={i}>
                    <span className="font-semibold">{r.brand} {r.label}</span> <span className="text-muted">{r.engine} · {optionLabel(r)} · {r.currency === "GBP" ? "£" : "AED "}{money(r.price)}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}
