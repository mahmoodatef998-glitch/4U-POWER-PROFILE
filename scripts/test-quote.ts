import assert from "node:assert/strict";
import { getModel } from "../src/lib/genset-models";
import { deliveryText, enclosureOptions, generatorItem, money, printable, searchModels, totals, ukDate, unprintable } from "../src/lib/quote";
import { parseQuotePayload } from "../src/lib/quote-form";

// totals: VAT 5% on the untaxed amount, rounded to fils
assert.deepEqual(totals([{ qty: 1, unit_price: 21250 }]), { subtotal: 21250, vat: 1062.5, total: 22312.5 });
assert.deepEqual(totals([{ qty: 1, unit_price: 21250 }], 0), { subtotal: 21250, vat: 0, total: 21250 });
assert.deepEqual(totals([{ qty: 2, unit_price: 1150000 }, { qty: 1, unit_price: 18500.333 }]), { subtotal: 2318500.33, vat: 115925.02, total: 2434425.35 });
assert.equal(money(2635237.5), "2,635,237.50");
assert.equal(money(0), "0.00");
assert.equal(ukDate("2026-09-16"), "16/09/2026");

// search: code with or without "4U-", kVA, engine words
assert.equal(searchModels("4U-P550")[0]!.code, "4U-P550");
assert.equal(searchModels("p550")[0]!.code, "4U-P550");
assert.equal(searchModels("4up550")[0]!.code, "4U-P550");
assert.ok(searchModels("550").every((m) => m.standbyKva === 550 || m.primeKva === 550));
assert.ok(searchModels("cummins 200").every((m) => m.brand === "Cummins"));
assert.equal(searchModels("").length, 0);
assert.equal(searchModels("zzz").length, 0);

// description comes from the datasheet and prints with the standard PDF fonts
const p550 = getModel("4u-p550")!;
assert.deepEqual(enclosureOptions(p550).map((o) => o.value), ["enclosed", "open"]);
const canopy = generatorItem(p550, "enclosed");
assert.equal(canopy.title, "4U-P550 — Perkins Diesel Generator Set 550 kVA, Closed Type");
for (const s of [
  "heavy-duty industrial grade Perkins diesel generator set, ready to run",
  "550 kVA Standby / 500 kVA Prime | 50 Hz | 1500 RPM | 3-Phase | 0.8 Power Factor",
  "original Perkins 2506A-E15TAG2 engine (6-cylinder in-line), water-cooled",
  "brushless alternator",
  "Deep Sea Electronics (DSE) digital control module with full monitoring and protection",
  "weather-protective industrial canopy (Closed Type)",
  "Factory assembled, tested and supplied as a complete ready-to-run industrial package",
])
  assert.ok(canopy.description.includes(s), s);
// only the points on the reference quotation: no sizes, weights, fuel or standards
assert.ok(!/\bISO\b|\bBS ?\d|\bIEC\b|\d mm\b|\bkg\b|L\/h|\bfuel\b|dB\(A\)/i.test(canopy.description), "nothing beyond the quotation points");
assert.equal(canopy.description.split("\n").length, 5);
const open = generatorItem(p550, "open");
assert.ok(open.title.endsWith("Open Type") && open.description.includes("Open type set") && !open.description.includes("canopy"));
const p2500 = getModel("4u-p2500")!;
assert.match(enclosureOptions(p2500)[0]!.label, /^Container/);
assert.ok(generatorItem(p2500, "enclosed").description.includes("(Containerised)"));
assert.deepEqual(unprintable(canopy.title + canopy.description), [], "generated text is printable");

// Arabic and emoji are refused at save time; render-time cleanup never throws
assert.deepEqual(unprintable("شركة"), ["ش", "ر", "ك", "ة"]);
assert.deepEqual(unprintable("Café – “Al Noor” × 2 ±3 °C"), []);
assert.equal(printable("A\tB→C"), "A B?C");

// VAT per quotation: 5% by default, 0% allowed, nothing else
const form = (extra: object) =>
  JSON.stringify({ id: null, lead_id: null, quote_date: "2026-10-23", status: "draft", customer: { name: "A" }, sales: {}, validity: "", notes: "", items: [{ title: "Gen", qty: 1, unit_price: 100 }], ...extra });
assert.equal(parseQuotePayload(form({}), true).data?.vat_rate, 5);
assert.equal(parseQuotePayload(form({ vat_rate: 0 }), true).data?.vat_rate, 0);
assert.match(parseQuotePayload(form({ vat_rate: 7 }), true).error ?? "", /VAT/);

// delivery: a period goes into the standard sentence, anything else prints as typed, empty prints nothing
assert.equal(deliveryText("10 days"), "Delivery within 10 days from receipt of the confirmed LPO and the advance payment, subject to prior booking.");
assert.match(deliveryText("one week"), /^Delivery within one week from/);
assert.equal(deliveryText("Ex-stock, subject to prior sale"), "Ex-stock, subject to prior sale");
assert.equal(deliveryText("  "), "");
assert.equal(parseQuotePayload(form({ delivery: " 15 days " }), true).data?.delivery, "15 days");
assert.match(parseQuotePayload(form({ delivery: "١٠ أيام" }), true).error ?? "", /Delivery/);

console.log("quotation tests passed");
