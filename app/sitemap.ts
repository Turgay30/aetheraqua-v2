import type { MetadataRoute } from "next";

const routes = [
  "",
  "/apollo",
  "/helios",
  "/akvaryum-asistani",
  "/hakkimizda",
  "/iletisim",
  "/gizlilik-politikasi",
  "/mesafeli-satis-sozlesmesi",
  "/kullanim-sartlari",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aetheraqua.com";
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
