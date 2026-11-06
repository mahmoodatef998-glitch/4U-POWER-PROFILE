-- Permanent IP bans (owner, 6 Nov 2026): more than 5 wrong admin passwords in 24 h bans the IP from the whole site.
-- Read by the middleware (cached for a minute). Unban: delete the row.
create table if not exists public.blocked_ips (
  ip text primary key,
  reason text,
  created_at timestamptz not null default now()
);
alter table public.blocked_ips enable row level security;
revoke all on public.blocked_ips from anon, authenticated;

create or replace function public.admin_login_failed(p_ip text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  insert into form_hits (key) values ('adminfail:' || p_ip);
  select count(*) into n from form_hits where key = 'adminfail:' || p_ip and at > now() - interval '24 hours';
  if n > 5 then
    insert into blocked_ips (ip, reason) values (p_ip, 'more than 5 wrong admin passwords in 24 h') on conflict (ip) do nothing;
    return true;
  end if;
  return false;
end;
$$;
revoke all on function public.admin_login_failed(text) from public, anon, authenticated;

create or replace function public.blocked_ip_list()
returns setof text
language sql
stable
security definer
set search_path = public
as $$ select ip from blocked_ips $$;
revoke all on function public.blocked_ip_list() from public, anon, authenticated;

insert into public.blocked_ips (ip, reason) values
  ('50.7.250.107', '5 Nov 2026: form probes, admin bypass (quotation 1059), password guessing'),
  ('4.190.153.197', '6 Nov 2026: 79 wrong admin passwords overnight')
on conflict (ip) do nothing;
