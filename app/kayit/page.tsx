"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DecorativeGlow from "@/components/DecorativeGlow";

export default function KayitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Bu e-posta adresi zaten kayıtlı."
          : "Kayıt sırasında bir sorun oluştu, lütfen tekrar deneyin."
      );
      return;
    }

    router.push("/hesabim");
    router.refresh();
  }

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="font-display text-4xl text-ink">Hesap Oluştur</h1>
        <p className="mt-2 font-body text-sm text-ink-muted">
          Siparişlerinizi takip etmek için ücretsiz bir hesap oluşturun.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field label="Ad Soyad" value={name} onChange={setName} required />
          <Field label="E-posta" type="email" value={email} onChange={setEmail} required />
          <Field
            label="Şifre"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-ink-muted">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-aqua hover:underline">
            Giriş yapın
          </Link>
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-abyss-border bg-abyss-surface px-4 py-2.5 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}
