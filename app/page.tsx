import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-abyss-gradient">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-aqua">
          Profesyonel Akvaryum Aydınlatması
        </p>
        <h1 className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
          Işık, tanrıların
          <br />
          <span className="text-gold">elinden çıkmış gibi.</span>
        </h1>
        <p className="mt-6 max-w-xl font-body text-base text-ink-muted md:text-lg">
          Apollo ve Helios — tam spektrum WRGB aydınlatma serisi. Akvaryumunuz
          için mitolojiden ilham alan iki farklı karakter, tek bir amaç: su
          altını gerçeğe en yakın haliyle aydınlatmak.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/apollo"
            className="rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.03]"
          >
            Apollo&apos;yu Keşfet
          </Link>
          <Link
            href="/helios"
            className="rounded-full border border-abyss-border px-8 py-3 font-body text-sm font-semibold text-ink transition-colors hover:border-aqua hover:text-aqua"
          >
            Helios&apos;u Keşfet
          </Link>
        </div>

        <Link
          href="/akvaryum-asistani"
          className="mt-16 font-body text-sm text-ink-faint underline decoration-abyss-border underline-offset-4 transition-colors hover:text-aqua hover:decoration-aqua"
        >
          Balıklarınız için doğru kurulumu bulun → Akvaryum Asistanı
        </Link>
      </section>
    </div>
  );
}
