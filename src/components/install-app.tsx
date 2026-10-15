"use client";

import { Download, Share, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * "Install the app": the site is an installable web app (src/app/manifest.ts). Chrome / Edge / Samsung Internet
 * fire `beforeinstallprompt`, which we keep and replay from our own banner and menu button; iPhone Safari has no
 * such event, so it gets the two-tap instructions instead. Hidden once installed or when opened as the app.
 */

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: InstallEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());
const OPEN_EVENT = "4u:install-open";

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // our banner replaces the browser's mini-infobar
    deferred = e as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    trackEvent("app_installed");
    emit();
  });
}

type Mode = "prompt" | "ios" | null;

function currentMode(): Mode {
  if (installed) return null;
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return null;
  if (deferred) return "prompt";
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  return ios ? "ios" : null;
}

function useInstall() {
  const mode = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    currentMode,
    () => null,
  );
  const install = async (location: string) => {
    trackEvent("app_install_click", { location, mode: mode ?? "none" });
    if (mode === "prompt" && deferred) {
      const e = deferred;
      deferred = null;
      await e.prompt();
      await e.userChoice.catch(() => null);
      emit();
    } else if (mode === "ios") window.dispatchEvent(new Event(OPEN_EVENT));
  };
  return { mode, install };
}

const DISMISS_KEY = "4u-install-dismissed";
const SNOOZE_DAYS = 7;
const DELAY_MS = 8000;

const snoozed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Date.now() - at < SNOOZE_DAYS * 864e5;
  } catch {
    return false;
  }
};

/** Bottom banner, a few seconds into the visit; "Not now" hides it for a week. */
export function InstallBanner() {
  const t = useTranslations("app");
  const { mode, install } = useInstall();
  const [ready, setReady] = useState(false);
  const [forced, setForced] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), DELAY_MS);
    const open = () => {
      setForced(true);
      setClosed(false);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, []);

  if (!mode || closed || (!forced && (!ready || snoozed()))) return null;
  const dismiss = () => {
    setClosed(true);
    setForced(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode: just hide for this page */
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="install-title"
      className="fixed inset-x-2 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-2xl border border-white/10 bg-navy-950/95 p-4 text-white shadow-2xl backdrop-blur md:inset-x-auto md:bottom-6 md:start-6 md:mx-0 md:w-96"
    >
      <button onClick={dismiss} aria-label={t("later")} className="absolute end-2 top-2 grid size-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
        <X className="size-4" aria-hidden />
      </button>
      <div className="flex items-start gap-3 pe-6">
        <Image src="/images/app/icon-192.png" alt="" width={48} height={48} className="size-12 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p id="install-title" className="font-extrabold">{t("title")}</p>
          <p className="mt-0.5 text-sm text-white/70">
            {mode === "ios"
              ? t.rich("ios", { share: () => <Share className="inline size-4 align-[-2px] text-brand-400" aria-label="Share" /> })
              : t("body")}
          </p>
        </div>
      </div>
      {mode === "prompt" && (
        <div className="mt-3 flex justify-end gap-2">
          <button onClick={dismiss} className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10">{t("later")}</button>
          <button onClick={() => install("banner")} className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2 text-sm font-extrabold text-ink-950 hover:bg-brand-400">
            <Download className="size-4" aria-hidden />
            {t("install")}
          </button>
        </div>
      )}
    </div>
  );
}

/** Always-there entry in the side menu; renders nothing where the site can't be installed or already is. */
export function InstallMenuButton({ onDone }: { onDone?: () => void }) {
  const t = useTranslations("app");
  const { mode, install } = useInstall();
  if (!mode) return null;
  return (
    <button
      onClick={() => {
        onDone?.();
        void install("menu");
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 font-bold text-white hover:bg-white/5"
    >
      <Download className="size-5 text-brand-400" aria-hidden />
      {t("menu")}
    </button>
  );
}
