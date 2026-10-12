import type { GensetBrand } from "@/content/genset-types";
import { amps400, STANDARD_ATS_AMPS } from "./calculator";
import type { L10n } from "./utils";

/** What the 3D configurator needs to know about a model (kept small; sent to the browser). */
export type ConfigModel = {
  slug: string;
  code: string;
  brand: GensetBrand;
  engine: string;
  standbyKva: number;
  primeKva: number;
  alternator: string;
  controller: string;
  /** mm / L / kg from the datasheet */
  open: { l: number; w: number; h: number; kg: number | null; tankL: number | null } | null;
  canopy: { l: number; w: number; h: number; kg: number | null; tankL: number | null } | null;
  /** the datasheet only offers a containerised enclosure (e.g. "20 ft container") */
  containerNote: string | null;
  containerKg: number | null;
  /** L/h at 75 % prime, for tank autonomy */
  fuel75: number | null;
  /** product photo, the fallback when WebGL is unavailable */
  image: string;
};

export type Enclosure = "open" | "canopy" | "container20" | "container40";
export type Silencer = "industrial" | "residential" | "critical" | "hospital";
export type Colour = "white" | "grey" | "beige" | "yellow" | "green" | "blue" | "black";

export type Config = {
  model: string;
  enclosure: Enclosure;
  ats: boolean;
  tankL: number;
  trailer: boolean;
  silencer: Silencer;
  remote: boolean;
  colour: Colour;
  units: number;
};

export const TANK_SIZES = [0, 500, 1000, 2000, 3000, 5000] as const;
export const MAX_UNITS = 4;

export const ENCLOSURES: Record<Enclosure, { label: L10n; hint: L10n }> = {
  open: { label: { en: "Open set", ar: "مفتوح" }, hint: { en: "Skid-mounted, for a plant room", ar: "على قاعدة، لغرفة مولدات" } },
  canopy: { label: { en: "Silent canopy", ar: "كابينة عازلة" }, hint: { en: "Weatherproof, sound-attenuated", ar: "مقاومة للعوامل الجوية وعازلة للصوت" } },
  container20: { label: { en: "20 ft container", ar: "حاوية 20 قدم" }, hint: { en: "ISO HC, from 400 kVA", ar: "ISO عالية، من 400 ك.ف.أ" } },
  container40: { label: { en: "40 ft container", ar: "حاوية 40 قدم" }, hint: { en: "ISO HC, from 1000 kVA", ar: "ISO عالية، من 1000 ك.ف.أ" } },
};

export const SILENCERS: Record<Silencer, { label: L10n; db: string; scale: number }> = {
  industrial: { label: { en: "Industrial", ar: "صناعي" }, db: "12–18", scale: 1 },
  residential: { label: { en: "Residential", ar: "سكني" }, db: "18–25", scale: 1.25 },
  critical: { label: { en: "Critical", ar: "حرج" }, db: "25–35", scale: 1.5 },
  hospital: { label: { en: "Hospital", ar: "مستشفيات" }, db: "35–42", scale: 1.8 },
};

export const COLOURS: Record<Colour, { label: L10n; ral: string; hex: string }> = {
  white: { label: { en: "Signal white", ar: "أبيض" }, ral: "RAL 9010", hex: "#efece4" },
  grey: { label: { en: "Light grey", ar: "رمادي فاتح" }, ral: "RAL 7035", hex: "#c7ccc9" },
  beige: { label: { en: "Desert beige", ar: "بيج صحراوي" }, ral: "RAL 1015", hex: "#e4d3b4" },
  yellow: { label: { en: "4U yellow", ar: "أصفر 4U" }, ral: "RAL 1023", hex: "#f2bd1d" },
  green: { label: { en: "Moss green", ar: "أخضر" }, ral: "RAL 6005", hex: "#1f4a3a" },
  blue: { label: { en: "Signal blue", ar: "أزرق" }, ral: "RAL 5005", hex: "#1f4f8f" },
  black: { label: { en: "Jet black", ar: "أسود" }, ral: "RAL 9005", hex: "#1b1c1e" },
};

/** ISO high-cube container outside dimensions, mm. */
export const CONTAINER_MM = { container20: { l: 6058, w: 2438, h: 2896 }, container40: { l: 12192, w: 2438, h: 2896 } } as const;

const TRAILER_MAX_KVA = 500;

/** Which enclosures a model can be ordered in, from its datasheet and size. */
export function allowedEnclosures(m: ConfigModel): Enclosure[] {
  const out: Enclosure[] = ["open"];
  if (m.canopy) out.push("canopy");
  if (m.standbyKva >= 400 || m.containerNote) out.push("container20");
  if (m.standbyKva >= 1000 || /40|30|12 m/.test(m.containerNote ?? "")) out.push("container40");
  return out;
}

