"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Plant = {
  id: string;
  name: string;
  image_url: string;
  note: string;
  light_level: "düşük" | "orta" | "yüksek";
  co2_required: boolean;
};

const LIGHT_RANK = { düşük: 1, orta: 2, yüksek: 3 };

export default function PlantSelector() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("plants")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setPlants((data as Plant[]) ?? []);
        setLoading(false);
      });
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading || plants.length === 0) return null;

  const selectedPlants = plants.filter((p) => selected.has(p.id));
  const maxLight = selectedPlants.reduce(
    (max, p) => Math.max(max, LIGHT_RANK[p.light_level]),
    0
  );

  return (
    <div className="mb-12">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        3 · Bitkilerinizi Seçin (opsiyonel)
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {plants.map((plant) => {
          const isSelected = selected.has(plant.id);
          return (
            <button
              key={plant.id}
              onClick={() => toggle(plant.id)}
              className={`overflow-hidden rounded-xl border bg-abyss-surface text-left transition-all ${
                isSelected
                  ? "border-gold shadow-[0_0_0_1px_theme(colors.gold.DEFAULT),0_0_16px_rgba(201,162,39,0.35)]"
                  : "border-abyss-border hover:border-ink-faint"
              }`}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image src={plant.image_url} alt={plant.name} fill className="object-cover" />
              </div>
              <div className="p-2.5">
                <p className="font-body text-xs font-semibold text-ink">{plant.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                  Işık: {plant.light_level}
                  {plant.co2_required && " · CO2"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedPlants.length > 0 && (
        <div className="mt-6 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Işık Önerisi
          </p>
          {maxLight >= 3 ? (
            <p className="mt-2 font-body text-sm text-ink-muted">
              Seçtiğiniz bitkiler arasında <span className="text-ink">yüksek ışık</span> isteyenler var.{" "}
              <Link href="/apollo" className="text-apollo-gold hover:underline">
                Apollo&apos;nun
              </Link>{" "}
              ayarlanabilir tam spektrumu (6.500K–18.000K) bu ihtiyacı karşılamak için ideal.
            </p>
          ) : (
            <p className="mt-2 font-body text-sm text-ink-muted">
              Seçtiğiniz bitkiler için sabit, dengeli bir gündüz ışığı yeterli —{" "}
              <Link href="/helios" className="text-helios-bronze hover:underline">
                Helios&apos;un
              </Link>{" "}
              8.000K sabit çıkışı bu ihtiyacı karşılar.
            </p>
          )}
          {selectedPlants.some((p) => p.co2_required) && (
            <p className="mt-2 font-body text-xs text-ink-faint">
              Not: Seçtiğiniz bitkilerden bazıları CO2 takviyesi gerektiriyor.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
