# Lighthouse report

**Run:** 2026-09-29 · Lighthouse 13.5 · **mobile** preset (simulated slow 4G, 4× CPU throttle) · production build (`next build && next start`) · headless Chromium in the build container.

## English pages

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /en | 92 | 100 | 100 | 100 | 3.1 s | 0 | 150 ms |
| /en/generators | 93 | 100 | 100 | 100 | 2.7 s | 0 | 180 ms |
| /en/ats-panels | 94 | 100 | 100 | 100 | 2.9 s | 0 | 120 ms |
| /en/switchgear | 95 | 100 | 100 | 100 | 2.7 s | 0 | 110 ms |
| /en/products | 95 | 100 | 100 | 100 | 2.8 s | 0 | 140 ms |
| /en/products/ats-panel-63a-400a | 96 | 100 | 100 | 100 | 2.7 s | 0 | 50 ms |
| /en/calculator | 94 | 100 | 100 | 100 | 2.9 s | 0 | 100 ms |
| /en/news/ats-panels-explained | 97 | 100 | 100 | 100 | 2.6 s | 0 | 90 ms |
| /en/markets/iraq | 95 | 100 | 100 | 100 | 2.6 s | 0 | 130 ms |
| /en/contact | 97 | 100 | 100 | 100 | 2.6 s | 0 | 70 ms |

## Arabic pages (after the `display: optional` font change)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /ar | 83 | 100 | 100 | 100 | 4.0 s | 0 | 120 ms |
| /ar/generators | 87 | 100 | 100 | 100 | 3.7 s | 0 | 80 ms |
| /ar/ats-panels | 89 | 100 | 100 | 100 | 3.1 s | 0 | 210 ms |
| /ar/calculator | 88 | 100 | 100 | 100 | 3.7 s | 0 | 100 ms |
| /ar/contact | 89 | 100 | 100 | 100 | 3.4 s | 0 | 80 ms |

## Against the §11 targets

| Target | Result |
|---|---|
| Accessibility ≥ 95 | ✅ 100 on every page tested (EN + AR) |
| Best Practices ≥ 95 | ✅ 100 everywhere |
| SEO = 100 | ✅ 100 everywhere (measured with `NEXT_PUBLIC_SITE_URL` set to the test host; with the production domain on a different host, Lighthouse flags the cross-domain canonical. That is expected and correct) |
| Performance ≥ 90 (mobile) | ✅ English pages 92–97 · ⚠️ Arabic pages 83–89 in this container (see below) |
| CLS < 0.05 | ✅ 0 on every English page and every Arabic page |
| LCP < 2.0 s | ⚠️ Lab LCP 2.6–3.1 s EN / 3.1–4.0 s AR under Lighthouse's *simulated* slow 4G. Observed (unthrottled) LCP is ~0.25 s EN |
| INP < 200 ms | ✅ TBT (the lab proxy for INP) 50–210 ms |

### Why the Arabic lab scores are lower
The test container has no Arabic system fonts (only DejaVu), so Chromium spends ~1 s on font fallback before the first paint of Arabic text. The same pages paint in ~0.25 s when unthrottled on a machine with Arabic fonts. Real iOS and Android devices ship Arabic system fonts (SF Arabic, Noto Sans Arabic), so field numbers will be closer to the English pages. **Re-measure on <https://pagespeed.web.dev> after deployment.** It runs on Google's infrastructure and is what Google Ads / Search use.

### Performance decisions already in the build
- Hero art is decorative and hidden on mobile, so the mobile LCP is the H1 text (no image on the critical path).
- The Latin font is preloaded. The Arabic font is **not** preloaded (English pages don't download it) and uses `display: optional` (no late swap → CLS 0).
- Every page is statically generated with ISR (`revalidate`). Only `/admin` is dynamic.
- Images use `next/image` with AVIF/WebP, explicit sizes and `priority` only above the fold.
- Framer Motion is loaded through `LazyMotion` (`domAnimation` subset), and nothing above the fold waits on animation.
- The map is a lazy `<iframe>` on `/contact` only. Analytics tags load `afterInteractive` / `lazyOnload`.

### When real photos are added
Use WebP/AVIF, ≤ 300 KB, at least 1600 px wide for the hero. Keep `priority` on the hero image only.

## Re-running

```bash
npm run build && npm start
npx lighthouse http://localhost:3000/en --preset=perf --form-factor=mobile --view
npm run audit:seo -- http://localhost:3000     # structural SEO checks on all 82 sitemap URLs
```
