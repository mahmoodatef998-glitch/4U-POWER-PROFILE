import { BrandHub, brandHubMetadata } from "@/components/brand-hub";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 86400;

export async function generateMetadata({ params }: Props) {
  return brandHubMetadata("Baudouin", (await params).locale);
}

export default async function BaudouinGenerators({ params }: Props) {
  return <BrandHub brand="Baudouin" locale={(await params).locale} />;
}
