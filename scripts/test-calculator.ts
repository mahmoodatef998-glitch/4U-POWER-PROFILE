import assert from "node:assert/strict";
import { calculate, matchProducts, matchAts, PRESETS } from "../src/lib/calculator";
import { products } from "../src/content/products";

const r1 = calculate({ mode: "known_load", unit: "kw", kw: 160, powerFactor: 0.8, margin: 25 });
assert.equal(r1.runningKva, 200);
assert.equal(r1.recommendedKva, 250);
assert.equal(r1.atsRating, 400);

const r2 = calculate({ mode: "known_load", unit: "amps", amps: 100, voltage: 400, phases: 3, powerFactor: 0.8, margin: 20 });
assert.equal(Math.round(r2.runningKva), 69);
assert.equal(r2.recommendedKva, 100);

const r3 = calculate({ mode: "known_load", unit: "kw", kw: 2400, powerFactor: 0.8, margin: 25 });
assert.ok(r3.overRange);

for (const [type, items] of Object.entries(PRESETS)) {
  const r = calculate({ mode: "site_builder", loadType: type as never, items, powerFactor: 0.8, margin: 25 });
  const m = matchProducts(products, r.recommendedKva);
  assert.ok(m.length > 0, `no match for ${type}`);
  assert.ok(matchAts(products, r.recommendedKva), `no ATS for ${type}`);
  console.log(type, r.runningKw, "kW ->", r.recommendedKva, "kVA,", r.atsRating, "A |", m.map((p) => p.slug).join(", "));
}
for (const k of [10, 15, 20, 30, 40, 50, 100, 250, 300, 500, 800, 1000, 2000, 2500]) {
  assert.ok(matchProducts(products, k).length > 0, `no gen for ${k}`);
  assert.ok(matchAts(products, k), `no ats for ${k}`);
}
console.log("calculator tests passed");
