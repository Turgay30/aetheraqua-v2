"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LivestockType, CompatibilityKey, key } from "@/lib/livestock";

type Item = { type: LivestockType; id: string; name: string };

const TYPE_LABELS: Record<LivestockType, string> = {
  fish: "Balıklar",
  shrimp: "Kabuklular",
  plant: "Bitkiler",
};

export default function CompatibilityPicker({
  excludeType,
  excludeId,
  selected,
  onChange,
}: {
  excludeType: LivestockType;
  excludeId?: string;
  selected: Set<CompatibilityKey>;
  onChange: (next: Set<CompatibilityKey>) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("fish_species").select("id, name"),
      supabase.from("shrimp_species").select("id, name"),
      supabase.from("plants").select("id, name"),
    ]).then(([fishRes, shrimpRes, plantRes]) => {
      const all: Item[] = [
        ...(fishRes.data ?? []).map((r) => ({ type: "fish" as const, id: r.id, name: r.name })),
        ...(shrimpRes.data ?? []).map((r) => ({ type: "shrimp" as const, id: r.id, name: r.name })),
        ...(plantRes.data ?? []).map((r) => ({ type: "plant" as const, id: r.id, name: r.name })),
      ];
      setItems(all.filter((i) => !(i.type === excludeType && i.id === excludeId)));
      setLoading(false);
    });
  }, [excludeType, excludeId]);

  function toggle(item: Item) {
    const k = key(item.type, item.id);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onChange(next);
  }

  if (loading) return null;

  const grouped: Record<LivestockType, Item[]> = { fish: [], shrimp: [], plant: [] };
  items.forEach((i) => grouped[i.type].push(i));

  return (
    <div className="space-y-3">
      {(["fish", "shrimp", "plant"] as LivestockType[]).map((type) =>
        grouped[type].length > 0 ? (
          <div key={type}>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {TYPE_LABELS[type]}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped[type].map((item) => {
                const k = key(item.type, item.id);
                const isSelected = selected.has(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggle(item)}
                    className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-abyss-border text-ink-muted hover:border-ink-faint"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
