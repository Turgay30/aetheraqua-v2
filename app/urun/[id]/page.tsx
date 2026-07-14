import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DynamicProductView, { DynamicProduct } from "@/components/product-template/DynamicProductView";
import ProductJsonLd from "@/components/ProductJsonLd";

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

  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", product.product_id);
  const ratingStats =
    reviews && reviews.length > 0
      ? { average: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, count: reviews.length }
      : undefined;

  return (
    <>
      <ProductJsonLd
        name={`AetherAqua ${product.name}`}
        description={product.description || product.tagline}
        image={product.images[0] ?? ""}
        price={product.base_price}
        sku={product.product_id}
        rating={ratingStats}
        url={`https://aetheraqua.com/urun/${product.product_id}`}
      />
      <DynamicProductView product={product} />
    </>
  );
}
