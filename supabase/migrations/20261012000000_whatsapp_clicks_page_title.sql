-- Heading of the page the WhatsApp button was clicked on (e.g. "4U-P500 — 500 kVA Perkins diesel generator"),
-- shown to sales next to the ref code.
alter table public.whatsapp_clicks add column if not exists page_title text;
