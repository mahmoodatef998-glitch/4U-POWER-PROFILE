import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "./ui/button";
import { CallButton, WhatsAppButton } from "./cta-buttons";

export async function CtaBanner({ title, body, message, location }: { title: string; body: string; message?: string; location: string }) {
  const t = await getTranslations("cta");
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-x">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -end-24 size-80 rounded-full bg-amber-500/20 blur-3xl" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl leading-tight sm:text-3xl lg:text-4xl">{title}</h2>
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
