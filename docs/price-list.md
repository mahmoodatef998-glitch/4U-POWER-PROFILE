# Quotation price lists

The UAE and Export consumer price lists (PDFs in the owner's Google Drive, folder "4U Pricing List") are loaded
into the private Supabase table `price_list_items` — **never into this repository**, which is public. The quotation
editor reads them through `src/lib/price-book-data.ts`; `/admin/quotes/prices` shows which model gets which price.

## Loading a new edition

1. Parse both PDFs (one row per line: list, brand, list code such as `CP455/500`, engine, alternator, origin,
   currency, price). Perkins is in GBP; the editor converts it with the rate saved on `/admin/quotes/prices`.
2. Link each row to 4U model codes by **engine** (normalised: letters and digits only), with these spelling
   aliases from the 2026 lists: `X3.3G1/2` → X3.3-G1/G2, `6BTA5.9G5/6` → 6BTA5.9-G5, `C6LTAA9.5G3` → 6LTAA9.5-G3,
   Kubota `…-E2BG` → `…-E2-BG` (`V3300-E2BG` → V3300-E2-BG2), `404A-22G1` → 404A(D)-22G1,
   `1206A-E70TTAG2` → 1206A-E70TAG2, `4008TAG2A` → 4008-TAG2, `2506A-E15AG2` → 2506A-E15TAG2.
3. Then compare the list's rating (first number = prime kVA at 50 Hz, second = 60 Hz) with the datasheet's prime
   rating. Small rounding gaps (≤ 4 %) are the same genset. **Do not link** where the gap is real — decided by
   the owner on 26 Oct 2026, prices for these are typed per quotation until the supplier confirms:
   - 4U-B165 (6M11G2D0/S, 150 kVA prime) vs list BP130/150
   - 4U-B200 (6M11G4D0/S, 180 kVA prime) vs list BP150/180
   - 4U-K16 (D1703-E2-BG, 15 kVA prime) vs list KU-14/18
   - 4U-K22B (V2003-T-E2-BG, 20 kVA prime) vs list KU-22/27 (that row prices 4U-K25)
4. Insert the rows with a new `edition`; the editor always uses the latest edition. Open and closed (canopy /
   container) builds take the same list price (owner's decision, 26 Oct 2026).
