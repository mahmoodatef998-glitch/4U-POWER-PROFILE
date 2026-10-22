import { VAT_RATE, totals, type Quote } from "@/lib/quote";
import { loadQuoteAssets } from "@/lib/quote-assets";
import { loadQuote } from "@/lib/quote-data";
import { parseQuotePayload } from "@/lib/quote-form";
import { buildQuotePdf } from "@/lib/quote-pdf";

export const runtime = "nodejs";

const text = (body: string, status: number) => new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

/**
 * PDF of the quotation form as it is now, without saving it or taking a number (marked DRAFT).
 * The editor posts here into a new tab; admin Basic Auth applies (no file extension in the path).
 */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return text("Forbidden", 403);
  const form = await req.formData();
  const parsed = parseQuotePayload(form.get("payload"), false);
  if (parsed.error !== undefined) return text(`Can't preview yet: ${parsed.error}`, 422);
  const d = parsed.data;
  const assets = await loadQuoteAssets();
  if ("missing" in assets) return text(`Upload the ${assets.missing.join(" and ")} PDF on /admin/quotes first.`, 409);
  // an existing quotation keeps its number on the preview; a new one shows DRAFT
  const saved = d.id ? await loadQuote(d.id) : null;
  const q: Quote = {
    id: d.id ?? "draft",
    number: saved?.number ?? 0,
    quote_date: d.quote_date,
    customer: d.customer,
    sales: d.sales,
    items: d.items,
    validity: d.validity || null,
    notes: d.notes || null,
    vat_rate: VAT_RATE,
    ...totals(d.items, VAT_RATE),
    status: d.status,
    lead_id: d.lead_id,
    created_at: "",
  };
  const pdf = await buildQuotePdf(q, assets, { draft: true });
  return new Response(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="Quotation DRAFT.pdf"`,
      "cache-control": "private, no-store",
    },
  });
}
