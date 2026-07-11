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
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-7 px-6 py-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12 sm:gap-y-4 sm:py-6">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-baseline sm:gap-2 sm:text-left"
          >
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
