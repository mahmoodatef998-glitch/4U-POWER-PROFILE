import assert from "node:assert/strict";
import { gensetModels, getModel } from "../src/lib/genset-models";
import { LEGACY_EXACT } from "../src/lib/legacy-exact";
import { MODEL_RENAMES, currentModelSlug } from "../src/lib/model-renames";
import { frameRating } from "../src/content/alternator-ratings";
import { buildDatasheet } from "../src/lib/datasheet";
import { FIFTY_HZ_ONLY, RATINGS_60HZ } from "../src/content/genset-60hz";
import { alternatorPhrase, amps, check60, countryOf, defaultHz, defaultVolts60, sixtyHz, deliveryText, enclosureOptions, generatorItem, inCurrency, listPrice, withAlternator, money, printable, ratingSearch, searchModels, totals, ukDate, unprintable } from "../src/lib/quote";
import { parseQuotePayload } from "../src/lib/quote-form";
import { describeFilters, filterQuery, filterQuotes, itemsSummary, parseFilters, salesPeople, salesSummary } from "../src/lib/quote-report";
import type { Quote } from "../src/lib/quote";
import { alternatorName, defaultOption, frameName, listRef, optionLabel, toAed, type PriceOption } from "../src/lib/price-book";

// totals: VAT 5% on the untaxed amount, rounded to fils
assert.deepEqual(totals([{ qty: 1, unit_price: 21250 }]), { subtotal: 21250, discount: 0, vat: 1062.5, total: 22312.5 });
assert.deepEqual(totals([{ qty: 1, unit_price: 21250 }], 0), { subtotal: 21250, discount: 0, vat: 0, total: 21250 });
assert.deepEqual(totals([{ qty: 2, unit_price: 1150000 }, { qty: 1, unit_price: 18500.333 }]), { subtotal: 2318500.33, discount: 0, vat: 115925.02, total: 2434425.35 });
// discount comes off before VAT
assert.deepEqual(totals([{ qty: 1, unit_price: 100000 }], 5, 10), { subtotal: 100000, discount: 10000, vat: 4500, total: 94500 });
assert.deepEqual(totals([{ qty: 3, unit_price: 33333.33 }], 0, 2.5), { subtotal: 99999.99, discount: 2500, vat: 0, total: 97499.99 });
assert.equal(money(2635237.5), "2,635,237.50");
assert.equal(money(0), "0.00");
assert.equal(ukDate("2026-09-16"), "16/09/2026");

