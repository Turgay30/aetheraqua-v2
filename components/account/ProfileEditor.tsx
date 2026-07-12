"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileEditor({ userId }: { userId: string }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name ?? "");
        setPhone(data?.phone ?? "");
        setLoading(false);
      });
  }, [userId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").upsert({ id: userId, full_name: fullName, phone });
    // Auth kullanıcı meta verisini de güncelle (checkout'ta otomatik doldurmak için)
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return null;

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Ad Soyad
          </span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Telefon
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-full bg-gold px-6 py-2.5 font-body text-xs font-semibold text-abyss disabled:opacity-50"
      >
        {saving ? "Kaydediliyor..." : saved ? "Kaydedildi ✓" : "Bilgileri Kaydet"}
      </button>
    </form>
  );
}
