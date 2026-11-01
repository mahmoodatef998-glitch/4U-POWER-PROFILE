-- Price-list rows that had no model on the site, now linked (1 Nov 2026, docs/datasheets.md). Only model_codes changes;
-- labels, engines, alternators and prices stay as the supplier wrote them.
update price_list_items set model_codes = array['4U-K20C']
where lower(regexp_replace(engine, '[^A-Za-z0-9]', '', 'g')) = 'v2403mdibg' and coalesce(cardinality(model_codes), 0) = 0;
update price_list_items set model_codes = array['4U-P24']
where lower(regexp_replace(engine, '[^A-Za-z0-9]', '', 'g')) = '404d22g60hz' and coalesce(cardinality(model_codes), 0) = 0;
