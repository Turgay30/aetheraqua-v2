"use client";

import Image from "next/image";
import Link from "next/link";
import { CardStatus } from "@/components/assistant/FishCard";

type Plant = {
  id: string;
  name: string;
  image_url: string;
  note: string;
  light_level: "düşük" | "orta" | "yüksek";
  co2_required: boolean;
};

const statusStyles: Record<CardStatus, string> = {
  neutral: "border-abyss-border hover:border-ink-faint",
  selected:
    "border-gold bg-gold/[0.06] shadow-[0_0_0_1px_theme(colors.gold.DEFAULT),0_0_20px_rgba(201,162,39,0.45)]",
  compatible:
    "border-emerald-400/60 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_0_12px_rgba(52,211,153,0.25)] hover:border-emerald-300",
  incompatible:
    "border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.35),0_0_12px_rgba(239,68,68,0.2)] opacity-40 cursor-not-allowed",
};

const lightLabels: Record<Plant["light_level"], string> = {
  düşük: "Düşük",
  orta: "Orta",
  yüksek: "Yüksek",
};

export default function PlantCard({
  plant,
  status,
  onToggle,
}: {
  plant: Plant;
  status: CardStatus;
  onToggle: () => void;
}) {
  const disabled = status === "incompatible";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-abyss-surface transition-all duration-300 ${statusStyles[status]}`}
    >
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={status === "selected"}
        className="flex w-full flex-col text-left"
      >
        <div className="relative aspect-[4/3] w-full">
          <Image src={plant.image_url} alt={plant.name} fill className="object-cover" />
        </div>
        <div className="p-3">
          <p className="font-body text-sm font-semibold text-ink">{plant.name}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-aqua/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-aqua">
              Işık: {lightLabels[plant.light_level]}
            </span>
            {plant.co2_required && (
              <span className="rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-gold">
                CO2 Gerekli
              </span>
            )}
          </div>
          {plant.note && (
            <p className="mt-2 line-clamp-2 border-t border-abyss-border pt-2 font-body text-xs leading-relaxed text-ink-muted">
              {plant.note}
            </p>
          )}
        </div>
      </button>

      {/* Kütüphane bilgisi — resmin sol üst köşesi */}
      <Link
        href={`/akvaryum-kutuphanesi?type=plant&id=${plant.id}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`${plant.name} hakkında bilgi al`}
        title="Kütüphanede detaylı bilgi al"
        className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-abyss/80 text-ink-muted backdrop-blur-sm transition-colors hover:bg-aqua hover:text-abyss"
      >
        <BookIcon />
      </Link>
    </div>
  );
}

function BookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 19.5V5a2 2 0 012-2h11.5v17H6a2 2 0 00-2 2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17.5 3v17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
