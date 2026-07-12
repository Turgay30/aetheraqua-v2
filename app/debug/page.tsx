"use client";

export default function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 font-mono text-xs text-ink">
      <h1 className="font-display text-2xl text-ink mb-6">Teşhis Sayfası (Geçici)</h1>

      <p className="mb-2">
        <span className="text-ink-faint">NEXT_PUBLIC_SUPABASE_URL:</span>
        <br />
        <span className={url ? "text-emerald-400" : "text-red-400"}>
          {url ? url : "TANIMLI DEĞİL (undefined)"}
        </span>
      </p>

      <p className="mb-2">
        <span className="text-ink-faint">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
        <br />
        <span className={key ? "text-emerald-400" : "text-red-400"}>
          {key ? `${key.slice(0, 20)}... (${key.length} karakter)` : "TANIMLI DEĞİL (undefined)"}
        </span>
      </p>

      <p className="mt-6 text-ink-muted">
        İkisi de yeşil ve doğru görünüyorsa ortam değişkenleri sorunlu değil —
        başka bir şeye bakmamız gerekiyor. Kırmızıysa, Vercel'deki ortam
        değişkenleri deploy'a yansımamış demektir.
      </p>
    </div>
  );
}
