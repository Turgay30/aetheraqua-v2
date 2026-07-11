"use client";

import { StockingResult, EquipmentRecommendation } from "@/lib/aquarium-calc";

const levelStyles: Record<StockingResult["level"], { label: string; dot: string; text: string }> = {
  rahat: { label: "Rahat", dot: "bg-emerald-400", text: "text-emerald-400" },
  uygun: { label: "Uygun", dot: "bg-aqua", text: "text-aqua" },
  kalabalık: { label: "Kalabalık", dot: "bg-red-400", text: "text-red-400" },
};

export default function StickySummaryBar({
  liters,
  fishCount,
  stocking,
  equipment,
}: {
  liters: number;
  fishCount: number;
  stocking: StockingResult;
  equipment: EquipmentRecommendation;
}) {
  const s = levelStyles[stocking.level];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-abyss-border bg-abyss/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          <span className="font-body text-xs text-ink-muted">
            <span className="text-ink">{liters.toFixed(0)}L</span> tank ·{" "}
            <span className="text-ink">{fishCount}</span> balık
          </span>

          <span className="flex items-center gap-1.5 font-body text-xs">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <span className={s.text}>{s.label}</span>
            <span className="text-ink-faint">({stocking.percent.toFixed(0)}%)</span>
          </span>

          <span className="hidden font-body text-xs text-ink-muted sm:inline">
            Filtre: <span className="text-ink">{equipment.filterFlowLph} L/saat</span>
          </span>
          <span className="hidden font-body text-xs text-ink-muted sm:inline">
            Isıtıcı: <span className="text-ink">{equipment.heaterWatt}W</span>
          </span>
        </div>

        <a
          href="#stoklama-detay"
          className="font-body text-xs text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua"
        >
          Detayları Gör ↓
        </a>
      </div>
    </div>
  );
}
