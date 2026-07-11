import Image from "next/image";
import Link from "next/link";

type Variant = "apollo" | "helios";

const variantStyles: Record<
  Variant,
  {
    bg: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    button: string;
  }
> = {
  apollo: {
    bg: "bg-apollo-bg",
    border: "border-apollo-gold/20",
    text: "text-apollo-text",
    muted: "text-apollo-muted",
    accent: "text-apollo-gold",
    button: "bg-apollo-gold text-apollo-bg hover:bg-apollo-gold/90",
  },
  helios: {
    bg: "bg-helios-surface",
    border: "border-helios-line",
    text: "text-helios-text",
    muted: "text-helios-muted",
    accent: "text-helios-bronze",
    button: "bg-helios-bronze text-helios-surface hover:bg-helios-bronze/90",
  },
};

export default function ProductCard({
  variant,
  name,
  tagline,
  specs,
  startingPrice,
  imageSrc,
  href,
}: {
  variant: Variant;
  name: string;
  tagline: string;
  specs: string[];
  startingPrice: string;
  imageSrc: string;
  href: string;
}) {
  const s = variantStyles[variant];

  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${s.border} ${s.bg} transition-transform duration-300 hover:-translate-y-1`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${s.accent}`}>
          {tagline}
        </p>
        <h3 className={`mt-2 font-display text-4xl ${s.text}`}>{name}</h3>

        <ul className={`mt-4 flex flex-wrap gap-x-4 gap-y-1.5 font-body text-xs ${s.muted}`}>
          {specs.map((spec) => (
            <li key={spec} className="flex items-center gap-1.5">
              <span className={`h-1 w-1 rounded-full ${s.accent} bg-current`} />
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <p className={`font-body text-sm ${s.muted}`}>
            30cm&apos;den başlıyor
            <span className={`ml-2 font-display text-xl ${s.text}`}>
              {startingPrice}
            </span>
          </p>
          <span
            className={`rounded-full px-5 py-2 font-body text-xs font-semibold transition-colors ${s.button}`}
          >
            İncele
          </span>
        </div>
      </div>
    </Link>
  );
}
