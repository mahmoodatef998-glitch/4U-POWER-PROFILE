import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/cta-buttons";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="on-dark grid min-h-[60vh] place-items-center bg-navy-950 px-4 py-24 text-center text-white">
      <div>
        <p className="text-7xl font-extrabold text-brand-400">404</p>
        <h1 className="mt-4 text-3xl">{t("title")}</h1>
        <p className="mt-3 text-white/70">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>{t("home")}</Link>
          <WhatsAppButton location="404" size="lg" />
        </div>
      </div>
    </section>
  );
}
