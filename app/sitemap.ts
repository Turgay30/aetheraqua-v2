import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const staticRoutes = [
  "",
  "/apollo",
  "/helios",
  "/akvaryum-asistani",
  "/akvaryum-kutuphanesi",
  "/hakkimizda",
  "/iletisim",
  "/gizlilik-politikasi",
  "/mesafeli-satis-sozlesmesi",
  "/kullanim-sartlari",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aetheraqua.com";

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    const supabase = await createClient();

    const { data: products } = await supabase
      .from("products")
      .select("product_id")
      .eq("is_builtin", false);

    products?.forEach((p) => {
      entries.push({ url: `${baseUrl}/urun/${p.product_id}`, lastModified: new Date() });
    });
  } catch {
    // Veritabanına erişilemezse sadece statik rotalarla devam et
  }

  return entries;
}
