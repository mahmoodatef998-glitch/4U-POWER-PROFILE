import { GENERATOR_SIZES, sizeSlug } from "@/content/generator-sizes";
import { cities } from "@/content/locations";
import { getProducts } from "@/lib/data";
import { company, SITE_URL } from "@/lib/site";

export const revalidate = 86400;

/** llms.txt — a plain-text map of the site for AI search assistants (https://llmstxt.org). */
export async function GET() {
  const products = await getProducts();
  const u = (p: string) => `${SITE_URL}/en${p === "/" ? "" : p}`;
  const body = [
    `# ${company.legalName}`,
    "",
    `> Supplier of diesel generators (10–2500 kVA, Cummins, Perkins), ATS panels, LV/MV switchgear, solar PV and BESS, fuel tanks and light towers. Based in SAIF Zone, Sharjah, UAE (licence ${company.licenseNo}); delivers across the UAE and exports to Saudi Arabia and Iraq. Every product carries a 12-month warranty. Phone/WhatsApp ${company.phone}. Arabic pages: replace /en/ with /ar/.`,
    "",
    "## Main pages",
    `- [Diesel generators](${u("/generators")})`,
    `- [ATS panels](${u("/ats-panels")})`,
    `- [Switchgear](${u("/switchgear")})`,
    `- [Product catalog](${u("/products")})`,
    `- [Generator size calculator](${u("/calculator")})`,
    `- [Generator size chart (kVA, kW, amps, fuel)](${u("/generators/sizes")})`,
    `- [Services & warranty](${u("/services")})`,
    `- [Generator spare parts (send a part number or photo)](${u("/spare-parts")})`,
    `- [Contact](${u("/contact")})`,
    "",
    "## Generator sizes",
    ...GENERATOR_SIZES.map((k) => `- [${k} kVA diesel generator](${u(`/generators/${sizeSlug(k)}`)})`),
    "",
    "## Locations",
    ...cities.map((c) => `- [Generators in ${c.name.en}](${u(`/locations/${c.slug}`)})`),
    "",
    "## Products",
    ...products.map((p) => `- [${p.name_en}](${u(`/products/${p.slug}`)})`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
