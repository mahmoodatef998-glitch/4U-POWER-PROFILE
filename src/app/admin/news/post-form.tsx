"use client";

import { useActionState } from "react";
import { createPost } from "../actions";

const F = ({ name, label, textarea, rows = 3, dir, hint }: { name: string; label: string; textarea?: boolean; rows?: number; dir?: "rtl"; hint?: string }) => (
  <label className="block text-sm font-bold">
    {label}
    {hint && <span className="ms-2 font-normal text-muted">{hint}</span>}
    {textarea ? (
      <textarea name={name} rows={rows} dir={dir} className="mt-1 block w-full rounded-xl border border-line p-3 font-mono text-sm font-normal" />
    ) : (
      <input name={name} dir={dir} className="mt-1 block w-full rounded-xl border border-line p-3 font-normal" />
    )}
  </label>
);

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, null);
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-white p-6">
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      <F name="slug" label="URL slug" hint="e.g. generator-maintenance-tips-uae" />
      <div className="grid gap-4 md:grid-cols-2">
        <F name="title_en" label="Title (EN)" />
        <F name="title_ar" label="Title (AR)" dir="rtl" />
        <F name="meta_title_en" label="SEO title (EN)" hint="55–60 chars, optional" />
        <F name="meta_title_ar" label="SEO title (AR)" dir="rtl" hint="optional" />
        <F name="excerpt_en" label="Meta description (EN)" textarea hint="140–155 chars" />
        <F name="excerpt_ar" label="Meta description (AR)" textarea dir="rtl" hint="140–155 chars" />
      </div>
      <F name="body_en" label="Body (EN, Markdown)" textarea rows={14} hint="Use ## for sections. Link to /en/generators, /en/ats-panels, /en/calculator" />
      <F name="body_ar" label="Body (AR, Markdown)" textarea rows={14} dir="rtl" hint="Links: /ar/generators …" />
      <div className="grid gap-4 md:grid-cols-2">
        <F name="cover_image" label="Cover image URL" hint="Supabase Storage public URL or /images/news/…" />
        <label className="block text-sm font-bold">
          Publish date
          <input type="datetime-local" name="published_at" className="mt-1 block w-full rounded-xl border border-line p-3 font-normal" />
        </label>
      </div>
      <button disabled={pending} className="justify-self-start rounded-full bg-amber-500 px-6 py-3 font-bold text-navy-950 disabled:opacity-50">
        {pending ? "Publishing…" : "Publish post"}
      </button>
    </form>
  );
}
