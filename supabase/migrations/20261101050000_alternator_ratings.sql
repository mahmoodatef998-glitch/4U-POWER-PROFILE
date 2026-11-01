-- Every set held to its Leroy-Somer alternator's rating (owner's go-ahead, 1 Nov 2026, docs/price-list.md): the
-- price list's rows, frames and prices are unchanged; only the model codes they link to move with the new prime kVA.
-- Runs after 20261101040000 (4U-C182 / 4U-C501 there become 4U-C180B / 4U-C500D here). One statement per table.
create temporary table _fix (old_code text primary key, new_code text not null, old_slug text, new_slug text not null);
insert into _fix values
  ('4U-P207', '4U-P200C', '4u-p207', '4u-p200c'),
  ('4U-P231', '4U-P230', '4u-p231', '4u-p230'),
  ('4U-P257', '4U-P250B', '4u-p257', '4u-p250b'),
  ('4U-P282', '4U-P275', '4u-p282', '4u-p275'),
  ('4U-P308', '4U-P300', '4u-p308', '4u-p300'),
  ('4U-P311', '4U-P300B', '4u-p311', '4u-p300b'),
  ('4U-P706', '4U-P660', '4u-p706', '4u-p660'),
  ('4U-P750', '4U-P746', '4u-p750', '4u-p746'),
  ('4U-P1253', '4U-P1250', '4u-p1253', '4u-p1250'),
  ('4U-P1505', '4U-P1500', '4u-p1505', '4u-p1500'),
  ('4U-C155', '4U-C150B', '4u-c155', '4u-c150b'),
  ('4U-C182', '4U-C180B', '4u-c182', '4u-c180b'),
  ('4U-C300B', '4U-C298', '4u-c300b', '4u-c298'),
  ('4U-C370', '4U-C365', '4u-c370', '4u-c365'),
  ('4U-C409', '4U-C407', '4u-c409', '4u-c407'),
  ('4U-C501', '4U-C500D', '4u-c501', '4u-c500d'),
  ('4U-C1275', '4U-C1250', '4u-c1275', '4u-c1250'),
  ('4U-B32', '4U-B30', '4u-b32', '4u-b30'),
  ('4U-B320', '4U-B300', '4u-b320', '4u-b300'),
  ('4U-B375', '4U-B365', '4u-b375', '4u-b365'),
  ('4U-B680', '4U-B660', '4u-b680', '4u-b660'),
  ('4U-B900', '4U-B820', '4u-b900', '4u-b820'),
  ('4U-L31', '4U-L30', '4u-l31', '4u-l30'),
  ('4U-L206', '4U-L200', '4u-l206', '4u-l200');

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
