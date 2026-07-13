"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FishRow = {
  id: string;
  name: string;
  latin_name: string;
  image_url: string;
  note: string;
  min_shoal_size: number;
  min_tank_liters: number;
  adult_size_cm: number;
};

type PlantRow = {
  id: string;
  name: string;
  image_url: string;
  note: string;
  light_level: string;
  co2_required: boolean;
};

type Category = "balik" | "bitki" | "kabuklu";

const CATEGORY_LABELS: Record<Category, string> = {
  balik: "Balıklar",
  bitki: "Bitkiler",
  kabuklu: "Kabuklular",
};

export default function LibraryBrowser({
  fish,
  shrimp,
  plants,
}: {
  fish: FishRow[];
  shrimp: FishRow[];
  plants: PlantRow[];
}) {
  const [category, setCategory] = useState<Category>("balik");

  const counts: Record<Category, number> = {
    balik: fish.length,
    bitki: plants.length,
    kabuklu: shrimp.length,
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
                category === c ? "bg-aqua text-abyss" : "border border-abyss-border text-ink-muted hover:text-ink"
              }`}
            >
              {CATEGORY_LABELS[c]} ({counts[c]})
            </button>
          ))}
        </div>

        <Link
          href="/akvaryum-asistani"
          className="flex items-center gap-2 rounded-full border border-abyss-border px-4 py-2 font-body text-xs text-ink-muted transition-colors hover:border-aqua hover:text-aqua"
        >
          ← Akvaryum Asistanı&apos;na Dön
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {category === "balik" &&
          (fish.length === 0 ? (
            <EmptyState />
          ) : (
            fish.map((f) => <FishOrShrimpCard key={f.id} item={f} />)
          ))}

        {category === "kabuklu" &&
          (shrimp.length === 0 ? (
            <EmptyState />
          ) : (
            shrimp.map((s) => <FishOrShrimpCard key={s.id} item={s} />)
          ))}

        {category === "bitki" &&
          (plants.length === 0 ? (
            <EmptyState />
          ) : (
            plants.map((p) => <PlantEntryCard key={p.id} item={p} />)
          ))}
      </div>
    </div>
  );
}

function FishOrShrimpCard({ item }: { item: FishRow }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface">
      <div className="relative aspect-[4/3] w-full">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="font-display text-lg text-ink">{item.name}</p>
        {item.latin_name && (
          <p className="font-body text-xs italic text-ink-faint">{item.latin_name}</p>
        )}
        {item.note && (
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{item.note}</p>
        )}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-abyss-border pt-3">
          <Spec label="Min. Tank" value={`${item.min_tank_liters} L`} />
          <Spec label="Min. Grup" value={`${item.min_shoal_size} adet`} />
          <Spec label="Yetişkin Boy" value={`${item.adult_size_cm} cm`} />
        </div>
      </div>
    </div>
  );
}

function PlantEntryCard({ item }: { item: PlantRow }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface">
      <div className="relative aspect-[4/3] w-full">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="font-display text-lg text-ink">{item.name}</p>
        {item.note && (
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{item.note}</p>
        )}
        <div className="mt-4 flex gap-2 border-t border-abyss-border pt-3">
          <Spec label="Işık İhtiyacı" value={item.light_level} />
          <Spec label="CO2" value={item.co2_required ? "Gerekli" : "Gerekmez"} />
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-0.5 font-body text-xs text-ink">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="col-span-full py-12 text-center font-body text-sm text-ink-muted">
      Bu kategoride henüz tür eklenmedi.
    </p>
  );
}
