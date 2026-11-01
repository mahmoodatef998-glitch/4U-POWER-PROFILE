-- 6M11 ratings from Baudouin's published data (1 Nov 2026, docs/price-list.md): 6M11G2D0/S is 130 / 143 kVA at 50 Hz
-- (4U-B150 → 4U-B130, its 150 / 165 is the 60 Hz rating) and 6M11G4D0/S is 150 / 165 kVA (4U-B150B → 4U-B150).
-- Both codes move in one statement per table, so they never chain. BP130/150 now matches 4U-B130 and is linked.
create temporary table _fix (old_code text primary key, new_code text not null, old_slug text, new_slug text not null);
insert into _fix values
  ('4U-B150', '4U-B130', '4u-b150', '4u-b130'),
  ('4U-B150B', '4U-B150', '4u-b150b', '4u-b150');

update price_list_items p
set model_codes = (select array_agg(coalesce(f.new_code, u.c) order by u.o) from unnest(p.model_codes) with ordinality u(c, o) left join _fix f on f.old_code = u.c)
where p.model_codes && (select array_agg(old_code) from _fix);
update price_list_items set model_codes = array['4U-B130'] where brand = 'Baudouin' and engine = '6M11G2D0/S' and cardinality(model_codes) = 0;

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
