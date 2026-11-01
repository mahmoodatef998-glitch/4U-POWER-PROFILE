-- Cummins ratings corrected to Cummins' G-Drive ratings card, held to the alternator's rating (1 Nov 2026,
-- docs/price-list.md). Codes follow the prime kVA; all move in one statement per table.
create temporary table _fix (old_code text primary key, new_code text not null, old_slug text, new_slug text not null);
insert into _fix values
  ('4U-C20', '4U-C26', '4u-c20', '4u-c26'),
  ('4U-C50', '4U-C53', '4u-c50', '4u-c53'),
  ('4U-C180B', '4U-C182', '4u-c180b', '4u-c182'),
  ('4U-C250C', '4U-C271', '4u-c250c', '4u-c271'),
  ('4U-C416', '4U-C410', '4u-c416', '4u-c410'),
  ('4U-C455B', '4U-C501', '4u-c455b', '4u-c501'),
  ('4U-C650', '4U-C652', '4u-c650', '4u-c652'),
  ('4U-C1400', '4U-C1416', '4u-c1400', '4u-c1416');

update price_list_items p
set model_codes = (select array_agg(coalesce(f.new_code, u.c) order by u.o) from unnest(p.model_codes) with ordinality u(c, o) left join _fix f on f.old_code = u.c)
where p.model_codes && (select array_agg(old_code) from _fix);

alter table quotations disable trigger quotations_touch;
update quotations q
set items = (
  select jsonb_agg(
    case when f.old_code is null then i
    else jsonb_set(i, '{code}', to_jsonb(f.new_code))
      || case when q.status = 'draft' and i->>'title' like f.old_code || ' %'
           then jsonb_build_object('title', f.new_code || substr(i->>'title', length(f.old_code) + 1)) else '{}'::jsonb end
    end order by e.o)
  from jsonb_array_elements(q.items) with ordinality e(i, o) left join _fix f on f.old_code = e.i->>'code'
)
where exists (select 1 from jsonb_array_elements(q.items) i join _fix f on f.old_code = i->>'code');
alter table quotations enable trigger quotations_touch;

update leads l set product_slug = f.new_slug from _fix f where l.product_slug = f.old_slug;
update calculator_submissions c set matched_product_slug = f.new_slug from _fix f where c.matched_product_slug = f.old_slug;

drop table _fix;
