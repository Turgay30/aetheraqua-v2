"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatTL } from "@/lib/pricing";
import { trackPurchase } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

type Step = "form" | "summary" | "confirmed";

type InvoiceType = "bireysel" | "kurumsal";

type OrderForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  invoiceType: InvoiceType;
  tckn: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
};

// Yasal metinler güncellendiğinde bu sürüm numarasını artırın —
// ileride veritabanı bağlandığında, hangi sürümün onaylandığı kayıt altına alınabilir.
const LEGAL_TEXT_VERSION = "2026-07-v1";

export default function OdemeContent() {
  const { lines, subtotal, totalPrice, coupon, couponDiscount, clear, isLoaded } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    invoiceType: "bireysel",
    tckn: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
  });
  const [orderNo, setOrderNo] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || (user.user_metadata?.full_name as string) || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

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

  async function handleConfirm() {
    setSaving(true);
    setSaveError(null);

    const generatedOrderNo = `AA-${Date.now().toString().slice(-8)}`;
    const supabase = createClient();

    const { data: insertedOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_no: generatedOrderNo,
        user_id: user?.id ?? null,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email,
        customer_address: form.address,
        invoice_type: form.invoiceType,
        tckn: form.invoiceType === "bireysel" ? form.tckn : null,
        company_name: form.invoiceType === "kurumsal" ? form.companyName : null,
        tax_office: form.invoiceType === "kurumsal" ? form.taxOffice : null,
        tax_number: form.invoiceType === "kurumsal" ? form.taxNumber : null,
        subtotal,
        coupon_code: coupon?.code ?? null,
        coupon_discount: couponDiscount,
        total: totalPrice,
        legal_text_version: LEGAL_TEXT_VERSION,
        consent_accepted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (orderError || !insertedOrder) {
      setSaving(false);
      setSaveError("Sipariş kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      lines.map((line) => ({
        order_id: insertedOrder.id,
        product_id: line.productId,
        product_name: line.productName,
        size: line.size,
        color_id: line.colorId,
        color_label: line.colorLabel,
        unit_price: line.unitPrice,
        quantity: line.quantity,
      }))
    );

    setSaving(false);

    if (itemsError) {
      setSaveError("Sipariş kalemleri kaydedilirken bir sorun oluştu.");
      return;
    }

    // NOT: Gerçek ödeme tahsilatı (iyzico) burada devreye girecek.
    trackPurchase(generatedOrderNo, totalPrice, lines.length);
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

          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Fatura Türü
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, invoiceType: "bireysel" })}
                className={`flex-1 rounded-lg border py-2.5 font-body text-sm transition-colors ${
                  form.invoiceType === "bireysel"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-abyss-border text-ink-muted hover:border-ink-faint"
                }`}
              >
                Bireysel
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, invoiceType: "kurumsal" })}
                className={`flex-1 rounded-lg border py-2.5 font-body text-sm transition-colors ${
                  form.invoiceType === "kurumsal"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-abyss-border text-ink-muted hover:border-ink-faint"
                }`}
              >
                Kurumsal
              </button>
            </div>
          </div>

          {form.invoiceType === "bireysel" ? (
            <Field
              label="TCKN"
              value={form.tckn}
              onChange={(v) => setForm({ ...form, tckn: v })}
              required
            />
          ) : (
            <div className="space-y-5">
              <Field
                label="Şirket Unvanı"
                value={form.companyName}
                onChange={(v) => setForm({ ...form, companyName: v })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Vergi Dairesi"
                  value={form.taxOffice}
                  onChange={(v) => setForm({ ...form, taxOffice: v })}
                  required
                />
                <Field
                  label="Vergi No"
                  value={form.taxNumber}
                  onChange={(v) => setForm({ ...form, taxNumber: v })}
                  required
                />
              </div>
            </div>
          )}

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
              <p className="text-ink-muted">
                {form.invoiceType === "bireysel"
                  ? `Bireysel Fatura — TCKN: ${form.tckn}`
                  : `Kurumsal Fatura — ${form.companyName} · ${form.taxOffice} V.D. · ${form.taxNumber}`}
              </p>
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
            {coupon && (
              <>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="font-body text-sm text-ink-muted">Ara toplam</span>
                  <span className="font-body text-sm text-ink-muted">{formatTL(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="font-body text-sm text-aqua">Kupon ({coupon.code})</span>
                  <span className="font-body text-sm text-aqua">−{formatTL(couponDiscount)}</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-body text-sm font-semibold text-ink">Toplam</span>
              <span className="font-display text-xl text-gold">{formatTL(totalPrice)}</span>
            </div>
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-xl border border-abyss-border bg-abyss-surface px-4 py-3.5">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold"
            />
            <span className="font-body text-xs leading-relaxed text-ink-muted">
              <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-aqua hover:underline">
                Mesafeli Satış Sözleşmesi&apos;ni
              </Link>{" "}
              ve{" "}
              <Link href="/gizlilik-politikasi" target="_blank" className="text-aqua hover:underline">
                Gizlilik Politikası&apos;nı
              </Link>{" "}
              okudum, kabul ediyorum.
            </span>
          </label>

          {saveError && (
            <p className="mt-3 font-body text-sm text-red-400">{saveError}</p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setStep("form")}
              disabled={saving}
              className="flex-1 rounded-full border border-abyss-border py-3 font-body text-sm text-ink hover:border-aqua hover:text-aqua disabled:opacity-40"
            >
              Bilgileri Düzenle
            </button>
            <button
              onClick={handleConfirm}
              disabled={!consentAccepted || saving}
              className="flex-1 rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {saving ? "Kaydediliyor..." : "Siparişi Onayla"}
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
