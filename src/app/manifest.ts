import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "4U Power Generation",
    short_name: "4U Power",
    start_url: "/en",
    display: "standalone",
    background_color: "#060c18",
    theme_color: "#060c18",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/images/logo-mark.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
