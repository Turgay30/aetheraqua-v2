"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_text: string;
  is_default: boolean;
};

export default function AddressBook({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ label: "Ev", recipientName: "", phone: "", addressText: "" });
  const [saving, setSaving] = useState(false);

  async function loadAddresses() {
    const supabase = createClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("addresses").insert({
      user_id: userId,
      label: form.label,
      recipient_name: form.recipientName,
      phone: form.phone,
      address_text: form.addressText,
      is_default: addresses.length === 0,
    });
    setForm({ label: "Ev", recipientName: "", phone: "", addressText: "" });
    setFormOpen(false);
    setSaving(false);
    loadAddresses();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    loadAddresses();
  }

  async function handleSetDefault(id: string) {
    const supabase = createClient();
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    loadAddresses();
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Adres Defterim
        </h2>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="font-body text-xs text-aqua hover:underline"
        >
          {formOpen ? "İptal" : "+ Yeni Adres"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Etiket (Ev, İş...)"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
              required
            />
            <input
              placeholder="Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
              required
            />
          </div>
          <input
            placeholder="Ad Soyad"
            value={form.recipientName}
            onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
            required
          />
          <textarea
            placeholder="Adres"
            value={form.addressText}
            onChange={(e) => setForm({ ...form, addressText: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-gold px-5 py-2 font-body text-xs font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Adresi Kaydet"}
          </button>
        </form>
      )}

      {addresses.length === 0 && !formOpen ? (
        <p className="mt-4 font-body text-sm text-ink-muted">Henüz kayıtlı adresiniz yok.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                addr.is_default
                  ? "border-gold/40 bg-gold/[0.04]"
                  : "border-abyss-border bg-abyss-surface"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                    addr.is_default ? "bg-gold/15 text-gold" : "bg-abyss text-ink-faint"
                  }`}
                >
                  <PinIcon />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-body text-sm font-semibold text-ink">{addr.label}</p>
                    {addr.is_default && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-body text-xs text-ink-muted">
                    {addr.recipient_name} · {addr.phone}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink-faint">{addr.address_text}</p>
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col gap-1.5 text-right">
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="font-body text-[11px] text-aqua hover:underline"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="font-body text-[11px] text-ink-faint hover:text-red-400"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21s-7-6.5-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.5 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
