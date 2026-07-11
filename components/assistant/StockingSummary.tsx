import { StockingResult } from "@/lib/aquarium-calc";

const levelStyles: Record<StockingResult["level"], { label: string; color: string; bar: string }> = {
  rahat: { label: "Rahat", color: "text-emerald-400", bar: "bg-emerald-400" },
  uygun: { label: "Uygun", color: "text-aqua", bar: "bg-aqua" },
  kalabalık: { label: "Kalabalık", color: "text-red-400", bar: "bg-red-400" },
};

export default function StockingSummary({ result }: { result: StockingResult }) {
  const s = levelStyles[result.level];
  const barWidth = Math.min(result.percent, 100);

  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Stoklama Değerlendirmesi
        </p>
        <span className={`font-body text-sm font-semibold ${s.color}`}>{s.label}</span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-abyss">
        <div
          className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <p className="mt-3 font-body text-xs text-ink-muted">
        Toplam yetişkin boy: {result.totalAdultCm.toFixed(1)}cm / Kapasite: ~
        {result.capacityCm.toFixed(0)}cm ({result.percent.toFixed(0)}%)
      </p>
    </div>
  );
}
