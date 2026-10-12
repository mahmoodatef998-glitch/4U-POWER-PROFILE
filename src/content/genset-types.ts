export type GensetBrand = "Perkins" | "Cummins";

export type Aspiration =
  | "na"
  | "turbo"
  | "turbo-ac"
  | "turbo-aa"
  | "twin-turbo-aa"
  | "turbo-water";

export type GensetDim = {
  l?: number;
  w?: number;
  h?: number;
  tankL?: number | null;
  kg: number | null;
  container?: string;
};

/** One 4U generating set (50 Hz, 1500 rpm, 400/230 V, 3-phase, 0.8 pf) as listed in its brand's data file. */
export type GensetModelData = {
  slug: string;
  code: string;
  standbyKva: number;
  standbyKw: number;
  primeKva: number;
  primeKw: number;
  engine: string;
  cylinders: number;
  layout: "inline" | "V";
  displacementL: number;
  boreStrokeMm: string;
  aspiration: Aspiration;
  governing: "mechanical" | "electronic";
  alternator: { leroySomer: string; stamford: string | null };
  controller: string;
  /** litres / hour at 50 %, 75 %, 100 % prime load and at standby rating */
  fuelLph: { p50: number; p75: number; p100: number; standby: number | null } | null;
  coolantL: number | null;
  oilL: number | null;
  /** sound pressure, dB(A) @ 7 m, canopy */
  noiseDb: number | null;
  open: GensetDim | null;
  enclosed: GensetDim | null;
  /** main breaker; LS MCCB unless stated */
  breaker?: "ls-mccb" | "schneider-acb";
  /** radiator design ambient, °C; 50 unless stated */
  ambientC?: number | null;
};

export type GensetModel = GensetModelData & { brand: GensetBrand };
