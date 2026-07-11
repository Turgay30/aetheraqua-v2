const specs = [
  { label: "CRI", value: ">92–98" },
  { label: "Su Geçirmezlik", value: "IP65 / IP67" },
  { label: "Kontrol", value: "Wi-Fi & Manuel" },
  { label: "Garanti", value: "1–2 Yıl" },
  { label: "Renk Sıcaklığı", value: "6.500K–18.000K" },
];

export default function SpecStrip() {
  return (
    <div className="border-y border-abyss-border bg-abyss-surface/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-6">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {spec.label}
            </span>
            <span className="font-body text-sm text-ink-muted">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
