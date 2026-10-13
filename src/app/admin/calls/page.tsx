import Link from "next/link";
import { OwnerList, SalesForm } from "../sales-form";
import { trafficSource } from "@/lib/sales";
import { loadOwners } from "@/lib/sales-data";
import { getAdminClient } from "@/lib/supabase/server";
import { describePage } from "@/lib/wa-page";

type Call = {
  id: string;
  created_at: string;
  page: string | null;
  page_title: string | null;
  location: string | null;
  locale: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  status: string;
  deal_value: number | null;
  owner: string | null;
  lost_reason: string | null;
  notes: string | null;
};

const fmt = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
const when = (d: string) => new Date(d).toLocaleString("en-GB", { timeZone: "Asia/Dubai", weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminCalls() {
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured.</p>;

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data, error }, { data: month }, owners] = await Promise.all([
    sb.from("call_clicks").select("*").order("created_at", { ascending: false }).limit(300),
    sb.from("call_clicks").select("status, deal_value").gte("created_at", since).limit(5000),
    loadOwners(sb),
  ]);
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">Could not load call clicks: {error.message}. Apply supabase/migrations/20261014000000_sales_report.sql in Supabase if the table is missing.</p>;
  const list = (data ?? []) as Call[];
  const last30 = (month ?? []) as Pick<Call, "status" | "deal_value">[];
  const won = last30.filter((c) => c.status === "won");

  return (
    <div>
      <OwnerList owners={owners} />
      <h1 className="text-2xl font-extrabold">Call-button taps</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Every tap on a <b>Call</b> button on the website is listed here with the time and the page. A phone call cannot carry a code, so when a
        customer calls, find the tap at that time (Dubai time) and update it. A call that has no tap here (number dialled by hand) goes in{" "}
        <Link href="/admin" className="font-semibold text-brand-700 underline">Leads → Log an enquiry</Link>.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Taps (30d)", fmt(last30.length)],
          ["Handled (30d)", fmt(last30.filter((c) => c.status !== "new").length)],
          ["Won (30d)", fmt(won.length)],
          ["Won value AED (30d)", fmt(won.reduce((s, c) => s + (Number(c.deal_value) || 0), 0))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-navy-900 p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 text-3xl font-extrabold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-navy-900">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              {["Time (Dubai)", "Page / button", "Came from", "Status · value · owner · notes"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((c) => (
              <tr key={c.id} className={c.status === "new" ? "bg-brand-50/50" : undefined}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold">{when(c.created_at)}</td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate font-semibold">{describePage(c.page).title}</p>
                  <p className="truncate text-muted">
                    {c.page}
                    {c.location ? ` · ${c.location}` : ""}
                    {c.locale === "ar" ? " · Arabic" : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{trafficSource(c)}</p>
                  {c.utm_campaign && <p className="text-muted">{c.utm_campaign}</p>}
                </td>
                <td className="px-4 py-3">
                  <SalesForm table="call_clicks" row={c} />
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">No call-button taps yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
