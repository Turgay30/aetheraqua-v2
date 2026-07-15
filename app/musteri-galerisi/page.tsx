import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DecorativeGlow from "@/components/DecorativeGlow";

export const metadata: Metadata = {
  title: "Müşterilerimizin Akvaryumları | AetherAqua",
  description: "AetherAqua müşterilerinin kendi akvaryumlarında paylaştığı gerçek fotoğraflar.",
};

export const revalidate = 60;

const PRODUCT_NAMES: Record<string, string> = {
  apollo: "Apollo",
  helios: "Helios",
};

export default async function MusteriGalerisiPage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, reviewer_name, rating, comment, photo_url, product_id, created_at")
    .not("photo_url", "is", null)
    .order("created_at", { ascending: false });

  const customProductIds = Array.from(
    new Set((reviews ?? []).map((r) => r.product_id).filter((id) => !PRODUCT_NAMES[id]))
  );

  let customNames: Record<string, string> = {};
  if (customProductIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("product_id, name")
      .in("product_id", customProductIds);
    customNames = Object.fromEntries((products ?? []).map((p) => [p.product_id, p.name]));
  }

  function productName(id: string) {
    return PRODUCT_NAMES[id] ?? customNames[id] ?? "AetherAqua";
  }

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Topluluk</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
          Müşterilerimizin Akvaryumları
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          Gerçek müşterilerimizin kendi akvaryumlarında AetherAqua ürünlerini nasıl kullandığı.
        </p>

        {!reviews || reviews.length === 0 ? (
          <p className="mt-16 text-center font-body text-sm text-ink-muted">
            Henüz paylaşılan bir fotoğraf yok — ilk paylaşan siz olun!
          </p>
        ) : (
          <div className="mt-12 columns-2 gap-4 sm:columns-3 md:columns-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface"
              >
                <div className="relative aspect-square w-full">
                  <Image src={r.photo_url!} alt={`${r.reviewer_name} — ${productName(r.product_id)}`} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="font-body text-xs font-semibold text-ink">{r.reviewer_name}</p>
                  <p className="font-mono text-[10px] text-ink-faint">{productName(r.product_id)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
