-- KTA50-G9 is a 60 Hz engine build (Cummins spec sheet 07/21: 1608 / 1913 kVA at 1800 rpm only): 4U-C1619 → 4U-C1608.
-- Price-list rows, frames and prices are unchanged; only the model code they link to moves. One statement per table.
create temporary table _fix (old_code text primary key, new_code text not null, old_slug text, new_slug text not null);
insert into _fix values
  ('4U-C1619', '4U-C1608', '4u-c1619', '4u-c1608');

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
