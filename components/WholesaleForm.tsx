"use client";

import { useState } from "react";

export default function WholesaleForm() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    city: "",
    estimatedQuantity: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/wholesale-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      <div className="rounded-2xl border border-aqua/30 bg-aqua/5 p-6">
        <p className="font-body text-sm leading-relaxed text-ink-muted">
          Talebiniz alındı ✓ En kısa sürede <span className="text-ink">{form.contactName}</span>{" "}
          ile iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İşletme Adı" value={form.businessName} onChange={(v) => update("businessName", v)} required />
        <Field label="Yetkili Kişi" value={form.contactName} onChange={(v) => update("contactName", v)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required />
        <Field label="E-posta" type="email" value={form.email} onChange={(v) => update("email", v)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Şehir" value={form.city} onChange={(v) => update("city", v)} />
        <Field
          label="Tahmini Aylık Adet"
          value={form.estimatedQuantity}
          onChange={(v) => update("estimatedQuantity", v)}
        />
      </div>
      <label className="block">
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Mesajınız (opsiyonel)
        </span>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
        />
      </label>

      {error && <p className="font-body text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:opacity-50"
      >
        {submitting ? "Gönderiliyor..." : "Talep Gönder"}
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
