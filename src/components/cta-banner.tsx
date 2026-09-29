import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "./ui/button";
import { CallButton, WhatsAppButton } from "./cta-buttons";

export async function CtaBanner({ title, body, message, location, dark }: { title: string; body: string; message?: string; location: string; dark?: boolean }) {
  const t = await getTranslations("cta");
  return (
    <section className={dark ? "relative py-16 sm:py-24" : "bg-white py-16 sm:py-20"}>
      <div className="container-x">
        <div className="on-dark spotlight relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-14">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="aurora pointer-events-none absolute inset-0" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-line-gen-a),var(--color-line-gen-b),var(--color-line-mdb-b),var(--color-line-sw-b),var(--color-line-ats-b))]" aria-hidden />
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
