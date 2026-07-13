"use client";

import { useState } from "react";
import Link from "next/link";
import { LightingSchedule } from "@/lib/lighting-schedule";
import { useToast } from "@/components/ToastProvider";

// Gerçekçi Kelvin renkleri birbirine çok yakın (hepsi beyaza yakın) düştüğü için,
// zaman çizelgesinde net ayırt edilebilmesi adına stilize/abartılı bir renk paleti
// kullanıyoruz — Kelvin değerleri metin olarak zaten doğru şekilde gösteriliyor.
const PHASE_VISUAL_COLORS: Record<string, string> = {
  "Gün Doğumu": "#FF9142",
  Gündüz: "#7DD8FF",
  "Öğle Zirvesi": "#FFFFFF",
  "Gün Batımı": "#FF5C5C",
  Gece: "#1A2540",
};

function phaseColor(label: string): string {
  return PHASE_VISUAL_COLORS[label] ?? "#7DD8FF";
}

export default function LightingScheduleCard({ schedule }: { schedule: LightingSchedule }) {
  const { showToast } = useToast();
  const [transferring, setTransferring] = useState(false);

  function handleTransfer() {
    setTransferring(true);
    setTimeout(() => {
      setTransferring(false);
      showToast(
        "AetherAqua Kontrol uygulaması çok yakında geliyor — o zaman bu program tek dokunuşla cihazınıza aktarılacak. 🚀",
        "info"
      );
    }, 900);
  }

  // Gün boyu geçen renk gradyanı için stop noktaları hesapla
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const gradientStops: string[] = [];
  schedule.phases.forEach((p) => {
    const [start] = p.time.split("–");
    const pct = (toMinutes(start) / (24 * 60)) * 100;
    gradientStops.push(`${phaseColor(p.label)} ${pct}%`);
  });
  gradientStops.push(`${phaseColor(schedule.phases[0].label)} 100%`);
  const gradientCss = `linear-gradient(90deg, ${gradientStops.join(", ")})`;

  return (
    <div className="overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            ☀️ Önerilen Aydınlatma Programı
          </p>
          <span className="rounded-full bg-abyss px-2.5 py-1 font-mono text-[10px] text-ink-muted">
            {schedule.photoperiodHours} saat/gün
          </span>
        </div>

        {/* Gün boyu renk geçişi — gerçek Kelvin tonlarıyla */}
        <div
          className="mt-5 h-8 w-full rounded-full shadow-inner"
          style={{ background: gradientCss }}
        />
        <div className="mt-1.5 flex justify-between font-mono text-[9px] text-ink-faint">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>

        <div className="mt-6 space-y-3">
          {schedule.phases.map((p) => (
            <div
              key={p.label}
              className="flex items-center justify-between rounded-xl border border-abyss-border/60 bg-abyss px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 flex-shrink-0 rounded-full ring-1 ring-white/10"
                  style={{
                    backgroundColor: phaseColor(p.label),
                    boxShadow: p.kelvin > 0 ? `0 0 12px ${phaseColor(p.label)}` : "none",
                  }}
                />
                <div>
                  <p className="font-body text-sm font-medium text-ink">{p.label}</p>
                  <p className="font-mono text-[10px] text-ink-faint">{p.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-sm text-ink">
                  {p.kelvin > 0 ? `${p.kelvin.toLocaleString("tr-TR")}K` : "Kapalı"}
                </p>
                {p.kelvin > 0 && (
                  <p className="font-mono text-[10px] text-ink-faint">%{p.intensity} yoğunluk</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-abyss-border bg-abyss p-4">
          <p className="font-body text-xs text-ink-muted">
            Seçtiğiniz bitkilerin ışık ihtiyacına göre{" "}
            <Link
              href={`/${schedule.recommendedProduct}`}
              className={`font-semibold hover:underline ${
                schedule.recommendedProduct === "apollo" ? "text-apollo-gold" : "text-helios-bronze"
              }`}
            >
              {schedule.recommendedProduct === "apollo" ? "Apollo" : "Helios"}
            </Link>{" "}
            bu programı uygulamak için ideal —{" "}
            {schedule.recommendedProduct === "apollo"
              ? "ayarlanabilir tam spektrumuyla gün doğumu/batımı geçişlerini otomatikleştirebilirsiniz."
              : "sabit gündüz ışığıyla bu ihtiyacı rahatça karşılar."}
          </p>
        </div>
      </div>

      {/* Gelecek vaadi: uygulamaya aktarma butonu */}
      <button
        onClick={handleTransfer}
        disabled={transferring}
        className="flex w-full items-center justify-center gap-2 border-t border-abyss-border bg-gradient-to-r from-aqua/10 via-gold/10 to-aqua/10 px-6 py-4 font-body text-sm font-semibold text-ink transition-colors hover:from-aqua/20 hover:to-aqua/20 disabled:opacity-60"
      >
        {transferring ? (
          "Aktarılıyor..."
        ) : (
          <>
            <span>📲</span>
            <span>Bu Programı Cihazıma Aktar</span>
            <span className="rounded-full bg-abyss px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-gold">
              Yakında
            </span>
          </>
        )}
      </button>
    </div>
  );
}
