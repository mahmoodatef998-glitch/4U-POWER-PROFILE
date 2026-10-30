import { BrandHub, brandHubMetadata } from "@/components/brand-hub";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 86400;

export async function generateMetadata({ params }: Props) {
  return brandHubMetadata("Lister Petter", (await params).locale);
}

export default async function ListerPetterGenerators({ params }: Props) {
  return <BrandHub brand="Lister Petter" locale={(await params).locale} />;
}
