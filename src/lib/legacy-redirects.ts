import { GENERATOR_SIZES, sizeSlug } from "@/content/generator-sizes";

/**
 * Where an unknown URL should go. Google still has addresses from the domain's previous website
 * (e.g. /perkins-diesel-generators); instead of a 404 they get a permanent redirect to the closest page.
 * Rules run in order on the lower-cased path; the first match wins. null = genuine 404.
 */
const RULES: [RegExp, string][] = [
  [/perkins/, "/models#perkins"],
  [/cummins/, "/models#cummins"],
  [/kubota/, "/models#kubota"],
  [/baudouin/, "/models#baudouin"],
  [/volvo/, "/products/volvo-penta-generator-80-700kva"],
  [/lister/, "/products/lister-petter-generator-7-60kva"],
  [/\bats\b|transfer[-_ ]?switch|change[-_ ]?over/, "/ats-panels"],
  [/sync/, "/products/generator-synchronizing-panel"],
  [/light[-_ ]?tower/, "/products/diesel-light-tower"],
  [/switch[-_ ]?gear|\bmdb\b|distribution|panel|\blv\b|\bmcc\b/, "/switchgear"],
  [/solar|\bpv\b|bess|batter/, "/products"],
  [/spare|parts?\b|filter/, "/spare-parts"],
  [/servic|mainten|repair|rental|\bamc\b|install/, "/services"],
  [/\bgas\b/, "/products/gas-generator-50-1000kva"],
  [/calculat|sizing/, "/calculator"],
  [/generat|genset|diesel|silent|canopy|power/, "/generators"],
  [/project|portfolio|reference/, "/projects"],
  [/contact|enquir|inquir|quote/, "/contact"],
  [/about|team|company|profile|who[-_ ]?we|quality|safety|polic/, "/about"],
  [/news|blog|article/, "/news"],
  [/product|shop|catalog|store/, "/products"],
];

export function legacyRedirect(path: string): string | null {
  const p = decodeURIComponent(path).toLowerCase().replace(/[_+]/g, "-");
  // a size in the address ("500-kva", "500kva") → that size's page, when we have one
  const kva = /(\d{2,4})\s*-?\s*k\.?v\.?a/.exec(p);
  if (kva && (GENERATOR_SIZES as readonly number[]).includes(Number(kva[1]))) return `/generators/${sizeSlug(Number(kva[1]))}`;
  // word boundaries on "-" and "/" too ("ats-panel", "/lv/")
  const words = p.replace(/[-/.]/g, " ");
  for (const [re, target] of RULES) if (re.test(words)) return target;
  return null;
}
