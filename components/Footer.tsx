import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-abyss-border bg-abyss">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg tracking-[0.15em] text-ink-muted">
          AETHER<span className="text-aqua">AQUA</span>
        </p>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 font-body text-sm text-ink-faint">
          <li>
            <Link href="/apollo" className="hover:text-aqua transition-colors">
              Apollo
            </Link>
          </li>
          <li>
            <Link href="/helios" className="hover:text-aqua transition-colors">
              Helios
            </Link>
          </li>
          <li>
            <Link href="/akvaryum-asistani" className="hover:text-aqua transition-colors">
              Akvaryum Asistanı
            </Link>
          </li>
          <li>
            <Link href="/sepet" className="hover:text-aqua transition-colors">
              Sepet
            </Link>
          </li>
        </ul>
        <p className="font-body text-xs text-ink-faint">
          © {new Date().getFullYear()} AetherAqua. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
