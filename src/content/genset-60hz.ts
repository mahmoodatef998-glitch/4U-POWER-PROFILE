/**
 * 60 Hz / 1800 rpm ratings, only where a datasheet publishes them (checked: kW = 0.8 × kVA and the rated current
 * matches √3 · V on every row). There is no fixed 50 → 60 Hz factor: the same sheets show sets that gain 13–26 %
 * at 1800 rpm and sets that stay at their 50 Hz rating (4U-B500, B650B, B750), so nothing here is calculated.
 * - Baudouin: the 4U datasheets of the switchable 1500 / 1800 rpm engines (…D0/S), ratings at 480/277 V, checked
 *   against Baudouin's published rating tables (baudouin.com, Nov 2025 cards) on 1 Nov 2026: 4M06G2D0/S prime 23,
 *   4M10G2D0/S standby 85 and 6M11G2D0/S standby 165 kVA corrected.
 * - Lister Petter TR: the engine sheets' "standard generator output" at 1800 rpm (no voltage stated).
 * - Perkins: Perkins' Gen Set Power Selector Chart (unregulated territories), 1800 rpm typical genset output.
 * - Cummins: Cummins' G-Drive diesel ratings card (2023), 1800 rpm typical genset output. Where Cummins builds the
 *   engine for 60 Hz under another code that the supplier's list names with it (X3.3-G1/G2, 6BTA5.9-G5/6), `engine`
 *   is the 60 Hz build the quotation prints.
 * Keyed by the 50 Hz engine. Engines the makers list at 1500 rpm only are in FIFTY_HZ_ONLY and are not offered at
 * 60 Hz; every other set has no 60 Hz data on file and the quotation takes the supplier's 60 Hz figures.
 * Price is the same at 50 and 60 Hz.
 */
export type Rating60 = {
  /** kVA / kWe at 0.8 pf */
  prime: number;
  primeKw: number;
  standby: number;
  standbyKw: number;
  /** voltage the datasheet rates the set at ("480/277"), or null when the sheet gives none */
  volts: string | null;
  source: "baudouin" | "lister" | "perkins" | "cummins";
  /** the engine build at 1800 rpm when its code differs from the 50 Hz one */
  engine?: string;
};

