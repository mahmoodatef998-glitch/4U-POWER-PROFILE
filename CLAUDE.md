# 4U Power Generation website — working rules

- Bilingual EN/AR Next.js 15 site; the branch `claude/affectionate-davinci-c5wxwo` deploys production on every push.
  Never open a pull request.
- The repository is **public**: no prices, price lists, letterhead/terms PDFs or secrets in git. Prices live in
  Supabase (`price_list_items`); see `docs/price-list.md`.
- No invented facts: no prices in articles, no certifications, clients, projects, stock or delivery times that
  are not already in the repo. Warranty 12 months / 1,000 h. Never write "AQT".
- Alternators: "4U · Leroy-Somer | Stamford" on product pages. A TAL / LSA alternator is **Leroy-Somer**; any
  other alternator is a **"4U Power alternator"** — never "Chinese", a supplier brand, or a generic "brushless"
  alternator (owner's rule, 26 Oct 2026).
- The 2026 price list is the reference for datasheet alternator frames and ratings (`docs/price-list.md`).
- Articles: `docs/content-calendar.md`; the weekly SEO article run writes from the Search Console snapshot in
  Supabase `seo_snapshots`. ⚠️ regulatory topics need the owner's review.
- Don't run prettier over whole files (it reformats everything). Checks: `npx tsc --noEmit -p .`,
  `npx eslint src`, `npm test`, `npm run check:seo`.
