import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { COMPANY, SPEC_NOTE, money, printable, quoteNumber, ukDate, type Quote } from "./quote";
import type { QuoteAssets } from "./quote-assets";

/**
 * Quotation PDF on the 4U letterhead: page 1 (and more if the items run long) is drawn on the letterhead,
 * the last page is the Terms & Conditions sheet exactly as supplied. Layout follows the usual GCC quotation:
 * customer / company blocks, item table, totals.
 */

const NAVY = rgb(0x1b / 255, 0x2a / 255, 0x41 / 255);
const INK = rgb(0x22 / 255, 0x22 / 255, 0x22 / 255);
const MUTED = rgb(0.42, 0.45, 0.5);
const GOLD = rgb(0.949, 0.761, 0);
const RULE = rgb(0.75, 0.75, 0.75);
const SHADE = rgb(0.95, 0.95, 0.95);
const SHADE_DARK = rgb(0.9, 0.9, 0.9);
const WHITE = rgb(1, 1, 1);

// Content box inside the letterhead (A4 points, origin bottom-left): clear of the header rule and the brand strip.
const X0 = 55;
const X1 = 540.5;
const TOP = 842.25 - 98;
const BOTTOM = 76;

type Fonts = { regular: PDFFont; bold: PDFFont };

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of printable(text).split("\n")) {
    let line = "";
    for (const word of para.split(/ +/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) {
        line = next;
        continue;
      }
      if (line) out.push(line);
      // a single word wider than the column (long e-mails, part numbers) is broken by character
      let w = word;
      while (font.widthOfTextAtSize(w, size) > width && w.length > 1) {
        let i = w.length - 1;
        while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > width) i--;
        out.push(w.slice(0, i));
        w = w.slice(i);
      }
      line = w;
    }
    out.push(line);
  }
  return out;
}

