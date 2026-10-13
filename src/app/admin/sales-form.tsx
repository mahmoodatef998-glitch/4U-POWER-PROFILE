import { LOST_REASON_KEYS, LOST_REASONS, STATUSES, type SalesTable } from "@/lib/sales";
import { updateSales } from "./actions";

export const OWNERS_LIST_ID = "sales-owners";

/** Render once per page: suggestions for the owner field so names stay consistent. */
export function OwnerList({ owners }: { owners: string[] }) {
  return (
    <datalist id={OWNERS_LIST_ID}>
      {owners.map((o) => (
        <option key={o} value={o} />
      ))}
    </datalist>
  );
}

type Row = { id: string; status: string; deal_value: number | null; owner?: string | null; lost_reason?: string | null; notes?: string | null };

const field = "rounded-lg border border-line px-2 py-1";

/** Status · value · owner · lost reason (only when "lost" is picked — pure CSS) · notes. */
export function SalesForm({ table, row }: { table: SalesTable; row: Row }) {
  // React resets a form after its action runs, but a <select> keeps the default it mounted with —
  // a key over the saved values remounts the form so it always shows what is stored.
  const saved = [row.id, row.status, row.deal_value, row.owner, row.lost_reason, row.notes].join("|");
  return (
    <form key={saved} action={updateSales} className="group flex flex-wrap items-center gap-2">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={row.id} />
      <select name="status" defaultValue={row.status} aria-label="Status" className={field}>
        {STATUSES.map((s) => (
          // explicit value: the lost-reason picker is revealed by CSS matching option[value=lost]
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input name="deal_value" type="number" min="0" step="1" defaultValue={row.deal_value ?? ""} placeholder="AED" aria-label="Deal value AED" className={`${field} w-24`} />
      <input name="owner" list={OWNERS_LIST_ID} defaultValue={row.owner ?? ""} placeholder="Sales owner" aria-label="Sales owner" maxLength={60} className={`${field} w-32`} />
      <select
        name="lost_reason"
        defaultValue={row.lost_reason ?? ""}
        aria-label="Lost reason"
        className={`${field} hidden max-w-56 border-red-300 group-has-[option[value=lost]:checked]:block`}
      >
        <option value="">Why lost? · سبب الخسارة</option>
        {LOST_REASON_KEYS.map((k) => (
          <option key={k} value={k}>
            {LOST_REASONS[k]}
          </option>
        ))}
      </select>
      <input name="notes" defaultValue={row.notes ?? ""} placeholder="Notes" aria-label="Notes" maxLength={1000} className={`${field} w-40`} />
      <button className="rounded-lg bg-navy-950 px-3 py-1 font-bold text-white">Save</button>
    </form>
  );
}
