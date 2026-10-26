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

## Datasheets follow the price list

The price list is what 4U actually buys and sells, so it is the reference (owner's decision, 26 Oct 2026). Where
the Leroy-Somer alternator frame on a 4U datasheet differed from the frame priced on the 2026 list, the datasheet
was changed to the list's frame (29 models: 4U-C80, C150A, C150B, C275, C450, C455, C500, C550, C550A, C550B,
C550C, C700, C715, C900B, C1000, C2250, B20, B44, B50, B72, B250, B250B, B300, B350, B440, B500, B550, B660,
K13). Where the frame itself changed, the Stamford equivalent was removed until the supplier confirms it, rather
than show a frame that no longer matches; the six C450–C550C changes are the same frame in the list's notation
(TAL-A47 → TAL-A473) and keep their Stamford frame. The ratings were already the same on both documents.
The Perkins list gives no alternator frame ("TAL"), so Perkins datasheets keep theirs.

