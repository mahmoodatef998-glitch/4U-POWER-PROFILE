"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

/** Switches <html data-theme> between the night (default) and light themes and remembers the choice. */
export function ThemeToggle({ className }: { className?: string }) {
  const ar = useLocale() === "ar";
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const label = theme === "dark" ? (ar ? "التبديل إلى الوضع الفاتح" : "Switch to light theme") : ar ? "التبديل إلى الوضع الداكن" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn("relative grid size-10 place-items-center overflow-hidden rounded-full text-white/85 transition hover:bg-white/10 hover:text-white", className)}
    >
      <Sun className={cn("absolute size-5 transition-all duration-500", theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0")} aria-hidden />
      <Moon className={cn("absolute size-5 transition-all duration-500", theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0")} aria-hidden />
    </button>
  );
}
