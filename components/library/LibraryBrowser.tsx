"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

type GuideRow = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
};

type Category = "balik" | "bitki" | "kabuklu" | "rehber";

const CATEGORY_LABELS: Record<Category, string> = {
  balik: "Balıklar",
  bitki: "Bitkiler",
  kabuklu: "Kabuklular",
  rehber: "Rehberler",
};

const URL_TYPE_TO_CATEGORY: Record<string, Category> = {
  fish: "balik",
  plant: "bitki",
  shrimp: "kabuklu",
};

function capitalize(s: string) {
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
}

export default function LibraryBrowser({
  fish,
  shrimp,
  plants,
  guides,
}: {
  fish: FishRow[];
  shrimp: FishRow[];
  plants: PlantRow[];
  guides: GuideRow[];
}) {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type");
  const urlId = searchParams.get("id");
  const targetKey = urlType && urlId ? `${urlType}-${urlId}` : null;

  const [category, setCategory] = useState<Category>(
    (urlType && URL_TYPE_TO_CATEGORY[urlType]) || "balik"
  );
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetKey && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const counts: Record<Category, number> = {
    balik: fish.length,
    bitki: plants.length,
    kabuklu: shrimp.length,
    rehber: guides.length,
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
            fish.map((f) => (
              <FishOrShrimpCard
                key={f.id}
                item={f}
                highlighted={targetKey === `fish-${f.id}`}
                highlightRef={targetKey === `fish-${f.id}` ? highlightRef : undefined}
              />
            ))
          ))}

        {category === "kabuklu" &&
          (shrimp.length === 0 ? (
            <EmptyState />
          ) : (
            shrimp.map((s) => (
              <FishOrShrimpCard
                key={s.id}
                item={s}
                highlighted={targetKey === `shrimp-${s.id}`}
                highlightRef={targetKey === `shrimp-${s.id}` ? highlightRef : undefined}
              />
            ))
          ))}

        {category === "bitki" &&
          (plants.length === 0 ? (
            <EmptyState />
          ) : (
            plants.map((p) => (
              <PlantEntryCard
                key={p.id}
                item={p}
                highlighted={targetKey === `plant-${p.id}`}
                highlightRef={targetKey === `plant-${p.id}` ? highlightRef : undefined}
              />
            ))
          ))}

        {category === "rehber" &&
          (guides.length === 0 ? (
            <EmptyState />
          ) : (
            guides.map((g) => <GuideCard key={g.slug} item={g} />)
          ))}
      </div>
    </div>
  );
}

function GuideCard({ item }: { item: GuideRow }) {
  return (
    <Link
      href={`/akvaryum-kutuphanesi/rehber/${item.slug}`}
      className="group overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface transition-transform hover:-translate-y-1"
    >
      {item.cover_image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-abyss">
          <Image
            src={item.cover_image}
            alt=""
            fill
            aria-hidden
            className="scale-110 object-cover opacity-50 blur-2xl"
          />
          <Image
            src={item.cover_image}
            alt={item.title}
            fill
            className="relative object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <p className="font-display text-lg text-ink">{item.title}</p>
        {item.excerpt && (
          <p className="mt-2 line-clamp-2 font-body text-sm text-ink-muted">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

function FishOrShrimpCard({
  item,
  highlighted,
  highlightRef,
}: {
  item: FishRow;
  highlighted?: boolean;
  highlightRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={highlightRef}
      className={`overflow-hidden rounded-2xl border bg-abyss-surface transition-shadow duration-700 ${
        highlighted
          ? "border-gold shadow-[0_0_0_1px_theme(colors.gold.DEFAULT),0_0_24px_rgba(201,162,39,0.5)]"
          : "border-abyss-border"
      }`}
    >
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

function PlantEntryCard({
  item,
  highlighted,
  highlightRef,
}: {
  item: PlantRow;
  highlighted?: boolean;
  highlightRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={highlightRef}
      className={`overflow-hidden rounded-2xl border bg-abyss-surface transition-shadow duration-700 ${
        highlighted
          ? "border-gold shadow-[0_0_0_1px_theme(colors.gold.DEFAULT),0_0_24px_rgba(201,162,39,0.5)]"
          : "border-abyss-border"
      }`}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="font-display text-lg text-ink">{item.name}</p>
        {item.note && (
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{item.note}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-abyss-border pt-3">
          <span className="rounded-full bg-aqua/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-aqua shadow-[0_0_10px_rgba(34,211,184,0.35)]">
            Işık: {capitalize(item.light_level)}
          </span>
          <span
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${
              item.co2_required
                ? "bg-gold/15 text-gold shadow-[0_0_10px_rgba(201,162,39,0.35)]"
                : "bg-abyss text-ink-faint"
            }`}
          >
            CO2: {item.co2_required ? "Gerekli" : "Gerekmez"}
          </span>
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