export const trailerAllowed = (m: ConfigModel, c: Pick<Config, "enclosure" | "units">) =>
  m.standbyKva <= TRAILER_MAX_KVA && (c.enclosure === "open" || c.enclosure === "canopy") && c.units === 1;

/** Default enclosure: the datasheet's enclosed version (canopy or container), else open. */
export function defaultEnclosure(m: ConfigModel): Enclosure {
  if (m.canopy) return "canopy";
  if (m.containerNote) return /40|30|12 m/.test(m.containerNote) ? "container40" : "container20";
  return "open";
}

/** Keeps a configuration valid when the model or enclosure changes. */
export function normalise(c: Config, m: ConfigModel): Config {
  const encl = allowedEnclosures(m);
  const enclosure = encl.includes(c.enclosure) ? c.enclosure : defaultEnclosure(m);
  const units = Math.min(MAX_UNITS, Math.max(1, Math.round(c.units)));
  const next = { ...c, model: m.slug, enclosure, units };
  return { ...next, trailer: c.trailer && trailerAllowed(m, next), tankL: TANK_SIZES.includes(c.tankL as never) ? c.tankL : 0 };
}

export const defaultConfig = (m: ConfigModel): Config =>
  normalise({ model: m.slug, enclosure: defaultEnclosure(m), ats: true, tankL: 0, trailer: false, silencer: "residential", remote: false, colour: "white", units: 1 }, m);

/** Real outside dimensions (mm) of what is drawn, from the datasheet where it has them. */
export function dimsMm(m: ConfigModel, enclosure: Enclosure): { l: number; w: number; h: number } {
  if (enclosure === "container20" || enclosure === "container40") return CONTAINER_MM[enclosure];
  const d = enclosure === "canopy" ? (m.canopy ?? m.open) : (m.open ?? m.canopy);
  if (d) return { l: d.l, w: d.w, h: d.h };
  const k = m.standbyKva;
  return { l: Math.min(7000, 1400 + 3.5 * k), w: Math.min(2400, 750 + 0.9 * k), h: Math.min(3000, 1200 + 0.9 * k) };
}

export function weightKg(m: ConfigModel, enclosure: Enclosure): number | null {
  if (enclosure === "open") return m.open?.kg ?? null;
  if (enclosure === "canopy") return m.canopy?.kg ?? null;
  return m.containerKg;
}

/** Base-tank litres for the chosen enclosure (containers carry a day tank sized to site). */
export function baseTankL(m: ConfigModel, enclosure: Enclosure): number | null {
  if (enclosure === "open") return m.open?.tankL ?? null;
  if (enclosure === "canopy") return m.canopy?.tankL ?? null;
  return null;
}

export function atsRating(m: ConfigModel, units: number) {
  const a = amps400(m.standbyKva * units);
  return STANDARD_ATS_AMPS.find((x) => x >= a) ?? Math.ceil(a / 100) * 100;
}

/** Hours of running at 75 % prime from base + external tank. */
export function autonomyHours(m: ConfigModel, c: Config): number | null {
  if (!m.fuel75) return null;
  const litres = (baseTankL(m, c.enclosure) ?? 0) * c.units + c.tankL;
  return litres ? litres / (m.fuel75 * c.units) : null;
}

/* ------------------------------------------------------------------ share link */

const ENC_KEYS = Object.keys(ENCLOSURES) as Enclosure[];
const SIL_KEYS = Object.keys(SILENCERS) as Silencer[];
const COL_KEYS = Object.keys(COLOURS) as Colour[];

export function toQuery(c: Config) {
  const q = new URLSearchParams({ model: c.model, enc: c.enclosure, sil: c.silencer, col: c.colour });
  if (!c.ats) q.set("ats", "0");
  if (c.tankL) q.set("tank", String(c.tankL));
  if (c.trailer) q.set("trailer", "1");
  if (c.remote) q.set("remote", "1");
  if (c.units > 1) q.set("units", String(c.units));
  return q.toString();
}

export function fromQuery(q: URLSearchParams, base: Config): Config {
  const pick = <T extends string>(v: string | null, keys: T[], d: T) => (v && keys.includes(v as T) ? (v as T) : d);
  return {
    ...base,
    model: q.get("model") ?? base.model,
    enclosure: pick(q.get("enc"), ENC_KEYS, base.enclosure),
    silencer: pick(q.get("sil"), SIL_KEYS, base.silencer),
    colour: pick(q.get("col"), COL_KEYS, base.colour),
    ats: q.get("ats") !== "0",
    tankL: Number(q.get("tank")) || 0,
    trailer: q.get("trailer") === "1",
    remote: q.get("remote") === "1",
    units: Number(q.get("units")) || 1,
  };
}