// codes are the prime kVA (100 kVA prime / 110 kVA standby → 4U-x100), a B/C suffix for another engine at that rating
const LETTER = { Perkins: "P", Cummins: "C", Kubota: "K", Baudouin: "B", "Lister Petter": "L" } as const;
for (const m of gensetModels) {
  assert.match(m.code, new RegExp(`^4U-${LETTER[m.brand]}${String(m.primeKva).replace(".", "\\.")}[B-D]?$`), m.code);
  assert.equal(m.slug, m.code.toLowerCase().replace(".", "-"), m.code);
}
assert.equal(new Set(gensetModels.map((m) => m.slug)).size, gensetModels.length, "slugs are unique");
// old standby-based URLs: each lands on a live model, never on another old address, and no live page is redirected away
const live = new Set(gensetModels.map((m) => m.slug));
for (const [from, to] of MODEL_RENAMES) {
  assert.ok(live.has(to), `${from} → ${to} must exist`);
  assert.ok(!live.has(from), `${from} is a live page and must not redirect`);
}
assert.equal(currentModelSlug("4u-p550"), "4u-p500");
assert.equal(currentModelSlug("4u-c1675"), "4u-c1416");
assert.equal(currentModelSlug("4u-p150"), "4u-p150", "now the 150 kVA prime set, a live page");
// ratings corrected against Baudouin's rating tables and Kubota's engine data (docs/price-list.md)
const rated = (slug: string) => { const m = getModel(slug)!; return [m.engine, m.primeKva, m.standbyKva]; };
assert.deepEqual(rated("4u-b150"), ["6M11G4D0/S", 150, 165], "1500 rpm rating, not the 1800 rpm 181 / 200");
assert.deepEqual(rated("4u-b130"), ["6M11G2D0/S", 130, 143], "1500 rpm: 120 kWm gross; 150 / 165 is its 60 Hz rating");
assert.deepEqual(rated("4u-b200"), ["6M16G2D0/S", 200, 220]);
assert.deepEqual(rated("4u-b65"), ["4M10G2D0/S", 65, 72]);
assert.deepEqual(rated("4u-k14"), ["D1703-E2-BG", 14, 15.4], "Kubota SQ-3140");
assert.deepEqual(rated("4u-k30"), ["V3300-E2-BG2", 30, 33], "Kubota SQ-3300");
assert.equal(getModel("4u-k20b"), null, "derated duplicate of 4U-K22.5");
// Cummins: Cummins' G-Drive ratings card, held to the Leroy-Somer alternator's rating where that is lower
assert.deepEqual(rated("4u-c300"), ["6LTAA9.5-G1", 300, 330], "TAL-A46-F: 300 / 330 kVA");
assert.deepEqual(rated("4u-c410"), ["QSG12-G4", 410, 450], "TAL-A473-A: 410 / 450 kVA");
assert.deepEqual(rated("4u-c1416"), ["KTA50-G8", 1416, 1650], "LSA 50.2 L8 standby 1650 kVA");
assert.deepEqual(rated("4u-c500d"), ["QSX15-G8", 500, 550], "TAL-A473-C: 500 / 550 kVA at 400 V 50 Hz");
assert.deepEqual(rated("4u-c180b"), ["QSB7-G4", 180, 200], "TAL-A44-L: 180 / 200 kVA");
assert.equal(currentModelSlug("4u-c550c"), "4u-c500d", "pre-1 Nov URL, no chain");
assert.equal(currentModelSlug("4u-c501"), "4u-c500d");
// every set is held to its Leroy-Somer frame (400 V / 50 Hz, class H continuous / H 163 K standby)
for (const m of gensetModels) {
  const f = frameRating(m.alternator.leroySomer)?.hz50;
  if (f) assert.ok(m.primeKva <= f[0] && m.standbyKva <= f[1], `${m.code} ${m.primeKva}/${m.standbyKva} over ${m.alternator.leroySomer} ${f.join("/")}`);
}
assert.deepEqual(frameRating("TAL0473C")?.hz50, [500, 550]);
assert.deepEqual(frameRating("LSA 50.2 M")?.hz50, [1250, 1375]);
assert.deepEqual(frameRating("TAL-A47-F")?.hz50, [660, 730], "TAL-A47 is the TAL-A473 frame");
assert.deepEqual(rated("4u-p200c"), ["1506A-E88TAG1", 200, 220], "Perkins chart 200 / 220, TAL-A44-M 200 / 220");
assert.deepEqual(rated("4u-b820"), ["12M26G1000/5", 820, 910], "TAL-A49-C 820 / 910 limits the 900 / 1000 engine");
assert.equal(currentModelSlug("4u-b900"), "4u-b820");
assert.equal(currentModelSlug("4u-b1000"), "4u-b820", "older URL, no chain");
assert.equal(currentModelSlug("4u-p275"), "4u-p275", "now the 275 kVA prime 1506A-E88TAG4 set, a live page");
assert.equal(currentModelSlug("4u-k22b"), "4u-k22-5");
assert.equal(currentModelSlug("4u-k20b"), "4u-k22-5");
assert.equal(currentModelSlug("4u-b72"), "4u-b65");
assert.equal(currentModelSlug("4u-b180"), "4u-b150");
assert.equal(currentModelSlug("4u-b165"), "4u-b130");
for (const m of gensetModels) assert.ok(m.standbyKva >= m.primeKva && m.standbyKva <= m.primeKva * 1.2, `${m.code} standby / prime ${m.standbyKva}/${m.primeKva}`);
assert.ok(LEGACY_EXACT.some(([a, b]) => a === "/:locale(en|ar)/models/4u-p165/datasheet" && b === "/:locale/models/4u-p150/datasheet"));

