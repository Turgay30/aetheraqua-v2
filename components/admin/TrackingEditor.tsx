"use client";

import { useState } from "react";
import { SHIPPING_COMPANIES } from "@/lib/shipping";

export default function TrackingEditor({
  orderId,
  initialCompany,
  initialTrackingNumber,
  onSave,
}: {
  orderId: string;
  initialCompany: string | null;
  initialTrackingNumber: string | null;
  onSave: (orderId: string, company: string, trackingNumber: string) => void;
}) {
  const [company, setCompany] = useState(initialCompany ?? "");
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(orderId, company, trackingNumber);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-abyss-border pt-3">
      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="rounded-lg border border-abyss-border bg-abyss px-2 py-1.5 font-body text-xs text-ink outline-none"
      >
        <option value="">Kargo Firması Seçin</option>
        {SHIPPING_COMPANIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        placeholder="Takip numarası"
        className="flex-1 rounded-lg border border-abyss-border bg-abyss px-2 py-1.5 font-body text-xs text-ink outline-none"
      />
      <button
        onClick={handleSave}
        className="rounded-full bg-aqua/10 px-3 py-1.5 font-body text-xs text-aqua hover:bg-aqua/20"
      >
        {saved ? "Kaydedildi ✓" : "Kaydet"}
      </button>
    </div>
  );
}
