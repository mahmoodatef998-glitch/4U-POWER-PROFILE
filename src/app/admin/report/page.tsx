import Link from "next/link";
import type { ReactNode } from "react";
import { gaConfigured, gaTotals, safe } from "@/lib/google";
import { buildReport, CHANNEL_KEYS, CHANNELS, closeRate, ownerKey, periodRange, PERIODS, type Bucket, type Channel, type PeriodKey, type Tally } from "@/lib/sales";
import { loadEnquiries, loadWonClosed } from "@/lib/sales-data";
import { getAdminClient } from "@/lib/supabase/server";

type Search = { p?: string; from?: string; to?: string; owner?: string };

const MIGRATION_HINT = "If this mentions a missing table or column, apply supabase/migrations/20261014000000_sales_report.sql in Supabase.";

const fmt = (n: number) => new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n);
const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)}%`);

/** categorical slots 1–4 of the validated chart palette, fixed per channel */
const SERIES: Record<Channel, string> = { whatsapp: "#2a78d6", call: "#eb6834", form: "#1baf7a", offline: "#eda100" };

function Delta({ now, prev }: { now: number; prev: number }) {
  if (!prev && !now) return null;
  if (!prev) return <span className="text-xs font-semibold text-muted">new vs previous period</span>;
  const d = (now - prev) / prev;
  if (Math.round(d * 100) === 0) return <span className="text-xs text-muted">same as previous period ({fmt(prev)})</span>;
  const up = d > 0;
  return (
    <span className={`text-xs font-bold ${up ? "text-emerald-700" : "text-red-700"}`}>
      {up ? "▲" : "▼"} {Math.abs(Math.round(d * 100))}% <span className="font-normal text-muted">vs previous ({fmt(prev)})</span>
    </span>
  );
}

function Stat({ label, value, children, alert }: { label: string; value: string; children?: ReactNode; alert?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${alert ? "border-red-300 bg-red-50" : "border-line bg-navy-900"}`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`mt-1 text-3xl font-extrabold ${alert ? "text-red-700" : ""}`}>{value}</dd>
      {children && <div className="mt-1 text-xs leading-5 text-muted">{children}</div>}
    </div>
  );
}

