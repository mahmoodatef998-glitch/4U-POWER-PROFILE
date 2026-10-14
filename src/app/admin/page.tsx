import Link from "next/link";
import { addLead } from "./actions";
import { OwnerList, OWNERS_LIST_ID, SalesForm } from "./sales-form";
import { LEAD_SOURCES, MANUAL_SOURCE_KEYS, MANUAL_SOURCES, PERIODS, periodRange, sourceLabel, STATUSES, trafficSource, type PeriodKey } from "@/lib/sales";
import { loadOwners } from "@/lib/sales-data";
import { gaActiveNow, gaConfigured, gaTotals, safe } from "@/lib/google";
import { SITE_URL } from "@/lib/site";
import { getAdminClient } from "@/lib/supabase/server";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  country: string | null;
  message: string | null;
  source: string;
  source_page: string | null;
  calculated_kva: number | null;
  product_slug: string | null;
  locale: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  status: string;
  deal_value: number | null;
  owner: string | null;
  lost_reason: string | null;
  notes: string | null;
  attachments: string[] | null;
};

type Filters = { q?: string; source?: string; status?: string; p?: string };

const MAX_ROWS = 500;
const PERIOD_KEYS = (Object.keys(PERIODS) as PeriodKey[]).filter((k) => k !== "custom");

/** Page the form was sent from: stored as a path or a full referer URL. */
function pageLink(page: string | null) {
  if (!page || page === "admin") return null;
  try {
    const u = new URL(page, SITE_URL);
    return { href: `${SITE_URL}${u.pathname}`, label: decodeURIComponent(u.pathname) };
  } catch {
    return null;
  }
}

