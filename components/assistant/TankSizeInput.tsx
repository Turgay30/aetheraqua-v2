"use client";

import { useEffect, useState } from "react";
import { calcLitersFromDimensions } from "@/lib/aquarium-calc";

export default function TankSizeInput({
  onChange,
}: {
  onChange: (liters: number) => void;
}) {
  const [mode, setMode] = useState<"dimensions" | "liters">("dimensions");
  const [length, setLength] = useState("60");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("35");
  const [directLiters, setDirectLiters] = useState("60");

  const dimensionLiters = calcLitersFromDimensions(
    Number(length) || 0,
    Number(width) || 0,
    Number(height) || 0
  );

  const liters = mode === "dimensions" ? dimensionLiters : Number(directLiters) || 0;

  useEffect(() => {
    onChange(liters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liters]);

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
        <Field label="Litre" value={directLiters} onChange={setDirectLiters} wide />
      )}

      <p className="mt-5 font-body text-sm text-ink-muted">
        Tank hacmi:{" "}
        <span className="font-display text-xl text-aqua">{liters.toFixed(0)} litre</span>
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
