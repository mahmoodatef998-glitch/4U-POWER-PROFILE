# 4U Power Generation — Website

Bilingual (English / Arabic RTL) B2B website for **4U POWER GENERATION (FZC)**, SAIF Zone Licence No. 23919: a supplier of diesel generators, ATS panels and switchgear. It's built to rank on UAE/GCC long-tail searches and to turn Google Ads clicks into WhatsApp and phone leads.

| | |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript strict |
| UI | Tailwind CSS v4, shadcn-style primitives on Radix UI, Framer Motion |
| i18n | `next-intl`, `/en/...` + `/ar/...`, full RTL |
| Data | Supabase (Postgres + RLS). Falls back to bundled seed content when not configured |
| Hosting | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local   # everything is optional for local dev
npm run dev                  # http://localhost:3000 → redirects to /en
```

The site runs with **zero configuration**: content comes from `src/content/*`, and leads are logged to the server console until Supabase is connected (see `DEPLOYMENT.md`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | kVA calculator unit checks (sizing math, product & ATS matching for 10–2500 kVA) |
| `npm run check:seo` | Title/description length check for all static pages |
| `npm run audit:seo -- http://localhost:3000` | Crawls every sitemap URL on a running server. Checks the title, meta description, a single H1, heading order, canonical, hreflang, OG/Twitter tags, JSON-LD types, image alt text, landmarks and `lang`/`dir` |
| `npm run seed:sql` | Regenerates `supabase/seed/*.sql` from `src/content/*` |
| `python3 scripts/generate-illustrations.py` | Regenerates the placeholder SVG illustrations |
| `python3 scripts/generate-brand-assets.py` | Rebuilds logo variants, favicon/icons, OG image and the hero part layers from `assets/source/` |

## Project map

```
src/
  app/[locale]/…          all public pages (home, pillars, products, calculator, projects, news, markets, contact, legal)
  app/admin/…             lead inbox + news publishing (HTTP Basic Auth)
  app/actions/…           server actions: leads, calculator logging (service-role Supabase)
  app/sitemap.ts, robots.ts
  components/…            UI (header, footer, floating CTA, calculator, catalog, FAQ, …)
  content/…               ALL copy + seed data (EN/AR). Edit text here.
  lib/site.ts             business identity / NAP / phone / social URLs  ← single source of truth
  lib/seo.ts              metadata builder, hreflang, JSON-LD (Organization, LocalBusiness, Breadcrumb, FAQ)
  lib/calculator.ts       kVA sizing engine
  lib/analytics.ts        trackEvent() → GA4 / GTM dataLayer / Meta Pixel
  messages/en.json, ar.json   UI strings
supabase/migrations/      schema + RLS
supabase/seed/*.sql       generated seed data (run in order)
```

## Hero: scroll-to-assemble generator

`src/components/hero-assembly.tsx` pins the hero while the visitor scrolls. The 8 parts of the client's exploded-view render (engine, alternator, radiator, end cover, control panel, air filter, silencer, base frame) travel from their exploded positions to the assembled set, one after another. Numbered callouts fade out as each part moves in.

- No video: pure GPU transforms on ~200 KB of WebP layers. Honours `prefers-reduced-motion` (shows the assembled set, no pinning).
- Tune the choreography in the `PARTS` array (`dx/dy` = assembled offset in canvas px, `win` = scroll window).
- **Cinematic upgrade path:** have a 3D artist render the assembly (Blender / KeyShot) as ~120 transparent frames, then swap the layer stage for a canvas image-sequence scrubber. Same scroll logic.

## Conversion tracking (for Google Ads)

`trackEvent()` fires these events. Each one maps to a Google Ads conversion you create later:

| Event | Fired when |
|---|---|
| `whatsapp_click` | Any WhatsApp button (header, sticky bar, hero, product cards, forms…), with `location` |
| `call_click` | Any tel: link |
| `generate_lead` | Quote/contact form submitted successfully |
| `calculator_complete` | Calculator produced a recommendation |
| `calculator_quote_click` | "Request quote for this unit" / "Send result on WhatsApp" from the calculator |

UTM parameters and `gclid` are captured on landing and stored with every lead in Supabase. This lets you tie a lead back to the campaign that produced it.

## SEO implementation

- A unique title and description for every page in both languages (`src/content/seo.ts` and generated per product/article/market).
- Exactly one `<h1>` per page and heading levels without gaps. This is verified by `npm run audit:seo`.
- Canonical and `hreflang` (en / ar / x-default) on every page, and in `sitemap.xml`.
- JSON-LD on every page: `Organization` + `LocalBusiness` with the licence NAP and geo-coordinates. Also `Product`, `Article`, `FAQPage` and `BreadcrumbList` where they apply.
- Six bilingual articles at launch, each linking internally to the pillar pages and the calculator.
- Six market landing pages, with the UAE, KSA and Iraq built out in full.

## Honest expectation note (for the client)

No website, however well built, can guarantee the #1 organic position on Google for single, globally contested words like "generators" or "ATS". Those results belong to decades-old multinational distributors and to unrelated industries (ATS is also a school system and an HR-software category). That isn't how search ranking works, and any agency promising it is misleading you.

What this build does deliver:

- **A technically clean foundation:** fast, fully indexed, fully structured and fully bilingual.
- **The best realistic shot at #1 for the searches that actually convert.** These are UAE/GCC-qualified, product-specific long-tail searches: *"ATS panel supplier Sharjah"*, *"diesel generator supplier UAE"*, *"generator exporter to Iraq"*, *"لوحات ATS الإمارات"*, *"مولدات ديزل الشارقة"*.
- **Google Ads (run separately)** gives guaranteed top-of-page visibility on the harder short terms from day one. The site is already wired with the conversion events those campaigns need.

Rankings then compound with consistent publishing (one or two articles a month via `/admin/news`), real project photos, and Google Business Profile reviews.

## Related docs

- `DEPLOYMENT.md`: Vercel, Supabase, domain/DNS and analytics setup (non-developer guide)
- `CONTENT_TODO.md`: every placeholder that needs real client content
- `LIGHTHOUSE.md`: measured Lighthouse results and how to re-run them
