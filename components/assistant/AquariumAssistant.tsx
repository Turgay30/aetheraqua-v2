"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FishSpecies } from "@/lib/fish-data";
import { LivestockType, CompatibilityKey, key as ckey } from "@/lib/livestock";
import { assessStocking, recommendEquipment } from "@/lib/aquarium-calc";
import TankSizeInput from "@/components/assistant/TankSizeInput";
import FishCard, { CardStatus } from "@/components/assistant/FishCard";
import PlantCard from "@/components/assistant/PlantCard";
import StockingSummary from "@/components/assistant/StockingSummary";
import EquipmentRecommendation from "@/components/assistant/EquipmentRecommendation";
import StickySummaryBar from "@/components/assistant/StickySummaryBar";
import ShareResult from "@/components/assistant/ShareResult";

type Plant = {
  id: string;
  name: string;
  image_url: string;
  note: string;
  light_level: "düşük" | "orta" | "yüksek";
  co2_required: boolean;
};

type Mode = "karma" | "balik" | "bitki" | "kabuklu";

const MODE_LABELS: Record<Mode, string> = {
  karma: "Karma Akvaryum",
  balik: "Balıklar",
  bitki: "Bitkiler",
  kabuklu: "Kabuklular",
};

export default function AquariumAssistant() {
  const [liters, setLiters] = useState(60);
  const [mode, setMode] = useState<Mode>("karma");

  const [fish, setFish] = useState<FishSpecies[]>([]);
  const [shrimp, setShrimp] = useState<FishSpecies[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [incompatMap, setIncompatMap] = useState<Map<CompatibilityKey, Set<CompatibilityKey>>>(new Map());
  const [loading, setLoading] = useState(true);

  // Birleşik seçim: "fish:id" veya "shrimp:id" -> adet. Bitkiler ayrı bir Set (adet yok).
  const [selection, setSelection] = useState<Record<CompatibilityKey, number>>({});
  const [selectedPlantIds, setSelectedPlantIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from("fish_species").select("*").order("name"),
      supabase.from("shrimp_species").select("*").order("name"),
      supabase.from("plants").select("*").order("name"),
      supabase.from("livestock_compatibility").select("a_type, a_id, b_type, b_id").eq("compatible", false),
    ]).then(([fishRes, shrimpRes, plantRes, compatRes]) => {
      const mapSpecies = (rows: typeof fishRes.data): FishSpecies[] =>
        (rows ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          latinName: row.latin_name,
          image: row.image_url,
          note: row.note,
          minShoalSize: row.min_shoal_size,
          minTankLiters: row.min_tank_liters,
          adultSizeCm: Number(row.adult_size_cm),
        }));

      setFish(mapSpecies(fishRes.data));
      setShrimp(mapSpecies(shrimpRes.data));
      setPlants((plantRes.data as Plant[]) ?? []);

      const map = new Map<CompatibilityKey, Set<CompatibilityKey>>();
      (compatRes.data ?? []).forEach((row) => {
        const a = ckey(row.a_type as LivestockType, row.a_id);
        const b = ckey(row.b_type as LivestockType, row.b_id);
        if (!map.has(a)) map.set(a, new Set());
        map.get(a)!.add(b);
      });
      setIncompatMap(map);
      setLoading(false);
    });
  }, []);

  function areCompatible(a: CompatibilityKey, b: CompatibilityKey): boolean {
    if (a === b) return true;
    return !incompatMap.get(a)?.has(b);
  }

  // Tüm seçili canlıların (balık+kabuklu+bitki) anahtarları — uyumluluk kontrolü hepsine karşı yapılır
  const allSelectedKeys = useMemo(() => {
    const keys = Object.keys(selection) as CompatibilityKey[];
    const plantKeys = Array.from(selectedPlantIds).map((id) => ckey("plant", id));
    return [...keys, ...plantKeys];
  }, [selection, selectedPlantIds]);

  const totalAdultCm = useMemo(() => {
    return Object.entries(selection).reduce((sum, [k, count]) => {
      const [type, id] = k.split(":");
      const list = type === "fish" ? fish : shrimp;
      const item = list.find((f) => f.id === id);
      return item ? sum + item.adultSizeCm * count : sum;
    }, 0);
  }, [selection, fish, shrimp]);

  const stocking = useMemo(() => assessStocking(totalAdultCm, liters), [totalAdultCm, liters]);
  const equipment = useMemo(() => recommendEquipment(liters, stocking.level), [liters, stocking.level]);
  const totalFishCount = useMemo(
    () => Object.values(selection).reduce((sum, c) => sum + c, 0),
    [selection]
  );

  function getStatus(type: LivestockType, id: string): CardStatus {
    const k = ckey(type, id);
    if (allSelectedKeys.includes(k)) return "selected";
    if (allSelectedKeys.length === 0) return "neutral";
    const compatible = allSelectedKeys.every((sel) => areCompatible(sel, k));
    return compatible ? "compatible" : "incompatible";
  }

  function toggleCreature(type: "fish" | "shrimp", id: string, minShoal: number) {
    const k = ckey(type, id);
    setSelection((prev) => {
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = minShoal;
      return next;
    });
  }

  function updateCount(type: "fish" | "shrimp", id: string, count: number) {
    const k = ckey(type, id);
    setSelection((prev) => ({ ...prev, [k]: Math.max(1, count) }));
  }

  function togglePlant(id: string) {
    setSelectedPlantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearAll() {
    setSelection({});
    setSelectedPlantIds(new Set());
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-24 text-center">
        <p className="font-body text-sm text-ink-muted">Yükleniyor...</p>
      </div>
    );
  }

  const showFish = mode === "karma" || mode === "balik";
  const showShrimp = mode === "karma" || mode === "kabuklu";
  const showPlants = (mode === "karma" || mode === "bitki") && plants.length > 0;

  const hasSelection = allSelectedKeys.length > 0;

  return (
    <div className={`mx-auto max-w-6xl px-6 ${hasSelection ? "pb-20" : "pb-24"}`}>
      {/* 0. Mod seçimi */}
      <div className="mb-10 flex flex-wrap gap-2">
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
              mode === m ? "bg-aqua text-abyss" : "border border-abyss-border text-ink-muted hover:text-ink"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* 1. Tank ölçüsü */}
      <div className="mb-12">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          1 · Tank Ölçünüzü Girin
        </p>
        <TankSizeInput onChange={setLiters} />
      </div>

      {/* 2. Canlı seçimi */}
      <div className="mb-12">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            2 · {MODE_LABELS[mode]} — Seçin
          </p>
          {hasSelection && (
            <button
              onClick={clearAll}
              className="font-body text-xs text-ink-faint underline decoration-abyss-border underline-offset-4 hover:text-aqua"
            >
              Seçimi Temizle
            </button>
          )}
        </div>

        {showFish && fish.length > 0 && (
          <div className="mb-8">
            {mode === "karma" && (
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Balıklar</p>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {fish.map((f) => (
                <FishCard
                  key={f.id}
                  fish={f}
                  status={getStatus("fish", f.id)}
                  count={selection[ckey("fish", f.id)] ?? 0}
                  onToggle={() => toggleCreature("fish", f.id, f.minShoalSize)}
                  onIncrement={() => updateCount("fish", f.id, (selection[ckey("fish", f.id)] ?? 0) + 1)}
                  onDecrement={() => {
                    const next = (selection[ckey("fish", f.id)] ?? 0) - 1;
                    if (next <= 0) toggleCreature("fish", f.id, f.minShoalSize);
                    else updateCount("fish", f.id, next);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {showShrimp && shrimp.length > 0 && (
          <div className="mb-8">
            {mode === "karma" && (
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Kabuklular</p>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {shrimp.map((s) => (
                <FishCard
                  key={s.id}
                  fish={s}
                  status={getStatus("shrimp", s.id)}
                  count={selection[ckey("shrimp", s.id)] ?? 0}
                  onToggle={() => toggleCreature("shrimp", s.id, s.minShoalSize)}
                  onIncrement={() => updateCount("shrimp", s.id, (selection[ckey("shrimp", s.id)] ?? 0) + 1)}
                  onDecrement={() => {
                    const next = (selection[ckey("shrimp", s.id)] ?? 0) - 1;
                    if (next <= 0) toggleCreature("shrimp", s.id, s.minShoalSize);
                    else updateCount("shrimp", s.id, next);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {showPlants && (
          <div>
            {mode === "karma" && (
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Bitkiler</p>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {plants.map((p) => (
                <PlantCard
                  key={p.id}
                  plant={p}
                  status={getStatus("plant", p.id)}
                  onToggle={() => togglePlant(p.id)}
                />
              ))}
            </div>
          </div>
        )}

        {mode === "bitki" && plants.length === 0 && (
          <p className="font-body text-sm text-ink-muted">Henüz bitki eklenmedi.</p>
        )}
      </div>

      {/* 3-4. Stoklama + Ekipman */}
      {hasSelection && (
        <div id="stoklama-detay" className="scroll-mt-24 pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            <StockingSummary result={stocking} />
            <EquipmentRecommendation equipment={equipment} />
          </div>
          <div className="mt-6">
            <ShareResult
              liters={liters}
              selectedFish={[
                ...Object.entries(selection).map(([k, count]) => {
                  const [type, id] = k.split(":");
                  const list = type === "fish" ? fish : shrimp;
                  return { name: list.find((f) => f.id === id)?.name ?? id, count };
                }),
                ...Array.from(selectedPlantIds).map((id) => ({
                  name: plants.find((p) => p.id === id)?.name ?? id,
                  count: 1,
                })),
              ]}
              stocking={stocking}
              equipment={equipment}
            />
          </div>
        </div>
      )}

      {hasSelection && (
        <StickySummaryBar
          liters={liters}
          fishCount={totalFishCount}
          stocking={stocking}
          equipment={equipment}
        />
      )}
    </div>
  );
}
