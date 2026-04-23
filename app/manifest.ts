import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wumbo Wellness",
    short_name: "Wumbo",
    description: "AI-powered youth wellbeing triage and counselor matching platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#9AB17A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/Wumbo.png",
        type: "image/png",
      },
    ],
  };
}