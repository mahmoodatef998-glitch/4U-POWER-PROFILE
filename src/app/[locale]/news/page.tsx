import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsCard } from "@/components/news-card";
import { PageHero } from "@/components/page-hero";
import { pageSeo } from "@/content/seo";
import { getNews } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/news", title: pageSeo.news.title[locale], description: pageSeo.news.description[locale] });
}

export default async function NewsIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const posts = await getNews();
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.news"), path: "/news" },
        ]}
        eyebrow={ar ? "المعرفة" : "Knowledge hub"}
        title={ar ? "مقالات وأدلة المولدات ولوحات ATS" : "Generator & ATS Panel Guides and News"}
        intro={
          ar
            ? "أدلة عملية يكتبها فريقنا الهندسي حول اختيار المولدات ولوحات التحويل ولوحات الكهرباء والتصدير في المنطقة."
            : "Practical guides from our engineering team on choosing generators, transfer switches and switchgear — and delivering them across the region."
        }
      />
      <section className="section bg-surface">
        <div className="container-x">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <NewsCard post={p} locale={locale} headingLevel="h2" priority={i < 3} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
