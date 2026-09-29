import type { ReactNode } from "react";
import "./globals.css";

// <html>/<body> are rendered by app/[locale]/layout.tsx (locale-aware lang/dir) and app/admin/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
