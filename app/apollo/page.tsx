export default function ApolloPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-apollo-bg">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-apollo-gold">
          Işığın Efendisi
        </p>
        <h1 className="font-display text-6xl text-apollo-text md:text-7xl">
          Apollo
        </h1>
        <p className="mt-6 max-w-lg font-body text-base text-apollo-muted">
          Ürün sayfası yapım aşamasında — tam spektrum, 6.500K–18.000K ayarlanabilir
          renk sıcaklığı, Wi-Fi kontrol ve gün doğumu/gün batımı otomasyonu ile
          çok yakında burada.
        </p>
      </section>
    </div>
  );
}
