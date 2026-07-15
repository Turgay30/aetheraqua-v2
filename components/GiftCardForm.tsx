"use client";

import { useState } from "react";
import { formatTL } from "@/lib/pricing";

const AMOUNTS = [500, 1000, 1500, 2500];

export default function GiftCardForm() {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({
    purchaserName: "",
    purchaserEmail: "",
    purchaserPhone: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const finalAmount = useCustom ? Number(customAmount) || 0 : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (finalAmount < 100) {
      setError("Tutar en az 100 TL olmalı.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/gift-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalAmount, ...form }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Talebiniz gönderilirken bir sorun oluştu, lütfen tekrar deneyin.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
        <p className="font-body text-sm leading-relaxed text-ink-muted">
          Talebiniz alındı ✓ Ödeme detayları için ekibimiz kısa süre içinde{" "}
          <span className="text-ink">{form.purchaserEmail}</span> adresinden sizinle iletişime
          geçecek. Onaylandıktan sonra hediye kartı doğrudan{" "}
          <span className="text-ink">{form.recipientName}</span>&apos;e e-posta ile gönderilecek.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Tutar</p>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setUseCustom(false);
              }}
              className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
                !useCustom && amount === a
                  ? "bg-gold text-abyss"
                  : "border border-abyss-border text-ink-muted hover:text-ink"
              }`}
            >
              {formatTL(a)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
              useCustom ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted hover:text-ink"
            }`}
          >
            Özel Tutar
          </button>
        </div>
        {useCustom && (
          <input
            type="number"
            min={100}
            placeholder="Tutar girin (TL)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="mt-3 w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        )}
      </div>

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Sizin Bilgileriniz</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Adınız" value={form.purchaserName} onChange={(v) => update("purchaserName", v)} required />
          <Field label="E-posta" type="email" value={form.purchaserEmail} onChange={(v) => update("purchaserEmail", v)} required />
        </div>
        <div className="mt-3">
          <Field label="Telefon" type="tel" value={form.purchaserPhone} onChange={(v) => update("purchaserPhone", v)} />
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Hediye Edilecek Kişi</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Adı" value={form.recipientName} onChange={(v) => update("recipientName", v)} required />
          <Field label="E-posta" type="email" value={form.recipientEmail} onChange={(v) => update("recipientEmail", v)} required />
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Kişisel Mesajınız (opsiyonel)
        </span>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={3}
          placeholder="Doğum günün kutlu olsun! 🎉"
          className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
        />
      </label>

      {error && <p className="font-body text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:opacity-50"
      >
        {submitting ? "Gönderiliyor..." : `${formatTL(finalAmount)} Hediye Kartı Talep Et`}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}
