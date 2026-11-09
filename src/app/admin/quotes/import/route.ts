import { isAdmin, unauthorized } from "@/lib/admin-guard";
import { readQuotePdf } from "@/lib/quote-import-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX = 10 * 1024 * 1024;

/** POST a quotation PDF (field "file"): returns what could be read from it for the editor to fill in. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (Number(req.headers.get("content-length") ?? 0) > MAX + 10_000) return Response.json({ error: "The PDF is larger than 10 MB." }, { status: 413 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "Choose a PDF file." }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "The PDF is larger than 10 MB." }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-") return Response.json({ error: "That file is not a PDF." }, { status: 415 });
  try {
    return Response.json(await readQuotePdf(bytes));
  } catch (e) {
    console.error("[quote-import]", e instanceof Error ? e.message : e);
    return Response.json({ error: "The PDF could not be read. Is it a scanned image? Only PDFs with real text can be imported." }, { status: 422 });
  }
}
