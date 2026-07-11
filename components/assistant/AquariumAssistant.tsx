"use client";

import { useMemo, useState } from "react";
import { FISH_SPECIES, areCompatible } from "@/lib/fish-data";
import { assessStocking, recommendEquipment } from "@/lib/aquarium-calc";
import TankSizeInput from "@/components/assistant/TankSizeInput";
import FishCard, { CardStatus } from "@/components/assistant/FishCard";
import StockingSummary from "@/components/assistant/StockingSummary";
import EquipmentRecommendation from "@/components/assistant/EquipmentRecommendation";

export default function AquariumAssistant() {
  const [liters, setLiters] = useState(60);
  // fishId -> adet (kaç tane seçildi)
  const [selection, setSelection] = useState<Record<string, number>>({});

  const selectedIds = useMemo(() => Object.keys(selection), [selection]);

  const totalAdultCm = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const fish = FISH_SPECIES.find((f) => f.id === id);
      if (!fish) return sum;
      return sum + fish.adultSizeCm * selection[id];
    }, 0);
  }, [selection, selectedIds]);

  const stocking = useMemo(() => assessStocking(totalAdultCm, liters), [totalAdultCm, liters]);
  const equipment = useMemo(() => recommendEquipment(liters, stocking.level), [liters, stocking.level]);

  function getStatus(fishId: string): CardStatus {
    if (selectedIds.includes(fishId)) return "selected";
    if (selectedIds.length === 0) return "neutral";
    const compatible = selectedIds.every((id) => areCompatible(id, fishId));
    return compatible ? "compatible" : "incompatible";
  }

  function toggleFish(fishId: string) {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[fishId]) {
        delete next[fishId];
      } else {
        const fish = FISH_SPECIES.find((f) => f.id === fishId)!;
        next[fishId] = fish.minShoalSize;
      }
      return next;
    });
  }

  function updateCount(fishId: string, count: number) {
    setSelection((prev) => ({ ...prev, [fishId]: Math.max(1, count) }));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      {/* 1. Tank ölçüsü */}
      <div className="mb-12">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          1 · Tank Ölçünüzü Girin
        </p>
        <TankSizeInput onChange={setLiters} />
      </div>

      {/* 2. Balık seçimi */}
      <div className="mb-12">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            2 · Balıklarınızı Seçin
          </p>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelection({})}
              className="font-body text-xs text-ink-faint underline decoration-abyss-border underline-offset-4 hover:text-aqua"
            >
              Seçimi Temizle
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FISH_SPECIES.map((fish) => (
            <FishCard
              key={fish.id}
              fish={fish}
              status={getStatus(fish.id)}
              count={selection[fish.id] ?? 0}
              onToggle={() => toggleFish(fish.id)}
            />
          ))}
        </div>

        {/* Seçili balıklar için adet ayarlama */}
        {selectedIds.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {selectedIds.map((id) => {
              const fish = FISH_SPECIES.find((f) => f.id === id)!;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-full border border-abyss-border bg-abyss-surface px-3 py-1.5"
                >
                  <span className="font-body text-xs text-ink">{fish.name}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCount(id, selection[id] - 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-abyss-border text-ink-muted hover:text-aqua"
                      aria-label={`${fish.name} adedini azalt`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-mono text-xs text-aqua">
                      {selection[id]}
                    </span>
                    <button
                      onClick={() => updateCount(id, selection[id] + 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-abyss-border text-ink-muted hover:text-aqua"
                      aria-label={`${fish.name} adedini artır`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3-4. Stoklama + Ekipman */}
      {selectedIds.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <StockingSummary result={stocking} />
          <EquipmentRecommendation equipment={equipment} />
        </div>
      )}
    </div>
  );
}
