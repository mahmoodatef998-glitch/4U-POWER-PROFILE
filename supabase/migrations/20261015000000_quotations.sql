-- Quotations made in /admin/quotes: customer, line items and totals; the PDF is rendered on demand from these.

create sequence if not exists public.quotation_number_seq start 1001;

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('public.quotation_number_seq'),
  quote_date date not null default ((now() at time zone 'Asia/Dubai')::date),
  -- { name, address, trn, project, attention, contact, email, ref }
  customer jsonb not null default '{}'::jsonb,
  -- { person, contact, email }
  sales jsonb not null default '{}'::jsonb,
  -- [{ code, title, description, qty, unit, unit_price }]
  items jsonb not null default '[]'::jsonb,
  validity text,
  notes text,
  vat_rate numeric not null default 5,
  subtotal numeric not null default 0,
  vat numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'draft' check (status in ('draft','sent','won','lost')),
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter sequence public.quotation_number_seq owned by public.quotations.number;
create index if not exists quotations_created_idx on public.quotations (created_at desc);

-- Admin only (service role); never readable from the public site.
alter table public.quotations enable row level security;
revoke all on public.quotations from anon, authenticated;
revoke all on sequence public.quotation_number_seq from anon, authenticated;

drop trigger if exists quotations_touch on public.quotations;
create trigger quotations_touch before update on public.quotations for each row execute function public.touch_updated_at();

-- Letterhead and Terms & Conditions PDFs the quotations are printed on. Private: uploaded and read by the admin only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quotation-assets', 'quotation-assets', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;
