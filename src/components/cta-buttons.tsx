"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";
import { telUrl, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "./ui/button";
import { WhatsAppIcon } from "./icons";

type Common = {
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  label?: string;
  location: string;
};

export function WhatsAppButton({ message, className, size = "md", variant = "whatsapp", label, location }: Common & { message?: string }) {
  const t = useTranslations("cta");
  return (
    <a
      href={whatsappUrl(message ?? t("whatsappDefault"))}
      data-wa-location={location}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { location })}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <WhatsAppIcon />
      {label ?? t("whatsappUs")}
    </a>
  );
}

export function CallButton({ className, size = "md", variant = "outline", label, location }: Common) {
  const t = useTranslations("cta");
  return (
    <a href={telUrl} onClick={() => trackEvent("call_click", { location })} className={cn(buttonVariants({ variant, size }), className)}>
      <Phone />
      {label ?? t("callUs")}
    </a>
  );
}
