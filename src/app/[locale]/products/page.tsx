import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { ProductCatalog } from "@/components/product-catalog";
import { home } from "@/content/pages";
import { pageSeo } from "@/content/seo";
import { getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { pick, type Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/products", title: pageSeo.products.title[locale], description: pageSeo.products.description[locale] });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const products = await getProducts();
  const ar = locale === "ar";

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.products"), path: "/products" },
        ]}
        eyebrow={ar ? "الكتالوج" : "Catalog"}
        title={ar ? "المولدات ولوحات ATS ولوحات الكهرباء" : "Generators, ATS Panels & Switchgear Catalog"}
        intro={
          ar
            ? "فلتر حسب الفئة والقدرة ونوع الوقود وماركة المحرك، ثم اطلب عرض سعر أو راسلنا على الواتساب مباشرة من أي منتج."
            : "Filter by category, kVA, fuel type and engine brand — then request a quote or WhatsApp us straight from any product."
        }
      />
      <section className="section bg-surface">
        <div className="container-x">
          {/* Suspense: filters read ?category= from the URL; fallback is the full static grid for crawlers. */}
          <Suspense
            fallback={
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <li key={p.slug}>
                    <ProductCard product={p} headingLevel="h2" />
                  </li>
                ))}
              </ul>
            }
          >
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </section>
      <CtaBanner title={pick(home.cta.title, locale)} body={pick(home.cta.body, locale)} location="products_cta" />
    </>
  );
}
