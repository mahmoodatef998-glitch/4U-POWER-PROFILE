export type GensetBrand = "Perkins" | "Cummins" | "Kubota" | "Baudouin";

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
  /** prime kVA at 60 Hz / 1800 rpm, where the CKD list gives it */
  prime60Kva?: number;
  engine: string;
  // base-engine, alternator and controller data: null on models added from the rating list only ("on request")
  cylinders: number | null;
  layout: "inline" | "V" | null;
  displacementL: number | null;
  boreStrokeMm: string | null;
  aspiration: Aspiration | null;
  governing: "mechanical" | "electronic" | null;
  alternator: { leroySomer: string | null; stamford: string | null };
  controller: string | null;
  /** litres / hour at 50 %, 75 %, 100 % prime load and at standby rating */
  fuelLph: { p50: number | null; p75: number; p100: number; standby: number | null } | null;
  coolantL: number | null;
  oilL: number | null;
  /** sound pressure, dB(A) @ 7 m, canopy */
  noiseDb: number | null;
  open: GensetDim | null;
  enclosed: GensetDim | null;
  /** main breaker; LS MCCB unless stated ("ls" = LS Electric, type not stated in the sheet) */
  breaker?: "ls-mccb" | "ls" | "schneider-acb";
  /** radiator design ambient, °C; 50 unless stated */
  ambientC?: number | null;
};

export type GensetModel = GensetModelData & { brand: GensetBrand };
