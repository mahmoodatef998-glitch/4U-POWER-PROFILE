-- Per-IP rate limit for the public forms (lead, parts, calculator) after a scanner flooded them on 5 Nov 2026.
-- form_hits is private (RLS on, no policies): only the service role writes it, through form_rate_ok().
create table if not exists public.form_hits (
  id bigserial primary key,
  key text not null,
  at timestamptz not null default now()
);
create index if not exists form_hits_key_at on public.form_hits (key, at desc);
alter table public.form_hits enable row level security;

-- Records one hit for p_key and returns false when p_key already has p_max hits within p_window_seconds.
create or replace function public.form_rate_ok(p_key text, p_window_seconds int, p_max int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  delete from form_hits where at < now() - interval '2 days';
  select count(*) into n from form_hits where key = p_key and at > now() - make_interval(secs => p_window_seconds);
  if n >= p_max then return false; end if;
  insert into form_hits (key) values (p_key);
  return true;
end;
$$;
revoke all on function public.form_rate_ok(text, int, int) from public, anon, authenticated;

-- Who sent each lead, so abuse can be traced and blocked.
alter table public.leads add column if not exists client_ip text;
alter table public.leads add column if not exists user_agent text;
