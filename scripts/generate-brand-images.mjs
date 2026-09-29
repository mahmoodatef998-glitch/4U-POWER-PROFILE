// Renders og-default.png, logo-mark.png and apple-icon.png with Playwright (run once; outputs are committed).
// Usage: node scripts/generate-brand-images.mjs <path-to-playwright/index.mjs>
import { readFileSync } from "node:fs";
const { chromium } = await import(process.argv[2] ?? "playwright");
const hero = readFileSync("public/images/hero/hero-genset.svg", "utf8");
const bolt = `<svg viewBox="0 0 40 40" width="100%" height="100%"><rect width="40" height="40" rx="10" fill="#f5a524"/><path d="M22.5 6 11 22.5h8.2L17 34l12-17.2h-8.3L22.5 6Z" fill="#0a1426"/></svg>`;
const og = `<html><body style="margin:0;width:1200px;height:630px;position:relative;overflow:hidden;background:#060c18;font-family:Arial,Helvetica,sans-serif">
<div style="position:absolute;inset:0;opacity:.75;transform:translateX(260px)">${hero.replace("<svg", '<svg width="1200" height="900" style="margin-top:-150px"')}</div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg,#060c18 38%,rgba(6,12,24,.4) 75%,rgba(6,12,24,0))"></div>
<div style="position:absolute;left:72px;top:70px;display:flex;align-items:center;gap:18px"><div style="width:72px;height:72px">${bolt}</div>
<div><div style="color:#fff;font-weight:800;font-size:34px">4U Power</div><div style="color:#ffbe3d;font-weight:700;font-size:16px;letter-spacing:5px">GENERATION</div></div></div>
<div style="position:absolute;left:72px;top:230px;width:640px;color:#fff;font-weight:800;font-size:54px;line-height:1.08">Diesel Generators, ATS Panels &amp; Switchgear</div>
<div style="position:absolute;left:72px;top:420px;color:#c6d1e6;font-size:26px">10 – 2500 kVA · SAIF Zone, Sharjah · UAE · KSA · Iraq</div>
<div style="position:absolute;left:72px;bottom:60px;background:#f5a524;color:#0a1426;font-weight:800;font-size:24px;padding:12px 26px;border-radius:999px">WhatsApp +971 52 336 7694</div>
</body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(og);
await p.screenshot({ path: "public/images/og-default.png" });
for (const [file, size] of [["public/images/logo-mark.png", 512], ["src/app/apple-icon.png", 180]]) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<html><body style="margin:0;background:transparent">${bolt.replace('width="100%" height="100%"', `width="${size}" height="${size}"`)}</body></html>`);
  await p.screenshot({ path: file, omitBackground: true });
}
await b.close();
console.log("brand images written");