function Panel({ title, note, children, className = "" }: { title: string; note?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-line bg-navy-900 p-5 ${className}`}>
      <h2 className="font-bold">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Enquiries / handled / won / lost / close rate / AED per group. */
function TallyTable({ rows, total, first, swatch, compact }: { rows: Tally[]; total?: Tally; first: string; swatch?: (t: Tally) => string | undefined; compact?: boolean }) {
  const all: [string, (t: Tally) => string][] = [
    ["Enquiries", (t) => fmt(t.enquiries)],
    ["Handled", (t) => fmt(t.handled)],
    ["Open", (t) => fmt(t.open)],
    ["Won", (t) => fmt(t.won)],
    ["Lost", (t) => fmt(t.lost)],
    ["Close rate", (t) => pct(closeRate(t))],
    ["Won AED", (t) => fmt(t.wonValue)],
    ["Quoted AED", (t) => fmt(t.pipeline)],
  ];
  // half-width panels keep the columns that answer "which source sells"
  const cols = compact ? all.filter(([h]) => ["Enquiries", "Handled", "Won", "Close rate", "Won AED"].includes(h)) : all;
  const line = (t: Tally, bold = false) => (
    <tr key={t.key} className={bold ? "bg-surface font-bold" : undefined}>
      <td className="px-3 py-2">
        <span className="flex items-center gap-2">
          {swatch?.(t) && <span className="size-2.5 shrink-0 rounded-sm" style={{ background: swatch(t) }} aria-hidden />}
          {t.label}
        </span>
      </td>
      {cols.map(([h, f]) => (
        <td key={h} className="px-3 py-2 text-end tabular-nums">{f(t)}</td>
      ))}
    </tr>
  );
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${compact ? "min-w-[420px]" : "min-w-[640px]"}`}>
        <thead className="text-xs uppercase text-muted">
          <tr>
            <th className="px-3 py-2 text-start">{first}</th>
            {cols.map(([h]) => (
              <th key={h} className="px-3 py-2 text-end">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((t) => line(t))}
          {total && line(total, true)}
          {!rows.length && (
            <tr>
              <td colSpan={cols.length + 1} className="px-3 py-6 text-center text-muted">No enquiries in this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Stacked bars of enquiries per day (or week) by channel; native tooltip per bar, legend above, table below. */
function TrendChart({ data, weekly }: { data: Bucket[]; weekly: boolean }) {
  const W = 1000;
  const H = 200;
  const pad = { t: 10, r: 8, b: 26, l: 30 };
  const totals = data.map((b) => CHANNEL_KEYS.reduce((s, c) => s + b.counts[c], 0));
  const max = Math.max(1, ...totals);
  const step = max <= 5 ? 1 : max <= 10 ? 2 : Math.ceil(max / 4 / 5) * 5;
  const top = Math.ceil(max / step) * step;
  const plotH = H - pad.t - pad.b;
  const slot = (W - pad.l - pad.r) / Math.max(1, data.length);
  const bw = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => pad.t + plotH - (v / top) * plotH;
  const labelEvery = Math.ceil(data.length / 10);
  const day = (d: Date) => d.toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short" });

  return (
    <figure>
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        {CHANNEL_KEYS.map((c) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: SERIES[c] }} aria-hidden />
            {CHANNELS[c]}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Enquiries per ${weekly ? "week" : "day"} by channel`}>
        {Array.from({ length: top / step + 1 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e4e3df" strokeWidth={1} />
            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#6b6a65">{v}</text>
          </g>
        ))}
        {data.map((b, i) => {
          const x = pad.l + i * slot + (slot - bw) / 2;
          let acc = 0;
          const parts = CHANNEL_KEYS.filter((c) => b.counts[c]);
          return (
            <g key={b.label}>
              <title>{`${weekly ? "Week of " : ""}${day(b.start)}: ${totals[i]} enquiries${parts.length ? ` — ${parts.map((c) => `${CHANNELS[c]} ${b.counts[c]}`).join(" · ")}` : ""}`}</title>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={plotH} fill="transparent" />
              {parts.map((c, j) => {
                const h = (b.counts[c] / top) * plotH;
                const yTop = y(acc + b.counts[c]);
                acc += b.counts[c];
                // 2px surface gap under every segment except the one on the baseline; round the top end only
                const hh = j === 0 ? h : Math.max(1, h - 2);
                const r = j === parts.length - 1 ? Math.min(4, bw / 2, hh) : 0;
                return (
                  <path
                    key={c}
                    d={`M${x},${yTop + hh} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + bw - r} Q${x + bw},${yTop} ${x + bw},${yTop + r} V${yTop + hh} Z`}
                    fill={SERIES[c]}
                  />
                );
              })}
              {i % labelEvery === 0 && (
                <text x={pad.l + i * slot + slot / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#6b6a65">{day(b.start)}</text>
              )}
            </g>
          );
        })}
        <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="#c9c8c2" strokeWidth={1} />
      </svg>
    </figure>
  );
}

export default async function SalesReport({ searchParams }: { searchParams: Promise<Search> }) {
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY — see DEPLOYMENT.md.</p>;
  const q = await searchParams;
  const period = periodRange(q.p, q.from, q.to);
  const owner = q.owner?.trim() || "";

  let all, prevAll, closed;
  try {
    [all, prevAll, closed] = await Promise.all([
      loadEnquiries(sb, period.start, period.end),
      loadEnquiries(sb, period.prevStart, period.prevEnd),
      loadWonClosed(sb, period.start, period.end, owner),
    ]);
  } catch (e) {
    return (
      <p className="rounded-xl bg-red-50 p-4 text-red-700">
        Could not load the report: {(e as Error).message}. {MIGRATION_HINT}
      </p>
    );
  }
  const visitors = gaConfigured() ? await safe(gaTotals(period.from, period.to)) : null;

  const mine = (list: typeof all) => (owner ? list.filter((e) => ownerKey(e.owner) === ownerKey(owner)) : list);
  const list = mine(all);
  const r = buildReport(list, period);
  const prev = buildReport(mine(prevAll), { start: period.prevStart, end: period.prevEnd }).total;
  const teamTable = buildReport(all, period).byOwner;
  const owners = teamTable.filter((t) => t.key).map((t) => t.label);
  const t = r.total;
  const byCh = Object.fromEntries(r.byChannel.map((c) => [c.key, c])) as Record<Channel, Tally>;

  const qs = (p: PeriodKey) => `?${new URLSearchParams({ p, ...(owner ? { owner } : {}) })}`;
  const exportQs = new URLSearchParams({ p: period.key, from: period.from, to: period.to, ...(owner ? { owner } : {}) });
  const lostMax = Math.max(1, ...r.lost.map((l) => l.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Sales report</h1>
          <p className="mt-1 text-sm text-muted">
            {period.key === "custom" ? period.label : `${period.label} · ${period.from} → ${period.to}`} (Dubai time){owner ? ` · ${owner}` : ""}
          </p>
        </div>
        <a href={`/admin/report/export?${exportQs}`} className="rounded-xl border border-line bg-navy-900 px-4 py-2 text-sm font-bold hover:border-brand-400">
          Download Excel (CSV)
        </a>
      </div>

      {/* filters: one row above everything they control */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-navy-900 p-3 text-sm">
        {(Object.keys(PERIODS) as PeriodKey[])
          .filter((k) => k !== "custom")
          .map((k) => (
            <Link
              key={k}
              href={qs(k)}
              aria-current={period.key === k ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 font-semibold ${period.key === k ? "bg-navy-950 text-white" : "hover:bg-surface"}`}
            >
              {PERIODS[k]}
            </Link>
          ))}
        <form className="flex flex-wrap items-center gap-2 border-s border-line ps-3">
          <input type="hidden" name="p" value="custom" />
          {owner && <input type="hidden" name="owner" value={owner} />}
          <input type="date" name="from" defaultValue={period.from} aria-label="From" className="rounded-lg border border-line px-2 py-1" />
          <span className="text-muted">→</span>
          <input type="date" name="to" defaultValue={period.to} aria-label="To" className="rounded-lg border border-line px-2 py-1" />
          <button className={`rounded-full px-3 py-1.5 font-semibold ${period.key === "custom" ? "bg-navy-950 text-white" : "border border-line"}`}>Apply</button>
        </form>
        {(owners.length > 0 || owner) && (
          <form className="ms-auto flex items-center gap-2">
            <input type="hidden" name="p" value={period.key} />
            {period.key === "custom" && (
              <>
                <input type="hidden" name="from" value={period.from} />
                <input type="hidden" name="to" value={period.to} />
              </>
            )}
            <select name="owner" defaultValue={owner} aria-label="Sales owner" className="rounded-lg border border-line px-2 py-1">
              <option value="">All sales staff</option>
              {owners.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <button className="rounded-full border border-line px-3 py-1.5 font-semibold">Filter</button>
          </form>
        )}
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Enquiries" value={fmt(t.enquiries)}>
          <p>
            WhatsApp {byCh.whatsapp.enquiries} · Calls {byCh.call.enquiries} · Forms {byCh.form.enquiries}
            {byCh.offline.enquiries ? ` · Other ${byCh.offline.enquiries}` : ""}
          </p>
          {visitors?.data && visitors.data.users > 0 && (
            <p>
              from {fmt(visitors.data.users)} website visitors ({pct(t.enquiries / visitors.data.users)})
            </p>
          )}
          <Delta now={t.enquiries} prev={prev.enquiries} />
        </Stat>
        <Stat label="Handled by sales" value={fmt(t.handled)}>
          <p>{pct(t.enquiries ? t.handled / t.enquiries : null)} of enquiries · {fmt(t.open)} still open</p>
        </Stat>
        <Stat label="Won (closed deals)" value={fmt(t.won)}>
          <p>{fmt(t.lost)} lost · close rate {pct(closeRate(t))}</p>
          <Delta now={t.won} prev={prev.won} />
        </Stat>
        <Stat label="Won value (AED)" value={fmt(t.wonValue)}>
          <p>{t.won ? `avg ${fmt(t.wonValue / t.won)} per order` : "no orders yet"}</p>
          <Delta now={t.wonValue} prev={prev.wonValue} />
        </Stat>
        <Stat label="Close rate" value={pct(closeRate(t))}>
          <p>won ÷ handled · {pct(t.enquiries ? t.won / t.enquiries : null)} of all enquiries</p>
        </Stat>
        <Stat label="Open quotes (AED)" value={fmt(t.pipeline)}>
          <p>deals at “quoted” still to close</p>
        </Stat>
        <Stat label="Orders closed this period" value={fmt(closed.count)}>
          <p>AED {fmt(closed.value)} · by close date, whenever the enquiry came in</p>
        </Stat>
        <Stat label="Form leads not contacted > 24 h" value={fmt(r.notFollowedUp)} alert={r.notFollowedUp > 0}>
          <p>{r.notFollowedUp ? "Customers left name + phone and are still “new”" : "Every form lead was picked up"}</p>
        </Stat>
      </dl>

      <Panel title={`Enquiries per ${r.buckets.length && period.days > 62 ? "week" : "day"}`} note="Hover a bar for the split. The table below has the exact figures.">
        <TrendChart data={r.buckets} weekly={period.days > 62} />
      </Panel>

      <Panel title="By channel" note="WhatsApp and call rows count button taps; “Handled” are the ones sales matched to a real chat or call and updated.">
        <TallyTable rows={r.byChannel} total={t} first="Channel" swatch={(x) => SERIES[x.key as Channel]} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Why deals were lost · أسباب خسارة الصفقات" note={`${fmt(t.lost)} lost in this period`}>
          {r.lost.length ? (
            <ul className="space-y-3 text-sm">
              {r.lost.map((l) => (
                <li key={l.key}>
                  <div className="flex justify-between gap-4">
                    <span className={l.key === "none" ? "text-muted" : undefined}>{l.label}</span>
                    <b className="tabular-nums">
                      {l.count} <span className="font-normal text-muted">({pct(l.count / t.lost)})</span>
                    </b>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface">
                    <div className="h-2 rounded-full" style={{ width: `${(l.count / lostMax) * 100}%`, background: l.key === "none" ? "#c9c8c2" : SERIES.whatsapp }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No lost deals in this period.</p>
          )}
        </Panel>

        <Panel title="Where customers came from" note="Google Ads, campaign (UTM), referring site, or direct / Google search.">
          <TallyTable rows={r.byTraffic.slice(0, 12)} first="Traffic" compact />
        </Panel>
      </div>

      <Panel title="Sales team" note="Assign an owner on each enquiry (Leads, WhatsApp, Calls pages) to see who closes what.">
        <TallyTable rows={teamTable} first="Owner" />
      </Panel>

      <Panel title="By source" note="Which button or form the enquiry came through.">
        <TallyTable rows={r.bySource} first="Source" />
      </Panel>

      <p className="text-xs leading-6 text-muted">
        Enquiries are counted by the day they came in, so “Won” here means won out of this period’s enquiries. Handled = sales moved it past
        “new”. Close rate = won ÷ handled. Open = contacted or quoted. WhatsApp and call taps that never turned into a real chat or call stay
        “new” — that is expected, not a sales miss; form leads are different (the customer left a phone number).
      </p>
    </div>
  );
}
