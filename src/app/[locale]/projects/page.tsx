import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ProjectGrid } from "@/components/project-grid";
import { pageSeo } from "@/content/seo";
import { getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: "/projects", title: pageSeo.projects.title[locale], description: pageSeo.projects.description[locale] });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const projects = await getProjects();
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.projects"), path: "/projects" },
        ]}
        eyebrow={ar ? "المشاريع والتطبيقات" : "Projects & applications"}
        title={ar ? "مشاريع المولدات ولوحات الكهرباء في الإمارات والسعودية والعراق" : "Generator & Switchgear Projects Across the UAE, KSA & Iraq"}
        intro={
          ar
            ? "نماذج لنطاقات التوريد التي نقدمها حسب القطاع والدولة: المولد ولوحة ATS ولوحات التوزيع والتزامن كنظام متكامل. يتم إضافة دراسات حالة كاملة مع صور العملاء تباعاً."
            : "Typical supply scopes by sector and country — generator, ATS, distribution and synchronising panels delivered as one system. Full case studies with client photos are being added."
        }
      />
      <section className="section bg-surface">
        <div className="container-x">
          <ProjectGrid projects={projects} labels={{ all: ar ? "الكل" : "All", country: ar ? "الدولة" : "Country", sector: ar ? "القطاع" : "Sector" }} />
        </div>
      </section>
      <CtaBanner
        title={ar ? "لديك مشروع مشابه؟" : "Planning a similar project?"}
        body={ar ? "أرسل لنا نطاق العمل أو المخطط أحادي الخط وسنجهز لك حزمة متكاملة بالسعر." : "Send us the scope or single-line diagram and we'll put together a complete, priced package."}
        location="projects_cta"
      />
    </>
  );
}
