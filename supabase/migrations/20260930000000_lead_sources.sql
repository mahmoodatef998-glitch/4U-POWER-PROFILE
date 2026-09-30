-- Datasheet downloads and multi-item quote requests (RFQ cart) are captured as leads too.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('contact_form','quote_form','calculator','product','datasheet','rfq'));
