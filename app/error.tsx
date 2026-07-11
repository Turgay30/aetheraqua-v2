"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-abyss px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-red-400">Bir Sorun Oluştu</p>
      <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
        Sular Bulanıklaştı
      </h1>
      <p className="mt-4 max-w-md font-body text-sm text-ink-muted">
        Beklenmedik bir hata oluştu. Sayfayı yeniden yüklemeyi deneyebilirsiniz.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.03]"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
