import assert from "node:assert/strict";
import { getModel } from "../src/lib/genset-models";
import { enclosureOptions, generatorItem, money, printable, searchModels, totals, ukDate, unprintable } from "../src/lib/quote";

// totals: VAT 5% on the untaxed amount, rounded to fils
assert.deepEqual(totals([{ qty: 1, unit_price: 21250 }]), { subtotal: 21250, vat: 1062.5, total: 22312.5 });
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
assert.match(canopy.title, /^4U-P550 — Perkins Diesel Generator Set 550 kVA, Silent Canopy$/);
for (const s of ["550 kVA / 440 kW standby", "500 kVA / 400 kW prime", "Perkins 2506A-E15TAG2", "4U · Leroy-Somer | Stamford", "Deep Sea DSE6110 MKII", "1,020 L base fuel tank", "83 dB(A)", "81 L/h at 75%", "5,170 × 1,590 × 2,600 mm", "5,000 kg"])
  assert.ok(canopy.description.includes(s), s);
assert.ok(!/ISO|BS ?\d|IEC/.test(canopy.description), "no standards claimed");
const open = generatorItem(p550, "open");
assert.ok(open.description.includes("820 L base fuel tank") && !open.description.includes("dB(A)"), "open set: its own tank, no canopy noise");
const p2500 = getModel("4u-p2500")!;
assert.match(enclosureOptions(p2500)[0]!.label, /^Container/);
assert.ok(generatorItem(p2500, "enclosed").description.includes("Weight: approx."), "container: weight without dimensions");
assert.deepEqual(unprintable(canopy.title + canopy.description), [], "generated text is printable");

// Arabic and emoji are refused at save time; render-time cleanup never throws
assert.deepEqual(unprintable("شركة"), ["ش", "ر", "ك", "ة"]);
assert.deepEqual(unprintable("Café – “Al Noor” × 2 ±3 °C"), []);
assert.equal(printable("A\tB→C"), "A B?C");

console.log("quotation tests passed");
