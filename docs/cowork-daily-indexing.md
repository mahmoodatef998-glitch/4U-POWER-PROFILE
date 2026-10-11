# Cowork scheduled task — daily Google indexing (4ugenerators.com)

Run in **Claude Cowork** (desktop app) with **Claude in Chrome**, in a Chrome profile already signed in to
Google Search Console. Schedule: **daily, 09:00 UAE**. The task stops itself once every sitemap URL is indexed.

Google allows ~10 "Request indexing" clicks per property per day; the task respects that and keeps a log so it
never repeats work.

---

## Prompt (paste as the scheduled task)

```
Daily Google indexing — https://www.4ugenerators.com

Use Chrome, where I am already signed in to Google Search Console. Property: "4ugenerators.com" (Domain property).
Keep a log file named 4u-indexing-log.csv in this task's folder with columns: date,url,result
(create it if it does not exist). Read it first.

1. Open https://search.google.com/search-console?resource_id=sc-domain%3A4ugenerators.com

2. Build today's candidate list in this exact order. Skip any URL the log marks "indexed",
   and any URL the log marks "requested" in the last 14 days.
   a) Priority pages (all under https://www.4ugenerators.com):
      /en  /ar
      /en/products  /en/generators  /en/ats-panels  /en/switchgear  /en/spare-parts  /en/services
      /en/products/perkins-diesel-generator-10-200kva  /en/products/perkins-diesel-generator-250-2500kva
      /en/products/cummins-diesel-generator-20-500kva  /en/products/cummins-diesel-generator-550-2500kva
      /en/products/ats-panel-63a-400a  /en/products/generator-synchronizing-panel
      /en/locations/dubai  /en/locations/sharjah  /en/locations/abu-dhabi
      /en/generators/100-kva  /en/generators/250-kva  /en/generators/500-kva  /en/generators/1000-kva
      /en/contact  /en/about  /en/projects  /en/news
      then the same list with /ar instead of /en
   b) Then every other URL listed in https://www.4ugenerators.com/sitemap.xml
      (English pages first, then Arabic, news articles last).

3. Work through the candidates until you have made 10 successful indexing requests:
   - Paste the URL into the "Inspect any URL" bar at the top of Search Console and press Enter. Wait for the result.
   - "URL is on Google" → log "indexed" and continue (does not count toward the 10).
   - "URL is not on Google" → click "Request indexing", wait for the live test to finish (can take 1–2 minutes),
     then close the "Indexing requested" dialog. Log "requested".
   - "Quota exceeded" / "daily limit" message → log "quota" and stop for today.
   - Any error (404, redirect, noindex, server error) → log the message as the result, do NOT request, continue.

4. Finish with a short summary in Arabic: how many requested today, how many found already indexed,
   any errors (with the URL), and how many sitemap URLs are still not confirmed indexed.

5. If every URL in the sitemap is logged "indexed", reply only:
   "كل صفحات الموقع اتفهرست على Google — تقدر توقف المهمة دي." and do nothing else.

Rules:
- Only use the URL inspection bar and the "Request indexing" button. Do not change settings, users, sitemaps,
  and never click "Remove", "Validate fix" or anything that edits the property.
- If Google asks me to sign in, for a password or for 2-step verification, stop and tell me. Never type passwords.
- Do not open other websites except https://www.4ugenerators.com/sitemap.xml.
```

---

## Notes

- The log file is what makes the task safe to run every day: indexed pages are skipped forever, requested pages
  are retried only after 14 days.
- After the priority pages are indexed (usually 1–2 weeks) the task moves through the rest of the sitemap
  (~200 URLs ≈ 3 weeks at 10/day), then tells you to stop it.
- Bing, Yandex and other IndexNow engines are already notified automatically by the site
  (`/api/indexnow`, weekly cron + every published article) — no task needed for them.
