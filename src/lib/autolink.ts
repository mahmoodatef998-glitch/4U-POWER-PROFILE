/**
 * Internal links for article Markdown: the first mention of a generator size, an engine brand or a product
 * becomes a link to its page (search engines judge a page partly by the links pointing at it; on 8 Nov 2026
 * only 2 of 44 articles linked the generators page). Existing links, headings and code are never touched,
 * a page already linked from the article is not linked again, and at most MAX links are added.
 */
import { GENERATOR_SIZES, sizeSlug } from "../content/generator-sizes";

type Locale = "en" | "ar";
type Rule = { re: RegExp; path: (m: RegExpExecArray) => string | null };

const MAX = 6;
const MAX_SIZES = 3;
const AR = "\\u0600-\\u06FF";
const en = (words: string) => new RegExp(`(?<![\\w-])(?:${words})(?![\\w-])`, "i");
const ar = (words: string) => new RegExp(`(?<![${AR}])(?:${words})(?![${AR}])`);
const fixed = (path: string) => () => path;

const SIZES = new Set<number>(GENERATOR_SIZES);
const sizeRule = (re: RegExp): Rule => ({
  re,
  path: (m) => {
    const k = Number(m[1]);
    return SIZES.has(k) ? `/generators/${sizeSlug(k)}` : null;
  },
});

const RULES: Record<Locale, Rule[]> = {
  en: [
    sizeRule(/(?<![\d–\-.,])(?<!\bto )(\d{2,4}) ?kVA\b/i),
    { re: en("Perkins"), path: fixed("/perkins-diesel-generators") },
    { re: en("Cummins"), path: fixed("/cummins-diesel-generators") },
    { re: en("Baudouin"), path: fixed("/baudouin-diesel-generators") },
    { re: en("Kubota"), path: fixed("/kubota-diesel-generators") },
    { re: en("Lister Petter"), path: fixed("/lister-petter-diesel-generators") },
    { re: en("ATS panels?"), path: fixed("/ats-panels") },
    { re: en("synchroni[sz]ing panels?"), path: fixed("/products/generator-synchronizing-panel") },
    { re: en("main distribution boards?|MDBs?"), path: fixed("/products/main-distribution-board-mdb") },
    { re: en("fuel tanks?"), path: fixed("/products/generator-fuel-tanks") },
    { re: en("kVA calculator"), path: fixed("/calculator") },
    { re: en("spare parts"), path: fixed("/spare-parts") },
    { re: en("switchgear"), path: fixed("/switchgear") },
    { re: en("diesel generators"), path: fixed("/generators") },
  ],
  ar: [
    sizeRule(/(?<![\d–\-.,])(?<!إلى )(\d{2,4}) ?ك\.ف\.أ/),
    { re: ar("بيركنز"), path: fixed("/perkins-diesel-generators") },
    { re: ar("كمنز"), path: fixed("/cummins-diesel-generators") },
    { re: ar("بودوان"), path: fixed("/baudouin-diesel-generators") },
    { re: ar("كوبوتا"), path: fixed("/kubota-diesel-generators") },
    { re: ar("ليستر بيتر"), path: fixed("/lister-petter-diesel-generators") },
    { re: ar("لوحات ATS|لوحة ATS"), path: fixed("/ats-panels") },
    { re: ar("لوحات التزامن|لوحة التزامن"), path: fixed("/products/generator-synchronizing-panel") },
    { re: ar("لوحة التوزيع الرئيسية|لوحات التوزيع الرئيسية"), path: fixed("/products/main-distribution-board-mdb") },
    { re: ar("خزان الوقود|خزان وقود|خزانات الوقود"), path: fixed("/products/generator-fuel-tanks") },
    { re: ar("حاسبة القدرة"), path: fixed("/calculator") },
    { re: ar("قطع الغيار"), path: fixed("/spare-parts") },
    { re: ar("مولدات الديزل"), path: fixed("/generators") },
  ],
};

/** Text ranges that must not be edited: links, images, headings, inline code, raw URLs. */
function protectedRanges(md: string): [number, number][] {
  const out: [number, number][] = [];
  const res = [/!?\[[^\]]*\]\([^)]*\)/g, /^#{1,6} .*$/gm, /`[^`]*`/g, /https?:\/\/\S+/g];
  for (const re of res) for (const m of md.matchAll(re)) out.push([m.index!, m.index! + m[0].length]);
  return out;
}

export function autoLink(md: string, locale: Locale): string {
  let s = md;
  let added = 0;
  let sizes = 0;
  const linked = (path: string) => s.includes(`](/${locale}${path})`) || s.includes(`](/${locale}${path}#`);
  for (const rule of RULES[locale]) {
    if (added >= MAX) break;
    const isSize = rule === RULES[locale][0];
    // the size rule may link several different sizes; every other rule links once
    for (let guard = 0; guard < (isSize ? 20 : 1); guard++) {
      if (added >= MAX || (isSize && sizes >= MAX_SIZES)) break;
      const blocked = protectedRanges(s);
      const re = new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : rule.re.flags + "g");
      let hit: RegExpExecArray | null = null;
      let target: string | null = null;
      for (let m = re.exec(s); m; m = re.exec(s)) {
        const start = m.index;
        const end = start + m[0].length;
        if (blocked.some(([a, b]) => start < b && end > a)) continue;
        const p = rule.path(m);
        if (!p || linked(p)) continue;
        hit = m;
        target = p;
        break;
      }
      if (!hit || !target) break;
      s = `${s.slice(0, hit.index)}[${hit[0]}](/${locale}${target})${s.slice(hit.index + hit[0].length)}`;
      added++;
      if (isSize) sizes++;
    }
  }
  return s;
}
