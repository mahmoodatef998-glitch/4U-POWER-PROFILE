import { Marked } from "marked";

// Raw HTML inside Markdown is dropped so a compromised admin account cannot inject scripts.
// Links and images may only point to http(s), mail, phone or on-site addresses (no javascript: / data: URLs).
const SAFE_URL = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;
const md = new Marked({
  gfm: true,
  renderer: { html: () => "" },
  walkTokens(token) {
    if ((token.type === "link" || token.type === "image") && !SAFE_URL.test(token.href.trim())) token.href = "#";
  },
});

/**
 * Renders trusted Markdown (news posts authored via /admin or Supabase). Heading levels in the
 * source start at h2 because the page title is the only h1.
 */
export function Markdown({ source, className = "prose-4u" }: { source: string; className?: string }) {
  const html = md.parse(source, { async: false }) as string;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
