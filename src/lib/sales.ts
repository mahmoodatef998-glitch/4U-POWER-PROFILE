/**
 * Sales report maths: one shape for every enquiry (WhatsApp click, call click, form lead), Dubai-time
 * reporting periods, and the aggregates shown in /admin/report. Pure functions — no I/O.
 */

export const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type Status = (typeof STATUSES)[number];

export const LOST_REASONS = {
  price: "Price too high · السعر عالي",
  competitor: "Bought from a competitor · اشترى من منافس",
  delivery: "Delivery time · مدة التوريد",
  spec: "Spec / model not available · المواصفات غير متوفرة",
  budget: "No budget / project on hold · لا ميزانية / المشروع متوقف",
  no_response: "Stopped replying · العميل لم يرد",
  not_serious: "Not serious / just asking · غير جاد",
  other: "Other · أخرى",
} as const;
export type LostReason = keyof typeof LOST_REASONS;
export const LOST_REASON_KEYS = Object.keys(LOST_REASONS) as LostReason[];

/** Enquiries sales log by hand in /admin (stored in `leads` with these sources). */
export const MANUAL_SOURCES = {
  phone: "Phone call",
  whatsapp: "WhatsApp (no ref code)",
  walk_in: "Walk-in / showroom",
  referral: "Referral",
  other: "Other",
} as const;
export type ManualSource = keyof typeof MANUAL_SOURCES;
export const MANUAL_SOURCE_KEYS = Object.keys(MANUAL_SOURCES) as ManualSource[];

export const FORM_SOURCES: Record<string, string> = {
  contact_form: "Contact form",
  quote_form: "Quote form",
  calculator: "kVA calculator",
  product: "Product page form",
  datasheet: "Datasheet download",
  rfq: "Quote basket (RFQ)",
  parts: "Spare-parts form",
};

/** Every `leads.source`, for filters. */
export const LEAD_SOURCES: Record<string, string> = { ...FORM_SOURCES, ...MANUAL_SOURCES };

export type Channel = "whatsapp" | "call" | "form" | "offline";
export const CHANNELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  call: "Phone calls",
  form: "Website forms",
  offline: "Walk-in / referral / other",
};
export const CHANNEL_KEYS = Object.keys(CHANNELS) as Channel[];

export type SalesTable = "leads" | "whatsapp_clicks" | "call_clicks";

export type Enquiry = {
  id: string;
  table: SalesTable;
  channel: Channel;
  /** finer source: the lead form, "whatsapp_click" or "call_click" */
  source: string;
  created_at: string;
  status: Status;
  deal_value: number | null;
  owner: string | null;
  lost_reason: LostReason | null;
  contacted_at: string | null;
  closed_at: string | null;
  /** where the visitor came from: Google Ads, a UTM source, a referring site, direct */
  traffic: string;
  campaign: string | null;
  page: string | null;
  ref: string | null;
  /** contact details and need — form / logged leads only */
  name: string | null;
  phone: string | null;
  email: string | null;
  country: string | null;
  message: string | null;
  product: string | null;
  kva: number | null;
  notes: string | null;
};

export const sourceLabel = (s: string) =>
  s === "whatsapp_click" ? "WhatsApp button" : s === "call_click" ? "Call button" : (FORM_SOURCES[s] ?? MANUAL_SOURCES[s as ManualSource] ?? s);

/** Google Ads click id wins, then UTM source, then the referring site, else direct. */
export function trafficSource(r: { gclid?: string | null; utm_source?: string | null; utm_medium?: string | null; referrer?: string | null }) {
  if (r.gclid) return "Google Ads";
  if (r.utm_source) return [r.utm_source, r.utm_medium].filter(Boolean).join(" / ");
  if (r.referrer) {
    try {
      const host = new URL(r.referrer).hostname.replace(/^www\./, "");
      if (!host.includes("4ugenerators")) return host;
    } catch {
      /* ignore */
    }
  }
  return "direct / organic";
}

/* ------------------------------------------------------------------ periods (Asia/Dubai, UTC+4, no DST) */

const TZ = 4 * 3600e3;
const DAY = 864e5;

export const PERIODS = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  this_month: "This month",
  last_month: "Last month",
  custom: "Custom",
} as const;
export type PeriodKey = keyof typeof PERIODS;

export type Period = {
  key: PeriodKey;
  label: string;
  start: Date;
  /** exclusive */
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  /** inclusive Dubai dates, YYYY-MM-DD */
  from: string;
  to: string;
  days: number;
};

