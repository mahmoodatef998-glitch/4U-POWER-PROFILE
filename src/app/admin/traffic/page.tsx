import { gaActiveNow, gaConfigured, gaDaily, gaTop, gaTotals, googleConfigured, gscQuery, gscSite, safe } from "@/lib/google";

const fmt = (n: number, d = 0) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: d }).format(n);
const pct = (n: number) => `${fmt(n * 100, 1)}%`;

const CHANNELS: Record<string, string> = {
  "Organic Search": "Google / Bing search",
  Direct: "Direct (typed / bookmark / WhatsApp)",
  "Organic Social": "Social media",
  Referral: "Other websites",
  "Paid Search": "Google Ads",
  "Paid Social": "Social media ads",
  "Cross-network": "Google Ads (Performance Max)",
  Unassigned: "Unknown (no source recorded)",
};

const UNKNOWN = (k: string) => (!k || k === "(not set)" ? "Unknown" : k);

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-900 p-5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-extrabold">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Panel({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="rounded-2xl border border-line bg-navy-900 p-5">
      <h2 className="font-bold">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Problem({ error }: { error: string | null }) {
  return error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not load: {error}</p> : null;
}

function Setup() {
  return (
    <div className="rounded-2xl border border-line bg-navy-900 p-6 text-sm leading-7">
      <h2 className="text-lg font-bold">Connect Google Analytics &amp; Search Console</h2>
      <ol className="mt-3 list-decimal space-y-1 ps-5">
        <li>Google Cloud console → create a project → enable <b>Google Analytics Data API</b> and <b>Google Search Console API</b>.</li>
        <li>IAM → Service accounts → create one → Keys → Add key → JSON (downloads a file).</li>
        <li>Google Analytics → Admin → Property access management → add the service-account email as <b>Viewer</b>. Copy the numeric <b>Property ID</b> (Admin → Property details).</li>
        <li>Search Console → Settings → Users and permissions → add the same email as <b>Restricted</b> user.</li>
        <li>
          Vercel → Environment Variables: <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> = the whole JSON file (Secret), <code>GA4_PROPERTY_ID</code> = the number (Config). Redeploy.
        </li>
      </ol>
    </div>
  );
}

