"use client";

import { useEffect, useState } from "react";
import { calcGrossLitersFromDimensions, calcEffectiveLiters } from "@/lib/aquarium-calc";

export default function TankSizeInput({
  onChange,
  initialLiters,
}: {
  onChange: (liters: number) => void;
  initialLiters?: number;
}) {
  const [mode, setMode] = useState<"dimensions" | "liters">(initialLiters ? "liters" : "dimensions");
  const [length, setLength] = useState("60");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("35");
  const [directLiters, setDirectLiters] = useState(
    initialLiters ? String(Math.round(initialLiters / 0.9)) : "60"
  );

  const grossLiters =
    mode === "dimensions"
      ? calcGrossLitersFromDimensions(Number(length) || 0, Number(width) || 0, Number(height) || 0)
      : Number(directLiters) || 0;

  const effectiveLiters = calcEffectiveLiters(grossLiters);

  useEffect(() => {
    onChange(effectiveLiters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveLiters]);

  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setMode("dimensions")}
          className={`rounded-full px-4 py-1.5 font-body text-xs transition-colors ${
            mode === "dimensions"
              ? "bg-aqua text-abyss"
              : "border border-abyss-border text-ink-muted hover:text-ink"
          }`}
        >
          Boyut Gir (cm)
        </button>
        <button
          onClick={() => setMode("liters")}
          className={`rounded-full px-4 py-1.5 font-body text-xs transition-colors ${
            mode === "liters"
              ? "bg-aqua text-abyss"
              : "border border-abyss-border text-ink-muted hover:text-ink"
          }`}
        >
          Doğrudan Litre
        </button>
      </div>

      {mode === "dimensions" ? (
        <div className="grid grid-cols-3 gap-3">
          <Field label="Uzunluk" value={length} onChange={setLength} />
          <Field label="Genişlik" value={width} onChange={setWidth} />
          <Field label="Yükseklik" value={height} onChange={setHeight} />
        </div>
      ) : (
        <Field
          label="Litre (tankın nominal/kutu hacmi)"
          value={directLiters}
          onChange={setDirectLiters}
          wide
        />
      )}

      <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <p className="font-body text-sm text-ink-muted">
          Kutu hacmi: <span className="text-ink">{grossLiters.toFixed(0)} L</span>
        </p>
        <p className="font-body text-sm text-ink-muted">
          Gerçek su hacmi:{" "}
          <span className="font-display text-xl text-aqua">{effectiveLiters.toFixed(0)} litre</span>
        </p>
      </div>
      <p className="mt-2 font-body text-xs text-ink-faint">
        Hesaplamalar, ekipman ve buharlaşma payı için camın ~%90&apos;ına kadar doldurulduğu
        varsayımıyla gerçek su hacmine göre yapılır.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "max-w-[160px]" : ""}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}
