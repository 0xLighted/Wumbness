import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wumbo Wellness",
    short_name: "Wumbo",
    description: "AI-powered youth wellbeing triage and counselor matching platform. Connect with professional counselors through intelligent matching.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FDFBF7",
    theme_color: "#98BC88",
    categories: ["productivity", "health"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/WumbnessLogoNew.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/WumbnessLogoNew.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/WumbnessLogoNew.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/WumbnessLogoNew.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/WumboMascot.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/WumboMascot.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}