// search: code with or without "4U-", kVA, engine words
assert.equal(searchModels("4U-P500")[0]!.code, "4U-P500");
assert.equal(searchModels("p500")[0]!.code, "4U-P500");
assert.equal(searchModels("4up500")[0]!.code, "4U-P500");
assert.ok(searchModels("550").every((m) => m.standbyKva === 550 || m.primeKva === 550));
assert.ok(searchModels("cummins 200").every((m) => m.brand === "Cummins"));
assert.equal(searchModels("").length, 0);
assert.equal(searchModels("zzz").length, 0);
// engine without punctuation, and the price-list code through aliases
assert.equal(searchModels("KTA50G8")[0]!.code, "4U-C1416");
assert.equal(searchModels("cummins kta50g9")[0]!.code, "4U-C1619");
assert.equal(searchModels("CP1400").length, 0);
assert.deepEqual(searchModels("CP1400", undefined, 8, { "4U-C1416": ["CP1400", "KTA50G8"] }).map((m) => m.code), ["4U-C1416"]);
assert.equal(searchModels("cp1275/1400", undefined, 8, { "4U-C1250": ["CP1275/1400"] })[0]!.code, "4U-C1250");
// a rating search: everything at or up to +10 kVA above, plus each brand's nearest larger model however far
const brands = (r: ReturnType<typeof ratingSearch>) => new Set(r!.hits.map((h) => h.m.brand));
const r152 = ratingSearch("152 kVA")!;
assert.equal(r152.kva, 152);
assert.equal(r152.exact, false);
assert.deepEqual(r152.hits.map((h) => h.gap), [...r152.hits.map((h) => h.gap)].sort((x, y) => x - y));
assert.ok(r152.hits.every((h) => h.gap > 0 && Math.min(...[h.m.standbyKva, h.m.primeKva].filter((k) => k >= 152)) - 152 === h.gap));
assert.ok(["Perkins", "Cummins", "Baudouin", "Lister Petter"].every((b) => brands(r152).has(b as never)));
// 1500: Perkins 4U-P1500 is an exact match, Cummins' nearest larger is 4U-C1619 (+119) — both shown
const r1500 = ratingSearch("1500")!;
assert.ok(r1500.hits.some((h) => h.m.code === "4U-P1500" && h.gap === 0));
assert.ok(r1500.hits.some((h) => h.m.code === "4U-C1619" && h.gap === 119));
assert.ok(ratingSearch("1600")!.hits.some((h) => h.m.code === "4U-C1619" && h.gap === 19));
// exact matches come first with gap 0
const r150 = ratingSearch("150")!;
assert.equal(r150.exact, true);
assert.ok(r150.hits.filter((h) => h.gap === 0).every((h) => h.m.standbyKva === 150 || h.m.primeKva === 150));
assert.equal(r150.hits[0]!.gap, 0);
assert.ok(ratingSearch("cummins 1500")!.hits.every((h) => h.m.brand === "Cummins"));
assert.equal(ratingSearch("3000")!.hits.length, 0);
assert.equal(ratingSearch("perkins"), null);
assert.equal(ratingSearch("4U-P500"), null);

// customer country: Saudi Arabia adds 6% to list prices; old quotations map from their price list
assert.equal(listPrice(100000, "SA"), 106000);
assert.equal(listPrice(12345.67, "SA"), 13086.41);
assert.equal(listPrice(100000, "OM"), 100000);
assert.equal(listPrice(100000, "AE"), 100000);
assert.equal(countryOf({ price_list: "export" }), "XX");
assert.equal(countryOf({ price_list: "uae" }), "AE");
assert.equal(countryOf({ country: "OM", price_list: "uae" }), "OM");
// currency: AED prices printed in USD at 3.6725, totals redone in USD
const usd = inCurrency({ items: [{ code: "", title: "", description: "", qty: 2, unit: "Units", unit_price: 36725 }], vat_rate: 0, discount_pct: 10, currency: "USD", fx_rate: 3.6725 });
assert.equal(usd.items[0]!.unit_price, 10000);
assert.deepEqual([usd.subtotal, usd.discount, usd.total], [20000, 2000, 18000]);
assert.equal(inCurrency({ items: [{ code: "", title: "", description: "", qty: 1, unit: "Units", unit_price: 500 }], vat_rate: 5, discount_pct: 0, currency: "AED", fx_rate: 1 }).total, 525);

