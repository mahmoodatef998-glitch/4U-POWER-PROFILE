-- Daily snapshot of real Google searches (Search Console), taken by the site itself (/api/seo-snapshot,
-- Vercel Cron) with the service account it already has. The weekly article run reads the latest row to
-- write about what people actually search. Server-only: no public access.
create table if not exists public.seo_snapshots (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  site text not null,
  days int not null,
  rows int not null default 0,
  data jsonb not null
);
create index if not exists seo_snapshots_created_at on public.seo_snapshots (created_at desc);
alter table public.seo_snapshots enable row level security;
revoke all on public.seo_snapshots from anon, authenticated;
notify pgrst, 'reload schema';
