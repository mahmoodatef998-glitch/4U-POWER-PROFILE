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
3. Then compare the list's rating with the datasheet's prime rating. The first number is the 50 Hz prime kVA. The
   second differs by brand: Baudouin = 60 Hz prime (matches the 60 Hz column of the …D0/S datasheets in 13 of 16);
   Cummins = 50 Hz standby (CP60/68 is 4BTA3.9-G2 at 60 / 68 kVA); Kubota = probably 60 Hz prime, unconfirmed. So
   the labels are not used as 60 Hz data (`src/content/genset-60hz.ts` takes datasheets only). Small rounding gaps
   (≤ 4 %) are the same genset. **Do not link** where the gap is real; the price is typed per quotation until the
   supplier confirms. Still unlinked:
   - 4U-B150 (6M11G2D0/S, 150 kVA prime) vs list BP130/150. Baudouin's 6M11 table rates this engine 150 / 165 kVA
     at 1500 rpm (138 / 152 kWm gross), so 4U keeps 150. The list's 130 at 50 Hz with 150 at 60 Hz fits a smaller
     alternator (an alternator gives ≈ 15 % more at 60 Hz): ask the supplier which frame their BP130 has.

   Ratings corrected on 1 Nov 2026 (owner's go-ahead), each checked against Baudouin's published rating tables or
   Kubota's engine data and against the engine's power (kWe ÷ gross kWm is 0.80–0.90 across the Baudouin range;
   a small alternator is 0.85–0.87 efficient). Old URLs redirect (`src/lib/model-renames.ts`):
   - 4U-B180 → **4U-B150B** (6M11G4D0/S): 50 Hz 150 / 165 kVA (Baudouin datasheet: 138 / 152 kWm at 1500 rpm). The
     4U sheet's 180 / 200 was its 1800 rpm rating (Baudouin: 181 / 200 kVA). Same alternator frame as 4U-B150.
     Now matches BP150/180 and is linked to it.
   - 4U-B200 (6M16G2D0/S): standby 250 → **220 kVA** / 176 kWe (Baudouin 6M16 table: 200 / 220 at 1500 rpm,
     225 / 250 at 1800 rpm). 250 kVA = 200 kWe would need 0.93 of the 216 kWm gross.
   - 4U-B66 → **4U-B65** (4M10G2D0/S): 50 Hz prime 65 kVA / 52 kWe (Baudouin 4M10 table: 65 / 72); the list says
     BP65. 60 Hz standby 83 → **85 kVA** / 68 kWe (Baudouin: 75 / 85 at 1800 rpm).
   - 4U-B18 at 60 Hz (4M06G2D0/S): prime 20 → **23 kVA** / 18 kWe, as the list (BP18/23) and the 60 Hz sets built
     on this engine (23 / 25 kVA); 20 / 25 was off the sheet's own ratio (1.25) and engine power (0.70).
   - 4U-K15 → **4U-K14** (D1703-E2-BG): prime 14 kVA. The engine gives 15.1 kWm standby at 1500 rpm, so 16 kVA
     standby (12.8 kWe, 0.85) stands but 15 kVA prime (12 kWe) would need 0.92 from a 12 kW alternator. Matches
     KU-14/18 and is linked to it. Fuel "on request": its sheet repeated 4U-K12.5's figures.
   - 4U-K20B removed (redirects to 4U-K22.5): the same V2003-T-E2-BG at a derated 20 / 22 kVA. The engine's
     20.4 kWm continuous / 22.5 kWm at 1500 rpm gives 22.5 / 25 kVA (0.88 / 0.89), as 4U-K22.5 and KU-22/27.

   Checked and left as they are: 4M10G4D0/S, 4M10G6D0/S, 6M16G4D0/S, 6M16G6D0/S, 6M21G2D0/S, 6M21G8D0/S,
   6M33G1D0/S, 6M33G6D0/S match Baudouin's tables at both speeds. 4U-L66 (SA441G2) 66 / 72 kVA fits its
   59 / 66.4 kWm engine (0.90 / 0.87); the list's "68 KVA" is rounding. TR661G1 stays out: its 1500 rpm standby,
   118 kVA / 95 kWe from 96 kWm, is impossible (prime 95 kVA must be 76 kWe, not 86). The "net" engine figures
   on the 4U sheets of 6M11G2D0/S and 6M11G4D0/S (fan losses of 24–31 kW) are wrong: use gross.
   Lister Petter (models from the Lister engine datasheets, `src/content/lister-models.ts`): the list's
   `TR219G1 (Air Cooling)` style names match on the engine code. Not linked: the list's SA315G1 (12 kVA) and
   LP613EG3 (500 kVA) have no datasheet; `LP625SG3` / `LP625G5` are linked to 4U-L638 (LP625EG3) / 4U-L750
   (LP625EG5) as the same rating — confirm the spelling with the supplier.
4. Insert the rows with a new `edition`; the editor always uses the latest edition. Open and closed (canopy /
   container) builds take the same list price (owner's decision, 26 Oct 2026).

## Datasheets follow the price list

The price list is what 4U actually buys and sells, so it is the reference (owner's decision, 26 Oct 2026). Where
the Leroy-Somer alternator frame on a 4U datasheet differed from the frame priced on the 2026 list, the datasheet
was changed to the list's frame (29 models: 4U-C80, C136, C135, C250, C409, C416, C455, C500B, C500C, C500,
C455B, C640, C650, C900, C910, C2047, B18, B40, B45, B66, B200, B230, B275, B320, B400, B450, B500, B600,
K12). Where the frame itself changed, the Stamford equivalent was removed until the supplier confirms it, rather
than show a frame that no longer matches; the six C409–C500C changes are the same frame in the list's notation
(TAL-A47 → TAL-A473) and keep their Stamford frame. The ratings were already the same on both documents.
The Perkins list gives no alternator frame ("TAL"), so Perkins datasheets keep theirs.

## Naming alternators (owner's rule, 26 Oct 2026)

- A **TAL** or **LSA** alternator is **Leroy-Somer**, with its frame when known (e.g. "Leroy-Somer TAL-A44-H").
- **Any other alternator** on the lists (Kwise, "China", LP…) is a **"4U Power alternator"**. Never describe an
  alternator as Chinese, by its supplier's brand, or as a generic "brushless" alternator — on the site, in
  quotations, datasheets or articles. (`alternatorName`, `alternatorPhrase` in `src/lib/price-book.ts` /
  `src/lib/quote.ts` apply this.)

