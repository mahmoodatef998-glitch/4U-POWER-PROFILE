-- New website enquiry forms (8 Nov 2026): book a service visit, request a call back, ask an engineer.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check check (source = any (array[
  'contact_form', 'quote_form', 'calculator', 'product', 'datasheet', 'rfq', 'parts',
  'service', 'callback', 'expert',
  'phone', 'whatsapp', 'walk_in', 'referral', 'other'
]));
