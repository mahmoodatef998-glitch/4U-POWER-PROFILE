import { BrandHub, brandHubMetadata } from "@/components/brand-hub";
import type { Locale } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 86400;

export async function generateMetadata({ params }: Props) {
  return brandHubMetadata("Cummins", (await params).locale);
}

export default async function CumminsGenerators({ params }: Props) {
  return <BrandHub brand="Cummins" locale={(await params).locale} />;
}
