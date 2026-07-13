"use client";

import Link from "next/link";
import { LightingSchedule } from "@/lib/lighting-schedule";

const PHASE_COLORS: Record<string, string> = {
  "Gün Doğumu": "bg-gold/60",
  Gündüz: "bg-aqua",
  "Öğle Zirvesi": "bg-apollo-gold",
  "Gün Batımı": "bg-orange-400/70",
  Gece: "bg-abyss-border",
};

export default function LightingScheduleCard({ schedule }: { schedule: LightingSchedule }) {
  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Önerilen Aydınlatma Programı
        </p>
        <span className="font-body text-xs text-ink-muted">{schedule.photoperiodHours} saat/gün</span>
      </div>

      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
        {schedule.phases.map((p, i) => {
          const [start, end] = p.time.split("–");
          const toMinutes = (t: string) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
          };
          let duration = toMinutes(end) - toMinutes(start);
          if (duration < 0) duration += 24 * 60;
          const widthPercent = (duration / (24 * 60)) * 100;
          return (
            <div
              key={i}
              style={{ width: `${widthPercent}%` }}
              className={`${PHASE_COLORS[p.label] ?? "bg-abyss-border"}`}
              title={`${p.label} · ${p.time}`}
            />
          );
        })}
      </div>

      <div className="mt-5 space-y-2.5">
        {schedule.phases.map((p) => (
          <div key={p.label} className="flex items-center justify-between font-body text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${PHASE_COLORS[p.label] ?? "bg-abyss-border"}`} />
              <span className="text-ink">{p.label}</span>
              <span className="text-ink-faint">{p.time}</span>
            </div>
            <span className="text-ink-muted">
              {p.kelvin > 0 ? `${p.kelvin.toLocaleString("tr-TR")}K · %${p.intensity}` : "Kapalı"}
            </span>
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
  );
}
