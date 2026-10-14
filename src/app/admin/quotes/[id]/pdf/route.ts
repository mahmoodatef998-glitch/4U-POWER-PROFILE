import { buildQuotePdf, quoteFileName } from "@/lib/quote-pdf";
import { loadQuoteAssets } from "@/lib/quote-assets";
import { loadQuote } from "@/lib/quote-data";

export const runtime = "nodejs";

/** The quotation as a PDF (behind the admin Basic Auth: this path has no file extension, so middleware guards it). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const q = await loadQuote((await params).id);
  if (!q) return new Response("Quotation not found", { status: 404 });
  const assets = await loadQuoteAssets();
  if ("missing" in assets) return new Response(`Upload the ${assets.missing.join(" and ")} PDF on /admin/quotes first.`, { status: 409, headers: { "content-type": "text/plain; charset=utf-8" } });
  const pdf = await buildQuotePdf(q, assets);
  const download = new URL(req.url).searchParams.has("download");
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${download ? "attachment" : "inline"}; filename="${quoteFileName(q)}"`,
      "cache-control": "private, no-store",
    },
  });
}
