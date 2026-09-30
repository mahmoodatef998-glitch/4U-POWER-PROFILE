-- Solar and fuel/accessory product lines.
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('generator','ats_panel','switchgear','mdb','sync_panel','solar','accessories'));
