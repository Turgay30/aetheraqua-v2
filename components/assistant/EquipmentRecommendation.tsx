import { EquipmentRecommendation as Equipment } from "@/lib/aquarium-calc";

export default function EquipmentRecommendation({ equipment }: { equipment: Equipment }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Önerilen Filtre
        </p>
        <p className="mt-2 font-display text-3xl text-ink">
          {equipment.filterFlowLph}
          <span className="ml-1 font-body text-sm text-ink-muted">L/saat</span>
        </p>
      </div>
      <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Önerilen Isıtıcı
        </p>
        <p className="mt-2 font-display text-3xl text-ink">
          {equipment.heaterWatt}
          <span className="ml-1 font-body text-sm text-ink-muted">W</span>
        </p>
      </div>
    </div>
  );
}
