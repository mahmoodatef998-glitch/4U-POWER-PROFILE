-- Price lists for quotations (UAE and Export), a settings table (GBP → AED rate for the Perkins list),
-- and a discount per quotation. The price rows themselves are loaded into the database only: the repository
-- is public, so prices are never committed.

create table if not exists public.price_list_items (
  id bigint generated always as identity primary key,
  edition text not null,
  list text not null check (list in ('uae', 'export')),
  brand text not null,
  section text not null,
  label text not null,
  engine text not null,
  alternator text not null,
  origin text not null default '',
  currency text not null check (currency in ('AED', 'GBP')),
  price numeric not null check (price >= 0),
  -- the 4U models (src/content/*-models.ts) this row prices, matched on the engine
  model_codes text[] not null default '{}',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists price_list_items_model_codes on public.price_list_items using gin (model_codes);
alter table public.price_list_items enable row level security;
revoke all on public.price_list_items from anon, authenticated;

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
revoke all on public.app_settings from anon, authenticated;
insert into public.app_settings (key, value) values ('gbp_aed_rate', '4.91') on conflict (key) do nothing;

alter table public.quotations
  add column if not exists price_list text not null default 'uae' check (price_list in ('uae', 'export')),
  add column if not exists discount_pct numeric not null default 0 check (discount_pct >= 0 and discount_pct <= 100),
  add column if not exists discount numeric not null default 0;

notify pgrst, 'reload schema';
