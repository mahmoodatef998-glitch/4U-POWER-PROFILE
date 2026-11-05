import { NextResponse, type NextRequest } from "next/server";
import { submitPartsRequest } from "@/app/actions/parts";
import { allowSubmission } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Spare-parts request endpoint (stable URL across deployments; photos ≤3, downscaled in the browser). */
export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > 4_400_000) return NextResponse.json({ status: "error" }, { status: 413 });
  if (!(await allowSubmission("parts"))) return NextResponse.json({ status: "error" }, { status: 429 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ status: "error" }, { status: 400 });
  return NextResponse.json(await submitPartsRequest(form));
}
