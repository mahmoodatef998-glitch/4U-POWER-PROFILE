import { Building2, Factory, HardHat, Hospital, Server, Sprout } from "lucide-react";
import type { Industry } from "@/content/industries";

const ICONS = { hospital: Hospital, server: Server, hardhat: HardHat, factory: Factory, building: Building2, sprout: Sprout } as const;

export function IndustryIcon({ icon, className }: { icon: Industry["icon"]; className?: string }) {
  const I = ICONS[icon];
  return <I className={className} aria-hidden />;
}
