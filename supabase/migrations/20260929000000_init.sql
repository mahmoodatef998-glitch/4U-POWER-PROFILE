-- 4U Power Generation — initial schema
-- Public (anon) role: SELECT published content only.
-- leads / calculator_submissions: written only by server actions using the service-role key (bypasses RLS).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('generator','ats_panel','switchgear','mdb','sync_panel')),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  kva_min numeric,
  kva_max numeric,
  engine_brand text,
  fuel_type text check (fuel_type in ('diesel','gas','hybrid','solar')),
  description_en text,
  description_ar text,
  -- [{label_en,label_ar,value_en,value_ar}]
  specs jsonb not null default '[]'::jsonb,
  spec_sheet_url text,
  images text[] not null default '{}',
  sort_order int not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category) where is_published;

-- ---------------------------------------------------------------- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text not null,
  country text not null check (country in ('uae','saudi-arabia','iraq','qatar','kenya','south-africa')),
  sector text,
  kva numeric,
  summary_en text,
  summary_ar text,
  images text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_company text,
  country text,
  quote_en text not null,
  quote_ar text not null,
  rating int check (rating between 1 and 5),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- news
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_ar text not null,
  meta_title_en text,
  meta_title_ar text,
  excerpt_en text,
  excerpt_ar text,
  body_en text not null,   -- Markdown
  body_ar text not null,   -- Markdown
  cover_image text,
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists news_published_idx on public.news_posts (published_at desc) where is_published;

-- ---------------------------------------------------------------- leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  country text,
  message text,
  source_page text,
  source text not null default 'contact_form' check (source in ('contact_form','quote_form','calculator','product')),
  calculated_kva numeric,
  product_slug text,
  locale text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  gclid text,
  status text not null default 'new' check (status in ('new','contacted','won','lost')),
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------- calculator submissions
create table if not exists public.calculator_submissions (
  id uuid primary key default gen_random_uuid(),
  mode text,                -- 'known_load' | 'site_builder'
  load_type text,
  input_kw numeric,
  input_amps numeric,
  voltage numeric,
  phases int,
  power_factor numeric,
  safety_margin numeric,
  running_kva numeric,
  recommended_kva numeric,
  recommended_ats_amps numeric,
  matched_product_slug text,
  locale text,
  source_page text,
  converted_to_lead boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists calc_created_idx on public.calculator_submissions (created_at desc);

-- ---------------------------------------------------------------- updated_at trigger
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists news_touch on public.news_posts;
create trigger news_touch before update on public.news_posts for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- RLS
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.news_posts enable row level security;
alter table public.leads enable row level security;
alter table public.calculator_submissions enable row level security;

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products for select to anon, authenticated using (is_published = true);

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select to anon, authenticated using (is_published = true);

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials for select to anon, authenticated using (is_published = true);

drop policy if exists "public read published news" on public.news_posts;
create policy "public read published news" on public.news_posts for select to anon, authenticated using (is_published = true and published_at <= now());

-- leads & calculator_submissions: NO policies for anon/authenticated => no public read or write.
-- The service role bypasses RLS and is used only inside Next.js server actions.
revoke all on public.leads from anon, authenticated;
revoke all on public.calculator_submissions from anon, authenticated;
