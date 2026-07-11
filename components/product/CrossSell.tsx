import Link from "next/link";
import Image from "next/image";

type Theme = "apollo" | "helios";

const otherProduct: Record<
  Theme,
  { name: string; tagline: string; href: string; image: string; price: string }
> = {
  apollo: {
    name: "Helios",
    tagline: "Gündüzün Taşıyıcısı",
    href: "/helios",
    image: "/images/helios-hero.jpg",
    price: "4.200 TL'den başlıyor",
  },
  helios: {
    name: "Apollo",
    tagline: "Işığın Efendisi",
    href: "/apollo",
    image: "/images/apollo-hero.jpg",
    price: "7.500 TL'den başlıyor",
  },
};

export default function CrossSell({ current }: { current: Theme }) {
  const other = otherProduct[current];

  return (
    <Link
      href={other.href}
      className="group flex items-center gap-5 rounded-2xl border border-abyss-border bg-abyss-surface p-4 transition-colors hover:border-aqua/40 sm:p-5"
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <Image
          src={other.image}
          alt={other.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Diğer Ürünümüz
        </p>
        <p className="mt-1 font-display text-xl text-ink">{other.name}</p>
        <p className="font-body text-xs text-ink-muted">{other.tagline} · {other.price}</p>
      </div>
      <span className="flex-shrink-0 font-body text-sm text-aqua opacity-0 transition-opacity group-hover:opacity-100">
        İncele →
      </span>
    </Link>
  );
}
