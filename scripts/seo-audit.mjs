/**
 * Crawls every URL in sitemap.xml on a running server and verifies the §6.1 technical SEO baseline.
 * Usage: npm run build && npm start  (in another shell)  →  node scripts/seo-audit.mjs http://localhost:3000
 */
import * as cheerio from "cheerio";

const base = process.argv[2] ?? "http://localhost:3000";
const siteXml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...siteXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const titles = new Map();
const descs = new Map();
let failures = 0;

for (const path of urls) {
  const res = await fetch(base + path);
  const html = await res.text();
  const $ = cheerio.load(html);
  const errs = [];
  const warn = [];
  if (res.status !== 200) errs.push(`status ${res.status}`);
  const title = $("head > title").text();
  const desc = $('meta[name="description"]').attr("content") ?? "";
  const tl = [...title].length;
  const dl = [...desc].length;
  if (!title) errs.push("missing <title>");
  else if (tl < 40 || tl > 65) warn.push(`title ${tl} chars`);
  if (!desc) errs.push("missing meta description");
  else if (dl < 110 || dl > 160) warn.push(`description ${dl} chars`);
  if (titles.has(title)) errs.push(`duplicate title with ${titles.get(title)}`);
  titles.set(title, path);
  if (desc && descs.has(desc)) errs.push(`duplicate description with ${descs.get(desc)}`);
  descs.set(desc, path);
  const h1 = $("h1").length;
  if (h1 !== 1) errs.push(`${h1} <h1>`);
  let prev = 1;
  $("main h1, main h2, main h3, main h4, main h5, main h6").each((_, el) => {
    const lvl = Number(el.tagName[1]);
    if (lvl > prev + 1) errs.push(`heading skip h${prev}→h${lvl} ("${$(el).text().slice(0, 40)}")`);
    prev = lvl;
  });
  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical || !canonical.endsWith(path === "/" ? "" : path)) errs.push(`canonical ${canonical}`);
  for (const l of ["en", "ar", "x-default"]) if (!$(`link[rel="alternate"][hreflang="${l}"]`).length) errs.push(`hreflang ${l} missing`);
  for (const p of ["og:title", "og:description", "og:image", "og:url"]) if (!$(`meta[property="${p}"]`).length) errs.push(`${p} missing`);
  if (!$('meta[name="twitter:card"]').length) errs.push("twitter:card missing");
  const types = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const d = JSON.parse($(el).text());
      const collect = (o) => (o["@graph"] ? o["@graph"].forEach(collect) : types.push([].concat(o["@type"]).join("/")));
      collect(d);
    } catch {
      errs.push("invalid JSON-LD");
    }
  });
  if (!types.some((t) => t.includes("LocalBusiness"))) errs.push("LocalBusiness schema missing");
  if (path.split("/").length > 2 && !types.includes("BreadcrumbList")) errs.push("BreadcrumbList missing");
  if (path.includes("/products/") && !types.includes("Product")) errs.push("Product schema missing");
  if (path.includes("/news/") && !types.includes("Article")) errs.push("Article schema missing");
  $("img").each((_, el) => {
    if ($(el).attr("alt") === undefined) errs.push(`img without alt: ${$(el).attr("src")}`);
  });
  if (!$("main").length || !$("nav").length || !$("footer").length) errs.push("missing landmark");
  const lang = $("html").attr("lang");
  const dir = $("html").attr("dir");
  if (path.startsWith("/ar") && (lang !== "ar" || dir !== "rtl")) errs.push("ar page not lang=ar dir=rtl");
  if (errs.length) failures++;
  console.log(`${errs.length ? "✗" : "✓"} ${path.padEnd(58)} [${types.join(", ")}] ${errs.join("; ")}${warn.length ? "  ⚠ " + warn.join(", ") : ""}`);
}
console.log(`\n${urls.length} URLs audited, ${failures} with errors.`);
process.exit(failures ? 1 : 0);
