"use client";

import { useState } from "react";
import { StockingResult, EquipmentRecommendation } from "@/lib/aquarium-calc";
import { useToast } from "@/components/ToastProvider";

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
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [preparing, setPreparing] = useState(false);

  function buildSummaryText(): string {
    const levelLabel =
      stocking.level === "rahat" ? "Rahat" : stocking.level === "uygun" ? "Uygun" : "Kalabalık";

    const lines = [
      "🐠 AetherAqua Akvaryum Asistanı — Sonuçlarım",
      "",
      `Tank hacmi: ${liters.toFixed(0)} litre`,
      "",
      "Canlılar:",
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
      showToast("Panoya kopyalanamadı.", "error");
    }
  }

  async function handleShareWhatsApp() {
    setPreparing(true);
    const pdfArgs = { liters, selectedFish, stocking, equipment };

    try {
      const { buildResultPdfBlob, buildResultPdfFile } = await import("@/lib/aquarium-pdf");
      const file = buildResultPdfFile(pdfArgs);

      // Mobil cihazlarda: yerel paylaşım sayfasını aç, WhatsApp doğrudan seçenek
      // olarak çıkar ve PDF dosya olarak eklenir.
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "AetherAqua Akvaryum Asistanı Sonuçları",
          text: "Akvaryum Asistanı'ndan sonuçlarım",
        });
        setPreparing(false);
        return;
      }

      // Masaüstü / desteklenmeyen tarayıcılar: PDF'i indir, WhatsApp Web'i
      // metinle birlikte aç — kullanıcı indirdiği PDF'i elle ekleyebilir.
      const blob = buildResultPdfBlob(pdfArgs);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "aetheraqua-akvaryum-sonuclari.pdf";
      link.click();
      URL.revokeObjectURL(url);

      showToast("PDF indirildi — WhatsApp'ı açın ve indirilen dosyayı ekleyin.", "info");
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          "AetherAqua Akvaryum Asistanı sonuçlarımı ekte paylaşıyorum 🐠"
        )}`,
        "_blank"
      );
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        showToast("Paylaşım sırasında bir sorun oluştu.", "error");
      }
    } finally {
      setPreparing(false);
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
      <button
        onClick={handleShareWhatsApp}
        disabled={preparing}
        className="rounded-full border border-abyss-border px-5 py-2.5 font-body text-xs text-ink-muted transition-colors hover:border-aqua hover:text-aqua disabled:opacity-50"
      >
        {preparing ? "Hazırlanıyor..." : "WhatsApp'tan Paylaş (PDF)"}
      </button>
    </div>
  );
}
