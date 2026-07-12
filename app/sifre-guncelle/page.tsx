"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import DecorativeGlow from "@/components/DecorativeGlow";

export default function SifreGuncellePage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Şifre güncellenirken bir sorun oluştu, lütfen tekrar deneyin.");
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/hesabim");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="font-display text-4xl text-ink">Yeni Şifre Belirle</h1>

        {hasSession === false && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <p className="font-body text-sm leading-relaxed text-ink-muted">
              Bu bağlantının süresi dolmuş veya geçersiz görünüyor. Lütfen{" "}
              <Link href="/sifremi-unuttum" className="text-aqua hover:underline">
                yeni bir sıfırlama bağlantısı
              </Link>{" "}
              isteyin.
            </p>
          </div>
        )}

        {hasSession && !done && (
          <>
            <p className="mt-2 font-body text-sm text-ink-muted">Hesabınız için yeni bir şifre belirleyin.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Yeni Şifre
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
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
                  className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
                />
              </label>

              {error && <p className="font-body text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? "Güncelleniyor..." : "Şifremi Güncelle"}
              </button>
            </form>
          </>
        )}

        {done && (
          <div className="mt-8 rounded-2xl border border-aqua/30 bg-aqua/5 p-6">
            <p className="font-body text-sm text-ink-muted">
              Şifreniz güncellendi ✓ Hesabım sayfasına yönlendiriliyorsunuz...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
