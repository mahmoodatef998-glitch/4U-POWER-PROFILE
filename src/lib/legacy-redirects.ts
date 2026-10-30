import { GENERATOR_SIZES, sizeSlug } from "@/content/generator-sizes";
import { LEGACY_EXACT } from "./legacy-exact";

export { LEGACY_EXACT };

/**
 * Keyword rules, in order, on the lower-cased path with "-", "_", "/" and "." turned into spaces;
 * the first match wins. English words use word boundaries; Arabic ones match anywhere.
 */
const RULES: [RegExp, string][] = [
  [/perkins|بيركنز|بركنز/, "/perkins-diesel-generators"],
  [/cummins|كمنز|كامنز|كومنز/, "/cummins-diesel-generators"],
  [/kubota|كوبوتا/, "/kubota-diesel-generators"],
  [/baudouin|بودوين|بودوان/, "/baudouin-diesel-generators"],
  [/lister|ليستر/, "/lister-petter-diesel-generators"],
  [/volvo|فولفو/, "/products/volvo-penta-generator-80-700kva"],
  [/\bats\b|transfer switch|change ?over|تحويل/, "/ats-panels"],
  [/sync|تزامن|مزامنة/, "/products/generator-synchronizing-panel"],
  [/light ?tower|برج إنارة|ابراج انارة|أبراج إنارة/, "/products/diesel-light-tower"],
  [/switch ?gear|\bmdb\b|distribution|panel|\blv\b|\bmcc\b|لوحة|لوحات|توزيع/, "/switchgear"],
  [/solar|\bpv\b|bess|batter|شمسي|طاقة شمسية|بطاري/, "/products"],
  [/spare|\bparts?\b|filter|قطع غيار|فلاتر/, "/spare-parts"],
  [/servic|mainten|repair|rental|\bamc\b|install|صيانة|خدمات|خدمة|تأجير|ايجار|إيجار|تركيب/, "/services"],
  [/\bgas\b|غاز/, "/products/gas-generator-50-1000kva"],
  [/calculat|sizing|حاسبة/, "/calculator"],
  [/generat|genset|diesel|silent|canopy|power|مولد|ديزل|كهرباء/, "/generators"],
  [/project|portfolio|reference|مشاريع|مشروع/, "/projects"],
  [/contact|enquir|inquir|quote|اتصل|تواصل|عرض سعر/, "/contact"],
  [/about|team|company|profile|who we|quality|safety|polic|author|من نحن|الشركة/, "/about"],
  [/news|blog|article|category|\btag\b|أخبار|مقالات|مدونة/, "/news"],
  [/product|shop|catalog|store|منتجات/, "/products"],
];

const ARABIC = /[؀-ۿ]/;

/** Closest page for an unknown path (without locale), or null for a genuine 404. */
export function legacyRedirect(path: string): string | null {
  let p: string;
  try {
    p = decodeURIComponent(path);
  } catch {
    p = path;
  }
  p = p.toLowerCase().replace(/[_+]/g, "-");
  // a size in the address ("500-kva", "500kva", "500 ك.ف.أ") → that size's page, when we have one
  const kva = /(\d{2,4})\s*-?\s*(?:k\.?v\.?a|ك\.?ف\.?أ)/.exec(p);
  if (kva && (GENERATOR_SIZES as readonly number[]).includes(Number(kva[1]))) return `/generators/${sizeSlug(Number(kva[1]))}`;
  const words = p.replace(/[-/.]/g, " ");
  for (const [re, target] of RULES) if (re.test(words)) return target;
  return null;
}

/** Arabic old addresses go to the Arabic site whatever locale the visitor landed on. */
export const legacyLocale = (path: string, locale: string) => (ARABIC.test(safeDecode(path)) ? "ar" : locale);

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export type UrlCheck = { path: string; status: "live" | "redirect" | "404"; target?: string };

/**
 * What happens today to an address Google has for the site (used by /admin/traffic):
 * a page of the new site, a redirect (exact or by keyword), or a 404 that still needs a rule.
 */
export function checkUrl(url: string, livePaths: Set<string>): UrlCheck {
  let path: string;
  try {
    path = new URL(url, "https://www.4ugenerators.com").pathname;
  } catch {
    path = url;
  }
  path = path.replace(/\/+$/, "") || "/";
  if (livePaths.has(path) || path === "/") return { path, status: "live" };
  const exact = LEGACY_EXACT.find(([from]) => (from.endsWith("/:slug*") ? path.startsWith(from.slice(0, -7)) : from === path));
  if (exact) return { path, status: "redirect", target: exact[1] };
  const m = /^\/(en|ar)(\/.*)?$/.exec(path);
  const locale = m?.[1] ?? "en";
  const rest = m ? (m[2] ?? "/") : path;
  const target = legacyRedirect(rest);
  return target ? { path, status: "redirect", target: `/${legacyLocale(rest, locale)}${target}` } : { path, status: "404" };
}
