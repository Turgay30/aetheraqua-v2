"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentlyViewed, RecentlyViewedItem } from "@/lib/recentlyViewed";
import { formatTL } from "@/lib/pricing";

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed(excludeId));
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        Son Görüntülediğiniz Ürünler
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group overflow-hidden rounded-xl border border-abyss-border bg-abyss-surface transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-2.5">
              <p className="truncate font-body text-xs text-ink">{item.name}</p>
              <p className="font-body text-xs text-ink-faint">{formatTL(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
