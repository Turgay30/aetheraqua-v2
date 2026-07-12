"use client";

import Image from "next/image";
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
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={status === "selected"}
      className={`overflow-hidden rounded-xl border bg-abyss-surface text-left transition-all duration-300 ${statusStyles[status]}`}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image src={plant.image_url} alt={plant.name} fill className="object-cover" />
      </div>
      <div className="p-3">
        <p className="font-body text-sm font-semibold text-ink">{plant.name}</p>
        <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
          Işık: {plant.light_level}
          {plant.co2_required && " · CO2"}
        </p>
        {plant.note && (
          <p className="mt-2 border-t border-abyss-border pt-2 font-body text-xs leading-relaxed text-ink-muted">
            {plant.note}
          </p>
        )}
      </div>
    </button>
  );
}
