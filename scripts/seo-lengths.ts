import { pageSeo } from "../src/content/seo";
for (const [k, v] of Object.entries(pageSeo)) {
  for (const l of ["en", "ar"] as const) {
    const t = [...v.title[l]].length, d = [...v.description[l]].length;
    const flag = (t < 45 || t > 62 ? " TITLE!" : "") + (d < 130 || d > 158 ? " DESC!" : "");
    console.log(k.padEnd(12), l, t, d, flag);
  }
}
