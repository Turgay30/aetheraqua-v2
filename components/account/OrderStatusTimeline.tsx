"use client";

const STEPS = [
  { key: "beklemede", label: "Alındı" },
  { key: "onaylandı", label: "Onaylandı" },
  { key: "hazırlanıyor", label: "Hazırlanıyor" },
  { key: "kargoya_verildi", label: "Kargoda" },
  { key: "teslim_edildi", label: "Teslim Edildi" },
];

export default function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "iptal") {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2">
        <p className="font-body text-xs font-semibold text-red-400">Bu sipariş iptal edildi</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= activeIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 text-[9px] transition-colors ${
                  done ? "border-aqua bg-aqua text-abyss" : "border-abyss-border text-ink-faint"
                }`}
              >
                {done ? "✓" : ""}
              </div>
              <p
                className={`mt-1.5 whitespace-nowrap text-center font-mono text-[9px] uppercase tracking-wide ${
                  done ? "text-aqua" : "text-ink-faint"
                }`}
              >
                {step.label}
              </p>
            </div>
            {!isLast && (
              <div className={`mx-1 h-0.5 flex-1 ${i < activeIndex ? "bg-aqua" : "bg-abyss-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
