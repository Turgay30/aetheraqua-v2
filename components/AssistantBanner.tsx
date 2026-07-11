import Link from "next/link";

export default function AssistantBanner() {
  return (
    <Link
      href="/akvaryum-asistani"
      className="group relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface px-8 py-14 text-center transition-colors hover:border-aqua/40 md:flex-row md:text-left"
    >
      <div className="pointer-events-none absolute inset-0 bg-abyss-gradient opacity-70" />

      <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-aqua/30 bg-aqua/10">
        <WaveIcon />
      </div>

      <div className="relative flex-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-aqua">
          Ücretsiz Araç
        </p>
        <h3 className="mt-2 font-display text-3xl text-ink md:text-4xl">
          Akvaryum Asistanı
        </h3>
        <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
          Tank ölçünüzü girin, balıklarınızı seçin — uyumluluk, stoklama
          yoğunluğu ve önerilen ekipmanları saniyeler içinde görün.
        </p>
      </div>

      <span className="relative flex-shrink-0 rounded-full border border-aqua/40 px-6 py-3 font-body text-sm font-semibold text-aqua transition-colors group-hover:bg-aqua group-hover:text-abyss">
        Hemen Dene →
      </span>
    </Link>
  );
}

function WaveIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 8c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="text-aqua"
      />
      <path
        d="M2 13c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
        className="text-aqua"
      />
      <path
        d="M2 18c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.25"
        className="text-aqua"
      />
    </svg>
  );
}
