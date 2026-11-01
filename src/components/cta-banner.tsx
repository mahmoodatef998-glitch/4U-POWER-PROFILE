import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "./ui/button";
import { CallButton, WhatsAppButton } from "./cta-buttons";

export async function CtaBanner({ title, body, message, location }: { title: string; body: string; message?: string; location: string; dark?: boolean }) {
  const t = await getTranslations("cta");
  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-x">
        <div className="stage-dark on-dark spotlight relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_22rem_at_12%_0%,rgb(214_176_92/0.16),transparent_70%)]" aria-hidden />
          <div className="gold-rule absolute inset-x-0 top-0 h-px" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl leading-[1.02] sm:text-4xl lg:text-5xl rtl:leading-tight">{title}</h2>
            <p className="mt-4 text-white/75 sm:text-lg">{body}</p>
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
            <WhatsAppButton location={location} message={message} size="lg" />
            <CallButton location={location} size="lg" variant="ghostDark" />
            <Link href="/contact" className={buttonVariants({ variant: "primary", size: "lg" })}>
              {t("quote")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
