/**
 * Weekly snapshot of real Google searches for the article routine (run by .github/workflows/seo-snapshot.yml).
 * Writes data/seo-opportunities.json: searches with no good page yet (gaps), almost-page-1 searches
 * (quick_wins), page 3–5 (push) and what already brings clicks (winners).
 * Env: GOOGLE_SERVICE_ACCOUNT_JSON (same service account as the site), optional GSC_SITE.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { googleConfigured, gscRows, gscSite } from "../src/lib/google-core";
import { snapshot } from "../src/lib/seo-opportunities";

const DAYS = 28;

async function main() {
  if (!googleConfigured()) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set or invalid");
  const rows = await gscRows(DAYS, 5000);
  const snap = snapshot(rows, gscSite(), DAYS);
  mkdirSync("data", { recursive: true });
  writeFileSync("data/seo-opportunities.json", `${JSON.stringify(snap, null, 2)}\n`);
  console.log(`${rows.length} rows → gaps ${snap.gaps.length}, quick wins ${snap.quick_wins.length}, push ${snap.push.length}, winners ${snap.winners.length}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