// description comes from the datasheet and prints with the standard PDF fonts
const p550 = getModel("4u-p500")!;
assert.deepEqual(enclosureOptions(p550).map((o) => o.value), ["enclosed", "open"]);
const canopy = generatorItem(p550, "enclosed");
assert.equal(canopy.title, "4U-P500 — Perkins Diesel Generator Set 500 kVA Prime / 550 kVA Standby, Closed Type");
for (const s of [
  "heavy-duty industrial grade Perkins diesel generator set, ready to run",
  "500 kVA Prime / 550 kVA Standby | 50 Hz | 1500 RPM | 3-Phase | 0.8 Power Factor",
  "original Perkins 2506A-E15TAG2 engine (6-cylinder in-line), water-cooled",
  "directly coupled to a Leroy-Somer TAL-A47-C alternator and controlled by",
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
const p2500 = getModel("4u-p2250")!;
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

// discount and price list on the form
assert.equal(parseQuotePayload(form({}), true).data?.discount_pct, 0);
assert.equal(parseQuotePayload(form({}), true).data?.price_list, "uae");
assert.equal(parseQuotePayload(form({ discount_pct: "7.5", price_list: "export" }), true).data?.discount_pct, 7.5);
assert.match(parseQuotePayload(form({ discount_pct: 120 }), true).error ?? "", /Discount/);
assert.equal(parseQuotePayload(form({ items: [{ title: "Gen", qty: 1, unit_price: 5, price_key: "TAL042H|INDIA" }] }), true).data?.items[0]?.price_key, "TAL042H|INDIA");

// price book rules: pounds to whole dirhams, Leroy-Somer first, readable labels
assert.equal(toAed(10000.4, "GBP", 4.91), 49102);
assert.equal(toAed(12345, "AED", 4.91), 12345);
const opt = (alternator: string, origin: string): PriceOption => ({ key: `${alternator}|${origin}`, alternator, origin, currency: "AED", price: 1, aed: 1, listLabel: "CP455/500", listEngine: "QSZ13G5" });
assert.equal(listRef(opt("TAL0473C", "CHINA")), "List: CP455/500 · QSZ13G5");
assert.equal(defaultOption([opt("KWISE (CHINA)", "INDIA"), opt("KWISE (CHINA)", "CHINA"), opt("LSA50.2M6", "INDIA")])?.alternator, "LSA50.2M6");
assert.equal(defaultOption([opt("CHINA", "")])?.alternator, "CHINA");
assert.equal(defaultOption(undefined), undefined);
// the editor's label says where engine and alternator come from (sales team only; the PDF names just the alternator)
assert.equal(optionLabel(opt("TAL044H", "CHINA")), "Engine China · Leroy-Somer TAL-A44-H");
assert.equal(optionLabel(opt("TAL040D", "JAPAN / EU")), "Engine Japan · Leroy-Somer TAL-A40-D (EU)");
assert.equal(optionLabel(opt("CHINA", "JAPAN / CHINA")), "Engine Japan · 4U Power alternator (China)");
assert.equal(optionLabel(opt("TAL", "")), "Leroy-Somer alternator");
assert.equal(optionLabel(opt("CHINA", "")), "4U Power alternator (China)");
assert.equal(optionLabel(opt("LP274C", "")), "4U Power alternator (LP274C)");

// naming rule: TAL / LSA is Leroy-Somer, anything else is a 4U Power alternator — never "China"/"Kwise"/"brushless"
for (const a of ["KWISE (CHINA)", "CHINA", "LP274C"]) assert.equal(alternatorName(a), "4U Power alternator");
assert.equal(optionLabel(opt("KWISE (CHINA)", "INDIA")), "Engine India · 4U Power alternator (China)");
assert.equal(frameName("TAL0473C"), "TAL-A473-C");
assert.equal(frameName("TAL-A44-H"), "TAL-A44-H");
assert.equal(frameName("TAL42A"), "TAL-A42-A");
assert.equal(frameName("TAL040C / D"), "TAL-A40-C/D");
assert.equal(frameName("LSA50.2M6"), "LSA50.2 M6");
assert.equal(frameName("TAL"), null);
assert.equal(alternatorPhrase(p550, "KWISE (CHINA)"), "a 4U Power alternator");
assert.equal(alternatorPhrase(p550, "TAL"), "a Leroy-Somer alternator");
assert.equal(alternatorPhrase(p550, "TAL0473C"), "a Leroy-Somer TAL-A473-C alternator");
assert.equal(alternatorPhrase(p550), "a Leroy-Somer TAL-A47-C alternator");
const kwise = generatorItem(p550, "open", "KWISE (CHINA)").description;
assert.ok(kwise.includes("directly coupled to a 4U Power alternator and controlled") && !/china|kwise|brushless/i.test(kwise), kwise);
assert.ok(withAlternator(kwise, "a Leroy-Somer TAL-A47-C alternator").includes("coupled to a Leroy-Somer TAL-A47-C alternator and controlled"));
assert.ok(withAlternator("…water-cooled, directly coupled to a brushless alternator and controlled by a Deep Sea…", "a 4U Power alternator").includes("coupled to a 4U Power alternator and controlled"));

// filters and the per-salesperson report
const mk = (number: number, person: string, status: Quote["status"], total: number, date: string, name: string): Quote => ({
  id: String(number), number, quote_date: date, status, total, subtotal: total, discount: 0, discount_pct: 0, vat: 0, vat_rate: 0,
  customer: { name, address: "", trn: "", project: "", attention: "", contact: "+971 50 000 0000", email: "", ref: "" },
  sales: { person, contact: "", email: "" }, items: [{ code: "4U-P500", title: "Gen", description: "", qty: 2, unit: "Units", unit_price: total / 2 }],
  validity: null, delivery: null, notes: null, price_list: "uae", country: "AE", currency: "AED", fx_rate: 1, fx_at: null, lead_id: null, created_at: "",
});
const qs = [mk(1001, "SHAMSA", "won", 100000, "2026-10-01", "Al Noor LLC"), mk(1002, "Shamsa ", "lost", 50000, "2026-10-10", "Gulf Steel"), mk(1003, "Mahmoud", "sent", 20000, "2026-10-20", "Al Noor Farms"), mk(1004, "Mahmoud", "won", 30000, "2026-11-02", "Delta")];
assert.deepEqual(salesPeople(qs), ["Mahmoud", "SHAMSA"]);
const f0 = parseFilters({ q: " al noor ", sales: "shamsa", status: "bogus", min: "1,000", max: "", from: "2026-10-01", to: "x" });
assert.deepEqual(f0, { q: "al noor", sales: "shamsa", status: "", min: 1000, max: null, from: "2026-10-01", to: "" });
assert.deepEqual(filterQuotes(qs, f0).map((q) => q.number), [1001]);
assert.deepEqual(filterQuotes(qs, parseFilters({ q: "qt 1003" })).map((q) => q.number), [1003]);
assert.deepEqual(filterQuotes(qs, parseFilters({ min: "25000", max: "60000" })).map((q) => q.number), [1002, 1004]);
assert.deepEqual(filterQuotes(qs, parseFilters({ to: "2026-10-31", status: "won" })).map((q) => q.number), [1001]);
const rep = salesSummary(qs);
assert.deepEqual(rep.map((r) => [r.person, r.quotes, r.won, r.lost, r.winRate, r.wonValue]), [["Mahmoud", 2, 1, 0, 1, 30000], ["SHAMSA", 2, 1, 1, 0.5, 100000]]);
assert.equal(filterQuery(f0), "q=al+noor&sales=shamsa&min=1000&from=2026-10-01");
assert.equal(filterQuery(f0, { sales: "Mahmoud" }), "q=al+noor&sales=Mahmoud&min=1000&from=2026-10-01");
assert.equal(describeFilters(parseFilters({})), "All quotations");
assert.equal(itemsSummary(qs[0]!), "2 × Gen");

// 60 Hz: datasheet ratings where published, same set and price, 1800 rpm, rated current at the quoted voltage
const b100 = getModel("4u-b100")!;
const s60 = sixtyHz(b100);
assert.equal(s60.kind, "datasheet");
assert.equal(amps(113, "480/277"), 136, "matches the Baudouin sheet's 136 A");
assert.equal(amps(125, "480/277"), 150);
assert.equal(amps(113, "380/220"), 172);
for (const [engine, r] of Object.entries(RATINGS_60HZ)) {
  // kW = 0.8 × kVA; Perkins rounds kVA up, so allow 2.5 %
  assert.ok(Math.abs(r.primeKw - 0.8 * r.prime) <= Math.max(1.01, 0.02 * r.prime) && Math.abs(r.standbyKw - 0.8 * r.standby) <= Math.max(1.01, 0.02 * r.standby), `${engine} kW = 0.8 × kVA`);
  assert.ok(r.standby >= r.prime, `${engine} standby ≥ prime`);
  assert.ok(gensetModels.some((m) => m.engine === engine), `${engine} is a model on the site`);
}
const b100at60 = generatorItem(b100, "enclosed", null, { prime: 113, standby: 125, volts: "480/277", ratedVolts: "480/277" });
assert.equal(b100at60.title, "4U-B100 — Baudouin Diesel Generator Set 113 kVA Prime / 125 kVA Standby, 60 Hz, Closed Type");
assert.equal(b100at60.code, "4U-B100");
assert.ok(b100at60.description.includes("113 kVA Prime / 125 kVA Standby | 60 Hz | 1800 RPM | 3-Phase | 0.8 Power Factor | 480/277 V."));
assert.ok(b100at60.description.includes("Rated current at 480/277 V: 136 A prime / 150 A standby."));
assert.ok(!b100at60.description.includes("derating"), "quoted at the rated voltage: no note");
const ksa = generatorItem(b100, "enclosed", null, { prime: 113, standby: 125, volts: "380/220", ratedVolts: "480/277" });
assert.ok(ksa.description.includes("Rated current at 380/220 V: 172 A prime / 190 A standby."));
assert.ok(ksa.description.includes("60 Hz ratings as per datasheet at 480/277 V; the output at 380/220 V is confirmed with the order"));
assert.ok(!ksa.description.includes("50 Hz"), "no 50 Hz line on a 60 Hz quotation");
// sets that keep their 50 Hz rating at 60 Hz (no fixed factor)
assert.equal(RATINGS_60HZ["6M21G8D0/S"]!.prime, 500);
assert.equal(sixtyHz(getModel("4u-b45")!).kind, "fifty-only", "Baudouin …/5 is a 50 Hz build");
assert.equal(sixtyHz(getModel("4u-p500")!).kind, "fifty-only", "2506A-E15TAG2 is a 1500 rpm engine (Perkins chart)");
assert.equal(sixtyHz(getModel("4u-p225")!).kind, "manual", "1206A-E70TAG2: no 60 Hz data on file");
for (const engine of Object.keys(FIFTY_HZ_ONLY)) {
  assert.ok(gensetModels.some((m) => m.engine === engine), `${engine} is a model on the site`);
  assert.ok(!RATINGS_60HZ[engine], `${engine} can't be both 50 Hz only and rated at 60 Hz`);
}
const p100at60 = sixtyHz(getModel("4u-p100")!);
assert.ok(p100at60.kind === "datasheet" && p100at60.rating.prime === 114 && p100at60.rating.standby === 127, "Perkins 1104C-44TAG2 at 1800 rpm");
// the 60 Hz line prints the 60 Hz engine build where Cummins codes it differently
const c100b = getModel("4u-c100b")!;
const c100b60 = sixtyHz(c100b);
assert.ok(c100b60.kind === "datasheet" && c100b60.rating.engine === "6BTA5.9-G6");
assert.ok(c100b60.kind === "datasheet" && c100b60.rating.prime === 120 && c100b60.rating.standby === 132 && c100b60.rating.primeKw === 96, "Cummins 124 / 137 held to TAL-A44-D at 480 V: 120 / 132");
const b150at60 = sixtyHz(getModel("4u-b150")!);
assert.ok(b150at60.kind === "datasheet" && b150at60.rating.prime === 180 && b150at60.rating.standby === 198, "Baudouin 181 / 200 held to TAL-A44-J 180 / 198");
const c100bLine = generatorItem(c100b, "enclosed", null, { prime: 124, standby: 137, volts: "480/277", engine: "6BTA5.9-G6" });
assert.ok(c100bLine.description.includes("original Cummins 6BTA5.9-G6 engine") && !c100bLine.description.includes("6BTA5.9-G5"));
assert.ok(generatorItem(c100b, "open", null, { prime: 124, standby: 137, volts: "380/220", ratedVolts: null }).description.includes("typical generator set output; the alternator for 380/220 V is confirmed with the order"));
assert.ok(!generatorItem(c100b, "open", null, { prime: 124, standby: 137, volts: "380/220" }).description.includes("typical generator set output"), "typed-in figures: no maker note");
assert.equal(sixtyHz(getModel("4u-l12-5")!).kind, "datasheet");
// typed-in figures: prime needed, standby ≥ prime, and a ratio far from 50 Hz is flagged
const p500 = getModel("4u-p500")!;
assert.match(check60(p500, 0, null)!, /Type the 60 Hz prime/);
assert.equal(check60(p500, 560, 616), null);
assert.match(check60(p500, 560, 500)!, /Standby can't be below prime/);
assert.match(check60(p500, 800, null)!, /Check it/);
const p500at60 = generatorItem(p500, "open", null, { prime: 560, standby: null, volts: "480/277" });
assert.equal(p500at60.title, "4U-P500 — Perkins Diesel Generator Set 560 kVA Prime, 60 Hz, Open Type");
assert.ok(p500at60.description.includes("Rated current at 480/277 V: 674 A prime."));
assert.equal(defaultHz("SA"), 60);
assert.equal(defaultHz("AE"), 50);
assert.equal(defaultVolts60("SA"), "380/220");
assert.equal(defaultVolts60("XX"), "480/277");

console.log("quotation tests passed");

// customer datasheets: every set builds, ratings come from the model file, no forbidden wording
{
  for (const m of gensetModels) {
    for (const loc of ["en", "ar"] as const) {
      const d = buildDatasheet(m, loc);
      assert.equal(d.prime.kva, m.primeKva);
      assert.equal(d.standby.kva, m.standbyKva);
      const text = JSON.stringify(d);
      assert.ok(!/brushless|chinese|\bAQT\b|\bAs\b/i.test(text), `${m.code} datasheet wording`);
    }
  }
  const p455 = buildDatasheet(getModel("4u-p455")!, "en");
  assert.equal(p455.prime.amps, 657);
  assert.equal(p455.sixty.kind, "fifty-only");
  const k30 = buildDatasheet(getModel("4u-k30")!, "en");
  assert.ok(k30.sixty.kind === "rated" && k30.sixty.prime === 35);
  // implausible source values stay off the sheet (e.g. a 0.25 m³/s radiator fan on a 136 kVA set)
  assert.ok(buildDatasheet(getModel("4u-c136")!, "en").hidden.some((h) => h.includes("cooling fan air flow")));
}