export default async function AdminTraffic() {
  if (!googleConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Visitors &amp; search</h1>
        <div className="mt-6">
          <Setup />
        </div>
      </div>
    );
  }

  const ga = gaConfigured();
  const [now, today, week, month, daily, pages, channels, countries, gscTotals, queries, gscPages] = await Promise.all([
    ga ? safe(gaActiveNow()) : null,
    ga ? safe(gaTotals("today")) : null,
    ga ? safe(gaTotals("6daysAgo")) : null,
    ga ? safe(gaTotals("29daysAgo")) : null,
    ga ? safe(gaDaily(14)) : null,
    ga ? safe(gaTop("pagePath")) : null,
    ga ? safe(gaTop("sessionDefaultChannelGroup", 8)) : null,
    ga ? safe(gaTop("country", 8)) : null,
    safe(gscQuery()),
    safe(gscQuery("query", 30)),
    safe(gscQuery("page", 10)),
  ]);
  const max = Math.max(1, ...(daily?.data ?? []).map((d) => d.users));
  const gsc = gscTotals.data?.[0];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-extrabold">Visitors &amp; search</h1>
        <p className="mt-1 text-sm text-muted">Google Analytics (visitors on the site) and Google Search Console (how often the site appears in Google results).</p>
      </div>

      {ga ? (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="On the site now" value={now?.data != null ? fmt(now.data) : "—"} hint="last 30 minutes" />
            <Stat label="Visitors today" value={today?.data ? fmt(today.data.users) : "—"} hint={today?.data ? `${fmt(today.data.views)} page views` : undefined} />
            <Stat label="Visitors (7 days)" value={week?.data ? fmt(week.data.users) : "—"} hint={week?.data ? `${fmt(week.data.views)} page views` : undefined} />
            <Stat label="Visitors (30 days)" value={month?.data ? fmt(month.data.users) : "—"} hint={month?.data ? `${fmt(month.data.sessions)} visits` : undefined} />
          </dl>
          <Problem error={today?.error ?? null} />

          <Panel title="Visitors per day (14 days)">
            <ul className="grid gap-1.5 text-sm">
              {(daily?.data ?? []).map((d) => (
                <li key={d.date} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-3">
                  <span className="text-muted">{`${d.date.slice(6, 8)}/${d.date.slice(4, 6)}`}</span>
                  <span className="h-3 rounded-full bg-brand-400" style={{ width: `${Math.max(2, (d.users / max) * 100)}%` }} />
                  <b className="text-end">{fmt(d.users)}</b>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Where visitors come from (30d)">
              <List rows={(channels?.data ?? []).map((r) => [CHANNELS[r.key] ?? r.key, fmt(r.users)])} />
            </Panel>
            <Panel title="Top pages (30d)">
              <List rows={(pages?.data ?? []).map((r) => [r.key, fmt(r.users)])} />
            </Panel>
            <Panel title="Countries (30d)">
              <List rows={(countries?.data ?? []).map((r) => [UNKNOWN(r.key), fmt(r.users)])} />
            </Panel>
          </div>
        </>
      ) : (
        <p className="rounded-xl bg-brand-50 p-4 text-sm">Set GA4_PROPERTY_ID to show visitor numbers.</p>
      )}

      <div>
        <h2 className="text-xl font-extrabold">Google search (last 28 days)</h2>
        <p className="mt-1 text-sm text-muted">Search Console data for {gscSite()} — Google publishes it with a 2–3 day delay.</p>
      </div>
      <Problem error={gscTotals.error} />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Times shown in Google" value={gsc ? fmt(gsc.impressions) : "—"} hint="impressions" />
        <Stat label="Clicks from Google" value={gsc ? fmt(gsc.clicks) : "—"} />
        <Stat label="Click rate" value={gsc ? pct(gsc.ctr) : "—"} hint="CTR" />
        <Stat label="Average position" value={gsc ? fmt(gsc.position, 1) : "—"} hint="1 = top result" />
      </dl>

      <Panel title="Search terms people used to find the site" note="Sorted by how often the site was shown. Position = average ranking in Google for that term.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr>
                {["Search term", "Shown", "Clicks", "CTR", "Position"].map((h) => (
                  <th key={h} className="py-2 pe-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...(queries.data ?? [])]
                .sort((a, b) => b.impressions - a.impressions)
                .map((q) => (
                  <tr key={q.key}>
                    <td className="py-2 pe-4 font-semibold">{q.key}</td>
                    <td className="py-2 pe-4">{fmt(q.impressions)}</td>
                    <td className="py-2 pe-4">{fmt(q.clicks)}</td>
                    <td className="py-2 pe-4">{pct(q.ctr)}</td>
                    <td className="py-2 pe-4">{fmt(q.position, 1)}</td>
                  </tr>
                ))}
              {!queries.data?.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted">{queries.error ? "—" : "No search data yet — it usually starts appearing a few days after the site is indexed."}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Pages shown most in Google">
        <List rows={(gscPages.data ?? []).map((r) => [r.key.replace(/^https:\/\/www\.4ugenerators\.com/, ""), `${fmt(r.impressions)} shown · ${fmt(r.clicks)} clicks`])} />
      </Panel>
    </div>
  );
}

function List({ rows }: { rows: [string, string][] }) {
  if (!rows.length) return <p className="text-sm text-muted">No data yet.</p>;
  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map(([k, v]) => (
        <li key={k} className="flex justify-between gap-4">
          <span className="truncate">{k}</span>
          <b className="shrink-0">{v}</b>
        </li>
      ))}
    </ul>
  );
}
