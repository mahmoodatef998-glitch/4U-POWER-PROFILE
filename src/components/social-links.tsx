import { social, type SocialNetwork } from "@/lib/site";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

const META: Record<SocialNetwork, { label: string; Icon: typeof FacebookIcon }> = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  whatsappBusiness: { label: "WhatsApp Business", Icon: WhatsAppIcon },
};

/** Renders only networks with a URL configured in lib/site.ts. */
export function SocialLinks({ className, emptyLabel }: { className?: string; emptyLabel?: string }) {
  const entries = (Object.keys(social) as SocialNetwork[]).filter((k) => social[k]);
  const hasRealSocial = entries.some((k) => k !== "whatsappBusiness");
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2">
        {entries.map((k) => {
          const { label, Icon } = META[k];
          return (
            <li key={k}>
              <a
                href={social[k]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn("grid size-10 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-navy-950")}
              >
                <Icon className="size-5" />
              </a>
            </li>
          );
        })}
      </ul>
      {!hasRealSocial && emptyLabel && <p className="mt-2 text-xs text-white/60">{emptyLabel}</p>}
    </div>
  );
}
