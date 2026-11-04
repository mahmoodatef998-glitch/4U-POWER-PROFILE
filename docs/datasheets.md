# Customer datasheets

`/[locale]/models/[slug]/datasheet` prints a five-page A4 product data sheet for every model (EN and AR), in the
owner's 4U style (navy / red, Barlow Condensed; sample: 4U-P455 and 4U-K30, 1 Nov 2026). "Download PDF / print"
uses the browser's Save as PDF; pages are fixed A4 with no margins.

- Page 1 cover (photo by size: `modelImage`), ratings cards, overview, supply options, key features.
- Page 2 output ratings at 50 Hz and, where a maker publishes it, at 60 Hz (held to the alternator at 480 V), engine.
- Page 3 alternator, operating data, air system, fuel table and chart, cooling, lubrication and exhaust.
- Page 4 controller, shutdowns, dimensions / weight / noise, enclosure, scope of supply. Page 5 options, voltages.

Data: `src/lib/datasheet.ts` builds every value. Ratings, currents, frames, fuel, dimensions and noise come from the
model files (the checked figures); the extra engine / cooling / air / exhaust / alternator / controller rows come
from `src/content/datasheet-details.json` (the group's technical sheets, remapped to today's codes by engine).

Engineering rules:
- No rating, current or 60 Hz figure is taken from the source sheets.
- A source value that fails a physical check is left off the sheet: radiator fan air against output, combustion air
  against swept volume (0.65–1.15 × naturally aspirated, 1.1–9 × charged), exhaust against combustion air
  (1.5–3.6 ×), heat to room 2–35 % of prime kW, oil and coolant against displacement, fuel 0.18–0.42 L/kWh at full
  prime and rising with load. Held back on 1 Nov 2026: heat to room 128.8 kW and combustion air 143.5 m³/min on the
  1206A / 1506A Perkins sets (P200B, P200C, P230, P250, P250B), radiator fan 0.25 m³/s (C135, C136, C150, C150B),
  48 m³/s (C200, C200B) and 1.41 m³/s (C1000B). Correct the JSON and they print again.
- Fuel figures are the engine's at its own rating; on sets held to a smaller alternator they slightly overstate.
- Tank running hours are worked out (tank ÷ fuel at full prime); breaker make only where the sheet names it.
- Lister Petter (39 sets): engine, cooling, lubrication, air and exhaust rows from Lister Petter's own engine
  datasheets (Starlite SA, Venus LP4 / LP6, Mars Max LP625 and air-cooled TR series, 2024). Held back by the checks:
  SA315G2 exhaust 1.2 m³/min (L10), SA423G1 combustion air 1.1 m³/min (L16), SA432G2 combustion air 2.5 m³/min (L40),
  LP625EG9 / EG10 exhaust 150 / 160 m³/min (L900, L1000). Canopy, open-set dimensions, base tank and controller:
  4U builds the canopy and fits the engine and alternator (owner, 1 Nov 2026), so each Lister set takes those of the
  4U set of the same or next size up whose engine is at least ~85 % of the Lister displacement (named in
  lister-models.ts per set). Weight and noise depend on the engine and stay "on request".
- Cummins list-only sets: Cummins' own G-Drive specification sheets — X2.5-G2 and X3.3-G1 (cummins.com, 10/12),
  4BTAA3.3-G15 / G14 / G12 (mart.cummins.com assets 0064175 / 0064174 / 0064172, 12/20), KTA50-G9 (0070368, 07/21),
  QSK60-G6 (0070614, 04/22). Bore, stroke, oil, coolant, fan, air flow and 50 Hz fuel (C26, C35, C53, C60) filled
  in the model file. Cummins rates 4BTAA3.3-G12 (4U-C68), KTA50-G9 (4U-C1608, was C1619) and QSK60-G6 (4U-C2290) at
  1800 rpm / 60 Hz only; since 1 Nov 2026 these carry `ratedHz: 60` and Cummins' 60 Hz ratings (68 / 75, 1608 / 1913,
  2290 / 2508 kVA at 480/277 V), print as 60 Hz sets, quote at 60 Hz only and stay out of 50 Hz sizing. Their 50 Hz
  counterparts are 4U-C60, 4U-C1416 and 4U-C2047.
