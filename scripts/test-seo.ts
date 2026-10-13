import assert from "node:assert/strict";
import { classify, isRelevant, popularSearches, snapshot } from "../src/lib/seo-opportunities";

const S = "https://www.4ugenerators.com";
const row = (query: string, page: string, position: number, impressions = 10, clicks = 0) => ({ query, page: S + page, position, impressions, clicks });

assert.ok(isRelevant("500 kva generator price uae"));
assert.ok(isRelevant("مولد ديزل 100 كيلو فولت"));
assert.ok(isRelevant("ats panel 400a"));
assert.ok(!isRelevant("generator technician jobs dubai"), "jobs are not leads");
assert.ok(!isRelevant("honda inverter generator"));
assert.ok(!isRelevant("weather sharjah"));

const rows = [
  row("500 kva generator price uae", "/en/generators/500-kva", 12.4, 40),
  row("500 kva generator price uae", "/en", 30, 15), // same search, weaker page: summed, best page kept
  row("perkins 1103 generator", "/en/models/4u-p100", 34, 8),
  row("ats panel price dubai", "/en", 18, 25), // ranks with the home page → needs a dedicated page
  row("synchronizing panel uae", "/en/products/generator-synchronizing-panel", 70, 6),
  row("cummins generator sharjah", "/en/models", 6, 30, 3),
  row("4u power generation", "/en", 1, 50, 20), // brand search: not an opportunity
  row("diesel generator 20 kva", "/en/generators/20-kva", 8, 2), // too few impressions
  row("مولد ديزل للبيع الشارقة", "/ar/generators", 9, 12),
  row("generator jobs uae", "/en", 40, 30),
];
const ops = classify(rows);
const by = Object.fromEntries(ops.map((o) => [o.query, o]));
assert.equal(by["500 kva generator price uae"]!.kind, "quick_win");
assert.equal(by["500 kva generator price uae"]!.page, "/en/generators/500-kva");
assert.equal(by["500 kva generator price uae"]!.impressions, 55);
assert.equal(by["perkins 1103 generator"]!.kind, "push");
assert.equal(by["ats panel price dubai"]!.kind, "gap", "home page ranking for a specific search = gap");
assert.equal(by["synchronizing panel uae"]!.kind, "gap");
assert.equal(by["cummins generator sharjah"]!.kind, "winner");
assert.equal(by["مولد ديزل للبيع الشارقة"]!.locale, "ar");
assert.ok(!by["4u power generation"], "brand searches are excluded");
assert.ok(!by["diesel generator 20 kva"], "below the impressions floor");
assert.ok(!by["generator jobs uae"]);
assert.equal(ops[0]!.query, "500 kva generator price uae", "biggest prize first");

// popular searches: same language, specific pages only, at most 2 per page
const en = popularSearches(rows, "en");
// position 34 is too weak to advertise; 2 impressions is enough for a link
assert.deepEqual(en.map((p) => p.href).sort(), ["/en/generators/20-kva", "/en/generators/500-kva", "/en/models"]);
assert.ok(!en.some((p) => p.href === "/en"), "never the home page");
const ar = popularSearches(rows, "ar");
assert.deepEqual(ar, [{ label: "مولد ديزل للبيع الشارقة", href: "/ar/generators" }]);
const many = popularSearches(Array.from({ length: 5 }, (_, i) => row(`perkins generator ${i}`, "/en/models", 5, 10 - i)), "en");
assert.equal(many.length, 2, "max two searches per page");

const snap = snapshot(rows, "sc-domain:4ugenerators.com", 28);
assert.equal(snap.gaps.length, 2);
assert.equal(snap.quick_wins[0]!.query, "500 kva generator price uae");
console.log("seo opportunity tests passed");
