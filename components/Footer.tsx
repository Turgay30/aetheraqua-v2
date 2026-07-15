import Link from "next/link";

const columns = [
  {
    title: "Ürünler",
    links: [
      { href: "/apollo", label: "Apollo" },
      { href: "/helios", label: "Helios" },
      { href: "/apollo-vs-helios", label: "Apollo mu Helios mu?" },
      { href: "/akvaryum-asistani", label: "Akvaryum Asistanı" },
      { href: "/hediye-karti", label: "Hediye Kartı" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/akvaryum-kutuphanesi", label: "Akvaryum Kütüphanesi" },
      { href: "/musteri-galerisi", label: "Müşteri Galerisi" },
      { href: "/toptan-satis", label: "Toptan Satış" },
      { href: "/sss", label: "Sıkça Sorulan Sorular" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/sepet", label: "Sepet" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
      { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-abyss-border bg-abyss">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-lg tracking-[0.15em] text-ink-muted">
              AETHER<span className="text-aqua">AQUA</span>
            </p>
            <p className="mt-3 max-w-[220px] font-body text-xs leading-relaxed text-ink-faint">
              Mitolojiden ilham alan, profesyonel akvaryum aydınlatmaları.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-ink-muted transition-colors hover:text-aqua"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-abyss-border pt-6">
          <p className="font-body text-xs text-ink-faint">
            © {new Date().getFullYear()} AetherAqua. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