- Price-list consistency (1 Nov 2026): every linked row's engine and Leroy-Somer frame match the model file;
  frames added from the list to C35 (TAL-A42-F), C53 / C60 / C68 (TAL-A42-H) and C1608 (LSA 50.2 L8); P225 engine
  named as Perkins and the list do, 1206A-E70TTAG2.

`npm test` builds every sheet in both languages and checks ratings and wording.

## 50 Hz counterparts and list rows (1 Nov 2026)

| 60 Hz-only set | 60 Hz rating (kVA) | 50 Hz counterpart | 50 Hz rating (kVA) |
| --- | --- | --- | --- |
| 4U-C68 4BTAA3.3-G12 | 68 / 75 | 4U-C60 4BTAA3.3-G14 | 60 / 66 (Cummins 61 / 66) |
| 4U-C1608 KTA50-G9 | 1608 / 1913 | 4U-C1500 KTA50-GS8 (added; sheet 4/19) | 1500 / 1650 (engine 1500 / 1675, LSA 50.2 L8) |
| 4U-C2290 QSK60-G6 | 2290 / 2508 | 4U-C2047 QSK60-G4 | 2047 / 2250 — the largest 50 Hz QSK60; next step is QSK78 (2750 / 3000) |
| 4U-P24 404D-22G (added) | 24 / 27 | 4U-P20 404A-22G1 | 20 / 22 |

Price-list rows now linked: V2403-M-DI-BG (KU-20 / 23) → 4U-K20C, 20 / 22 kVA on TAL-A40-F (Kubota sheet 238: 22.4 kW
stand-by net at 1500 rpm); 404D-22G (60HZ) → 4U-P24. Still without a model, for the owner: SA315G1 (12 kVA — Lister's own
2025 table lists the SA315G2 only), LP613EG3 (500 kVA — Lister gives 435 kW maximum at 1500 rpm, enough for 500 kVA
standby but not prime) and V3800DI-T-E2CB (no Kubota sheet for this build). Sets without a list row (4U-C1500, 4U-C2290)
are quoted at a typed-in price.

## Alternator section (1 Nov 2026)

The alternator follows the price list (`src/content/list-alternators.ts`, regenerated from `price_list_items` when a
new edition is loaded): "Options on the price list" names the Leroy-Somer frame(s) and a 4U Power alternator where the
list has one. Sets the list sells with a 4U Power alternator only (P300, P300B, P352, C180B) show that alternator, with
the Leroy-Somer frame "on request" and no Leroy-Somer detail. For a Leroy-Somer frame the rows come from Leroy-Somer's
own sheets (`frameFamily` / `frameRating` in `src/content/alternator-ratings.ts`): frame rating at 400 V 50 Hz (480 V
for 60 Hz sets), winding, class H / IP 23, standard excitation and AVR, voltage regulation, THD / THF, TIF, overspeed
and cooling air flow. Lister Petter sets get the same rows from their list frame (TAL-A40 … A49).

## Sets added from the price list without a sheet of their own (2 Nov 2026)

4U-P24, C26, C35, C53, C60, C68, C1500, C1608, C2290 and K20C had no dimensions. As for Lister, 4U builds the canopy,
so each takes the canopy, open-set dimensions, base tank and controller of the 4U set of the same or next size up
with an engine of at least ~85 % of the displacement (P24 ← P20, C26 ← P30, C35 ← K36, C53 / C60 ← C60B, C68 ← C80,
C1500 / C1608 ← C1416 (KTA50), C2290 ← C2047 (QSK60), K20C ← K20). Weight and noise depend on the engine: on request.

