import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/hesabim",
        "/odeme",
        "/sepet",
        "/api/",
        "/auth/",
        "/sifremi-unuttum",
        "/sifre-guncelle",
      ],
    },
    sitemap: "https://aetheraqua.com/sitemap.xml",
  };
}
