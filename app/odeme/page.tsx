"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatTL } from "@/lib/pricing";

type Step = "form" | "summary" | "confirmed";

type OrderForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function OdemePage() {
  const { lines, totalPrice, clear, isLoaded } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", email: "", address: "" });
  const [orderNo, setOrderNo] = useState("");

  if (!isLoaded) return null;

  if (lines.length === 0 && step !== "confirmed") {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl text-ink md:text-5xl">Sepetiniz Boş</h1>
        <p className="mt-4 font-body text-base text-ink-muted">
          Ödeme adımına geçmeden önce sepetinize ürün ekleyin.
        </p>
        <Link
          href="/apollo"
          className="mt-8 rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-abyss"
        >
          Ürünleri İncele
        </Link>
      </section>
    );
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("summary");
  }

  function handleConfirm() {
    // NOT: Gerçek ödeme tahsilatı (iyzico/PayTR) ve sipariş kaydı
    // (Supabase) burada devreye girecek. Şimdilik sipariş simüle ediliyor.
    const generatedOrderNo = `AA-${Date.now().toString().slice(-8)}`;
    setOrderNo(generatedOrderNo);
    clear();
    setStep("confirmed");
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <Stepper step={step} />

      {step === "form" && (
        <form onSubmit={handleFormSubmit} className="mt-10 space-y-5">
          <Field
            label="Ad Soyad"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <Field
            label="Telefon"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            type="tel"
            required
          />
          <Field
            label="E-posta"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            type="email"
            required
          />
          <TextAreaField
            label="Teslimat Adresi"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            required
          />

          <button
            type="submit"
            className="w-full rounded-full bg-gold py-3.5 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01]"
          >
            Sipariş Özetine Geç
          </button>
        </form>
      )}

      {step === "summary" && (
        <div className="mt-10">
          <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              Teslimat Bilgileri
            </p>
            <div className="mt-3 space-y-1 font-body text-sm text-ink">
              <p>{form.name}</p>
              <p className="text-ink-muted">{form.phone} · {form.email}</p>
              <p className="text-ink-muted">{form.address}</p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-abyss-border rounded-2xl border border-abyss-border bg-abyss-surface">
            {lines.map((line) => (
              <div key={line.key} className="flex items-center justify-between px-6 py-4">
                <span className="font-body text-sm text-ink">
                  {line.productName} {line.size}cm ({line.colorLabel}) × {line.quantity}
                </span>
                <span className="font-body text-sm text-ink-muted">
                  {formatTL(line.unitPrice * line.quantity)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-body text-sm font-semibold text-ink">Toplam</span>
              <span className="font-display text-xl text-gold">{formatTL(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 rounded-full border border-abyss-border py-3 font-body text-sm text-ink hover:border-aqua hover:text-aqua"
            >
              Bilgileri Düzenle
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01]"
            >
              Siparişi Onayla
            </button>
          </div>
        </div>
      )}

      {step === "confirmed" && (
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aqua/10 text-aqua">
            <CheckIcon />
          </div>
          <h2 className="mt-6 font-display text-3xl text-ink">Siparişiniz Alındı</h2>
          <p className="mt-2 font-body text-sm text-ink-muted">
            Sipariş numaranız: <span className="text-aqua">{orderNo}</span>
          </p>
          <p className="mt-4 font-body text-sm text-ink-muted">
            En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-abyss-border px-6 py-2.5 font-body text-sm text-ink hover:border-aqua hover:text-aqua"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      )}
    </section>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "form", label: "Bilgiler" },
    { id: "summary", label: "Özet" },
    { id: "confirmed", label: "Onay" },
  ];
  const activeIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs ${
              i <= activeIndex ? "bg-gold text-abyss" : "border border-abyss-border text-ink-faint"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`font-body text-xs ${i <= activeIndex ? "text-ink" : "text-ink-faint"}`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="h-px w-8 bg-abyss-border" />}
        </div>
      ))}
    </div>
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
        className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
