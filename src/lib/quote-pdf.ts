import "server-only";
import { PDFDocument, StandardFonts, degrees, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import { COMPANY, SPEC_NOTE, money, printable, quoteNumber, ukDate, type Quote } from "./quote";
import type { QuoteAssets } from "./quote-assets";

/**
 * Quotation PDF on the 4U letterhead: page 1 (and more if the items run long) is drawn on the letterhead,
 * the last page is the Terms & Conditions sheet exactly as supplied.
 * Layout: title with quotation number / date / validity, "Prepared for" and "Prepared by" cards, a ruled item
 * table, a totals panel, then notes. Colours follow the letterhead: navy text, gold accents, soft grey panels.
 */

const NAVY = rgb(0x1b / 255, 0x2a / 255, 0x41 / 255);
const INK = rgb(0x1f / 255, 0x29 / 255, 0x37 / 255);
const BODY = rgb(0x4b / 255, 0x55 / 255, 0x63 / 255);
const MUTED = rgb(0x8a / 255, 0x93 / 255, 0xa0 / 255);
const GOLD = rgb(0.949, 0.761, 0);
const GOLD_DARK = rgb(0.72, 0.56, 0);
const HAIR = rgb(0.9, 0.91, 0.93);
const PANEL = rgb(0.965, 0.969, 0.976);
const WHITE = rgb(1, 1, 1);

// Content box inside the letterhead (A4 points, origin bottom-left): clear of the header rule and the brand strip.
const X0 = 55;
const X1 = 540.5;
const TOP = 842.25 - 104;
const BOTTOM = 80;

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont };

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

/** Rounded rectangle as an SVG path; (x, yTop) is the top-left corner in page coordinates. */
function roundRect(page: PDFPage, x: number, yTop: number, w: number, h: number, r: number, color: RGB) {
  const p = `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`;
  page.drawSvgPath(p, { x, y: yTop, color, borderWidth: 0 });
}