/** Dubai calendar date of an instant, YYYY-MM-DD. */
export const dubaiYmd = (d: Date | number) => new Date(+d + TZ).toISOString().slice(0, 10);
/** UTC instant of Dubai midnight on a YYYY-MM-DD date. */
const dubaiMidnightOf = (ymd: string) => new Date(Date.parse(`${ymd}T00:00:00Z`) - TZ);
const monthStart = (y: number, m: number) => new Date(Date.UTC(y, m, 1) - TZ);
const isYmd = (s: string | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

export function periodRange(key: string | undefined, fromQ?: string, toQ?: string, now = new Date()): Period {
  const k: PeriodKey = key && key in PERIODS ? (key as PeriodKey) : "30d";
  const todayStart = dubaiMidnightOf(dubaiYmd(now));
  const tomorrow = new Date(+todayStart + DAY);
  const local = new Date(+now + TZ);
  const [y, m] = [local.getUTCFullYear(), local.getUTCMonth()];
  let start: Date;
  let end = tomorrow;
  let prevStart: Date | null = null;
  let prevEnd: Date | null = null;

  switch (k) {
    case "today":
      start = todayStart;
      break;
    case "7d":
      start = new Date(+todayStart - 6 * DAY);
      break;
    case "this_month":
      start = monthStart(y, m);
      prevStart = monthStart(y, m - 1);
      // same number of days into last month, so a half month is compared with a half month
      prevEnd = new Date(Math.min(+prevStart + (+end - +start), +start));
      break;
    case "last_month":
      start = monthStart(y, m - 1);
      end = monthStart(y, m);
      prevStart = monthStart(y, m - 2);
      prevEnd = start;
      break;
    case "custom": {
      if (!isYmd(fromQ) || !isYmd(toQ) || fromQ > toQ) return periodRange("30d", undefined, undefined, now);
      start = dubaiMidnightOf(fromQ);
      end = new Date(+dubaiMidnightOf(toQ) + DAY);
      if (+end - +start > 366 * DAY) start = new Date(+end - 366 * DAY);
      break;
    }
    default:
      start = new Date(+todayStart - 29 * DAY);
  }
  const span = +end - +start;
  prevStart ??= new Date(+start - span);
  prevEnd ??= start;
  return {
    key: k,
    label: k === "custom" ? `${dubaiYmd(start)} → ${dubaiYmd(+end - 1)}` : PERIODS[k],
    start,
    end,
    prevStart,
    prevEnd,
    from: dubaiYmd(start),
    to: dubaiYmd(+end - 1),
    days: Math.round(span / DAY),
  };
}

/* ------------------------------------------------------------------ aggregates */

export type Tally = {
  key: string;
  label: string;
  enquiries: number;
  /** left "new": sales picked it up (for WhatsApp: matched the ref of a chat that really arrived) */
  handled: number;
  open: number;
  won: number;
  lost: number;
  wonValue: number;
  /** quoted deals still open, AED */
  pipeline: number;
};

const blank = (key: string, label: string): Tally => ({ key, label, enquiries: 0, handled: 0, open: 0, won: 0, lost: 0, wonValue: 0, pipeline: 0 });

function add(t: Tally, e: Enquiry) {
  t.enquiries++;
  if (e.status !== "new") t.handled++;
  if (e.status === "contacted" || e.status === "quoted") t.open++;
  if (e.status === "won") {
    t.won++;
    t.wonValue += e.deal_value ?? 0;
  }
  if (e.status === "lost") t.lost++;
  if (e.status === "quoted") t.pipeline += e.deal_value ?? 0;
}

/** won ÷ handled — the share of real conversations sales turned into orders */
export const closeRate = (t: Pick<Tally, "won" | "handled">) => (t.handled ? t.won / t.handled : null);

function group(list: Enquiry[], keyOf: (e: Enquiry) => [string, string]) {
  const m = new Map<string, Tally>();
  for (const e of list) {
    const [key, label] = keyOf(e);
    let t = m.get(key);
    if (!t) m.set(key, (t = blank(key, label)));
    add(t, e);
  }
  return [...m.values()].sort((a, b) => b.enquiries - a.enquiries || b.won - a.won);
}

export const ownerKey = (o: string | null) => o?.trim().toLowerCase() || "";

export type Bucket = { label: string; start: Date; counts: Record<Channel, number> };

/** Daily buckets up to 62 days, weekly beyond. */
export function buckets(list: Enquiry[], p: Pick<Period, "start" | "end">): Bucket[] {
  const span = +p.end - +p.start;
  const step = span > 62 * DAY ? 7 * DAY : DAY;
  const out: Bucket[] = [];
  for (let t = +p.start; t < +p.end; t += step) {
    out.push({ label: dubaiYmd(t), start: new Date(t), counts: { whatsapp: 0, call: 0, form: 0, offline: 0 } });
  }
  for (const e of list) {
    const i = Math.floor((Date.parse(e.created_at) - +p.start) / step);
    if (out[i]) out[i]!.counts[e.channel]++;
  }
  return out;
}

export type Report = {
  total: Tally;
  byChannel: Tally[];
  bySource: Tally[];
  byTraffic: Tally[];
  byOwner: Tally[];
  lost: { key: LostReason | "none"; label: string; count: number }[];
  /** form leads (they left a name + phone) still "new" after 24 h */
  notFollowedUp: number;
  buckets: Bucket[];
};

export function buildReport(list: Enquiry[], p: Pick<Period, "start" | "end">, now = new Date()): Report {
  const total = blank("all", "All enquiries");
  for (const e of list) add(total, e);

  const byChannel = CHANNEL_KEYS.map((c) => {
    const t = blank(c, CHANNELS[c]);
    for (const e of list) if (e.channel === c) add(t, e);
    return t;
  });

  const lostList = list.filter((e) => e.status === "lost");
  const lost = [
    ...LOST_REASON_KEYS.map((k) => ({ key: k, label: LOST_REASONS[k], count: lostList.filter((e) => e.lost_reason === k).length })).filter((r) => r.count),
    { key: "none" as const, label: "No reason recorded · بدون سبب", count: lostList.filter((e) => !e.lost_reason).length },
  ]
    .filter((r) => r.count)
    .sort((a, b) => (a.key === "none" ? 1 : b.key === "none" ? -1 : b.count - a.count));

  return {
    total,
    byChannel,
    bySource: group(list, (e) => [e.source, sourceLabel(e.source)]),
    byTraffic: group(list, (e) => [e.traffic, e.traffic]),
    byOwner: group(list, (e) => [ownerKey(e.owner), e.owner?.trim() || "Unassigned"]),
    lost,
    notFollowedUp: list.filter((e) => e.channel === "form" && e.status === "new" && +now - Date.parse(e.created_at) > DAY).length,
    buckets: buckets(list, p),
  };
}

/* ------------------------------------------------------------------ CSV */

const CSV_COLUMNS: [string, (e: Enquiry) => string | number | null][] = [
  ["Date (Dubai)", (e) => new Date(Date.parse(e.created_at) + TZ).toISOString().slice(0, 16).replace("T", " ")],
  ["Channel", (e) => CHANNELS[e.channel]],
  ["Source", (e) => sourceLabel(e.source)],
  ["Ref", (e) => e.ref],
  ["Name", (e) => e.name],
  ["Phone", (e) => e.phone],
  ["Email", (e) => e.email],
  ["Country", (e) => e.country],
  ["Product", (e) => e.product],
  ["kVA", (e) => e.kva],
  ["Message / need", (e) => e.message],
  ["Page", (e) => e.page],
  ["Traffic", (e) => e.traffic],
  ["Campaign", (e) => e.campaign],
  ["Status", (e) => e.status],
  ["Sales owner", (e) => e.owner],
  ["Deal value AED", (e) => e.deal_value],
  ["Lost reason", (e) => (e.lost_reason ? LOST_REASONS[e.lost_reason] : null)],
  ["Notes", (e) => e.notes],
  ["First contact (Dubai)", (e) => (e.contacted_at ? new Date(Date.parse(e.contacted_at) + TZ).toISOString().slice(0, 16).replace("T", " ") : null)],
  ["Closed (Dubai)", (e) => (e.closed_at ? new Date(Date.parse(e.closed_at) + TZ).toISOString().slice(0, 16).replace("T", " ") : null)],
];

export const csvCell = (v: string | number | null) => {
  if (v == null) return "";
  const s = String(v);
  // quote everything that could break a row; neutralise spreadsheet formulas (phone numbers like +971… are fine)
  const formula = typeof v === "string" && /^[=+\-@]/.test(s) && !/^\+?[\d\s()-]+$/.test(s);
  const safe = formula ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function toCsv(list: Enquiry[]) {
  const rows = [CSV_COLUMNS.map(([h]) => h), ...list.map((e) => CSV_COLUMNS.map(([, f]) => f(e)))];
  // BOM so Excel opens Arabic text as UTF-8
  return "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}
