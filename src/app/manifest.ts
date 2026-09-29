import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "4U Power Generation",
    short_name: "4U Power",
    start_url: "/en",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/images/logo-mark.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
