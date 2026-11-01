-- Customer country (sets the price list, the Saudi uplift and the usual VAT) and the currency a quotation is printed in.
-- Prices stay in AED; fx_rate is AED per 1 unit of the currency, frozen when the quotation is saved.
alter table public.quotations
  add column if not exists country text check (country in ('AE', 'SA', 'OM', 'XX')),
  add column if not exists currency text not null default 'AED' check (currency in ('AED', 'USD', 'EUR', 'SAR')),
  add column if not exists fx_rate numeric not null default 1 check (fx_rate > 0),
  add column if not exists fx_at timestamptz;

update public.quotations set country = case when price_list = 'export' then 'XX' else 'AE' end where country is null;

notify pgrst, 'reload schema';
