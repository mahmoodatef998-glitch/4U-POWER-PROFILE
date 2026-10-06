import { updateWaClick } from "../actions";
import { getAdminClient } from "@/lib/supabase/server";

type Click = {
  id: string;
  ref: string;
  created_at: string;
  page: string | null;
  location: string | null;
  locale: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  status: string;
  deal_value: number | null;
  notes: string | null;
};

const fmt = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
const when = (d: string) => new Date(d).toLocaleString("en-GB", { timeZone: "Asia/Dubai", dateStyle: "short", timeStyle: "short" });

/** Channel label: Google Ads click id wins, then UTM source, then the referring site, else direct. */
function channel(c: Click) {
  if (c.gclid) return "Google Ads";
  if (c.utm_source) return [c.utm_source, c.utm_medium].filter(Boolean).join(" / ");
  if (c.referrer) {
    try {
      const host = new URL(c.referrer).hostname.replace(/^www\./, "");
      if (!host.includes("4ugenerators")) return host;
    } catch {
      /* ignore */
    }
  }
  return "direct / organic";
}

function top(rows: Click[], key: (c: Click) => string, n = 8) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default async function AdminWhatsApp({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured.</p>;
  const q = ((await searchParams).q ?? "").trim().toUpperCase();

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  let query = sb.from("whatsapp_clicks").select("*").order("created_at", { ascending: false }).limit(300);
  if (q) query = query.ilike("ref", `%${q.replace(/[^A-Z0-9-]/g, "")}%`);
  const [{ data }, { data: month }] = await Promise.all([query, sb.from("whatsapp_clicks").select("*").gte("created_at", since).limit(5000)]);
  const list = (data ?? []) as Click[];
  const last30 = (month ?? []) as Click[];
  const won = last30.filter((c) => c.status === "won");
  const revenue = won.reduce((s, c) => s + (Number(c.deal_value) || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">WhatsApp clicks</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Every WhatsApp message sent from the website ends with a code like <b>Ref: 4U-7K2PX</b>. Search the code to see which page and
        campaign the chat came from, then update the status and deal value as the sale progresses.
      </p>

      <form className="mt-6 flex max-w-md gap-2">
        <input name="q" defaultValue={q} placeholder="Search ref, e.g. 4U-7K2PX" className="flex-1 rounded-xl border border-line bg-white px-4 py-2 uppercase" />
        <button className="rounded-xl bg-navy-950 px-4 py-2 font-bold text-white">Search</button>
      </form>

      <dl className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Clicks (30d)", fmt(last30.length)],
          ["Quoted (30d)", fmt(last30.filter((c) => c.status === "quoted").length)],
          ["Won (30d)", fmt(won.length)],
          ["Won value AED (30d)", fmt(revenue)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-navy-900 p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 text-3xl font-extrabold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {[
          ["Top pages (30d)", top(last30, (c) => c.page ?? "—")],
          ["Top channels (30d)", top(last30, channel)],
        ].map(([title, rows]) => (
          <div key={title as string} className="rounded-2xl border border-line bg-navy-900 p-5">
            <h2 className="text-sm font-bold text-muted">{title as string}</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {(rows as [string, number][]).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="truncate">{k}</span>
                  <b>{v}</b>
                </li>
              ))}
              {!(rows as unknown[]).length && <li className="text-muted">No data yet.</li>}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-navy-900">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              {["Date", "Ref", "Page / button", "Channel / campaign", "Status · value AED · notes"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((c) => (
              <tr key={c.id} className={c.status === "new" ? "bg-brand-50/50" : undefined}>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{when(c.created_at)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono font-bold">{c.ref}</td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate">{c.page}</p>
                  {c.location && <p className="text-muted">{c.location}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{channel(c)}</p>
                  {c.utm_campaign && <p className="text-muted">{c.utm_campaign}</p>}
                </td>
                <td className="px-4 py-3">
                  <form action={updateWaClick} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <select name="status" defaultValue={c.status} className="rounded-lg border border-line px-2 py-1">
                      {["new", "contacted", "quoted", "won", "lost"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <input name="deal_value" type="number" min="0" step="1" defaultValue={c.deal_value ?? ""} placeholder="AED" className="w-28 rounded-lg border border-line px-2 py-1" />
                    <input name="notes" defaultValue={c.notes ?? ""} placeholder="Notes" className="w-44 rounded-lg border border-line px-2 py-1" />
                    <button className="rounded-lg bg-navy-950 px-3 py-1 font-bold text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">{q ? "No click with that reference." : "No WhatsApp clicks yet."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
