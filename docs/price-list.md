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
   supplier confirms. None left: the four gaps of 26 Oct 2026 were rating errors on the 4U sheets (below).

   Ratings corrected on 1 Nov 2026 (owner's go-ahead) from the manufacturers' published data: Baudouin's rating
   tables (baudouin.com engine pages and the Nov 2025 rating cards) and engine datasheets, Kubota's engine pages and
   BG catalogue (engine.kubota.com: "-BG" engines are the 1800 rpm builds, "-BG2" the 1500 rpm ones). Each is also
   checked against the engine's power (kWe ÷ gross kWm is 0.80–0.90 across Baudouin). Old URLs redirect
   (`src/lib/model-renames.ts`):
   - 4U-B150 → **4U-B130** (6M11G2D0/S): 130 / 143 kVA. Baudouin lists this engine only at 60 Hz (150 / 165 kVA from
     138 / 152 kWm); its datasheet gives 120 / 132 kWm at 1500 rpm, which at the 0.87 of the 6M11G4D0/S is
     104 / 115 kWe. The 4U sheet carried the 60 Hz rating as 50 Hz. Matches BP130/150 and is linked to it.
   - 4U-B180 → **4U-B150** (6M11G4D0/S): 150 / 165 kVA (Baudouin table, 50 Hz); 181 / 200 is its 60 Hz rating.
     Matches BP150/180 and is linked to it. Fuel at 1500 rpm from its datasheet.
   - Both 6M11: 6.75 L, 105 × 130 mm (the sheets said 6.5 L, 105 × 124).
   - 4U-B200 (6M16G2D0/S): standby 250 → **220 kVA** / 176 kWe (Baudouin 6M16 table: 200 / 220 at 1500 rpm,
     225 / 250 at 1800 rpm). 250 kVA = 200 kWe would need 0.93 of the 216 kWm gross.
   - 4U-B66 → **4U-B65** (4M10G2D0/S): 50 Hz prime 65 kVA / 52 kWe (Baudouin 4M10 table: 65 / 72); the list says
     BP65. 60 Hz standby 83 → **85 kVA** / 68 kWe (Baudouin: 75 / 85 at 1800 rpm).
   - 4U-B18 at 60 Hz (4M06G2D0/S): prime 20 → **23 kVA** / 18 kWe (Baudouin 4M06 table: 23 / 25 kVA at 1800 rpm;
     the list says BP18/23).
   - 4U-K15 → **4U-K14** (D1703): prime 14 kVA. Kubota: 12.8 kW continuous / 15.0 kW standby at 1500 rpm (BG2), so
     16 kVA standby (12.8 kWe, 0.85) stands but 15 kVA prime (12 kWe) would need 0.94 from a 12 kW alternator. Matches
     KU-14/18 and is linked to it. Fuel "on request": its sheet repeated 4U-K12.5's figures.
   - 4U-K20B removed (redirects to 4U-K22.5): the same V2003-T-E2-BG at a derated 20 / 22 kVA. The engine's
     20.4 kWm continuous / 22.5 kWm at 1500 rpm gives 22.5 / 25 kVA (0.88 / 0.89), as 4U-K22.5 and KU-22/27.

   Checked and left as they are: 4M10G4D0/S, 4M10G6D0/S, 6M16G4D0/S, 6M16G6D0/S, 6M21G2D0/S, 6M21G8D0/S,
   6M33G1D0/S, 6M33G6D0/S match Baudouin's tables at both speeds. 4U-L66 (SA441G2) 66 / 72 kVA fits its
   59 / 66.4 kWm engine (0.90 / 0.87); the list's "68 KVA" is rounding. TR661G1 stays out: its 1500 rpm standby,
   118 kVA / 95 kWe from 96 kWm, is impossible (prime 95 kVA must be 76 kWe, not 86). Baudouin 6M33G1D0/S
   650 / 715 kVA and 12M26G1000/5 900 / 1000 kVA at 50 Hz are on the Nov 2025 card. Kubota at 1500 rpm (BG2):
   every 4U rating is within the engine's power; 4U-K30 (30 kVA from 26.3 kW continuous) is at the edge but within
   ±5 %, 4U-K12.5 is conservative. The 4U Kubota sheets name the "-BG" (1800 rpm) engine; at 50 Hz it is the BG2
   build of the same engine.
   60 Hz data (`src/content/genset-60hz.ts`): Baudouin datasheets checked against Baudouin's 60 Hz table, Lister
   Petter TR sheets, Perkins' Gen Set Power Selector Chart and Cummins' G-Drive ratings card (2023). Engines those
   documents list at 1500 rpm only are blocked at 60 Hz. Not published openly: Lister Petter SA / LP / Mars ratings
   (sheets on request) and Kubota sets on other engines: these take the supplier's figures. Kubota's own three-phase
   sets (generator.kubota.com, SQ range) give 50 / 60 Hz ratings for D1703, V2203 and V3300: 4U-K14 14 / 15.4 kVA
   (60 Hz 17 / 18.7), 4U-K20 20 / 22 (25 / 27.5), 4U-K30 30 / 33 (35 / 38.5); K14 and K30 standby set to these.

   Cummins ratings corrected on 1 Nov 2026 (owner's go-ahead) to Cummins' G-Drive ratings card at 50 Hz, held to
   the Leroy-Somer alternator's rating where that is lower (Leroy-Somer TAL-A42/A44/A46/A473 and LSA 50.2 data
   sheets, 400 V 50 Hz, class H continuous / H 163 K standby): C20 → **C26** 26 / 28; C35 35 / 38; C50 → **C53**
   53 / 60; C180B → C182 182 / 212 (then **C180B** 180 / 200, see below); C250C → **C271** 271 / 302; C300 300 / 330 (engine 321 / 352, TAL-A46-F
   300 / 330); C416 → **C410** 410 / 450 (engine 416 / 455, TAL-A473-A 410 / 450); C455B → C501 501 / 561 (then **C500D** 500 / 550, see below);
   C650 → **C652** 652 / 715; C1400 → **C1416** 1416 / 1650 (engine 1416 / 1675, LSA 50.2 L8 standby 1650).
   Why: in five Cummins rows the 4U "standby" was Cummins' 60 Hz prime (the label's second number, e.g. CP416/479,
   CP500/569), so the 22 Oct 2026 update had stored 60 Hz prime as 50 Hz standby. Still to check with the supplier:
   4U-C68 (4BTAA3.3-G12), 4U-C1619 (KTA50-G9) and 4U-C2290 (QSK60-G6) are Cummins 60 Hz builds whose 4U 50 Hz
   ratings equal Cummins' 60 Hz figures; the CKD-only engines (4BTA3.9-G2, 6BT5.9-G1, 6CTA8.3-G1, 6LTAA8.9-G2,
   M15-G8, QSZ13-G3, KTA38-G2...) are not on Cummins' card. The alternators the list calls KWISE (China) have no
   published ratings: a quotation on that option should be checked against the supplier's alternator data.
   Every set held to its alternator on 1 Nov 2026 (owner's go-ahead, option A: the price list's frames and prices
   stay as they are; the set's rating is the lower of the engine's published figure and the frame's rating). Frame
   ratings are in `src/content/alternator-ratings.ts` (Leroy-Somer sheets 6608–6613 and 4098: 400 V 50 Hz and
   480 V 60 Hz, class H continuous / H 163 K standby); `npm test` fails if any set is rated above its frame. The two
   Cummins figures above for TAL-A44-L (195 / 215) and TAL-A473-C (555 / 610) had been read from the 60 Hz / 416 V
   column; at 400 V 50 Hz they are 180 / 200 and 500 / 550. Changed (prime / standby kVA):
   Perkins P13 13 / 14 (TAL-A40-C), P15 15 / 16.5 (TAL-A40-D), P207 → **P200C** 200 / 220, P231 → **P230**
   230 / 250, P257 → **P250B** 250 / 275, P282 → **P275** 275 / 300, P308 → **P300** 300 / 330 (Perkins chart, 1506A
   series), P311 → **P300B** 300 / 330 (TAL-A46-F), P706 → **P660** 660 / 730 (TAL-A47-F = TAL-A473-F), P750 →
   **P746** 746 / 820, P1253 → **P1250** 1250 / 1375 (LSA 50.2 M6), P1505 → **P1500** 1500 / 1650, P1710 1710 /
   1875 (Perkins chart); Cummins C100B 100 / 110, C136 136 / 150, C155 → **C150B** 150 / 165, C182 → **C180B**
   180 / 200, C200B 200 / 220, C250B 250 / 275, C300B → **C298** 298 / 330, C370 → **C365** 365 / 400, C409 →
   **C407** 407 / 450, C501 → **C500D** 500 / 550, C500C 500 / 550, C810 810 / 900, C910 910 / 1020, C1000B
   1000 / 1100, C1275 → **C1250** 1250 / 1375; Baudouin B32 → **B30** 30 / 33 (TAL-A42-C), B320 → **B300** 300 / 330
   (TAL-A46-F), B375 → **B365** 365 / 400 (TAL-A46-H), B680 → **B660** 660 / 730 (TAL-A473-F), B900 → **B820**
   820 / 910 (TAL-A49-C); Lister L25B 25 / 27.5 (TAL-A40-G), L31 → **L30** 30 / 33 (TAL-A42-C), L206 → **L200**
   200 / 220 (TAL-A44-M). Quotations at 60 Hz hold the maker's 1800 rpm figure to the frame's 480 V rating the
   same way (e.g. C100B 120 / 132, B150 180 / 198). Where the price list's own label names a higher kVA than the
   set now carries (L206 → 200, L31 → 30, BP32 → 30, BP320 → 300, BP380 → 365, BP680 → 660, CP155 → 150,
   CP300 → 298, CP370 → 365, CP409 → 407, CP1275 → 1250), the label stays as the supplier wrote it; only the site
   and quotation rating follow the frame.
   Lister Petter (models from the Lister engine datasheets, `src/content/lister-models.ts`): the list's
   `TR219G1 (Air Cooling)` style names match on the engine code. Not linked: the list's SA315G1 (12 kVA) and
   LP613EG3 (500 kVA) have no datasheet; `LP625SG3` / `LP625G5` are linked to 4U-L638 (LP625EG3) / 4U-L750
   (LP625EG5) as the same rating — confirm the spelling with the supplier.
4. Insert the rows with a new `edition`; the editor always uses the latest edition. Open and closed (canopy /
   container) builds take the same list price (owner's decision, 26 Oct 2026).

## Datasheets follow the price list

The price list is what 4U actually buys and sells, so it is the reference (owner's decision, 26 Oct 2026). Where
the Leroy-Somer alternator frame on a 4U datasheet differed from the frame priced on the 2026 list, the datasheet
was changed to the list's frame (29 models: 4U-C80, C136, C135, C250, C409, C410, C455, C500B, C500C, C500,
C501, C640, C652, C900, C910, C2047, B18, B40, B45, B65, B200, B230, B275, B320, B400, B450, B500, B600,
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

