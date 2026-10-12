import { cities } from "@/content/locations";
import { products } from "@/content/products";
import { getModel, nearestModels } from "./genset-models";

export type PageInfo = {
  /** what the visitor was looking at, in sales language */
  title: string;
  /** one line of specs / context */
  detail?: string;
  /** public page (absolute path incl. locale) */
  href?: string;
  /** printable datasheet for the generator in question, when there is one */
  datasheet?: string;
  /** country the page targets, when it matters for the quote (KSA runs 60 Hz) */
  market?: string;
};

const KSA = new Set(["riyadh", "jeddah", "dammam"]);
const IRAQ = new Set(["baghdad", "erbil", "basra"]);

/** Turns a logged page path (e.g. "/ar/models/4u-p500") into what a salesperson needs to answer the chat. */
export function describePage(path: string | null): PageInfo {
  if (!path) return { title: "Unknown page" };
  const [, locale = "en", section, slug] = path.split("/");
  const href = path;

  if (section === "models" && slug) {
    const m = getModel(slug);
    if (m)
      return {
        title: `${m.code} — ${m.standbyKva} kVA ${m.brand}`,
        detail: `Standby ${m.standbyKva} kVA / Prime ${m.primeKva} kVA · ${m.brand} ${m.engine} · ${m.alternator.leroySomer}${m.fuelLph ? ` · ${m.fuelLph.p100} L/h @100%` : ""}`,
        href,
        datasheet: `/${locale}/models/${m.slug}/datasheet`,
      };
  }
  if (section === "generators" && slug) {
    const kva = Number(/^(\d+)-kva$/.exec(slug)?.[1]);
    if (kva) {
      const models = nearestModels(kva);
      return {
        title: `${kva} kVA generator (size page)`,
        detail: models.length ? `Matching models: ${models.map((m) => m.code).join(" / ")}` : undefined,
        href,
        datasheet: models.length === 1 ? `/${locale}/models/${models[0]!.slug}/datasheet` : undefined,
      };
    }
  }
  if (section === "products" && slug) {
    const p = products.find((x) => x.slug === slug);
    if (p) return { title: p.name_en, detail: p.kva_min ? `${p.kva_min}–${p.kva_max} kVA` : undefined, href, datasheet: `/${locale}/products/${p.slug}/datasheet` };
  }
  if (section === "locations" && slug) {
    const c = cities.find((x) => x.slug === slug);
    if (c)
      return {
        title: `City page — ${c.name.en}`,
        detail: "General enquiry from this city; no specific generator chosen yet. Ask the load (kVA) or what it will power.",
        href,
        market: KSA.has(slug) ? "Saudi Arabia — 60 Hz (check voltage with the client)" : IRAQ.has(slug) ? "Iraq — 50 Hz" : "UAE — 50 Hz, 400/230 V",
      };
  }
  const named: Record<string, string> = {
    "": "Home page",
    "ats-panels": "ATS panels",
    switchgear: "Switchgear & panels",
    "spare-parts": "Spare parts",
    services: "Services",
    calculator: "kVA calculator",
    contact: "Contact page",
    models: "Generator model list (Perkins & Cummins)",
    news: slug ? `Article: ${slug.replace(/-/g, " ")}` : "News",
    projects: "Projects",
  };
  return { title: named[section ?? ""] ?? path, href };
}