export const RATINGS_60HZ: Record<string, Rating60> = {
  "4M06G2D0/S": { prime: 23, primeKw: 18, standby: 25, standbyKw: 20, volts: "480/277", source: "baudouin" }, // 4U-B18
  "4M06G4D0/S": { prime: 29, primeKw: 23, standby: 32, standbyKw: 25, volts: "480/277", source: "baudouin" }, // 4U-B23
  "4M06G6D0/S": { prime: 38, primeKw: 30, standby: 42, standbyKw: 33, volts: "480/277", source: "baudouin" }, // 4U-B32
  "4M06G8D0/S": { prime: 47, primeKw: 37, standby: 51, standbyKw: 41, volts: "480/277", source: "baudouin" }, // 4U-B40
  "4M06G10D0/S": { prime: 63, primeKw: 50, standby: 69, standbyKw: 55, volts: "480/277", source: "baudouin" }, // 4U-B50
  "4M10G2D0/S": { prime: 75, primeKw: 60, standby: 85, standbyKw: 68, volts: "480/277", source: "baudouin" }, // 4U-B65
  "4M10G4D0/S": { prime: 94, primeKw: 75, standby: 103, standbyKw: 82, volts: "480/277", source: "baudouin" }, // 4U-B80
  "4M10G6D0/S": { prime: 113, primeKw: 90, standby: 125, standbyKw: 100, volts: "480/277", source: "baudouin" }, // 4U-B100
  "6M11G2D0/S": { prime: 150, primeKw: 120, standby: 165, standbyKw: 132, volts: "480/277", source: "baudouin" }, // 4U-B130
  "6M11G4D0/S": { prime: 181, primeKw: 145, standby: 200, standbyKw: 160, volts: "480/277", source: "baudouin" }, // 4U-B150
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
  // Perkins Gen Set Power Selector Chart, 1800 rpm
  "403A-15G2": { prime: 18, primeKw: 14, standby: 20, standbyKw: 16, volts: null, source: "perkins" }, // 4U-P15
  "1103A-33G": { prime: 35, primeKw: 28, standby: 38, standbyKw: 31, volts: null, source: "perkins" }, // 4U-P30
  "1103A-33TG1": { prime: 53, primeKw: 43, standby: 59, standbyKw: 47, volts: null, source: "perkins" }, // 4U-P45
  "1103A-33TG2": { prime: 68, primeKw: 55, standby: 75, standbyKw: 60, volts: null, source: "perkins" }, // 4U-P60
  "1104A-44TG2": { prime: 91, primeKw: 73, standby: 100, standbyKw: 80, volts: null, source: "perkins" }, // 4U-P80
  "1104C-44TAG2": { prime: 114, primeKw: 92, standby: 127, standbyKw: 101, volts: null, source: "perkins" }, // 4U-P100
  "1106A-70TG1": { prime: 152, primeKw: 122, standby: 169, standbyKw: 135, volts: null, source: "perkins" }, // 4U-P135
  "1106A-70TAG2": { prime: 169, primeKw: 135, standby: 188, standbyKw: 150, volts: null, source: "perkins" }, // 4U-P150
  "1106A-70TAG3": { prime: 197, primeKw: 158, standby: 219, standbyKw: 175, volts: null, source: "perkins" }, // 4U-P180
  "1506A-E88TAG1": { prime: 250, primeKw: 200, standby: 275, standbyKw: 220, volts: null, source: "perkins" }, // 4U-P207
  "1506A-E88TAG2": { prime: 250, primeKw: 200, standby: 275, standbyKw: 220, volts: null, source: "perkins" }, // 4U-P231
  "1506A-E88TAG3": { prime: 290, primeKw: 230, standby: 320, standbyKw: 250, volts: null, source: "perkins" }, // 4U-P257
  "1506A-E88TAG4": { prime: 315, primeKw: 250, standby: 350, standbyKw: 275, volts: null, source: "perkins" }, // 4U-P282
  "1506A-E88TAG5": { prime: 350, primeKw: 280, standby: 390, standbyKw: 310, volts: null, source: "perkins" }, // 4U-P308
  "2806A-E18TAG1A": { prime: 625, primeKw: 500, standby: 687, standbyKw: 550, volts: null, source: "perkins" }, // 4U-P600
  "4006-23TAG2A": { prime: 750, primeKw: 600, standby: 825, standbyKw: 660, volts: null, source: "perkins" }, // 4U-P750
  "4006-23TAG3A": { prime: 850, primeKw: 680, standby: 944, standbyKw: 755, volts: null, source: "perkins" }, // 4U-P800
  "4008-TAG1": { prime: 884, primeKw: 707, standby: 975, standbyKw: 780, volts: null, source: "perkins" }, // 4U-P900
  "4008-TAG2": { prime: 1000, primeKw: 800, standby: 1100, standbyKw: 875, volts: null, source: "perkins" }, // 4U-P1000
  "4012-46TWG2A": { prime: 1250, primeKw: 1000, standby: 1375, standbyKw: 1100, volts: null, source: "perkins" }, // 4U-P1253
  "4012-46TAG2A": { prime: 1500, primeKw: 1200, standby: 1675, standbyKw: 1330, volts: null, source: "perkins" }, // 4U-P1505
  "4012-46TAG3A": { prime: 1700, primeKw: 1350, standby: 1880, standbyKw: 1500, volts: null, source: "perkins" }, // 4U-P1710
  // Cummins G-Drive diesel ratings card 2023, 1800 rpm
  "X3.3-G1/G2": { prime: 40, primeKw: 32, standby: 45, standbyKw: 36, volts: null, source: "cummins", engine: "X3.3-G2" }, // 4U-C35
  "4BTAA3.3-G12": { prime: 68, primeKw: 55, standby: 75, standbyKw: 60, volts: null, source: "cummins" }, // 4U-C68
  "6BTA5.9-G5": { prime: 124, primeKw: 100, standby: 137, standbyKw: 110, volts: null, source: "cummins", engine: "6BTA5.9-G6" }, // 4U-C100B
  "6BTAA5.9-G6": { prime: 158, primeKw: 127, standby: 169, standbyKw: 135, volts: null, source: "cummins" }, // 4U-C136
  "QSB7-G4": { prime: 200, primeKw: 160, standby: 223, standbyKw: 179, volts: null, source: "cummins" }, // 4U-C180B
  "QSB7-G5": { prime: 225, primeKw: 180, standby: 261, standbyKw: 208, volts: null, source: "cummins" }, // 4U-C200B
  "QSL9-G3": { prime: 283, primeKw: 226, standby: 320, standbyKw: 256, volts: null, source: "cummins" }, // 4U-C250B
  "6LTAA9.5-G3": { prime: 295, primeKw: 236, standby: 320, standbyKw: 256, volts: null, source: "cummins" }, // 4U-C250C
  "6LTAA9.5-G1": { prime: 312, primeKw: 250, standby: 343, standbyKw: 275, volts: null, source: "cummins" }, // 4U-C300
  "QSL9-G5": { prime: 344, primeKw: 275, standby: 395, standbyKw: 316, volts: null, source: "cummins" }, // 4U-C300B
  "QSG12-G3": { prime: 425, primeKw: 340, standby: 462, standbyKw: 370, volts: null, source: "cummins" }, // 4U-C370
  "QSZ13-G7": { prime: 450, primeKw: 360, standby: 507, standbyKw: 406, volts: null, source: "cummins" }, // 4U-C409
  "QSG12-G4": { prime: 479, primeKw: 383, standby: 523, standbyKw: 418, volts: null, source: "cummins" }, // 4U-C416
  "QSZ13-G5": { prime: 505, primeKw: 404, standby: 558, standbyKw: 446, volts: null, source: "cummins" }, // 4U-C455
  "QSX15-G8": { prime: 466, primeKw: 373, standby: 509, standbyKw: 407, volts: null, source: "cummins" }, // 4U-C455B
  "KTA19-G4": { prime: 570, primeKw: 456, standby: 629, standbyKw: 503, volts: null, source: "cummins" }, // 4U-C500C
  "VTA28-G5": { prime: 683, primeKw: 547, standby: 750, standbyKw: 600, volts: null, source: "cummins" }, // 4U-C640
  "QSK19-G4": { prime: 628, primeKw: 502, standby: 708, standbyKw: 567, volts: null, source: "cummins" }, // 4U-C650
  "QSK23-G3": { prime: 920, primeKw: 736, standby: 1010, standbyKw: 808, volts: null, source: "cummins" }, // 4U-C810
  "KTA38-G3": { prime: 1042, primeKw: 833, standby: 1137, standbyKw: 909, volts: null, source: "cummins" }, // 4U-C910
  "KTA38-G14": { prime: 1153, primeKw: 923, standby: 1265, standbyKw: 1012, volts: null, source: "cummins" }, // 4U-C1000
  "QST30-G4": { prime: 1162, primeKw: 929, standby: 1273, standbyKw: 1019, volts: null, source: "cummins" }, // 4U-C1000B
  "KTA50-G3": { prime: 1404, primeKw: 1123, standby: 1578, standbyKw: 1262, volts: null, source: "cummins" }, // 4U-C1275
  "KTA50-G9": { prime: 1608, primeKw: 1286, standby: 1913, standbyKw: 1530, volts: null, source: "cummins" }, // 4U-C1619
  "QSK60-G6": { prime: 2308, primeKw: 1847, standby: 2528, standbyKw: 2023, volts: null, source: "cummins" }, // 4U-C2290
};

