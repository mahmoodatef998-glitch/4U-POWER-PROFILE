"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/cta-buttons";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  useEffect(() => console.error(error), [error]);
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 py-24 text-center">
      <div>
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} size="lg">{t("retry")}</Button>
          <WhatsAppButton location="error" size="lg" />
        </div>
      </div>
    </section>
  );
}
