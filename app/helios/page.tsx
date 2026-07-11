export default function HeliosPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-helios-bg">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-helios-bronze">
          Gündüzün Taşıyıcısı
        </p>
        <h1 className="font-display text-6xl text-helios-text md:text-7xl">
          Helios
        </h1>
        <p className="mt-6 max-w-lg font-body text-base text-helios-muted">
          Ürün sayfası yapım aşamasında — sabit 8.000K çıkış, manuel kademe ve
          zamanlayıcı özellikleriyle çok yakında burada.
        </p>
      </section>
    </div>
  );
}
