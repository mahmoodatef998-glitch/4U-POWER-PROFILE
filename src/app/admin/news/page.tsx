import { hideBundledPost, togglePost } from "../actions";
import { PostForm } from "./post-form";
import { newsPosts as bundled } from "@/content/news";
import { getAdminClient } from "@/lib/supabase/server";

type DbPost = { id: string; slug: string; title_en: string; published_at: string; is_published: boolean };
type Row = { slug: string; title: string; publishedAt: string; status: "live" | "scheduled" | "hidden"; id?: string; fromCalendar: boolean };

const DAY = 864e5;
/** below this many days of scheduled articles, the page asks for the next batch */
const MIN_QUEUE_DAYS = 10;
const when = (d: string) => new Date(d).toLocaleString("en-GB", { timeZone: "Asia/Dubai", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const BADGE: Record<Row["status"], string> = {
  live: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-sky-100 text-sky-800",
  hidden: "bg-zinc-200 text-zinc-700",
};

export default async function AdminNews({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { created } = await searchParams;
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured. See DEPLOYMENT.md.</p>;
  const { data } = await sb.from("news_posts").select("id,slug,title_en,published_at,is_published").order("published_at", { ascending: false });
  const db = (data ?? []) as DbPost[];

  // Same merge as the public site (getNews): a database row wins over the calendar article with the same slug.
  const now = Date.now();
  const inDb = new Set(db.map((p) => p.slug));
  const calendar = new Set(bundled.map((p) => p.slug));
  const status = (published: boolean, at: string): Row["status"] => (!published ? "hidden" : Date.parse(at) > now ? "scheduled" : "live");
  const rows: Row[] = [
    ...db.map((p) => ({ slug: p.slug, title: p.title_en, publishedAt: p.published_at, status: status(p.is_published, p.published_at), id: p.id, fromCalendar: calendar.has(p.slug) })),
    ...bundled.filter((p) => !inDb.has(p.slug)).map((p) => ({ slug: p.slug, title: p.title_en, publishedAt: p.published_at, status: status(p.is_published, p.published_at), fromCalendar: true })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const live = rows.filter((r) => r.status === "live");
  const scheduled = rows.filter((r) => r.status === "scheduled").sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const last30 = live.filter((r) => now - Date.parse(r.publishedAt) < 30 * DAY).length;
  const next = scheduled[0];
  const queueEnd = scheduled.at(-1);
  const daysLeft = queueEnd ? Math.floor((Date.parse(queueEnd.publishedAt) - now) / DAY) : 0;
  const lowQueue = daysLeft < MIN_QUEUE_DAYS;

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-2xl font-extrabold">News &amp; articles</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Articles from the content calendar are scheduled ahead and go live by themselves at 10:00 UAE on their date (the site refreshes within
          30 minutes). Search engines are notified the same morning. Hide any article before its date if it should not go out.
        </p>
        {created && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-emerald-800">Post published. It is live on /en/news and /ar/news.</p>}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Live articles", String(live.length), `${last30} published in the last 30 days`],
            ["Scheduled", String(scheduled.length), scheduled.length ? "waiting for their date" : "nothing queued"],
            ["Next article", next ? when(next.publishedAt) : "—", next?.title ?? ""],
            ["Queue runs until", queueEnd ? when(queueEnd.publishedAt) : "—", queueEnd ? `${daysLeft} days of articles left` : "add articles"],
          ].map(([k, v, hint], i) => (
            <div key={k} className={`rounded-2xl border p-5 ${i === 3 && lowQueue ? "border-red-300 bg-red-50" : "border-line bg-navy-900"}`}>
              <dt className="text-sm text-muted">{k}</dt>
              <dd className={`mt-1 font-extrabold ${i >= 2 ? "text-base" : "text-3xl"}`}>{v}</dd>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{hint}</p>
            </div>
          ))}
        </dl>
        {lowQueue && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            Less than {MIN_QUEUE_DAYS} days of scheduled articles left — the next batch from the content calendar is due.
          </p>
        )}

        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-navy-900">
          {rows.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                {p.status === "live" ? (
                  <a href={`/en/news/${p.slug}`} target="_blank" rel="noreferrer" className="font-bold hover:text-brand-700">{p.title}</a>
                ) : (
                  <p className="font-bold">{p.title}</p>
                )}
                <p className="text-xs text-muted">
                  {when(p.publishedAt)} · /{p.slug} · {p.fromCalendar ? "content calendar" : "written in admin"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${BADGE[p.status]}`}>
                  {p.status === "scheduled" ? `Scheduled · in ${Math.max(1, Math.ceil((Date.parse(p.publishedAt) - now) / DAY))} d` : p.status === "live" ? "Live" : "Hidden"}
                </span>
                {p.id ? (
                  <form action={togglePost}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="slug" value={p.slug} />
                    <input type="hidden" name="next" value={String(p.status === "hidden")} />
                    <button className="rounded-full border border-line px-3 py-1 text-xs font-bold hover:border-brand-400">{p.status === "hidden" ? "Show" : "Hide"}</button>
                  </form>
                ) : (
                  <form action={hideBundledPost}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <button className="rounded-full border border-line px-3 py-1 text-xs font-bold hover:border-brand-400">Hide</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-extrabold">New post</h2>
        <div className="mt-4">
          <PostForm />
        </div>
      </div>
    </div>
  );
}
