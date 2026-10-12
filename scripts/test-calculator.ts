import assert from "node:assert/strict";
import { calculate, matchProducts, matchAts, PRESETS } from "../src/lib/calculator";
import { products } from "../src/content/products";
import { sizingModels } from "../src/lib/genset-models";
import { analyse, evaluate, fuelAt, minimumRating, recommend, SITE_PRESETS, softStartAlternative, type SizingInput } from "../src/lib/sizing";

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
// ---------------------------------------------------------------- sizing engine (all 4U models)
const models = sizingModels();
const base = { duty: "standby", ambientC: 40, altitudeM: 0, growthPct: 0, dipLimitPct: 20, simultaneityPct: 100, avgLoadPct: 75, startTogether: false } as const;
const run = (inp: SizingInput) => {
  const a = analyse(inp);
  return { a, min: minimumRating(inp, a), picks: recommend(models, inp, a) };
};

// 80 kW at 0.8 PF, 40 °C, no growth → exactly 100 kVA standby needed; every pick covers it
const s1 = run({ ...base, lines: [{ id: "a", kind: "sockets", kw: 80, qty: 1, pf: 0.8 }] });
assert.equal(Math.round(s1.a.runningKva), 100);
assert.equal(Math.round(s1.min.standbyKva), 100);
assert.ok(s1.picks.length >= 3);
for (const f of s1.picks) assert.ok(f.ok && f.model.standbyKva >= 100 && f.loadPct <= 100, f.model.code);

// derating: 50 °C → 90 %, 2200 m → another 16 %
const s2 = run({ ...base, ambientC: 50, altitudeM: 2200, lines: [{ id: "a", kind: "sockets", kw: 80, qty: 1, pf: 0.8 }] });
assert.equal(Math.round(s2.a.derate * 100), 76);
assert.ok(s2.min.standbyKva > 130);

// a 37 kW DOL motor drives the size; a soft starter makes the set smaller
const fac: SizingInput = { ...base, lines: [{ id: "m", kind: "motor", kw: 37, qty: 1 }, { id: "o", kind: "sockets", kw: 40, qty: 1 }] };
const s3 = run(fac);
assert.ok(["start", "dip"].includes(s3.min.binding));
const soft = softStartAlternative(models, fac, s3.a, s3.picks[0]);
assert.ok(soft && soft.savingKva > 0);

// tighter dip limit never gives a smaller set
const s4 = run({ ...fac, dipLimitPct: 10 });
assert.ok(s4.min.standbyKva >= s3.min.standbyKva);

// prime duty needs at least as much as standby
const s5 = run({ ...fac, duty: "prime" });
assert.ok(s5.picks[0]!.model.standbyKva >= s3.picks[0]!.model.standbyKva);

// beyond a single set → identical sets in parallel
const s6 = run({ ...base, lines: [{ id: "a", kind: "sockets", kw: 3000, qty: 1, pf: 0.8 }] });
assert.ok(s6.picks.length && s6.picks.every((f) => f.units > 1 && f.ok));

// 6-pulse UPS needs a bigger alternator than the same load as IGBT
const ups = (h: "igbt" | "six_pulse") => run({ ...base, lines: [{ id: "u", kind: "ups", kw: 200, qty: 1, harmonics: h }] }).min.standbyKva;
assert.ok(ups("six_pulse") > ups("igbt"));

// fuel interpolation hits the datasheet points
for (const m of models) {
  if (!m.fuel) continue;
  assert.equal(fuelAt(m, 1), m.fuel[2], m.code);
  assert.equal(fuelAt(m, 0.75), m.fuel[1], m.code);
}

// every site preset gets a recommendation that really passes
for (const [type, lines] of Object.entries(SITE_PRESETS)) {
  const inp = { ...base, ambientC: 45, growthPct: 15, lines };
  const r = run(inp);
  assert.ok(r.picks.length, `no pick for ${type}`);
  for (const f of r.picks) assert.ok(evaluate(f.model, inp, r.a, f.units).ok);
  console.log("sizing", type, Math.round(r.a.runningKw), "kW → min", Math.round(r.min.standbyKva), "kVA by", r.min.binding, "|", r.picks.map((f) => f.model.code).join(", "));
}
console.log("calculator tests passed");
