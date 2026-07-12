import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DynamicProductView, { DynamicProduct } from "@/components/product-template/DynamicProductView";

async function getProduct(id: string): Promise<DynamicProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("product_id", id)
    .eq("is_builtin", false)
    .maybeSingle();

  if (!data) return null;

  return {
    product_id: data.product_id,
    name: data.name ?? data.product_id,
    tagline: data.tagline ?? "",
    description: data.description ?? "",
    accent_color: data.accent_color ?? "#C9A227",
    images: (data.images as string[]) ?? [],
    features: (data.features as string[]) ?? [],
    tech_specs: (data.tech_specs as { label: string; value: string }[]) ?? [],
    mythology_title: data.mythology_title ?? "",
    mythology_paragraphs: (data.mythology_paragraphs as string[]) ?? [],
    base_price: Number(data.base_price),
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Ürün Bulunamadı | AetherAqua" };

  return {
    title: `${product.name} | AetherAqua`,
    description: product.description,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function DynamicProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return <DynamicProductView product={product} />;
}
