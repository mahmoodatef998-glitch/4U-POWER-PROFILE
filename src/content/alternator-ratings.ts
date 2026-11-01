/**
 * Leroy-Somer alternator ratings, kVA at 0.8 pf, from Leroy-Somer's own data sheets (TAL-A40 6608, TAL-A42 6609,
 * TAL-A44 6610, TAL-A46 6611, TAL-A473 6612, TAL-A49 6613, LSA 50.2 4098; 6-wire, star):
 * - 50 Hz / 1500 rpm at 400 V, 60 Hz / 1800 rpm at 480 V;
 * - [continuous class H (125 K), standby class H (163 K / 27 °C)] — the limits a set's prime and standby ratings
 *   are held to (owner's rule, 1 Nov 2026: a set's rating is the lower of the engine's and the alternator's).
 * TAL-A47 is the earlier name of the TAL-A473 frame. Frames not listed here (TAL-A40-B, A42-A, A44-B, LSA 51.2,
 * LSA 52.3, LSA 50.2 S6) have no current Leroy-Somer sheet on file and are not checked.
 */
import { frameName } from "@/lib/price-book";

type Pair = [continuous: number, standby: number];
export type FrameRating = { hz50: Pair; hz60: Pair };

const T = (hz50: Pair, hz60: Pair): FrameRating => ({ hz50, hz60 });

export const LEROY_SOMER_RATINGS: Record<string, FrameRating> = {
  "TAL-A40-C": T([13, 14], [15.5, 17]),
  "TAL-A40-D": T([15, 16.5], [18, 20]),
  "TAL-A40-E": T([17.5, 19.3], [21, 23]),
  "TAL-A40-F": T([20, 22], [24, 26]),
  "TAL-A40-G": T([25, 27.5], [30, 33]),
  "TAL-A42-C": T([30, 33], [36, 39.5]),
  "TAL-A42-E": T([38, 42], [45.5, 50]),
  "TAL-A42-F": T([45, 50], [54, 59]),
  "TAL-A42-G": T([50, 55], [60, 66]),
  "TAL-A42-H": T([63, 70], [75.6, 83]),
  "TAL-A44-C": T([85, 93.5], [102, 112]),
  "TAL-A44-D": T([100, 110], [120, 132]),
  "TAL-A44-E": T([125, 137.5], [150, 165]),
  "TAL-A44-H": T([137.5, 151.5], [165, 182]),
  "TAL-A44-J": T([150, 165], [180, 198]),
  "TAL-A44-K": T([170, 187.5], [204, 224]),
  "TAL-A44-L": T([180, 200], [225, 250]),
  "TAL-A44-M": T([200, 220], [250, 275]),
  "TAL-A46-C": T([230, 253], [288, 316]),
  "TAL-A46-D": T([250, 275], [313, 344]),
  "TAL-A46-E": T([275, 303], [344, 378]),
  "TAL-A46-F": T([300, 330], [360, 400]),
  "TAL-A46-G": T([325, 360], [406, 447]),
  "TAL-A46-H": T([365, 400], [438, 480]),
  "TAL-A473-A": T([410, 450], [510, 560]),
  "TAL-A473-B": T([455, 500], [570, 625]),
  "TAL-A473-C": T([500, 550], [625, 690]),
  "TAL-A473-D": T([550, 600], [690, 750]),
  "TAL-A473-E": T([600, 660], [750, 825]),
  "TAL-A473-F": T([660, 730], [825, 910]),
  "TAL-A49-B": T([750, 825], [940, 1030]),
  "TAL-A49-C": T([820, 910], [1025, 1130]),
  "TAL-A49-D": T([910, 1010], [1140, 1255]),
  "TAL-A49-E": T([1000, 1100], [1250, 1375]),
  "LSA50.2 M6": T([1250, 1375], [1560, 1720]),
  "LSA50.2 L7": T([1350, 1485], [1680, 1850]),
  "LSA50.2 L8": T([1500, 1650], [1875, 2060]),
  "LSA50.2 VL10": T([1640, 1800], [2000, 2200]),
};

/** The Leroy-Somer rating of a frame as written on a datasheet or price list ("TAL-A44-J", "TAL044J", "LSA 50.2 M"). */
export function frameRating(alternator: string | null | undefined): FrameRating | null {
  if (!alternator) return null;
  let f = frameName(alternator);
  if (!f) return null;
  f = f.replace(/^TAL-A47-/, "TAL-A473-").replace(/^LSA50\.2 M$/, "LSA50.2 M6");
  return LEROY_SOMER_RATINGS[f] ?? null;
}

/**
 * General characteristics per Leroy-Somer frame family (same sheets): standard excitation and AVR (options after
 * the slash), steady-state voltage regulation, winding, cooling air at 50 Hz and waveform. Insulation class H,
 * IP 23 and 2,250 rpm overspeed on every family.
 */
export type FrameFamily = { excitation: string; avr: string; regulation: string; wires: string; airFlow: string; thd: string; tif: string };
const FAMILIES: Record<string, FrameFamily> = {
  "TAL-A40": { excitation: "SHUNT (AREP+ option)", avr: "R120 (R180 with AREP+)", regulation: "± 1 %", wires: "12", airFlow: "0.08 m³/s", thd: "THF < 2 %", tif: "< 50" },
  "TAL-A42": { excitation: "SHUNT (AREP+ / PMG option)", avr: "R120 (R180 with AREP+)", regulation: "± 1 %", wires: "6 or 12", airFlow: "0.12 m³/s", thd: "< 3.5 % (no load)", tif: "< 50" },
  "TAL-A44": { excitation: "SHUNT (AREP+ / PMG option)", avr: "R120 (R180 with AREP+)", regulation: "± 1 %", wires: "6 or 12", airFlow: "0.25 m³/s", thd: "< 3.5 % (no load)", tif: "< 50" },
  "TAL-A46": { excitation: "SHUNT (AREP+ / PMG option)", avr: "R150 (R180 with AREP+)", regulation: "± 0.8 %", wires: "6 or 12", airFlow: "0.48 m³/s", thd: "< 3.5 % (no load)", tif: "< 50" },
  "TAL-A473": { excitation: "SHUNT (AREP+ / PMG option)", avr: "R150 (R180 with AREP+)", regulation: "± 0.8 %", wires: "6 (12 option)", airFlow: "0.9 m³/s", thd: "< 2.5 % (no load)", tif: "< 50" },
  "TAL-A49": { excitation: "SHUNT (AREP+ / PMG option)", avr: "R150 (R180 with AREP+)", regulation: "± 0.8 %", wires: "6 or 12", airFlow: "1 m³/s", thd: "< 3.5 % (no load)", tif: "< 50" },
  "LSA50.2": { excitation: "AREP or PMG", avr: "D350", regulation: "± 0.25 %", wires: "6 (12 option)", airFlow: "1.8 m³/s", thd: "< 3.5 %", tif: "< 50" },
};

/** The frame family's general characteristics, or null for frames without a current Leroy-Somer sheet on file. */
export function frameFamily(alternator: string | null | undefined): FrameFamily | null {
  const f = alternator && frameName(alternator);
  if (!f) return null;
  const fam = f.replace(/^TAL-A47-/, "TAL-A473-").replace(/-[A-Z](\/[A-Z])?$/, "").replace(/ \S+$/, "");
  return FAMILIES[fam] ?? null;
}