export default async function AdminLeads({ searchParams }: { searchParams: Promise<Filters> }) {
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY — see DEPLOYMENT.md.</p>;

  const f = await searchParams;
  // letters, digits and the characters of phones / emails only — the term goes into a PostgREST or() filter
  const q = (f.q ?? "").replace(/[^\p{L}\p{N}@.+\- ]/gu, "").trim().slice(0, 60);
  const source = f.source && f.source in LEAD_SOURCES ? f.source : "";
  const status = STATUSES.find((x) => x === f.status) ?? "";
  const pKey = PERIOD_KEYS.find((k) => k === f.p) ?? "";
  const period = pKey ? periodRange(pKey) : null;

  let query = sb.from("leads").select("*").order("created_at", { ascending: false }).limit(MAX_ROWS);
  if (q) query = query.or(["name", "phone", "email", "message"].map((c) => `${c}.ilike."*${q}*"`).join(","));
  if (source) query = query.eq("source", source);
  if (status) query = query.eq("status", status);
  if (period) query = query.gte("created_at", period.start.toISOString()).lt("created_at", period.end.toISOString());
  const filtered = !!(q || source || status || period);
  const exportQs = new URLSearchParams({ only: "leads", p: pKey || "all", ...(q && { q }), ...(source && { source }), ...(status && { status }) });

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: leads }, { count: calc30 }, { count: calcConv }, owners] = await Promise.all([
    query,
    sb.from("calculator_submissions").select("id", { count: "exact", head: true }).gte("created_at", since),
    sb.from("calculator_submissions").select("id", { count: "exact", head: true }).gte("created_at", since).eq("converted_to_lead", true),
    loadOwners(sb),
  ]);
  // visitor strip from GA4 (only when configured; never blocks the leads table)
  const [visNow, visToday, visWeek] = gaConfigured() ? await Promise.all([safe(gaActiveNow()), safe(gaTotals("today")), safe(gaTotals("6daysAgo"))]) : [null, null, null];
  const list = (leads ?? []) as Lead[];
  // spare-part photos live in a private bucket — sign short-lived links for this page view
  const paths = list.flatMap((l) => l.attachments ?? []);
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await sb.storage.from("lead-files").createSignedUrls(paths, 3600);
    for (const u of urls ?? []) if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
  }
  const newCount = list.filter((l) => l.status === "new").length;

  return (
    <div>
      <Link href="/admin/traffic" className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-2xl border border-line bg-navy-900 px-5 py-4 text-sm hover:border-brand-400">
        {gaConfigured() ? (
          <>
            <span>On the site now: <b className="text-lg">{visNow?.data ?? "—"}</b></span>
            <span>Visitors today: <b className="text-lg">{visToday?.data?.users ?? "—"}</b></span>
            <span>Visitors (7 days): <b className="text-lg">{visWeek?.data?.users ?? "—"}</b></span>
            <span className="ms-auto font-semibold text-brand-700">Visitors &amp; Google search →</span>
          </>
        ) : (
          <span className="font-semibold text-brand-700">Connect Google Analytics &amp; Search Console to see visitors and search terms →</span>
        )}
      </Link>
      <OwnerList owners={owners} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Leads</h1>
        <Link href="/admin/report" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-ink-950">Sales report →</Link>
      </div>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Everyone who leaves their details on the website — contact and quote forms, product pages, datasheet downloads, the quote basket,
        the kVA calculator, the 3D configurator and spare-parts requests — is saved here with name, phone, email, country and what they asked for.
      </p>
      <ManualLeadForm />
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["New leads", newCount],
          ["Calculator runs (30d)", calc30 ?? 0],
          ["Calculator → lead (30d)", calcConv ?? 0],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-navy-900 p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 text-3xl font-extrabold">{v}</dd>
          </div>
        ))}
      </dl>
      <form className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-navy-900 p-3 text-sm">
        <input name="q" defaultValue={q} placeholder="Search name, phone, email, message" aria-label="Search" className="min-w-56 flex-1 rounded-lg border border-line px-3 py-1.5" />
        <select name="source" defaultValue={source} aria-label="Source" className="rounded-lg border border-line px-2 py-1.5">
          <option value="">All sources</option>
          {Object.entries(LEAD_SOURCES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status" className="rounded-lg border border-line px-2 py-1.5">
          <option value="">All statuses</option>
          {STATUSES.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
        <select name="p" defaultValue={pKey} aria-label="Period" className="rounded-lg border border-line px-2 py-1.5">
          <option value="">All time</option>
          {PERIOD_KEYS.map((k) => (
            <option key={k} value={k}>{PERIODS[k]}</option>
          ))}
        </select>
        <button className="rounded-lg bg-navy-950 px-4 py-1.5 font-bold text-white">Filter</button>
        {filtered && <Link href="/admin" className="px-2 font-semibold text-muted hover:text-ink">Clear</Link>}
        <a href={`/admin/report/export?${exportQs}`} className="ms-auto rounded-lg border border-line px-3 py-1.5 font-bold hover:border-brand-400">
          Download these leads (Excel CSV)
        </a>
      </form>
      <p className="mt-3 text-sm text-muted">
        {list.length === MAX_ROWS ? `Latest ${MAX_ROWS} leads shown — narrow the filters or download the CSV for all.` : `${list.length} lead${list.length === 1 ? "" : "s"}${filtered ? " match" : ""}`}
      </p>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-navy-900">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              {["Date", "Customer", "Need", "Source / page", "Status · value · owner · notes"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((l) => (
              <tr key={l.id} className={l.status === "new" ? "bg-brand-50/50" : undefined}>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(l.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</td>
                <td className="px-4 py-3">
                  <p className="font-bold">{l.name}</p>
                  <a className="text-brand-700" href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{l.phone}</a>
                  {l.email && (
                    <p>
                      <a className="text-muted hover:text-brand-700" href={`mailto:${l.email}`}>{l.email}</a>
                    </p>
                  )}
                  <p className="text-muted">
                    {[l.country, l.locale === "ar" ? "Arabic" : l.locale === "en" ? "English" : null].filter(Boolean).join(" · ")}
                  </p>
                  <Link href={`/admin/quotes/new?lead=${l.id}`} className="mt-1 inline-block text-xs font-bold text-brand-700 hover:underline">Make quotation →</Link>
                </td>
                <td className="max-w-xs px-4 py-3">
                  {l.calculated_kva && <p className="font-bold">{l.calculated_kva} kVA</p>}
                  {l.product_slug && <p className="text-muted">{l.product_slug}</p>}
                  <p className="line-clamp-4 whitespace-pre-line">{l.message}</p>
                  {!!l.attachments?.length && (
                    <p className="mt-2 flex flex-wrap gap-2">
                      {l.attachments.map((p, i) =>
                        signed.get(p) ? (
                          <a key={p} href={signed.get(p)} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline">
                            Photo {i + 1}
                          </a>
                        ) : null,
                      )}
                    </p>
                  )}
                </td>
                <td className="max-w-56 px-4 py-3 text-muted">
                  <p className="font-semibold text-ink">{sourceLabel(l.source)}</p>
                  {(() => {
                    const page = pageLink(l.source_page);
                    return page ? (
                      <a href={page.href} target="_blank" rel="noopener" className="block truncate hover:text-brand-700" title={page.label}>{page.label}</a>
                    ) : null;
                  })()}
                  {l.source_page !== "admin" && <p>{trafficSource(l)}</p>}
                  {l.utm_campaign && <p>campaign: {l.utm_campaign}</p>}
                </td>
                <td className="px-4 py-3">
                  <SalesForm table="leads" row={l} />
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">{filtered ? "No leads match these filters." : "No leads yet."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const input = "rounded-lg border border-line px-3 py-2";

/** Log an enquiry that reached sales outside the website buttons, so the report counts every customer. */
function ManualLeadForm() {
  return (
    <details className="mt-4 rounded-2xl border border-line bg-navy-900 p-5 open:pb-6">
      <summary className="cursor-pointer font-bold">+ Log an enquiry (direct call, WhatsApp without a ref, walk-in, referral)</summary>
      <form action={addLead} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input name="name" required minLength={2} maxLength={120} placeholder="Customer / company" className={input} />
        <input name="phone" required minLength={6} maxLength={40} placeholder="Phone" dir="ltr" className={input} />
        <select name="source" defaultValue="phone" aria-label="How they reached us" className={input}>
          {MANUAL_SOURCE_KEYS.map((k) => (
            <option key={k} value={k}>{MANUAL_SOURCES[k]}</option>
          ))}
        </select>
        <input name="owner" list={OWNERS_LIST_ID} maxLength={60} placeholder="Sales owner" className={input} />
        <input name="message" maxLength={2000} placeholder="What do they need? (e.g. 500 kVA + ATS, Dubai)" className={`${input} sm:col-span-2`} />
        <select name="status" defaultValue="contacted" aria-label="Status" className={input}>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input name="deal_value" type="number" min="0" step="1" placeholder="AED" className={`${input} w-full`} />
          <button className="rounded-lg bg-navy-950 px-4 py-2 font-bold text-white">Add</button>
        </div>
      </form>
    </details>
  );
}
