import assert from "node:assert/strict";
import { buildReport, closeRate, dubaiYmd, periodRange, toCsv, type Enquiry } from "../src/lib/sales";

// ---------------------------------------------------------------- periods (Dubai = UTC+4)
// 13 Oct 2026, 01:30 in Dubai = 12 Oct 21:30 UTC
const now = new Date("2026-10-12T21:30:00Z");
assert.equal(dubaiYmd(now), "2026-10-13");

const today = periodRange("today", undefined, undefined, now);
assert.equal(today.start.toISOString(), "2026-10-12T20:00:00.000Z");
assert.equal(today.end.toISOString(), "2026-10-13T20:00:00.000Z");
assert.equal(today.from, "2026-10-13");
assert.equal(today.to, "2026-10-13");

const w = periodRange("7d", undefined, undefined, now);
assert.equal(w.from, "2026-10-07");
assert.equal(w.to, "2026-10-13");
assert.equal(w.days, 7);
assert.equal(+w.prevEnd, +w.start);
assert.equal(+w.start - +w.prevStart, 7 * 864e5);

const last = periodRange("last_month", undefined, undefined, now);
assert.equal(last.from, "2026-09-01");
assert.equal(last.to, "2026-09-30");
assert.equal(dubaiYmd(last.prevStart), "2026-08-01");
assert.equal(+last.prevEnd, +last.start);

const month = periodRange("this_month", undefined, undefined, now);
assert.equal(month.from, "2026-10-01");
assert.equal(month.to, "2026-10-13");
assert.equal(dubaiYmd(month.prevStart), "2026-09-01");
assert.equal(dubaiYmd(+month.prevEnd - 1), "2026-09-13", "this month is compared with the same days of last month");

// January → previous month is December of the year before
const jan = periodRange("last_month", undefined, undefined, new Date("2027-01-10T08:00:00Z"));
assert.equal(jan.from, "2026-12-01");
assert.equal(jan.to, "2026-12-31");

const custom = periodRange("custom", "2026-09-10", "2026-09-20", now);
assert.equal(custom.from, "2026-09-10");
assert.equal(custom.to, "2026-09-20");
assert.equal(custom.days, 11);
// bad input falls back to the last 30 days
assert.equal(periodRange("custom", "2026-09-20", "2026-09-10", now).key, "30d");
assert.equal(periodRange("custom", "nope", "2026-09-10", now).key, "30d");
assert.equal(periodRange(undefined, undefined, undefined, now).days, 30);

// ---------------------------------------------------------------- report
let n = 0;
const e = (o: Partial<Enquiry>): Enquiry => ({
  id: String(++n), table: "leads", channel: "form", source: "quote_form", created_at: "2026-10-10T08:00:00Z", status: "new",
  deal_value: null, owner: null, lost_reason: null, contacted_at: null, closed_at: null, traffic: "direct / organic",
  campaign: null, page: null, ref: null, name: "A", phone: "+971500000000", notes: null, ...o,
});
const list: Enquiry[] = [
  e({ channel: "whatsapp", source: "whatsapp_click", table: "whatsapp_clicks", status: "won", deal_value: 120000, owner: "Ahmed", traffic: "Google Ads" }),
  e({ channel: "whatsapp", source: "whatsapp_click", table: "whatsapp_clicks", status: "new" }),
  e({ channel: "whatsapp", source: "whatsapp_click", table: "whatsapp_clicks", status: "lost", lost_reason: "price", owner: "ahmed " }),
  e({ channel: "call", source: "call_click", table: "call_clicks", status: "quoted", deal_value: 50000, owner: "Sara" }),
  e({ channel: "call", source: "phone", status: "lost", owner: "Sara" }),
  e({ status: "new", created_at: "2026-10-12T08:00:00Z" }), // form lead, 13.5 h old → not yet overdue
  e({ status: "new", created_at: "2026-10-08T08:00:00Z" }), // form lead, 4 days old → overdue
  e({ status: "won", deal_value: 30000, owner: "Sara", created_at: "2026-10-01T08:00:00Z" }),
];
const r = buildReport(list, w, now);
assert.equal(r.total.enquiries, 8);
assert.equal(r.total.handled, 5);
assert.equal(r.total.won, 2);
assert.equal(r.total.lost, 2);
assert.equal(r.total.open, 1);
assert.equal(r.total.wonValue, 150000);
assert.equal(r.total.pipeline, 50000);
assert.equal(closeRate(r.total), 2 / 5);
assert.equal(r.notFollowedUp, 1);

const ch = Object.fromEntries(r.byChannel.map((c) => [c.key, c]));
assert.equal(ch.whatsapp!.enquiries, 3);
assert.equal(ch.whatsapp!.won, 1);
assert.equal(ch.call!.enquiries, 2, "a logged phone lead counts as a call");
assert.equal(ch.form!.enquiries, 3);

// owners group case- and space-insensitively; unassigned is its own row
const ahmed = r.byOwner.find((o) => o.key === "ahmed")!;
assert.equal(ahmed.enquiries, 2);
assert.equal(ahmed.won, 1);
assert.equal(r.byOwner.find((o) => o.key === "")!.label, "Unassigned");
assert.equal(r.byOwner.find((o) => o.key === "sara")!.wonValue, 30000);

// lost reasons, with the missing one last
assert.deepEqual(r.lost.map((l) => [l.key, l.count]), [["price", 1], ["none", 1]]);

// buckets: 7 days, every enquiry inside the period lands in a bucket
assert.equal(r.buckets.length, 7);
const inPeriod = list.filter((x) => Date.parse(x.created_at) >= +w.start).length;
assert.equal(r.buckets.reduce((s, b) => s + b.counts.whatsapp + b.counts.call + b.counts.form + b.counts.offline, 0), inPeriod);
// long ranges switch to weekly buckets
assert.equal(buildReport([], periodRange("custom", "2026-01-01", "2026-06-30", now)).buckets.length, 26);

// ---------------------------------------------------------------- CSV
const csv = toCsv([e({ name: '=HYPERLINK("x")', notes: 'said "call back", tomorrow', phone: "+971 50 123 4567" })]);
assert.ok(csv.startsWith("﻿Date (Dubai),Channel"));
assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`), "formulas are neutralised and quotes escaped");
assert.ok(csv.includes('"said ""call back"", tomorrow"'));
assert.ok(csv.includes(",+971 50 123 4567,"), "phone numbers stay as typed");

console.log("sales report tests passed");
