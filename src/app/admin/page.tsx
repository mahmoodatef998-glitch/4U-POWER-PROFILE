import { updateLeadStatus } from "./actions";
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
  utm_campaign: string | null;
  gclid: string | null;
  status: string;
  deal_value: number | null;
  attachments: string[] | null;
};

export default async function AdminLeads() {
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY — see DEPLOYMENT.md.</p>;

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: leads }, { count: calc30 }, { count: calcConv }] = await Promise.all([
    sb.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
    sb.from("calculator_submissions").select("id", { count: "exact", head: true }).gte("created_at", since),
    sb.from("calculator_submissions").select("id", { count: "exact", head: true }).gte("created_at", since).eq("converted_to_lead", true),
  ]);
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
      <h1 className="text-2xl font-extrabold">Leads</h1>
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
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-navy-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              {["Date", "Name / phone", "Country", "Need", "Source", "Status"].map((h) => (
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
                  {l.email && <p className="text-muted">{l.email}</p>}
                </td>
                <td className="px-4 py-3">{l.country}</td>
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
                <td className="px-4 py-3 text-muted">
                  {l.source}
                  {l.utm_campaign && <p>utm: {l.utm_campaign}</p>}
                  {l.gclid && <p>Google Ads</p>}
                </td>
                <td className="px-4 py-3">
                  <form action={updateLeadStatus} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status} className="rounded-lg border border-line px-2 py-1">
                      {["new", "contacted", "quoted", "won", "lost"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <input name="deal_value" type="number" min="0" step="1" defaultValue={l.deal_value ?? ""} placeholder="AED" className="w-24 rounded-lg border border-line px-2 py-1" />
                    <button className="rounded-lg bg-navy-950 px-3 py-1 font-bold text-white">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">No leads yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
