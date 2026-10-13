import Link from "next/link";
import type { ReactNode } from "react";
import { googleConfigured, gscRows, gscSite, safe } from "@/lib/google";
import { classify, KIND_LABEL, popularSearches, type Opportunity, type OpportunityKind } from "@/lib/seo-opportunities";
import { SITE_URL } from "@/lib/site";

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
const fmt = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 1 }).format(n);
const RANGES = [28, 90] as const;

const SECTIONS: { kind: OpportunityKind; note: string }[] = [
  { kind: "quick_win", note: "Positions 4–20: one push away from the first page. Strengthen the page shown — title, heading, a short answer or FAQ, and links to it from related pages." },
  { kind: "gap", note: "People search this and we rank only with a generic page, or very low. Each one is an article or page to write." },
  { kind: "push", note: "Positions 20–50: Google knows the page but it needs depth and links." },
  { kind: "winner", note: "Already on page 1 and bringing clicks — keep these pages current." },
];

function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-navy-900 p-5">
      <h2 className="font-bold">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: Opportunity[] }) {
  if (!rows.length) return <p className="text-sm text-muted">None right now.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="text-xs uppercase text-muted">
          <tr>
            <th className="py-2 text-start">Search</th>
            <th className="py-2 text-start">Page Google shows</th>
            <th className="py-2 text-end">Position</th>
            <th className="py-2 text-end">Shown</th>
            <th className="py-2 text-end">Clicks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((o) => (
            <tr key={o.query}>
              <td className="py-2 pe-4 font-semibold" dir={o.locale === "ar" ? "rtl" : "ltr"}>{o.query}</td>
              <td className="max-w-xs truncate py-2 pe-4">
                <a href={`${SITE_URL}${o.page}`} target="_blank" rel="noopener" className="text-brand-700 hover:underline" title={o.page}>{safeDecode(o.page)}</a>
              </td>
              <td className="py-2 text-end tabular-nums">{fmt(o.position)}</td>
              <td className="py-2 text-end tabular-nums">{fmt(o.impressions)}</td>
              <td className="py-2 text-end tabular-nums">{fmt(o.clicks)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminSeo({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const q = await searchParams;
  const days = RANGES.find((d) => String(d) === q.days) ?? 28;
  if (!googleConfigured()) {
    return <p className="rounded-xl bg-brand-50 p-4">Connect Google Search Console first (see the Visitors page).</p>;
  }
  const res = await safe(gscRows(days, 5000));
  const rows = res.data ?? [];
  const ops = classify(rows);
  const count = (k: OpportunityKind) => ops.filter((o) => o.kind === k).length;
  const blockEn = popularSearches(rows, "en");
  const blockAr = popularSearches(rows, "ar");

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">SEO opportunities</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted">
            Real Google searches about our products ({gscSite()}, last {days} days — Google publishes the data 2–3 days late), sorted by what is closest
            to bringing customers. Searches for the company name and job/second-hand searches are left out. Updated automatically.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {RANGES.map((d) => (
            <Link key={d} href={`/admin/seo?days=${d}`} className={`rounded-full px-3 py-1.5 font-semibold ${d === days ? "bg-navy-950 text-white" : "border border-line"}`}>
              {d} days
            </Link>
          ))}
          <a href={`/admin/seo/export?days=${days}`} className="rounded-full border border-line px-3 py-1.5 font-bold hover:border-brand-400">Download CSV</a>
        </div>
      </div>
      {res.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not load Search Console: {res.error}</p>}

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map(({ kind }) => (
          <div key={kind} className="rounded-2xl border border-line bg-navy-900 p-5">
            <dt className="text-sm text-muted">{KIND_LABEL[kind]}</dt>
            <dd className="mt-1 text-3xl font-extrabold">{count(kind)}</dd>
          </div>
        ))}
      </dl>

      {SECTIONS.map(({ kind, note }) => (
        <Panel key={kind} title={KIND_LABEL[kind]} note={note}>
          <Table rows={ops.filter((o) => o.kind === kind).slice(0, 50)} />
        </Panel>
      ))}

      <Panel
        title="“Popular searches” links on the site"
        note="Shown automatically on the Generators, Products and Models pages: real searches that already find a specific page, linked to that page. Refreshed daily."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {([["English", blockEn], ["العربية", blockAr]] as const).map(([lang, list]) => (
            <div key={lang}>
              <p className="text-xs font-bold uppercase text-muted">{lang}</p>
              {list.length ? (
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {list.map((p) => (
                    <li key={p.href + p.label} className="rounded-full border border-line px-3 py-1">{p.label} → <span className="text-muted">{p.href}</span></li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">Not enough search data yet — the block stays hidden until there is.</p>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
