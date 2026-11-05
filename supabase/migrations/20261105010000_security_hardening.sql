-- Security hardening (5 Nov 2026). RLS already blocks the public key; this removes the table privileges too,
-- so a missing or wrong policy can never expose or change data (defence in depth).

-- Private tables: only the service role (server code) touches them.
do $$
declare t text;
begin
  foreach t in array array['app_settings','calculator_submissions','call_clicks','form_hits','leads','price_list_items',
                           'quotations','seo_snapshots','whatsapp_clicks'] loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
  -- Public content: read-only for the site (RLS still limits it to published rows).
  foreach t in array array['news_posts','products','projects','testimonials'] loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;

-- Trigger helpers are not for API callers.
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
revoke execute on function public.sales_stamps() from public, anon, authenticated;

-- New tables / functions created later in public stay private unless granted on purpose.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Read-only hit count (admin lockout checks it without recording a hit).
create or replace function public.form_hits_count(p_key text, p_window_seconds int)
returns int
language sql
stable
security definer
set search_path = public
as $$ select count(*)::int from form_hits where key = p_key and at > now() - make_interval(secs => p_window_seconds) $$;
revoke all on function public.form_hits_count(text, int) from public, anon, authenticated;
