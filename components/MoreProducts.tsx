"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { formatTL } from "@/lib/pricing";

type Product = {
  product_id: string;
  name: string;
  tagline: string;
  accent_color: string;
  images: string[];
  base_price: number;
};

export default function MoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("product_id, name, tagline, accent_color, images, base_price")
      .eq("is_builtin", false)
      .then(({ data }) => setProducts((data as Product[]) ?? []));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-ink-faint">Koleksiyona Yeni Katılanlar</p>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Diğer Ürünlerimiz</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.product_id}
            href={`/urun/${p.product_id}`}
            className="group overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {p.images[0] && (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              )}
            </div>
            <div className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: p.accent_color }}>
                {p.tagline}
              </p>
              <h3 className="mt-1.5 font-display text-2xl text-ink">{p.name}</h3>
              <p className="mt-3 font-body text-sm text-ink-muted">
                30cm&apos;den başlıyor{" "}
                <span className="font-display text-lg text-ink">{formatTL(p.base_price)}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
