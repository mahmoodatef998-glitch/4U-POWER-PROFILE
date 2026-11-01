-- Ratings corrected on 1 Nov 2026 against Baudouin's rating tables and Kubota's engine data (docs/price-list.md):
-- 4U-B66 → 4U-B65 (4M10G2D0/S 65 kVA prime), 4U-B180 → 4U-B150B (6M11G4D0/S 150 kVA at 1500 rpm), 4U-K15 → 4U-K14
-- (D1703-E2-BG 14 kVA prime), 4U-K20B removed (the V2003-T-E2-BG of 4U-K22.5 at a derated rating).
-- The two corrected sets now match their list rows, so those rows are linked. Issued quotations keep their titles;
-- drafts get the new code in the title. updated_at is left as it was.
create temporary table _fix (old_code text primary key, new_code text not null, old_slug text, new_slug text not null);
insert into _fix values
  ('4U-B66', '4U-B65', '4u-b66', '4u-b65'),
  ('4U-B180', '4U-B150B', '4u-b180', '4u-b150b'),
  ('4U-K15', '4U-K14', '4u-k15', '4u-k14'),
  ('4U-K20B', '4U-K22.5', '4u-k20b', '4u-k22-5');

update price_list_items p
set model_codes = (select array_agg(coalesce(f.new_code, u.c) order by u.o) from unnest(p.model_codes) with ordinality u(c, o) left join _fix f on f.old_code = u.c)
where p.model_codes && (select array_agg(old_code) from _fix);

-- BP150/180 (6M11G4D0/S) and KU-14 / 18 (D1703-E2BG), both lists
update price_list_items set model_codes = array['4U-B150B'] where brand = 'Baudouin' and engine = '6M11G4D0/S' and cardinality(model_codes) = 0;
update price_list_items set model_codes = array['4U-K14'] where brand = 'Kubota' and engine = 'D1703-E2BG' and cardinality(model_codes) = 0;

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
