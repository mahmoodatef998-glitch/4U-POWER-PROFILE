/**
 * 60 Hz / 1800 rpm ratings, only where a datasheet publishes them (checked: kW = 0.8 × kVA and the rated current
 * matches √3 · V on every row). There is no fixed 50 → 60 Hz factor: the same sheets show sets that gain 13–26 %
 * at 1800 rpm and sets that stay at their 50 Hz rating (4U-B150, B500, B650B, B750), so nothing here is calculated.
 * - Baudouin: the 4U datasheets of the switchable 1500 / 1800 rpm engines (…D0/S), ratings at 480/277 V.
 * - Lister Petter TR: the engine sheets' "standard generator output" at 1800 rpm (no voltage stated).
 * Keyed by engine. Every other set has no 60 Hz data on file: the quotation takes the supplier's 60 Hz figures.
 * Baudouin …/5 engines are 50 Hz builds and are not offered at 60 Hz. Price is the same at 50 and 60 Hz.
 * To check with the owner: 4U-B18 prime is 20 kVA on the sheet but 23 in the price-list label (BP18/23).
 */
export type Rating60 = {
  /** kVA / kWe at 0.8 pf */
  prime: number;
  primeKw: number;
  standby: number;
  standbyKw: number;
  /** voltage the datasheet rates the set at ("480/277"), or null when the sheet gives none */
  volts: string | null;
  source: "baudouin" | "lister";
};

export const RATINGS_60HZ: Record<string, Rating60> = {
  "4M06G2D0/S": { prime: 20, primeKw: 16, standby: 25, standbyKw: 20, volts: "480/277", source: "baudouin" }, // 4U-B18
  "4M06G4D0/S": { prime: 29, primeKw: 23, standby: 32, standbyKw: 25, volts: "480/277", source: "baudouin" }, // 4U-B23
  "4M06G6D0/S": { prime: 38, primeKw: 30, standby: 42, standbyKw: 33, volts: "480/277", source: "baudouin" }, // 4U-B32
  "4M06G8D0/S": { prime: 47, primeKw: 37, standby: 51, standbyKw: 41, volts: "480/277", source: "baudouin" }, // 4U-B40
  "4M06G10D0/S": { prime: 63, primeKw: 50, standby: 69, standbyKw: 55, volts: "480/277", source: "baudouin" }, // 4U-B50
  "4M10G2D0/S": { prime: 75, primeKw: 60, standby: 83, standbyKw: 66, volts: "480/277", source: "baudouin" }, // 4U-B66
  "4M10G4D0/S": { prime: 94, primeKw: 75, standby: 103, standbyKw: 82, volts: "480/277", source: "baudouin" }, // 4U-B80
  "4M10G6D0/S": { prime: 113, primeKw: 90, standby: 125, standbyKw: 100, volts: "480/277", source: "baudouin" }, // 4U-B100
  "6M11G2D0/S": { prime: 150, primeKw: 120, standby: 170, standbyKw: 135, volts: "480/277", source: "baudouin" }, // 4U-B150
  "6M11G4D0/S": { prime: 181, primeKw: 145, standby: 200, standbyKw: 160, volts: "480/277", source: "baudouin" }, // 4U-B180
  "6M16G2D0/S": { prime: 225, primeKw: 180, standby: 250, standbyKw: 200, volts: "480/277", source: "baudouin" }, // 4U-B200
  "6M16G4D0/S": { prime: 250, primeKw: 200, standby: 280, standbyKw: 224, volts: "480/277", source: "baudouin" }, // 4U-B230
  "6M16G6D0/S": { prime: 284, primeKw: 227, standby: 313, standbyKw: 250, volts: "480/277", source: "baudouin" }, // 4U-B250
  "6M21G2D0/S": { prime: 390, primeKw: 312, standby: 430, standbyKw: 344, volts: "480/277", source: "baudouin" }, // 4U-B375
  "6M21G8D0/S": { prime: 500, primeKw: 400, standby: 575, standbyKw: 460, volts: "480/277", source: "baudouin" }, // 4U-B500
  "6M33G1D0/S": { prime: 650, primeKw: 520, standby: 715, standbyKw: 572, volts: "480/277", source: "baudouin" }, // 4U-B650B
  "6M33G6D0/S": { prime: 750, primeKw: 600, standby: 825, standbyKw: 660, volts: "480/277", source: "baudouin" }, // 4U-B750
  "TR219G1": { prime: 15, primeKw: 12, standby: 16.5, standbyKw: 13, volts: null, source: "lister" }, // 4U-L12.5
  "TR328G1": { prime: 27, primeKw: 22, standby: 30, standbyKw: 24, volts: null, source: "lister" }, // 4U-L25B
  "TR438G1": { prime: 52, primeKw: 42, standby: 58, standbyKw: 46, volts: null, source: "lister" }, // 4U-L45
  "TR441G1": { prime: 70, primeKw: 56, standby: 77, standbyKw: 62, volts: null, source: "lister" }, // 4U-L60B
  "TR661G2": { prime: 147, primeKw: 118, standby: 162, standbyKw: 130, volts: null, source: "lister" }, // 4U-L125B
};
