import { togglePost } from "../actions";
import { PostForm } from "./post-form";
import { getAdminClient } from "@/lib/supabase/server";

export default async function AdminNews({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { created } = await searchParams;
  const sb = getAdminClient();
  if (!sb) return <p className="rounded-xl bg-brand-50 p-4">Supabase is not configured. See DEPLOYMENT.md.</p>;
  const { data } = await sb.from("news_posts").select("id,slug,title_en,published_at,is_published").order("published_at", { ascending: false });
  const posts = (data ?? []) as { id: string; slug: string; title_en: string; published_at: string; is_published: boolean }[];

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-2xl font-extrabold">News posts</h1>
        {created && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-emerald-800">Post published. It is live on /en/news and /ar/news.</p>}
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <a href={`/en/news/${p.slug}`} target="_blank" rel="noreferrer" className="font-bold hover:text-brand-700">{p.title_en}</a>
                <p className="text-xs text-muted">{new Date(p.published_at).toDateString()} · /{p.slug}</p>
              </div>
              <form action={togglePost}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="next" value={String(!p.is_published)} />
                <button className={`rounded-full px-3 py-1 text-xs font-bold ${p.is_published ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200"}`}>
                  {p.is_published ? "Published — unpublish" : "Draft — publish"}
                </button>
              </form>
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
