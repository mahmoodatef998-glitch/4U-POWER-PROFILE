import assert from "node:assert/strict";
import { PDFDocument, PDFHexString, PDFName, StandardFonts, type PDFDict } from "pdf-lib";
import { isoDate, num } from "../src/lib/quote-import";
import { readQuotePdf } from "../src/lib/quote-import-pdf";

// dummy figures only: the repository is public, no real prices
assert.equal(num("1,250.50"), 1250.5);
assert.equal(num("AED 3,000"), 3000);
assert.equal(num("(150.00)"), -150);
assert.equal(num("Units"), null);
assert.equal(isoDate("09/11/2026"), "2026-11-09");
assert.equal(isoDate("9 Nov 2026"), "2026-11-09");
assert.equal(isoDate("November 9, 2026"), "2026-11-09");
assert.equal(isoDate("2026-11-09"), "2026-11-09");

(async () => {
  // 1. embedded data (what the admin's own PDFs carry)
  {
    const doc = await PDFDocument.create();
    doc.addPage();
    const data = {
      v: 1,
      customer: { name: "Test Customer LLC", attention: "Mr. Test" },
      items: [{ code: "4U-P100", title: "4U-P100 Generator", description: "line two", qty: 2, unit: "Units", unit_price: 1000 }],
      currency: "USD",
      vat_rate: 0,
      discount_pct: 5,
      quote_date: "2026-11-09",
      validity: "30 days",
      delivery: "10 days",
      notes: null,
      total: 1900,
    };
    (doc as unknown as { getInfoDict(): PDFDict }).getInfoDict().set(PDFName.of("FourUQuote"), PDFHexString.fromText(JSON.stringify(data)));
    const q = await readQuotePdf(await doc.save());
    assert.equal(q.source, "embedded");
    assert.equal(q.items[0]!.unit_price, 1000);
    assert.equal(q.currency, "USD");
    assert.equal(q.discount_pct, 5);
    assert.equal(q.customer.name, "Test Customer LLC");
  }
  // 2. keywords "4U-QUOTE:<base64>"
  {
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.setKeywords(["4U-QUOTE:" + Buffer.from(JSON.stringify({ v: 1, items: [{ title: "ATS panel", qty: 1, unit_price: 500 }] })).toString("base64")]);
    const q = await readQuotePdf(await doc.save());
    assert.equal(q.source, "embedded");
    assert.equal(q.items[0]!.title, "ATS panel");
  }
  // 3. a plain quotation laid out as a table, read from its text
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);
    const f = await doc.embedFont(StandardFonts.Helvetica);
    const t = (s: string, x: number, y: number) => page.drawText(s, { x, y, size: 9, font: f });
    t("QUOTATION", 250, 800);
    t("To: Test Contracting LLC", 40, 760);
    t("Date: 09/11/2026", 400, 760);
    t("Attn: Mr. Tester", 40, 745);
    t("Validity: 30 days", 400, 745);
    t("Tel: +971 50 000 0000", 40, 730);
    t("Delivery: 10 days", 400, 730);
    t("Email: buyer@test-contracting.example", 40, 715);
    t("Project: Test Villa", 40, 700);
    const head = (y: number) => {
      t("No.", 40, y);
      t("Description", 70, y);
      t("Qty", 330, y);
      t("Unit", 365, y);
      t("Unit Price (AED)", 400, y);
      t("Total (AED)", 500, y);
    };
    head(660);
    const row = (y: number, no: string, d: string, q: string, u: string, p: string, tot: string) => {
      t(no, 40, y);
      t(d, 70, y);
      t(q, 335, y);
      t(u, 365, y);
      t(p, 410, y);
      t(tot, 505, y);
    };
    row(640, "1", "4U-P100 Perkins Diesel Generator 100 kVA Prime", "2", "Units", "1,000.00", "2,000.00");
    t("Silent canopy, DSE controller, 12-month / 1,000-hour warranty", 70, 628);
    row(610, "2", "ATS Panel 250 A, 4-pole", "1", "Set", "500.00", "500.00");
    row(595, "3", "Installation and commissioning", "2", "Lot", "100.00", "200.00");
    t("Subtotal", 400, 570);
    t("2,700.00", 505, 570);
    t("Discount (10%)", 400, 556);
    t("-270.00", 505, 556);
    t("VAT 5%", 400, 542);
    t("121.50", 505, 542);
    t("Grand Total", 400, 528);
    t("2,551.50", 505, 528);
    const q = await readQuotePdf(await doc.save());
    assert.equal(q.source, "text");
    assert.equal(q.items.length, 3, JSON.stringify(q, null, 1));
    assert.equal(q.items[0]!.code, "4U-P100");
    assert.equal(q.items[0]!.qty, 2);
    assert.equal(q.items[0]!.unit_price, 1000);
    assert.ok(q.items[0]!.description.includes("Silent canopy"));
    assert.equal(q.items[1]!.unit, "Set");
    assert.equal(q.items[2]!.unit_price, 100);
    assert.equal(q.customer.name, "Test Contracting LLC");
    assert.equal(q.customer.attention, "Mr. Tester");
    assert.equal(q.customer.email, "buyer@test-contracting.example");
    assert.equal(q.customer.project, "Test Villa");
    assert.equal(q.quote_date, "2026-11-09");
    assert.equal(q.validity, "30 days");
    assert.equal(q.delivery, "10 days");
    assert.equal(q.discount_pct, 10);
    assert.equal(q.vat_rate, 5);
    assert.equal(q.currency, "AED");
    assert.equal(q.printed_total, 2551.5);
    assert.deepEqual(q.warnings, []);
  }
  console.log("quote import tests passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

// 4. numbers centred between two lines of description (common in Word / Excel exports)
(async () => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const f = await doc.embedFont(StandardFonts.Helvetica);
  const t = (s: string, x: number, y: number) => page.drawText(s, { x, y, size: 9, font: f });
  t("Item Description", 60, 700);
  t("Quantity", 330, 700);
  t("Rate", 410, 700);
  t("Amount", 500, 700);
  t("Diesel generator 250 kVA, silent canopy", 60, 680);
  t("1", 335, 674);
  t("2,000.00", 405, 674);
  t("2,000.00", 500, 674);
  t("Cummins engine, Deep Sea controller", 60, 668);
  t("Fuel tank 1000 L", 60, 650);
  t("2", 335, 644);
  t("300.00", 405, 644);
  t("600.00", 500, 644);
  t("Double-wall steel", 60, 638);
  t("Total", 405, 610);
  t("2,600.00", 500, 610);
  const q = await readQuotePdf(await doc.save());
  assert.equal(q.items.length, 2, JSON.stringify(q.items, null, 1));
  assert.equal(q.items[0]!.title, "Diesel generator 250 kVA, silent canopy");
  assert.equal(q.items[0]!.description, "Cummins engine, Deep Sea controller");
  assert.equal(q.items[1]!.title, "Fuel tank 1000 L");
  assert.equal(q.items[1]!.description, "Double-wall steel");
  assert.equal(q.items[1]!.unit_price, 300);
  console.log("centred-row import test passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
