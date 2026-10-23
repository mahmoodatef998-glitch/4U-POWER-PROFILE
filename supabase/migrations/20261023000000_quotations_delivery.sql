-- Delivery period per quotation, printed on page 1 (it is no longer on the fixed Terms & Conditions sheet).
alter table public.quotations add column if not exists delivery text;
comment on column public.quotations.delivery is 'Delivery period printed on page 1 of the quotation, e.g. "10 days". Null = not printed.';
notify pgrst, 'reload schema';
