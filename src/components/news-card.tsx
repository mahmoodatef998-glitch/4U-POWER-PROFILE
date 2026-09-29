import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NewsPost } from "@/lib/types";
import { formatDate, type Locale } from "@/lib/utils";

export function NewsCard({ post, locale, headingLevel = "h3", priority, dark }: { post: NewsPost; locale: Locale; headingLevel?: "h2" | "h3"; priority?: boolean; dark?: boolean }) {
  const H = headingLevel;
  const title = locale === "ar" ? post.title_ar : post.title_en;
  return (
    <article className={`grad-border spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border ${dark ? "border-white/10 bg-navy-900 text-white" : "border-line bg-navy-900"} transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgb(10_10_11/0.35)]`}>
      <div className="relative aspect-[1200/630] overflow-hidden bg-navy-950">
        {post.cover_image && <Image src={post.cover_image} alt={title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" priority={priority} />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.published_at} className={`text-xs font-semibold ${dark ? "text-white/55" : "text-muted"}`}>
          {formatDate(post.published_at, locale)}
        </time>
        <H className="mt-2 text-lg leading-snug">
          <Link href={`/news/${post.slug}`} className={`after:absolute after:inset-0 ${dark ? "group-hover:text-brand-400" : "group-hover:text-brand-700"}`}>
            {title}
          </Link>
        </H>
        <p className={`mt-2 line-clamp-3 text-sm leading-6 ${dark ? "text-white/65" : "text-muted"}`}>{locale === "ar" ? post.excerpt_ar : post.excerpt_en}</p>
      </div>
    </article>
  );
}
