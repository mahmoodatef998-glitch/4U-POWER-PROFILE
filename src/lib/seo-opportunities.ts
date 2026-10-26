import type { SearchRow } from "./google-core";

/**
 * Turns Search Console rows (query × page) into actions: what to strengthen, what to write, and which
 * real searches to link internally. Pure functions — used by /admin/seo, the "Popular searches" block
 * and scripts/seo-snapshot.ts (weekly data for the article routine).
 */

/** A search is about our business when it names a product, engine brand, rating or application. */
const BUSINESS =
  /generat|genset|gen set|kva|\bkw\b|diesel|silent|canopy|perkins|cummins|kubota|baudouin|volvo|lister|\bats\b|transfer switch|change ?over|switch ?gear|\bmdb\b|\bsmdb\b|distribution board|\bsync|synchron|\bamf\b|alternator|stamford|leroy|load ?bank|light ?tower|fuel tank|solar|hybrid|\bbess\b|backup power|standby power|prime power|مولد|ديزل|كيلو ?فولت|ك\.?ف\.?أ|لوح|تحويل|توزيع|بيركنز|بركنز|كمنز|كامنز|كوبوتا|بودوين|طاقة|كهرباء/i;
/** …but not job hunting, second-hand or consumer gadgets. */
const EXCLUDE = /\bjobs?\b|vacanc|salary|career|hiring|وظيف|وظائف|راتب|\bused\b|مستعمل|second ?hand|wikipedia|\bhonda\b|inverter generator|home depot|walmart|\bamazon\b/i;
/** Searches for our own name are kept apart: they show brand demand, not content gaps. */
const BRAND = /\b4u\b|4u ?power|4ugenerators|فور ?يو/i;
/** Ranking pages too generic to satisfy a specific search. */
const GENERIC_PAGE = /^\/(en|ar)?(\/(news|contact|products|about))?$/;

const ARABIC = /[؀-ۿ]/;

export const isRelevant = (q: string) => BUSINESS.test(q) && !EXCLUDE.test(q);
export const isBrand = (q: string) => BRAND.test(q);
export const queryLocale = (q: string): "en" | "ar" => (ARABIC.test(q) ? "ar" : "en");

export type OpportunityKind = "quick_win" | "push" | "gap" | "winner";

export type Opportunity = {
  query: string;
  /** best-ranking page, as a path */
  page: string;
  position: number;
  impressions: number;
  clicks: number;
  locale: "en" | "ar";
  kind: OpportunityKind;
  action: string;
};

export const KIND_LABEL: Record<OpportunityKind, string> = {
  quick_win: "Almost on page 1",
  push: "Page 3–5",
  gap: "No good page yet",
  winner: "Already bringing clicks",
};

const ACTIONS: Record<OpportunityKind, string> = {
  quick_win: "Strengthen this page for the search: put the words in the title/heading, add a short section or FAQ that answers it, link to it from 2–3 related pages.",
  push: "Add depth: a section answering this search on the page, plus an article on the topic that links to it.",
  gap: "Write an article (or a dedicated page) that answers this search and links to the matching product page.",
  winner: "Working — keep the page current and check the click rate.",
};

export const pathOf = (url: string) => {
  try {
    return new URL(url, "https://www.4ugenerators.com").pathname.replace(/\/+$/, "") || "/";
  } catch {
    return url;
  }
};

/** One entry per search: the best-ranking page, with impressions and clicks summed over all its pages. */
function bestPerQuery(rows: SearchRow[]) {
  const m = new Map<string, SearchRow & { totalImpressions: number; totalClicks: number }>();
  for (const r of rows) {
    const q = r.query.trim().toLowerCase();
    if (!q) continue;
    const prev = m.get(q);
    if (!prev) m.set(q, { ...r, query: q, totalImpressions: r.impressions, totalClicks: r.clicks });
    else {
      prev.totalImpressions += r.impressions;
      prev.totalClicks += r.clicks;
      if (r.position < prev.position) Object.assign(prev, { page: r.page, position: r.position });
    }
  }
  return [...m.values()];
}

export function classify(rows: SearchRow[], minImpressions = 3): Opportunity[] {
  const out: Opportunity[] = [];
  for (const r of bestPerQuery(rows)) {
    if (!isRelevant(r.query) || isBrand(r.query)) continue;
    const page = pathOf(r.page);
    const position = Math.round(r.position * 10) / 10;
    let kind: OpportunityKind | null = null;
    if (r.totalClicks > 0 && position <= 10) kind = "winner";
    else if (r.totalImpressions < minImpressions) continue;
    else if (position > 50 || GENERIC_PAGE.test(page)) kind = "gap";
    else if (position > 20) kind = "push";
    else if (position > 3) kind = "quick_win";
    if (!kind) continue;
    out.push({ query: r.query, page, position, impressions: r.totalImpressions, clicks: r.totalClicks, locale: queryLocale(r.query), kind, action: ACTIONS[kind] });
  }
  // biggest prize first: many impressions, closest to page 1
  const score = (o: Opportunity) => o.impressions / Math.max(1, o.position / 10);
  return out.sort((a, b) => score(b) - score(a) || a.query.localeCompare(b.query));
}

export type PopularSearch = { label: string; href: string };

/**
 * Real searches that already find a specific page of ours, as internal links ("Popular searches").
 * Descriptive anchors from genuine demand help those pages; capped and filtered so it never reads as stuffing.
 */
export function popularSearches(rows: SearchRow[], locale: "en" | "ar", max = 10): PopularSearch[] {
  const perPage = new Map<string, number>();
  const out: PopularSearch[] = [];
  const candidates = bestPerQuery(rows)
    .filter((r) => isRelevant(r.query) && !isBrand(r.query) && queryLocale(r.query) === locale && r.position <= 30 && r.totalImpressions >= 2)
    .filter((r) => r.query.split(/\s+/).length <= 6 && r.query.length <= 60)
    .sort((a, b) => b.totalImpressions - a.totalImpressions);
  for (const r of candidates) {
    const href = pathOf(r.page);
    if (!href.startsWith(`/${locale}/`) || GENERIC_PAGE.test(href)) continue;
    const n = perPage.get(href) ?? 0;
    if (n >= 2) continue;
    perPage.set(href, n + 1);
    out.push({ label: r.query, href });
    if (out.length >= max) break;
  }
  return out;
}

/** Compact snapshot for the weekly article run (Supabase seo_snapshots, or data/seo-opportunities.json). */
export function snapshot(rows: SearchRow[], site: string, days: number) {
  const all = classify(rows);
  const slim = ({ query, page, position, impressions, clicks, locale, kind }: Opportunity) => ({ query, page, position, impressions, clicks, locale, kind });
  const pick = (k: OpportunityKind, n: number) =>
    all.filter((o) => o.kind === k).slice(0, n).map(({ query, page, position, impressions, clicks, locale }) => ({ query, page, position, impressions, clicks, locale }));
  return {
    generated_at: new Date().toISOString(),
    site,
    days,
    /** the most-searched relevant queries, whatever their position */
    top: [...all].sort((a, b) => b.impressions - a.impressions).slice(0, 40).map(slim),
    gaps: pick("gap", 40),
    quick_wins: pick("quick_win", 40),
    push: pick("push", 40),
    winners: pick("winner", 20),
  };
}
