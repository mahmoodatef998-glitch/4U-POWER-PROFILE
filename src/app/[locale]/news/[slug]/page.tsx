import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { WhatsAppButton } from "@/components/cta-buttons";
import { JsonLd } from "@/components/json-ld";
import { Markdown } from "@/components/markdown";
import { NewsCard } from "@/components/news-card";
import { PageHero } from "@/components/page-hero";
import { newsPosts } from "@/content/news";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getNews, getNewsPost } from "@/lib/data";
import { buildMetadata, localeUrl, ORG_ID } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { formatDate, type Locale } from "@/lib/utils";

export const revalidate = 1800;
export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => newsPosts.map((p) => ({ locale, slug: p.slug })));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = await getNewsPost(slug);
  if (!p) return {};
  const ar = locale === "ar";
  const title = (ar ? p.meta_title_ar : p.meta_title_en) || (ar ? p.title_ar : p.title_en);
  return buildMetadata({
    locale,
    path: `/news/${slug}`,
    title,
    description: ar ? p.excerpt_ar : p.excerpt_en,
    image: p.cover_image ?? undefined,
    type: "article",
    publishedTime: p.published_at,
  });
}

export default async function NewsPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getNewsPost(slug);
  if (!p) notFound();
  const t = await getTranslations();
  const ar = locale === "ar";
  const title = ar ? p.title_ar : p.title_en;
  const more = (await getNews()).filter((n) => n.slug !== p.slug).slice(0, 3);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: ar ? p.excerpt_ar : p.excerpt_en,
    inLanguage: ar ? "ar-AE" : "en-AE",
    datePublished: p.published_at,
    dateModified: p.published_at,
    mainEntityOfPage: localeUrl(locale, `/news/${p.slug}`),
    image: `${SITE_URL}/images/og-default.png`,
    author: { "@type": "Organization", name: "4U Power Generation", url: SITE_URL },
    publisher: { "@id": ORG_ID },
  };

  return (
    <>
      <JsonLd data={article} />
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.news"), path: "/news" },
          { name: title, path: `/news/${p.slug}` },
        ]}
        title={title}
        intro={ar ? p.excerpt_ar : p.excerpt_en}
      >
        <p className="text-sm text-white/70">
          <time dateTime={p.published_at}>{t("common.updated", { date: formatDate(p.published_at, locale) })}</time>
        </p>
      </PageHero>

      <article className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {p.cover_image && (
              <div className="relative mb-10 aspect-[1200/630] overflow-hidden rounded-3xl bg-navy-900">
                <Image src={p.cover_image} alt={title} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
              </div>
            )}
            <Markdown source={ar ? p.body_ar : p.body_en} />
          </div>
          <aside className="lg:col-span-4">
            <div className="on-dark rounded-3xl bg-navy-900 p-6 text-white lg:sticky lg:top-28">
              <p className="text-lg font-extrabold">{ar ? "تحتاج مساعدة في الاختيار؟" : "Need help choosing?"}</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                {ar ? "أرسل لنا الحمل أو القدرة المطلوبة وسيرد مهندس خلال ساعة عمل." : "Send us your load or required kVA — an engineer replies within the working hour."}
              </p>
              <WhatsAppButton location="article_aside" className="mt-5 w-full" />
              <Link href="/calculator" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:underline">
                {t("cta.tryCalculator")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="section bg-surface" aria-labelledby="more-title">
        <div className="container-x">
          <h2 id="more-title" className="text-2xl sm:text-3xl">{ar ? "مقالات أخرى" : "More guides"}</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {more.map((n) => (
              <li key={n.slug}>
                <NewsCard post={n} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner title={t("calc.teaserTitle")} body={t("calc.teaserBody")} location="article_cta" />
    </>
  );
}
