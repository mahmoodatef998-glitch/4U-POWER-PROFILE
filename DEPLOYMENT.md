# Deployment guide (no coding needed)

This takes about 45 minutes. You need: a GitHub account with access to this repository, a Vercel account, a Supabase account, and access to your domain's DNS settings.

---

## 1. Supabase (database for leads, products, news)

1. Go to <https://supabase.com> → **New project**.
   - Name: `4u-power`
   - Region: **Middle East (Bahrain)** if offered, otherwise **Frankfurt (eu-central-1)**
   - Save the database password somewhere safe.
2. When the project is ready, open **SQL Editor** → **New query**.
3. Open the file `supabase/migrations/20260929000000_init.sql` from this repository, copy **all** of it, paste it into the editor and click **Run**. You should see "Success".
4. Load the content: run the 5 files in `supabase/seed/` **one at a time, in order**. For each one: **New query**, paste the whole file, **Run**.
   - `01_products.sql` → `02_projects_testimonials.sql` → `03_news_1.sql` → `04_news_2.sql` → `05_news_3.sql`
   - Together they load 16 products, 9 projects, 6 articles and 3 *unpublished* placeholder testimonials.
   - Every file is safe to re-run (no duplicates). If one fails, just run it again.
   - Tip: open the file on GitHub → **Raw** → Ctrl+A / Ctrl+C, so the paste is never cut short.
5. Go to **Project Settings → API** and copy three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ *secret: never share it or paste it anywhere public*

> **Security:** Row Level Security is enabled on every table. Visitors can only *read* published products, projects, testimonials and news. Leads and calculator data can only be written by the website server and read by you (Supabase dashboard or `/admin`).

### Optional: images in Supabase Storage
**Storage → New bucket** → name `media`, set it to **Public**. Upload photos there and use their public URLs in the `images` / `cover_image` fields. The site is already allowed to load images from `*.supabase.co`.

---

## 2. Vercel (hosting)

1. Go to <https://vercel.com> → **Add New… → Project** → import this GitHub repository.
2. Framework preset: **Next.js** (detected automatically). Leave the build settings at their defaults.
3. Open **Environment Variables** and add:

| Name | Value | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.4ugenerators.com` (your final domain, no trailing slash) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | from step 1.5 | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from step 1.5 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1.5 | ✅ |
| `ADMIN_USER` | a username for `/admin` | ✅ to use /admin |
| `ADMIN_PASSWORD` | a long, strong password | ✅ to use /admin |
| `NEXT_PUBLIC_GA_ID` | e.g. `G-XXXXXXXXXX` | later |
| `NEXT_PUBLIC_GTM_ID` | e.g. `GTM-XXXXXXX` | later |
| `NEXT_PUBLIC_META_PIXEL_ID` | numeric Pixel ID | later |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console HTML-tag token | later |
| `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL` | email alert for every new lead | optional |

4. Click **Deploy**. After about 2 minutes you get a `*.vercel.app` URL. Test it: submit the contact form, then check **Supabase → Table editor → leads**.
5. **Settings → Functions → Region:** choose the region closest to the Gulf that your plan offers (Dubai `dxb1` if listed, otherwise Mumbai `bom1` or Frankfurt `fra1`).

> Preview deployments automatically send `Disallow: /` in robots.txt, so only production gets indexed.

---

## 3. Custom domain + DNS

1. Check availability of `4ugenerators.com`. Fallbacks: `4u-generators.com`, `4upowergeneration.com`. Whichever you buy, set `NEXT_PUBLIC_SITE_URL` to match and **redeploy**.
2. In Vercel: **Project → Settings → Domains** → add `4ugenerators.com` **and** `www.4ugenerators.com`. Set `www` to redirect to the apex domain (or the reverse; just keep it the same as `NEXT_PUBLIC_SITE_URL`).
3. At your domain registrar, add the DNS records Vercel shows. Typically:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME` record, host `www` → `cname.vercel-dns.com`
4. Wait for Vercel to show **Valid Configuration**. The SSL certificate is issued automatically.

---

## 4. Google Search Console

1. <https://search.google.com/search-console> → **Add property → Domain** → verify it with the DNS TXT record Google gives you.
   (Or choose the **URL prefix** method → **HTML tag**, copy the `content="…"` value into `NEXT_PUBLIC_GSC_VERIFICATION`, and redeploy.)
2. **Sitemaps** → submit `https://www.4ugenerators.com/sitemap.xml`.
3. Use **URL inspection** on `/en`, `/ar`, `/en/ats-panels`, `/en/generators` and `/en/switchgear` → **Request indexing**.

## 5. Google Analytics 4 + Tag Manager + Google Ads

1. Create a GA4 property → **Data streams → Web** → copy the Measurement ID (`G-…`) → `NEXT_PUBLIC_GA_ID`.
2. (Optional) Create a GTM container → `NEXT_PUBLIC_GTM_ID`. If you use GTM, you can load GA4 through GTM instead and leave `NEXT_PUBLIC_GA_ID` empty.
3. Redeploy. In GA4 **Admin → Events**, mark these as **Key events**: `whatsapp_click`, `call_click`, `generate_lead`, `calculator_quote_click`.
4. Link GA4 to Google Ads (**Admin → Product links**), then import those key events as Google Ads conversions.
5. Leads keep the `utm_*` and `gclid` values, so you can see in `/admin` which campaign produced each lead.

## 6. Meta Pixel
Events Manager → create a Pixel → copy the ID → `NEXT_PUBLIC_META_PIXEL_ID` → redeploy. WhatsApp/Call clicks are sent as `Contact`, and forms and calculator quotes as `Lead`.

## 7. Google Business Profile
Create the profile with the **exact** details below. The website schema uses these same values, and consistency matters for local rankings:

- **Name:** 4U Power Generation
- **Address:** 600 M² Warehouse A2-020, SAIF Zone, P.O. Box 513810, Sharjah, United Arab Emirates
- **Phone:** +971 52 336 7694
- **Website:** https://www.4ugenerators.com/en
- **Category:** Generator shop (secondary: Electrical equipment supplier)

Then open the pin in Google Maps, and if Warehouse A2-020 sits elsewhere, update `geo` in `src/lib/site.ts`.

## 8. Social links
When your accounts exist, paste their URLs into `src/lib/site.ts` → `social`. Empty entries stay hidden automatically.

## 9. Publishing news (no code)
Go to `https://www.4ugenerators.com/admin/news` (log in with `ADMIN_USER` / `ADMIN_PASSWORD`) → fill in both languages → **Publish**. The post goes live on `/en/news` and `/ar/news` and is added to the sitemap.
Aim for 1–2 posts a month. Every post should link to at least one of `/en/generators`, `/en/ats-panels`, `/en/switchgear` or `/en/calculator`.

You can also edit any table directly in **Supabase → Table editor** (products, projects, testimonials, news). Changes show on the site within an hour; new posts from `/admin` show immediately.
