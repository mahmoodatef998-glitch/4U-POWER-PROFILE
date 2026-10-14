import { PDFDocument } from "pdf-lib";
import { revalidatePath } from "next/cache";
import { ASSET_FILES, BUCKET, type AssetKey } from "@/lib/quote-assets";
import { getAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX = 10 * 1024 * 1024;
const back = (req: Request, msg: string) => Response.redirect(new URL(`/admin/quotes?assets=${encodeURIComponent(msg)}`, req.url), 303);

/**
 * Upload the letterhead and/or terms PDF to the private bucket (admin Basic Auth applies: no file extension in the path).
 * A route handler rather than a server action so the 1 MB server-action body limit doesn't apply.
 */
export async function POST(req: Request) {
  // same-origin only: a cached Basic Auth login must not let another site replace the letterhead
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return new Response("Forbidden", { status: 403 });
  const sb = getAdminClient();
  if (!sb) return back(req, "Supabase is not configured.");
  const form = await req.formData();
  const done: string[] = [];
  for (const key of Object.keys(ASSET_FILES) as AssetKey[]) {
    const f = form.get(key);
    if (!(f instanceof File) || !f.size) continue;
    if (f.size > MAX) return back(req, `${key}: the file is over 10 MB.`);
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const pdf = await PDFDocument.load(bytes);
      if (!pdf.getPageCount()) throw new Error("no pages");
    } catch {
      return back(req, `${key}: that file is not a readable PDF.`);
    }
    const { error } = await sb.storage.from(BUCKET).upload(ASSET_FILES[key], bytes, { contentType: "application/pdf", upsert: true });
    if (error) return back(req, `${key}: ${error.message}${/bucket/i.test(error.message) ? " (run the quotations SQL migration first)" : ""}`);
    done.push(key);
  }
  revalidatePath("/admin/quotes");
  return back(req, done.length ? `Uploaded: ${done.join(" & ")}.` : "Choose a PDF to upload.");
}
