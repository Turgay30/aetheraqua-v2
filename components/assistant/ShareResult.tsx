"use client";

import { useState } from "react";
import { StockingResult, EquipmentRecommendation } from "@/lib/aquarium-calc";
import { buildWhatsAppLink } from "@/lib/contact";

type SelectedFish = { name: string; count: number };

export default function ShareResult({
  liters,
  selectedFish,
  stocking,
  equipment,
}: {
  liters: number;
  selectedFish: SelectedFish[];
  stocking: StockingResult;
  equipment: EquipmentRecommendation;
}) {
  const [copied, setCopied] = useState(false);

  function buildSummaryText(): string {
    const levelLabel =
      stocking.level === "rahat" ? "Rahat" : stocking.level === "uygun" ? "Uygun" : "Kalabalık";

    const lines = [
      "🐠 AetherAqua Akvaryum Asistanı — Sonuçlarım",
      "",
      `Tank hacmi: ${liters.toFixed(0)} litre`,
      "",
      "Balıklar:",
      ...selectedFish.map((f) => `• ${f.name} × ${f.count}`),
      "",
      `Stoklama durumu: ${levelLabel} (%${stocking.percent.toFixed(0)})`,
      `Önerilen filtre: ${equipment.filterFlowLph} L/saat`,
      `Önerilen ısıtıcı: ${equipment.heaterWatt} W`,
      "",
      "aetheraqua.com/akvaryum-asistani",
    ];

    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erişimi engellenmişse sessizce yok say
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        className="rounded-full border border-abyss-border px-5 py-2.5 font-body text-xs text-ink-muted transition-colors hover:border-aqua hover:text-aqua"
      >
        {copied ? "Kopyalandı ✓" : "Listeyi Kopyala"}
      </button>
      <a
        href={buildWhatsAppLink(buildSummaryText())}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-abyss-border px-5 py-2.5 font-body text-xs text-ink-muted transition-colors hover:border-aqua hover:text-aqua"
      >
        WhatsApp&apos;tan Paylaş
      </a>
    </div>
  );
}
