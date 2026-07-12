"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/product/FavoriteButton";
import { createClient } from "@/lib/supabase/client";
import { formatTL } from "@/lib/pricing";

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
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [livePrice, setLivePrice] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("base_price")
      .eq("product_id", variant)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.base_price) setLivePrice(formatTL(Number(data.base_price)));
      });
  }, [variant]);

  const displayPrice = livePrice ?? startingPrice;

  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex flex-col overflow-hidden rounded-2xl border ${s.border} ${s.bg} transition-transform duration-300 hover:-translate-y-1`}
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
                {displayPrice}
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

      {/* Favori butonu — Link'in üzerinde ayrı, bağımsız bir buton */}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton productId={variant} />
      </div>

      {/* Hızlı Bakış — Link'in üzerinde ayrı, bağımsız bir buton */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setQuickViewOpen(true);
        }}
        className="absolute left-1/2 top-[38%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-abyss/80 px-5 py-2.5 font-body text-xs font-semibold text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
      >
        Hızlı Bakış
      </button>

      {quickViewOpen && (
        <QuickViewModal
          variant={variant}
          name={name}
          tagline={tagline}
          specs={specs}
          startingPrice={displayPrice}
          imageSrc={imageSrc}
          href={href}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </div>
  );
}

function QuickViewModal({
  variant,
  name,
  tagline,
  specs,
  startingPrice,
  imageSrc,
  href,
  onClose,
}: {
  variant: Variant;
  name: string;
  tagline: string;
  specs: string[];
  startingPrice: string;
  imageSrc: string;
  href: string;
  onClose: () => void;
}) {
  const s = variantStyles[variant];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-abyss/90 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative grid w-full max-w-2xl gap-0 overflow-hidden rounded-2xl border ${s.border} ${s.bg} sm:grid-cols-2`}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-abyss/70 text-ink hover:text-aqua"
        >
          <CloseIcon />
        </button>

        <div className="relative aspect-[4/3] sm:aspect-auto">
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        </div>

        <div className="flex flex-col p-7">
          <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${s.accent}`}>
            {tagline}
          </p>
          <h3 className={`mt-2 font-display text-3xl ${s.text}`}>{name}</h3>

          <ul className={`mt-4 space-y-1.5 font-body text-xs ${s.muted}`}>
            {specs.map((spec) => (
              <li key={spec} className="flex items-center gap-1.5">
                <span className={`h-1 w-1 rounded-full ${s.accent} bg-current`} />
                {spec}
              </li>
            ))}
          </ul>

          <p className={`mt-5 font-body text-sm ${s.muted}`}>
            30cm&apos;den başlıyor
            <span className={`ml-2 font-display text-xl ${s.text}`}>{startingPrice}</span>
          </p>

          <Link
            href={href}
            className={`mt-6 rounded-full py-3 text-center font-body text-sm font-semibold transition-colors ${s.button}`}
          >
            Ürün Sayfasına Git
          </Link>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
