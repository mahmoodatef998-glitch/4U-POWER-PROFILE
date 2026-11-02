import { NextResponse } from "next/server";
import { buildDatasheet, type Build, type FuelPoint, type Row } from "@/lib/datasheet";
import { getModel } from "@/lib/genset-models";
import { currentModelSlug } from "@/lib/model-renames";

export const dynamic = "force-dynamic";

/** What the 3D configurator shows under the model: the datasheet's technical data (no prices, nothing gated). */
export type ModelSpec = {
  code: string;
  hz: 50 | 60;
  prime: { kva: number; kw: number; amps: number };
  standby: { kva: number; kw: number; amps: number };
  sixty: { prime: number; standby: number | null } | null;
  noiseDb: number | null;
  builds: Build[];
  fuel: FuelPoint[];
  engineRows: Row[];
  alternatorRows: Row[];
  operatingRows: Row[];
  coolingRows: Row[];
  lubeRows: Row[];
  airRows: Row[];
  controller: string | null;
  controllerFeatures: string[];
  enclosureRows: Row[];
};

export function GET(req: Request) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "ar" ? "ar" : "en";
  const m = getModel(currentModelSlug(url.searchParams.get("slug") ?? ""));
  if (!m) return NextResponse.json({ error: "Unknown model" }, { status: 404 });
  const d = buildDatasheet(m, locale);
  const spec: ModelSpec = {
    code: d.code,
    hz: d.hz,
    prime: d.prime,
    standby: d.standby,
    sixty: d.sixty.kind === "rated" ? { prime: d.sixty.prime, standby: d.sixty.standby ?? null } : null,
    noiseDb: d.noiseDb,
    builds: d.builds,
    fuel: d.fuel,
    engineRows: d.engineRows,
    alternatorRows: d.alternatorRows,
    operatingRows: d.operatingRows,
    coolingRows: d.coolingRows,
    lubeRows: d.lubeRows,
    airRows: d.airRows,
    controller: d.controller,
    controllerFeatures: d.controllerFeatures,
    enclosureRows: d.enclosureRows,
  };
  // the data only changes with a deploy: cache at the edge for a day
  return NextResponse.json(spec, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
}
