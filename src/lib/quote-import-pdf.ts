import { PDFDocument, PDFHexString, PDFName, PDFString, type PDFDict } from "pdf-lib";
import { getDocumentProxy } from "unpdf";
import { parseEmbedded, parseQuoteLines, QUOTE_DATA_KEY, QUOTE_KEYWORD_PREFIX, type ImportedQuote, type Line } from "./quote-import";

/** Reads a quotation PDF: the embedded 4U data when present, otherwise its text (see quote-import.ts). */
export async function readQuotePdf(bytes: Uint8Array): Promise<ImportedQuote> {
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false, ignoreEncryption: true });
    // getInfoDict is public in pdf-lib's JS but not in its typings
    const v = (doc as unknown as { getInfoDict(): PDFDict }).getInfoDict().lookup(PDFName.of(QUOTE_DATA_KEY));
    if (v instanceof PDFString || v instanceof PDFHexString) {
      const q = parseEmbedded(v.decodeText());
      if (q) return q;
    }
    const kw = doc.getKeywords();
    if (kw?.startsWith(QUOTE_KEYWORD_PREFIX)) {
      const q = parseEmbedded(Buffer.from(kw.slice(QUOTE_KEYWORD_PREFIX.length).trim(), "base64").toString("utf8"));
      if (q) return q;
    }
  } catch {
    // not readable by pdf-lib: fall through to the text reader
  }
  return parseQuoteLines(await pdfLines(bytes));
}

/** Text of the first pages as lines, each with its cells' x positions (pdf.js via unpdf). */
export async function pdfLines(bytes: Uint8Array, maxPages = 10): Promise<Line[]> {
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const lines: Line[] = [];
  for (let p = 1; p <= Math.min(pdf.numPages, maxPages); p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items
      .flatMap((it) => ("str" in it && it.str.trim() ? [{ x: it.transform[4] as number, y: it.transform[5] as number, w: it.width as number, str: it.str }] : []))
      .sort((a, b) => b.y - a.y || a.x - b.x);
    let line: Line | null = null;
    for (const it of items) {
      if (!line || Math.abs(line.y - it.y) > 3) {
        line = { page: p, y: it.y, segs: [] };
        lines.push(line);
      }
      line.segs.push({ x: it.x, x2: it.x + it.w, str: it.str });
    }
  }
  for (const l of lines) l.segs.sort((a, b) => a.x - b.x);
  return lines;
}
