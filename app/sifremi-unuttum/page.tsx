"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import DecorativeGlow from "@/components/DecorativeGlow";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/sifre-guncelle`,
    });

    setLoading(false);

    if (error) {
      setError("Bir sorun oluştu, lütfen tekrar deneyin.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="font-display text-4xl text-ink">Şifremi Unuttum</h1>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-aqua/30 bg-aqua/5 p-6">
            <p className="font-body text-sm leading-relaxed text-ink-muted">
              <span className="font-medium text-ink">{email}</span> adresine bir şifre sıfırlama
              bağlantısı gönderdik. Gelen kutunuzu (ve gereksiz/spam klasörünü) kontrol edin.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Hesabınıza kayıtlı e-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  E-posta
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
                />
              </label>

              {error && <p className="font-body text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center font-body text-sm text-ink-muted">
          <Link href="/giris" className="text-aqua hover:underline">
            Giriş sayfasına dön
          </Link>
        </p>
      </section>
    </div>
  );
}
