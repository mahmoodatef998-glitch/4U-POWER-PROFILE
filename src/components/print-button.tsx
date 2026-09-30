"use client";

import { Printer } from "lucide-react";
import { useEffect } from "react";

/** Opens the browser's print dialog ("Save as PDF"). With ?print=1 it opens automatically. */
export function PrintButton({ label, className }: { label: string; className?: string }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") === "1") setTimeout(() => window.print(), 600);
  }, []);
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer className="size-4" aria-hidden />
      {label}
    </button>
  );
}
