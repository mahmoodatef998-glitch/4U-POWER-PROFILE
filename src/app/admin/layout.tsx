import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "4U Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Protected by HTTP Basic Auth in middleware (ADMIN_USER / ADMIN_PASSWORD). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-surface font-sans text-ink">
        <header className="bg-navy-950 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <span className="font-extrabold">4U Admin</span>
            <nav className="flex gap-4 text-sm font-semibold">
              <Link href="/admin" className="hover:text-brand-400">Leads</Link>
              <Link href="/admin/whatsapp" className="hover:text-brand-400">WhatsApp</Link>
              <Link href="/admin/traffic" className="hover:text-brand-400">Visitors</Link>
              <Link href="/admin/news" className="hover:text-brand-400">News</Link>
              <Link href="/en" className="hover:text-brand-400">View site ↗</Link>
            </nav>
            {/* paste the "Ref: 4U-XXXXX" code from a WhatsApp chat to see what the customer was looking at */}
            <form action="/admin/whatsapp" className="flex">
              <input name="q" placeholder="Ref 4U-XXXXX" aria-label="Find WhatsApp ref" className="w-36 rounded-s-lg bg-white/10 px-3 py-1.5 text-sm uppercase text-white placeholder:text-white/50 focus:outline-none" />
              <button className="rounded-e-lg bg-brand-500 px-3 py-1.5 text-sm font-bold text-ink-950">Find</button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