export async function buildQuotePdf(q: Quote, assets: QuoteAssets): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Quotation ${quoteNumber(q.number)} - ${printable(q.customer.name)}`);
  doc.setAuthor(COMPANY.name);
  doc.setCreator("4U Power Generation admin");
  const [letterhead] = await doc.embedPdf(assets.letterhead, [0]);
  const fonts: Fonts = { regular: await doc.embedFont(StandardFonts.Helvetica), bold: await doc.embedFont(StandardFonts.HelveticaBold) };
  const { width: W, height: H } = letterhead!;

  const pages: PDFPage[] = [];
  const newPage = () => {
    const p = doc.addPage([W, H]);
    p.drawPage(letterhead!, { x: 0, y: 0, width: W, height: H });
    pages.push(p);
    return p;
  };

  let page = newPage();
  let y = TOP;
  const text = (s: string, x: number, yy: number, size: number, font = fonts.regular, color = INK) => page.drawText(printable(s), { x, y: yy, size, font, color });
  const textRight = (s: string, xr: number, yy: number, size: number, font = fonts.regular, color = INK) =>
    text(s, xr - font.widthOfTextAtSize(printable(s), size), yy, size, font, color);

  /* ---------------------------------------------------------- customer / company blocks */
  const gap = 14;
  const colW = (X1 - X0 - gap) / 2;
  const labelW = 74;
  const fs = 8.2;
  const lead = 10.5;
  const block = (x: number, title: string, rows: [string, string][]) => {
    let yy = y;
    page.drawRectangle({ x, y: yy - 15, width: colW, height: 15, color: NAVY });
    text(title, x + (colW - fonts.bold.widthOfTextAtSize(printable(title), 8.6)) / 2, yy - 10.8, 8.6, fonts.bold, WHITE);
    yy -= 15;
    rows.forEach(([k, v], i) => {
      const lines = wrap(v || "", fonts.regular, fs, colW - labelW - 8);
      const h = Math.max(1, lines.length) * lead + 4;
      if (i % 2 === 0) page.drawRectangle({ x, y: yy - h, width: colW, height: h, color: SHADE });
      text(k, x + 5, yy - 10, fs, fonts.bold, NAVY);
      lines.forEach((l, j) => text(l, x + labelW, yy - 10 - j * lead, fs));
      yy -= h;
    });
    return yy;
  };
  const c = q.customer;
  const customerRows = (
    [
      ["Customer:", c.name],
      ["Address:", c.address],
      ["TRN:", c.trn],
      ["Project:", c.project],
      ["Attention:", c.attention],
      ["Contact:", c.contact],
      ["Email:", c.email],
      ["Customer ref:", c.ref],
    ] as [string, string][]
  ).filter(([, v], i) => i === 0 || v?.trim());
  const companyRows: [string, string][] = [
    ["Ref:", quoteNumber(q.number)],
    ["Date:", ukDate(q.quote_date)],
    ["TRN:", COMPANY.trn],
    ["Sales Person:", q.sales.person],
    ["Contact:", q.sales.contact],
    ["Email:", q.sales.email],
    ...(q.validity?.trim() ? ([["Validity:", q.validity]] as [string, string][]) : []),
  ];
  const yLeft = block(X0, "CUSTOMER DETAILS", customerRows);
  const yRight = block(X0 + colW + gap, COMPANY.name, companyRows.filter(([, v]) => v?.trim()));
  y = Math.min(yLeft, yRight) - 26;

  /* ---------------------------------------------------------- title */
  text("QUOTATION", X0, y + 4, 8, fonts.bold, MUTED);
  text(quoteNumber(q.number), X0, y - 18, 21, fonts.regular, NAVY);
  page.drawRectangle({ x: X0, y: y - 25, width: 38, height: 2, color: GOLD });
  y -= 36;

  /* ---------------------------------------------------------- item table */
  const cols = [
    { key: "desc", label: ["DESCRIPTION"], w: 245 },
    { key: "qty", label: ["QUANTITY"], w: 52 },
    { key: "unit", label: ["UNIT", "PRICE"], w: 70 },
    { key: "tax", label: ["TAXES"], w: 38 },
    { key: "total", label: ["TOTAL PRICE"], w: X1 - X0 - 245 - 52 - 70 - 38 },
  ];
  const colX = cols.map((_, i) => X0 + cols.slice(0, i).reduce((s, cc) => s + cc.w, 0));
  const headerH = 28;
  const pad = 5;
  const descSize = 8.4;
  const descLead = 11.2;

  const drawHeader = () => {
    page.drawRectangle({ x: X0, y: y - headerH, width: X1 - X0, height: headerH, color: NAVY });
    cols.forEach((col, i) => {
      col.label.forEach((l, j) => {
        const yy = y - headerH + 7 + (col.label.length - 1 - j) * 10;
        if (i === 0) text(l, colX[i]! + pad, yy, 8.4, fonts.bold, WHITE);
        else textRight(l, colX[i]! + col.w - pad, yy, 8.4, fonts.bold, WHITE);
      });
    });
    y -= headerH;
  };
  // borders for a run of rows on the current page, from yTop down to yBottom
  const drawFrame = (yTop: number, yBottom: number) => {
    page.drawRectangle({ x: colX[4]!, y: yBottom, width: cols[4]!.w, height: yTop - yBottom, color: SHADE });
    page.drawRectangle({ x: X0, y: yBottom, width: X1 - X0, height: yTop - yBottom, borderColor: RULE, borderWidth: 0.6 });
    for (let i = 1; i < cols.length; i++) page.drawLine({ start: { x: colX[i]!, y: yTop }, end: { x: colX[i]!, y: yBottom }, thickness: 0.6, color: RULE });
  };
  // the frame goes under the text, so each page's rows are collected first and drawn after their frame
  type Pending = () => void;
  let pending: Pending[] = [];
  let frameTop = 0;
  const flush = (yBottom: number) => {
    drawFrame(frameTop, yBottom);
    pending.forEach((f) => f());
    pending = [];
  };
  const startTable = () => {
    drawHeader();
    frameTop = y;
  };
  const nextPage = () => {
    flush(y - pad);
    page = newPage();
    y = TOP;
    startTable();
  };

  startTable();
  q.items.forEach((item, idx) => {
    const lines: { s: string; bold: boolean }[] = [
      ...wrap(item.title, fonts.bold, descSize, cols[0]!.w - 2 * pad).map((s) => ({ s, bold: true })),
      ...(item.description.trim() ? wrap(item.description, fonts.regular, descSize, cols[0]!.w - 2 * pad).map((s) => ({ s, bold: false })) : []),
    ];
    let first = true;
    let i = 0;
    if (idx > 0) {
      const yy = y;
      const p = page;
      pending.push(() => p.drawLine({ start: { x: X0, y: yy }, end: { x: X1, y: yy }, thickness: 0.6, color: RULE }));
    }
    y -= pad + 2;
    while (i < lines.length) {
      if (y - descLead < BOTTOM) {
        nextPage();
        y -= pad + 2;
      }
      const yy = y - 8;
      const ln = lines[i]!;
      const p = page;
      pending.push(() => p.drawText(ln.s, { x: X0 + pad, y: yy, size: descSize, font: ln.bold ? fonts.bold : fonts.regular, color: INK }));
      if (first) {
        const amount = Math.round(item.qty * item.unit_price * 100) / 100;
        const cells = [
          `${item.qty.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.unit}`,
          money(item.unit_price),
          `VAT ${q.vat_rate}%`,
          `AED ${money(amount)}`,
        ];
        cells.forEach((cell, k) => {
          const col = k + 1;
          const fit = wrap(cell, fonts.regular, descSize, cols[col]!.w - 2 * pad);
          fit.forEach((f, j) =>
            pending.push(() => p.drawText(f, { x: colX[col]! + cols[col]!.w - pad - fonts.regular.widthOfTextAtSize(f, descSize), y: yy - j * descLead, size: descSize, font: fonts.regular, color: INK })),
          );
        });
        first = false;
      }
      y -= descLead;
      i++;
    }
    y -= pad;
  });
  y -= 6;
  flush(y);
  y -= 16;

  /* ---------------------------------------------------------- totals */
  const totalsH = 3 * 18;
  if (y - totalsH < BOTTOM) {
    page = newPage();
    y = TOP;
  }
  const tw = 220;
  const tx = X1 - tw;
  const tRows: [string, string, "plain" | "shade" | "total"][] = [
    ["Untaxed Amount", `AED ${money(q.subtotal)}`, "plain"],
    [`VAT ${q.vat_rate}%`, `AED ${money(q.vat)}`, "shade"],
    ["Total", `AED ${money(q.total)}`, "total"],
  ];
  tRows.forEach(([k, v, kind]) => {
    const h = 18;
    if (kind === "total") page.drawRectangle({ x: tx, y: y - h, width: tw, height: h, color: NAVY });
    else page.drawRectangle({ x: tx, y: y - h, width: tw, height: h, borderColor: RULE, borderWidth: 0.6, color: kind === "shade" ? SHADE_DARK : WHITE });
    const color = kind === "total" ? WHITE : INK;
    text(k, tx + 7, y - 12.5, 9, fonts.bold, kind === "total" ? WHITE : NAVY);
    textRight(v, X1 - 7, y - 12.5, 9, kind === "total" ? fonts.bold : fonts.regular, color);
    y -= h;
  });
  page.drawRectangle({ x: tx, y: y - 2, width: tw, height: 2, color: GOLD });
  y -= 22;

  /* ---------------------------------------------------------- notes */
  const noteBlocks = [
    ...(q.notes?.trim() ? [{ title: "Notes", body: q.notes, size: 8.4, bold: false }] : []),
    { title: "", body: SPEC_NOTE, size: 7.4, bold: true },
  ];
  for (const nb of noteBlocks) {
    const lines = wrap(nb.body, nb.bold ? fonts.bold : fonts.regular, nb.size, X1 - X0 - 12);
    const h = lines.length * (nb.size + 3) + (nb.title ? 14 : 0) + 10;
    if (y - h < BOTTOM) {
      page = newPage();
      y = TOP;
    }
    if (nb.bold) page.drawRectangle({ x: X0, y: y - h, width: X1 - X0, height: h, color: SHADE });
    let yy = y - 11;
    if (nb.title) {
      text(nb.title, X0 + 6, yy, 9, fonts.bold, NAVY);
      yy -= 14;
    }
    lines.forEach((l) => {
      text(l, X0 + 6, yy, nb.size, nb.bold ? fonts.bold : fonts.regular, INK);
      yy -= nb.size + 3;
    });
    y -= h + 10;
  }

  /* ---------------------------------------------------------- terms sheet + page numbers */
  const terms = await PDFDocument.load(assets.terms);
  const [termsPage] = await doc.copyPages(terms, [0]);
  doc.addPage(termsPage!);
  pages.push(termsPage!);
  pages.forEach((p, i) => {
    const label = `${quoteNumber(q.number)}  ·  Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: X1 - fonts.regular.widthOfTextAtSize(label, 7), y: 64, size: 7, font: fonts.regular, color: MUTED });
    if (i === 0) p.drawText("This is a formal document generated electronically.", { x: X0, y: 64, size: 7, font: fonts.regular, color: MUTED });
  });
  return doc.save();
}

export const quoteFileName = (q: Pick<Quote, "number" | "customer">) =>
  `Quotation ${quoteNumber(q.number)} - ${q.customer.name}`.replace(/[^A-Za-z0-9 ._()&-]+/g, "").replace(/\s+/g, " ").trim().slice(0, 90) + ".pdf";
