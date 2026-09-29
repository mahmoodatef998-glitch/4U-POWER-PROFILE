import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, type Crumb } from "@/lib/seo";
import type { Locale } from "@/lib/utils";
import { JsonLd } from "./json-ld";

/** Visible breadcrumb trail + BreadcrumbList schema. First crumb should be Home ("/"). */
export function Breadcrumbs({ locale, items, dark = true }: { locale: Locale; items: Crumb[]; dark?: boolean }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, items)} />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className={`flex flex-wrap items-center gap-1.5 ${dark ? "text-white/70" : "text-muted"}`}>
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-brand-400">
                      {c.name}
                    </Link>
                    <ChevronRight className="flip-rtl size-3.5 opacity-60" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