/** `draft`: an unsaved preview, labelled DRAFT and watermarked so it is never mistaken for the quotation sent. */
export async function buildQuotePdf(q: Quote, assets: QuoteAssets, opts: { draft?: boolean } = {}): Promise<Uint8Array> {
  const ref = opts.draft ? (q.number ? `${quoteNumber(q.number)} DRAFT` : "DRAFT") : quoteNumber(q.number);
  const doc = await PDFDocument.create();
  doc.setTitle(`Quotation ${ref} - ${printable(q.customer.name)}`);
  doc.setAuthor(COMPANY.name);
  doc.setCreator("4U Power Generation admin");
  const [letterhead] = await doc.embedPdf(assets.letterhead, [0]);
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
  };
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
  const text = (s: string, x: number, yy: number, size: number, font = fonts.regular, color: RGB = INK) => page.drawText(printable(s), { x, y: yy, size, font, color });
  const width = (s: string, size: number, font = fonts.regular) => font.widthOfTextAtSize(printable(s), size);
  const textRight = (s: string, xr: number, yy: number, size: number, font = fonts.regular, color: RGB = INK) => text(s, xr - width(s, size, font), yy, size, font, color);
  /** Small uppercase label with letter spacing. */
  const caps = (s: string, x: number, yy: number, size = 6.8, color: RGB = MUTED, font = fonts.bold, align: "left" | "right" = "left") => {
    const chars = [...printable(s.toUpperCase())];
    const tracking = 0.9;
    const total = chars.reduce((t, c) => t + font.widthOfTextAtSize(c, size) + tracking, -tracking);
    let cx = align === "right" ? x - total : x;
    for (const c of chars) {
      page.drawText(c, { x: cx, y: yy, size, font, color });
      cx += font.widthOfTextAtSize(c, size) + tracking;
    }
  };
  const hair = (x0: number, x1: number, yy: number, color: RGB = HAIR, thickness = 0.7) => page.drawLine({ start: { x: x0, y: yy }, end: { x: x1, y: yy }, thickness, color });

  /* ---------------------------------------------------------- title + reference */
  text("Quotation", X0, y - 24, 26, fonts.bold, NAVY);
  page.drawRectangle({ x: X0 + 1, y: y - 34, width: 34, height: 3, color: GOLD });
  const meta: [string, string][] = [
    ["Quotation no.", ref],
    ["Date", ukDate(q.quote_date)],
    ...(q.validity?.trim() ? ([["Valid for", q.validity.trim()]] as [string, string][]) : []),
  ];
  // reference strip on the right: label above value, columns divided by hairlines
  const metaColW = 82;
  meta.forEach(([k, v], i) => {
    const xr = X1 - (meta.length - 1 - i) * metaColW;
    caps(k, xr, y - 9, 6.5, MUTED, fonts.bold, "right");
    textRight(v, xr, y - 24, 10.5, fonts.bold, i === 0 ? NAVY : INK);
    if (i > 0) page.drawLine({ start: { x: xr - metaColW + 4, y: y - 2 }, end: { x: xr - metaColW + 4, y: y - 28 }, thickness: 0.7, color: HAIR });
  });
  y -= 56;

  /* ---------------------------------------------------------- prepared for / prepared by */
  const gap = 14;
  const cardW = (X1 - X0 - gap) / 2;
  const pad = 12;
  const labelW = 62;
  const fs = 8.4;
  const lead = 11;
  const c = q.customer;
  const cards: { title: string; name: string; rows: [string, string][] }[] = [
    {
      title: "Prepared for",
      name: c.name,
      rows: (
        [
          ["Attention", c.attention],
          ["Address", c.address],
          ["Project", c.project],
          ["Contact", c.contact],
          ["Email", c.email],
          ["TRN", c.trn],
          ["Customer ref", c.ref],
        ] as [string, string][]
      ).filter(([, v]) => v?.trim()),
    },
    {
      title: "Prepared by",
      name: COMPANY.name,
      rows: (
        [
          ["Sales person", q.sales.person],
          ["Contact", q.sales.contact],
          ["Email", q.sales.email],
          ["TRN", COMPANY.trn],
        ] as [string, string][]
      ).filter(([, v]) => v?.trim()),
    },
  ];
  const laid = cards.map((card) => {
    const nameLines = wrap(card.name, fonts.bold, 10.5, cardW - 2 * pad);
    const rows = card.rows.map(([k, v]) => ({ k, lines: wrap(v, fonts.regular, fs, cardW - 2 * pad - labelW) }));
    const h = pad + 10 + nameLines.length * 13 + 6 + rows.reduce((t, r) => t + r.lines.length * lead + 3, 0) + pad - 2;
    return { ...card, nameLines, rows, h };
  });
  const cardH = Math.max(...laid.map((l) => l.h));
  laid.forEach((card, i) => {
    const x = X0 + i * (cardW + gap);
    roundRect(page, x, y, cardW, cardH, 7, PANEL);
    page.drawRectangle({ x, y: y - cardH + 10, width: 2.4, height: cardH - 20, color: i === 0 ? GOLD : NAVY });
    let yy = y - pad - 6;
    caps(card.title, x + pad, yy, 6.8, i === 0 ? GOLD_DARK : MUTED);
    yy -= 15;
    card.nameLines.forEach((l) => {
      text(l, x + pad, yy, 10.5, fonts.bold, NAVY);
      yy -= 13;
    });
    yy -= 4;
    card.rows.forEach((r) => {
      text(r.k, x + pad, yy, 7.6, fonts.regular, MUTED);
      r.lines.forEach((l, j) => text(l, x + pad + labelW, yy - j * lead, fs, fonts.regular, INK));
      yy -= r.lines.length * lead + 3;
    });
  });
  y -= cardH + 26;

  /* ---------------------------------------------------------- items */
  const cols = [
    { label: "#", w: 24, right: false },
    { label: "Description", w: 229, right: false },
    { label: "Qty", w: 46, right: true },
    { label: "Unit price", w: 76, right: true },
    { label: "VAT", w: 32, right: true },
    { label: "Amount (AED)", w: X1 - X0 - 24 - 229 - 46 - 76 - 32, right: true },
  ];
  const colX = cols.map((_, i) => X0 + cols.slice(0, i).reduce((s, cc) => s + cc.w, 0));
  const cellPad = 6;
  const descW = cols[1]!.w - cellPad;
  const titleSize = 9;
  const descSize = 8.2;
  const descLead = 11.4;

  const header = () => {
    cols.forEach((col, i) => {
      if (col.right) caps(col.label, colX[i]! + col.w, y - 10, 6.6, NAVY, fonts.bold, "right");
      else caps(col.label, colX[i]!, y - 10, 6.6, NAVY);
    });
    y -= 16;
    hair(X0, X1, y, NAVY, 1.2);
  };
  const continueOnNewPage = () => {
    page = newPage();
    y = TOP;
    caps(`${ref}  ·  continued`, X0, y - 8, 6.6);
    y -= 20;
    header();
  };

  header();
  q.items.forEach((item, idx) => {
    const lines = [
      ...wrap(item.title, fonts.bold, titleSize, descW).map((s) => ({ s, kind: "title" as const })),
      ...(item.description.trim() ? wrap(item.description, fonts.regular, descSize, descW).map((s) => ({ s, kind: "body" as const })) : []),
    ];
    // start an item on a fresh page rather than split it, unless it is longer than a page anyway
    const itemH = 19 + lines.reduce((t, l) => t + (l.kind === "title" ? 12.5 : descLead), 0);
    if (y - itemH < BOTTOM && itemH < TOP - BOTTOM - 60) continueOnNewPage();
    y -= 10;
    let first = true;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i]!;
      const step = ln.kind === "title" ? 12.5 : descLead;
      if (y - step < BOTTOM) {
        continueOnNewPage();
        y -= 10;
      }
      const base = y - (ln.kind === "title" ? 9 : 8.2);
      if (ln.kind === "title") text(ln.s, colX[1]!, base, titleSize, fonts.bold, NAVY);
      else text(ln.s, colX[1]!, base, descSize, fonts.regular, BODY);
      if (first) {
        const amount = Math.round(item.qty * item.unit_price * 100) / 100;
        text(String(idx + 1).padStart(2, "0"), colX[0]!, base, 9, fonts.bold, GOLD_DARK);
        const qty = Number.isInteger(item.qty) ? String(item.qty) : item.qty.toFixed(2);
        textRight(qty, colX[2]! + cols[2]!.w, base, 9, fonts.bold, INK);
        textRight(item.unit || "", colX[2]! + cols[2]!.w, base - 10, 7, fonts.regular, MUTED);
        textRight(money(item.unit_price), colX[3]! + cols[3]!.w, base, 9, fonts.regular, INK);
        textRight(`${q.vat_rate}%`, colX[4]! + cols[4]!.w, base, 9, fonts.regular, INK);
        textRight(money(amount), X1, base, 9, fonts.bold, NAVY);
        first = false;
      }
      y -= step;
      // keep the unit label under the quantity inside the row
      if (i === 0 && lines.length === 1) y -= 4;
    }
    y -= 9;
    hair(X0, X1, y);
  });
  y -= 18;

  /* ---------------------------------------------------------- totals (right) + notes (left) */
  const tw = 214;
  const tx = X1 - tw;
  const notesW = tx - X0 - 22;
  const noteLines = q.notes?.trim() ? wrap(q.notes, fonts.regular, 8.2, notesW - 12) : [];
  const totalsH = 2 * 17 + 8 + 32;
  const notesH = noteLines.length ? 18 + noteLines.length * 11 : 0;
  if (y - Math.max(totalsH, notesH) < BOTTOM) {
    page = newPage();
    y = TOP;
  }
  const yTotals = y;
  [
    ["Subtotal", money(q.subtotal)],
    [`VAT ${q.vat_rate}%`, money(q.vat)],
  ].forEach(([k, v]) => {
    text(k!, tx + 2, y - 11, 8.6, fonts.regular, BODY);
    textRight(`AED ${v}`, X1, y - 11, 8.8, fonts.regular, INK);
    y -= 17;
  });
  y -= 8;
  roundRect(page, tx, y, tw, 32, 6, NAVY);
  page.drawRectangle({ x: tx, y: y - 32 + 8, width: 3, height: 16, color: GOLD });
  caps("Total (AED)", tx + 14, y - 19.5, 7.2, WHITE);
  textRight(money(q.total), X1 - 12, y - 21, 13, fonts.bold, WHITE);
  caps(`incl. ${q.vat_rate}% VAT`, X1 - 12, y - 41, 6.2, MUTED, fonts.bold, "right");
  y -= 48;

  if (noteLines.length) {
    let yy = yTotals;
    caps("Notes", X0, yy - 9, 6.8, GOLD_DARK);
    yy -= 22;
    noteLines.forEach((l) => {
      text(l, X0, yy, 8.2, fonts.regular, INK);
      yy -= 11;
    });
    y = Math.min(y, yy);
  }
  y -= 12;

  /* ---------------------------------------------------------- specification note */
  const specLines = wrap(SPEC_NOTE, fonts.italic, 7.4, X1 - X0 - 14);
  const specH = specLines.length * 10 + 4;
  if (y - specH < BOTTOM) {
    page = newPage();
    y = TOP;
  }
  page.drawRectangle({ x: X0, y: y - specH, width: 2, height: specH, color: GOLD });
  specLines.forEach((l, i) => text(l, X0 + 10, y - 8 - i * 10, 7.4, fonts.italic, BODY));

  if (opts.draft)
    for (const p of pages) {
      const size = 120;
      const w = fonts.bold.widthOfTextAtSize("DRAFT", size);
      p.drawText("DRAFT", { x: W / 2 - (w / 2) * Math.cos(Math.PI / 6), y: H / 2 - (w / 2) * Math.sin(Math.PI / 6), size, font: fonts.bold, color: rgb(0.8, 0.1, 0.1), opacity: 0.08, rotate: degrees(30) });
    }

  /* ---------------------------------------------------------- terms sheet + page numbers */
  const terms = await PDFDocument.load(assets.terms);
  const [termsPage] = await doc.copyPages(terms, [0]);
  doc.addPage(termsPage!);
  pages.push(termsPage!);
  pages.forEach((p, i) => {
    const label = `${ref}  ·  Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: X1 - fonts.regular.widthOfTextAtSize(label, 7), y: 64, size: 7, font: fonts.regular, color: MUTED });
    if (i === 0) p.drawText("This is a formal document generated electronically.", { x: X0, y: 64, size: 7, font: fonts.regular, color: MUTED });
  });
  return doc.save();
}

export const quoteFileName = (q: Pick<Quote, "number" | "customer">) =>
  `Quotation ${quoteNumber(q.number)} - ${q.customer.name}`.replace(/[^A-Za-z0-9 ._()&-]+/g, "").replace(/\s+/g, " ").trim().slice(0, 90) + ".pdf";