const PERKINS_50 = "Perkins lists this engine at 1500 rpm (50 Hz) only; its 60 Hz range uses other engines";
const CUMMINS_50 = "Cummins rates this engine at 50 Hz only";
/** Engines the makers rate at 1500 rpm only (Perkins chart, Cummins card; Baudouin …/5 is checked by name). */
export const FIFTY_HZ_ONLY: Record<string, string> = {
  "403A-11G1": PERKINS_50,
  "403A(D)-15G1": PERKINS_50,
  "404A(D)-22G1": PERKINS_50,
  "1106A-70TAG4": PERKINS_50,
  "2206A-E13TAG2": PERKINS_50,
  "2206A-E13TAG3": PERKINS_50,
  "2506A-E15TAG1": PERKINS_50,
  "2506A-E15TAG2": PERKINS_50,
  "2806A-E18TAG2": PERKINS_50,
  "4016-61TRG1": PERKINS_50,
  "4016-61TRG2": PERKINS_50,
  "4016-61TRG3": PERKINS_50,
  "X2.5-G2": `${CUMMINS_50} (its 60 Hz build is the X2.5-G4)`,
  "4BTAA3.3-G15": CUMMINS_50,
  "4BTAA3.3-G14": CUMMINS_50,
  "6BTAA5.9-G7": CUMMINS_50,
  "VTA28-G6": CUMMINS_50,
  "KTA50-G8": `${CUMMINS_50} (its 60 Hz build is the KTA50-G9)`,
  "QSK60-G4": `${CUMMINS_50} (its 60 Hz build is the QSK60-G6)`,
};
