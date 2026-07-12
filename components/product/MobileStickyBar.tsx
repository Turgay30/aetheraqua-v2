"use client";

import { formatTL } from "@/lib/pricing";

export default function MobileStickyBar({
  visible,
  productName,
  size,
  price,
  disabled,
  justAdded,
  onAdd,
  accentClass = "bg-gold text-abyss",
  accentStyle,
}: {
  visible: boolean;
  productName: string;
  size: number;
  price: number;
  disabled: boolean;
  justAdded: boolean;
  onAdd: () => void;
  accentClass?: string;
  accentStyle?: React.CSSProperties;
}) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-abyss-border bg-abyss/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-xs text-ink-muted">
            {productName} · {size}cm
          </p>
          <p className="font-display text-lg text-ink">{formatTL(price)}</p>
        </div>
        <button
          onClick={onAdd}
          disabled={disabled}
          style={accentStyle}
          className={`flex-shrink-0 rounded-full px-6 py-2.5 font-body text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${accentClass}`}
        >
          {disabled ? "Stokta Yok" : justAdded ? "Eklendi ✓" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}
