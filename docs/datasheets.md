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
  LP625EG9 / EG10 exhaust 150 / 160 m³/min (L900, L1000). No controller, canopy, tank or set dimensions: the
  sheets are engine-only, so those read "on request".
- Cummins list-only sets: Cummins' own G-Drive specification sheets — X2.5-G2 and X3.3-G1 (cummins.com, 10/12),
  4BTAA3.3-G15 / G14 / G12 (mart.cummins.com assets 0064175 / 0064174 / 0064172, 12/20), KTA50-G9 (0070368, 07/21),
  QSK60-G6 (0070614, 04/22). Bore, stroke, oil, coolant, fan, air flow and 50 Hz fuel (C26, C35, C53, C60) filled
  in the model file. ⚠️ Cummins publishes 4BTAA3.3-G12 (4U-C68), KTA50-G9 (4U-C1619) and QSK60-G6 (4U-C2290) at
  1800 rpm / 60 Hz only (QSK60-G6 50 Hz column "–"); their 4U 50 Hz ratings are the 60 Hz figures. Owner to decide.

`npm test` builds every sheet in both languages and checks ratings and wording.
