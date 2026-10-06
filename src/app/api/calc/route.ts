import { NextResponse, type NextRequest } from "next/server";
import { logCalculation } from "@/app/actions/calculator";

export const dynamic = "force-dynamic";

/** Logs a completed kVA calculation (stable URL across deployments). */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ id: null }, { status: 400 });
  return NextResponse.json(await logCalculation(body));
}
