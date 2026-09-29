import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import type { LegalDoc } from "@/content/legal";
import { formatDate, pick, type Locale } from "@/lib/utils";

export async function LegalPage({ locale, doc, path }: { locale: Locale; doc: LegalDoc; path: string }) {
  const t = await getTranslations();
  const title = pick(doc.h1, locale);
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: title, path },
        ]}
        title={title}
        intro={t("common.updated", { date: formatDate(doc.updated, locale) })}
      />
      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          <p className="text-[1.0625rem] leading-8 text-slate-700">{pick(doc.intro, locale)}</p>
          {doc.sections.map((s) => (
            <section key={s.title.en} className="mt-10">
              <h2 className="text-xl sm:text-2xl">{pick(s.title, locale)}</h2>
              <p className="mt-3 leading-8 text-slate-700">{pick(s.body, locale)}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
