-- WhatsApp click attribution + spare-parts requests.

-- Every WhatsApp click from the site gets a short reference (e.g. 4U-7K2PX) that is appended to the
-- pre-filled message, so sales can match a WhatsApp chat back to the page and ad campaign it came from.
create table if not exists public.whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  page text,
  location text,
  locale text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  gclid text,
  status text not null default 'new' check (status in ('new','contacted','quoted','won','lost')),
  deal_value numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists whatsapp_clicks_created_idx on public.whatsapp_clicks (created_at desc);
alter table public.whatsapp_clicks enable row level security;
drop trigger if exists whatsapp_clicks_touch on public.whatsapp_clicks;
create trigger whatsapp_clicks_touch before update on public.whatsapp_clicks for each row execute function public.touch_updated_at();

-- Leads: spare-parts source, photo attachments, quoted stage and deal value for ROI reporting.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('contact_form','quote_form','calculator','product','datasheet','rfq','parts'));
alter table public.leads add column if not exists attachments text[];
alter table public.leads add column if not exists deal_value numeric;
alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check check (status in ('new','contacted','quoted','won','lost'));

-- Private bucket for spare-part photos (read via short-lived signed URLs in /admin only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lead-files', 'lead-files', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
