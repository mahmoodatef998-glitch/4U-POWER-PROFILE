import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Inline the (small, ~20 KB) global CSS into each HTML response: removes the render-blocking stylesheet round-trip on first paint.
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // URLs from the previous website on this domain that Google still crawls → closest new page.
  async redirects() {
    const old: [string, string][] = [
      ["/team", "/en/about"],
      ["/about-us", "/en/about"],
      ["/our_services", "/en/services"],
      ["/our-services", "/en/services"],
      ["/safety-policy", "/en/about"],
      ["/quality-policy", "/en/about"],
      ["/quality-policy-2", "/en/about"],
      ["/contact-us", "/en/contact"],
      ["/project/:slug*", "/en/projects"],
      ["/our_projects", "/en/projects"],
    ];
    return old.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
