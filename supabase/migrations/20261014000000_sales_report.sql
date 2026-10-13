-- Sales report: call-button clicks, owner / lost reason on every enquiry, and automatic stage timestamps.

-- Every tap on a "Call" button (tel: link). A call cannot carry a ref code, so sales match it by time and page.
create table if not exists public.call_clicks (
  id uuid primary key default gen_random_uuid(),
  page text,
  page_title text,
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
create index if not exists call_clicks_created_idx on public.call_clicks (created_at desc);
alter table public.call_clicks enable row level security;
revoke all on public.call_clicks from anon, authenticated;
drop trigger if exists call_clicks_touch on public.call_clicks;
create trigger call_clicks_touch before update on public.call_clicks for each row execute function public.touch_updated_at();

-- Sales fields shared by all three enquiry tables.
do $$
declare t text;
begin
  foreach t in array array['leads','whatsapp_clicks','call_clicks'] loop
    execute format('alter table public.%I add column if not exists owner text', t);
    execute format('alter table public.%I add column if not exists lost_reason text', t);
    execute format('alter table public.%I add column if not exists notes text', t);
    execute format('alter table public.%I add column if not exists contacted_at timestamptz', t);
    execute format('alter table public.%I add column if not exists closed_at timestamptz', t);
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_lost_reason_check');
    execute format(
      'alter table public.%I add constraint %I check (lost_reason in (''price'',''competitor'',''delivery'',''spec'',''budget'',''no_response'',''not_serious'',''other''))',
      t, t || '_lost_reason_check');
    execute format('create index if not exists %I on public.%I (closed_at) where status = ''won''', t || '_won_closed_idx', t);
  end loop;
end $$;

-- Enquiries logged by hand in /admin (phone calls, direct WhatsApp, walk-ins, referrals).
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('contact_form','quote_form','calculator','product','datasheet','rfq','parts','phone','whatsapp','walk_in','referral','other'));

-- contacted_at = first time the enquiry left "new"; closed_at = when it was marked won/lost (cleared if reopened).
-- A lost reason only makes sense on a lost enquiry.
create or replace function public.sales_stamps() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    if new.status <> 'new' then new.contacted_at = coalesce(new.contacted_at, now()); end if;
    if new.status in ('won','lost') then new.closed_at = now(); else new.closed_at = null; end if;
  end if;
  if new.status <> 'lost' then new.lost_reason = null; end if;
  return new;
end $$;

drop trigger if exists leads_sales_stamps on public.leads;
create trigger leads_sales_stamps before insert or update on public.leads for each row execute function public.sales_stamps();
drop trigger if exists whatsapp_clicks_sales_stamps on public.whatsapp_clicks;
create trigger whatsapp_clicks_sales_stamps before insert or update on public.whatsapp_clicks for each row execute function public.sales_stamps();
drop trigger if exists call_clicks_sales_stamps on public.call_clicks;
create trigger call_clicks_sales_stamps before insert or update on public.call_clicks for each row execute function public.sales_stamps();

-- Existing won/lost rows: stamp them with their last update so they show up in "closed in period".
update public.whatsapp_clicks set closed_at = updated_at where status in ('won','lost') and closed_at is null;
update public.whatsapp_clicks set contacted_at = updated_at where status <> 'new' and contacted_at is null;
update public.leads set closed_at = created_at where status in ('won','lost') and closed_at is null;
update public.leads set contacted_at = created_at where status <> 'new' and contacted_at is null;
