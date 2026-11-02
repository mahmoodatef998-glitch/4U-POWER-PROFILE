-- The % added to list prices for a Saudi customer is set per quotation (owner, 2 Nov 2026); 6% was the fixed rule.
-- Other countries carry 0. Existing Saudi quotations keep the 6% they were priced with.
alter table public.quotations
  add column if not exists uplift_pct numeric(5, 2) not null default 0
  check (uplift_pct >= 0 and uplift_pct <= 100);

update public.quotations set uplift_pct = 6 where country = 'SA' and uplift_pct = 0;
