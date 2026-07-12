"use client";

import { useToast } from "@/components/ToastProvider";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CouponRow = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  is_active: boolean;
  expires_at: string | null;
  usage_limit: number | null;
  times_used: number;
};

export default function CouponManager() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRow[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: "10",
    expiresAt: "",
    usageLimit: "",
  });

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("coupons").insert({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      expires_at: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
    });
    setSaving(false);

    if (error) {
      showToast("Kupon eklenirken bir sorun oluştu: " + error.message, "error");
      return;
    }

    setFormOpen(false);
    setForm({ code: "", type: "percent", value: "10", expiresAt: "", usageLimit: "" });
    showToast("Kupon oluşturuldu", "success");
    load();
  }

  async function toggleActive(code: string, isActive: boolean) {
    const supabase = createClient();
    await supabase.from("coupons").update({ is_active: !isActive }).eq("code", code);
    showToast(isActive ? "Kupon pasif yapıldı" : "Kupon aktif yapıldı", "success");
    load();
  }

  async function handleDelete(code: string) {
    if (!confirm(`"${code}" kuponunu silmek istediğinize emin misiniz?`)) return;
    const supabase = createClient();
    await supabase.from("coupons").delete().eq("code", code);
    showToast("Kupon silindi", "success");
    load();
  }

  if (coupons === null) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Kuponlar ({coupons.length})
        </h2>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Kupon"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Kod</span>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                placeholder="YAZ2026"
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-mono text-sm uppercase text-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Tür</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              >
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit Tutar (TL)</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Değer</span>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Son Tarih</span>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Kullanım Limiti</span>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Sınırsız"
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kuponu Oluştur"}
          </button>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {coupons.map((c) => (
          <div key={c.code} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-abyss-border bg-abyss-surface p-4">
            <div>
              <p className="font-mono text-sm text-aqua">{c.code}</p>
              <p className="font-body text-xs text-ink-muted">
                {c.type === "percent" ? `%${c.value} indirim` : `${c.value} TL indirim`}
                {c.usage_limit && ` · ${c.times_used}/${c.usage_limit} kullanıldı`}
                {c.expires_at && ` · ${new Date(c.expires_at).toLocaleDateString("tr-TR")} son tarih`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(c.code, c.is_active)}
                className={`rounded-full px-3 py-1 font-body text-xs ${
                  c.is_active ? "bg-emerald-400/10 text-emerald-400" : "bg-abyss text-ink-faint"
                }`}
              >
                {c.is_active ? "Aktif" : "Pasif"}
              </button>
              <button onClick={() => handleDelete(c.code)} className="text-ink-faint hover:text-red-400">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
