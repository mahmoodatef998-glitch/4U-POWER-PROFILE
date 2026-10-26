import ExcelJS from "exceljs";
import { quoteNumber } from "@/lib/quote";
import { listQuotes } from "@/lib/quote-data";
import { describeFilters, filterQuotes, itemsSummary, netValue, parseFilters, salesSummary } from "@/lib/quote-report";

export const runtime = "nodejs";

const AED = '#,##0.00';
/** "2026-10-05" as a real Excel date (sortable, filterable by month). */
const excelDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const STATUS: Record<string, string> = { draft: "Draft", sent: "Sent", won: "Won", lost: "Lost" };

/** Header row in bold on a light fill, frozen, with auto-filter, and sensible column widths. */
function sheet(wb: ExcelJS.Workbook, name: string, columns: { header: string; key: string; width: number; money?: boolean; date?: boolean }[]) {
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width, style: c.money ? { numFmt: AED } : c.date ? { numFmt: "dd/mm/yyyy" } : {} }));
  const head = ws.getRow(1);
  head.font = { bold: true };
  head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4C2" } };
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  return ws;
}

/**
 * Excel report of the quotations on /admin/quotes with the same filters: a summary per sales person, every
 * quotation (customer, what was offered, status, totals) and every line offered. Admin Basic Auth applies
 * (no file extension in the path).
 */
export async function GET(req: Request) {
  const f = parseFilters(Object.fromEntries(new URL(req.url).searchParams));
  const res = await listQuotes();
  if (res.error !== undefined) return new Response(res.error, { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } });
  const quotes = filterQuotes(res.data, f).sort((a, b) => a.number - b.number);

  const wb = new ExcelJS.Workbook();
  wb.creator = "4U Power Generation";
  wb.created = new Date();

  const sum = sheet(wb, "By sales person", [
    { header: "Sales person", key: "person", width: 22 },
    { header: "Quotations", key: "quotes", width: 12 },
    { header: "Draft", key: "draft", width: 8 },
    { header: "Sent", key: "sent", width: 8 },
    { header: "Won", key: "won", width: 8 },
    { header: "Lost", key: "lost", width: 8 },
    { header: "Win rate (won ÷ won + lost)", key: "winRate", width: 14 },
    { header: "Quoted, AED excl. VAT", key: "quoted", width: 20, money: true },
    { header: "Won, AED excl. VAT", key: "wonValue", width: 20, money: true },
  ]);
  for (const r of salesSummary(quotes)) sum.addRow({ ...r, winRate: r.winRate });
  sum.getColumn("winRate").numFmt = "0%";
  sum.addRow([]);
  sum.addRow([`Filters: ${describeFilters(f)}`]);
  sum.addRow([`Generated: ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · values after discount, before VAT`]);

  const qs = sheet(wb, "Quotations", [
    { header: "Quotation", key: "no", width: 11 },
    { header: "Date", key: "date", width: 12, date: true },
    { header: "Sales person", key: "sales", width: 16 },
    { header: "Status", key: "status", width: 9 },
    { header: "Customer", key: "customer", width: 30 },
    { header: "Attention", key: "attention", width: 18 },
    { header: "Contact", key: "contact", width: 16 },
    { header: "Email", key: "email", width: 24 },
    { header: "Project", key: "project", width: 20 },
    { header: "Customer ref", key: "ref", width: 14 },
    { header: "What was offered", key: "items", width: 60 },
    { header: "Price list", key: "list", width: 10 },
    { header: "Subtotal", key: "subtotal", width: 15, money: true },
    { header: "Discount %", key: "discountPct", width: 10 },
    { header: "Discount", key: "discount", width: 13, money: true },
    { header: "Net (excl. VAT)", key: "net", width: 15, money: true },
    { header: "VAT %", key: "vatRate", width: 7 },
    { header: "VAT", key: "vat", width: 13, money: true },
    { header: "Total (AED)", key: "total", width: 15, money: true },
    { header: "Delivery", key: "delivery", width: 16 },
    { header: "Validity", key: "validity", width: 10 },
    { header: "Notes", key: "notes", width: 30 },
  ]);
  for (const q of quotes) {
    qs.addRow({
      no: quoteNumber(q.number),
      date: excelDate(q.quote_date),
      sales: q.sales.person,
      status: STATUS[q.status] ?? q.status,
      customer: q.customer.name,
      attention: q.customer.attention,
      contact: q.customer.contact,
      email: q.customer.email,
      project: q.customer.project,
      ref: q.customer.ref,
      items: itemsSummary(q),
      list: q.price_list === "export" ? "Export" : "UAE",
      subtotal: q.subtotal,
      discountPct: q.discount_pct,
      discount: q.discount,
      net: netValue(q),
      vatRate: q.vat_rate,
      vat: q.vat,
      total: q.total,
      delivery: q.delivery ?? "",
      validity: q.validity ?? "",
      notes: q.notes ?? "",
    });
  }
  qs.getColumn("items").alignment = { wrapText: true, vertical: "top" };

  const lines = sheet(wb, "Lines offered", [
    { header: "Quotation", key: "no", width: 11 },
    { header: "Date", key: "date", width: 12, date: true },
    { header: "Sales person", key: "sales", width: 16 },
    { header: "Status", key: "status", width: 9 },
    { header: "Customer", key: "customer", width: 30 },
    { header: "#", key: "line", width: 5 },
    { header: "Model code", key: "code", width: 12 },
    { header: "Item", key: "title", width: 55 },
    { header: "Qty", key: "qty", width: 6 },
    { header: "Unit", key: "unit", width: 8 },
    { header: "Unit price (AED, excl. VAT)", key: "price", width: 18, money: true },
    { header: "Line total (AED, excl. VAT)", key: "lineTotal", width: 18, money: true },
  ]);
  for (const q of quotes)
    q.items.forEach((it, i) =>
      lines.addRow({
        no: quoteNumber(q.number),
        date: excelDate(q.quote_date),
        sales: q.sales.person,
        status: STATUS[q.status] ?? q.status,
        customer: q.customer.name,
        line: i + 1,
        code: it.code,
        title: it.title,
        qty: it.qty,
        unit: it.unit,
        price: it.unit_price,
        lineTotal: Math.round(it.qty * it.unit_price * 100) / 100,
      }),
    );

  const buf = await wb.xlsx.writeBuffer();
  const who = f.sales ? `-${f.sales.replace(/[^A-Za-z0-9]+/g, "-")}` : "";
  const name = `4U-quotations${who}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new Response(new Uint8Array(buf as ArrayBuffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${name}"`,
      "cache-control": "private, no-store",
    },
  });
}
