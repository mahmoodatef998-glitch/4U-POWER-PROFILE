import { NextResponse, type NextRequest } from "next/server";
import { submitLead } from "@/app/actions/leads";
import { allowSubmission } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Lead form endpoint. A plain route (not a Server Action) on purpose: its URL never changes between
 * deployments, so a visitor who loaded the page before a deploy can still submit.
 */
export async function POST(req: NextRequest) {
  if (!(await allowSubmission("lead"))) return NextResponse.json({ status: "error" }, { status: 429 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ status: "error" }, { status: 400 });
  return NextResponse.json(await submitLead({ status: "idle" }, form));
}
