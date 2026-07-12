"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PRODUCT_INFO: Record<string, { name: string; tagline: string; href: string; image: string }> = {
  apollo: {
    name: "Apollo",
    tagline: "Işığın Efendisi",
    href: "/apollo",
    image: "/images/apollo-hero.jpg",
  },
  helios: {
    name: "Helios",
    tagline: "Gündüzün Taşıyıcısı",
    href: "/helios",
    image: "/images/helios-hero.jpg",
  },
};

export default function FavoritesList({ userId }: { userId: string }) {
  const [favoriteIds, setFavoriteIds] = useState<string[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId)
      .then(({ data }) => setFavoriteIds(data?.map((f) => f.product_id) ?? []));
  }, [userId]);

  if (favoriteIds === null) return null;
  if (favoriteIds.length === 0) {
    return (
      <p className="mt-4 font-body text-sm text-ink-muted">
        Henüz favori ürününüz yok — ürün sayfalarındaki kalp ikonuna dokunarak ekleyebilirsiniz.
      </p>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {favoriteIds.map((id) => {
        const info = PRODUCT_INFO[id];
        if (!info) return null;
        return (
          <Link
            key={id}
            href={info.href}
            className="flex items-center gap-4 rounded-2xl border border-abyss-border bg-abyss-surface p-4 transition-colors hover:border-aqua/40"
          >
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
              <Image src={info.image} alt={info.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-display text-lg text-ink">{info.name}</p>
              <p className="font-body text-xs text-ink-muted">{info.tagline}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
