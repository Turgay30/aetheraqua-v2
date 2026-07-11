"use client";

import Image from "next/image";
import { FishSpecies } from "@/lib/fish-data";

export type CardStatus = "neutral" | "selected" | "compatible" | "incompatible";

const statusStyles: Record<CardStatus, string> = {
  neutral: "border-abyss-border hover:border-ink-faint",
  selected: "border-aqua shadow-[0_0_0_1px_theme(colors.aqua.DEFAULT),0_0_24px_theme(colors.aqua.DEFAULT)]",
  compatible:
    "border-emerald-400/70 shadow-[0_0_0_1px_rgba(52,211,153,0.5),0_0_18px_rgba(52,211,153,0.35)] hover:border-emerald-300",
  incompatible:
    "border-red-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_0_16px_rgba(239,68,68,0.25)] opacity-40 cursor-not-allowed",
};

export default function FishCard({
  fish,
  status,
  count,
  onToggle,
}: {
  fish: FishSpecies;
  status: CardStatus;
  count: number;
  onToggle: () => void;
}) {
  const disabled = status === "incompatible";

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={status === "selected"}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-abyss-surface text-left transition-all duration-300 ${statusStyles[status]}`}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={fish.image}
          alt={fish.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
        />
        {status === "selected" && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-aqua text-abyss">
            <CheckIcon />
          </span>
        )}
        {status === "incompatible" && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
            <XIcon />
          </span>
        )}
        {count > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-abyss/80 px-2 py-0.5 font-mono text-[11px] text-aqua">
            ×{count}
          </span>
        )}
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
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
