"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";

export default function PasswordChangeForm({ email }: { email: string }) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("Yeni şifreler eşleşmiyor.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Yeni şifre en az 6 karakter olmalı.", "error");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // Mevcut şifreyi doğrula
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyError) {
      setSaving(false);
      showToast("Mevcut şifreniz yanlış.", "error");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      showToast("Şifre güncellenirken bir sorun oluştu.", "error");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Şifreniz güncellendi", "success");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Mevcut Şifre
          </span>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Yeni Şifre
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Yeni Şifre (Tekrar)
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-full bg-gold px-6 py-2.5 font-body text-xs font-semibold text-abyss disabled:opacity-50"
      >
        {saving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}
