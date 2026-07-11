"use client";

import Image from "next/image";
import { FishSpecies } from "@/lib/fish-data";

export type CardStatus = "neutral" | "selected" | "compatible" | "incompatible";

const statusStyles: Record<CardStatus, string> = {
  neutral: "border-abyss-border hover:border-ink-faint",
  selected:
    "border-gold bg-gold/[0.06] shadow-[0_0_0_1px_theme(colors.gold.DEFAULT),0_0_20px_rgba(201,162,39,0.45)]",
  compatible:
    "border-emerald-400/60 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_0_12px_rgba(52,211,153,0.25)] hover:border-emerald-300",
  incompatible:
    "border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.35),0_0_12px_rgba(239,68,68,0.2)] opacity-40 cursor-not-allowed",
};

export default function FishCard({
  fish,
  status,
  count,
  onToggle,
  onIncrement,
  onDecrement,
}: {
  fish: FishSpecies;
  status: CardStatus;
  count: number;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const disabled = status === "incompatible";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-abyss-surface transition-all duration-300 ${statusStyles[status]}`}
    >
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={status === "selected"}
        className="flex w-full flex-col text-left"
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={fish.image}
            alt={fish.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>

        <div className="p-3.5">
          <p className="font-body text-sm font-semibold text-ink">{fish.name}</p>
          <p className="font-body text-[11px] italic text-ink-faint">{fish.latinName}</p>
          <p className="mt-1.5 line-clamp-2 font-body text-[11px] text-ink-muted">{fish.note}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 font-mono text-[10px] text-ink-faint">
            <span>Min. sürü: {fish.minShoalSize}</span>
            <span>Min. tank: {fish.minTankLiters}L</span>
          </div>
        </div>
      </button>

      {/* Adet göstergesi — resmin sağ üst köşesi */}
      {status === "selected" && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-abyss/90 px-1 py-1 backdrop-blur-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecrement();
            }}
            aria-label={`${fish.name} adedini azalt`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-gold-bright hover:bg-gold/20"
          >
            −
          </button>
          <span className="w-4 text-center font-mono text-[11px] text-gold-bright">{count}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
            aria-label={`${fish.name} adedini artır`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-gold-bright hover:bg-gold/20"
          >
            +
          </button>
        </div>
      )}

      {status === "incompatible" && (
        <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
          <XIcon />
        </span>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
