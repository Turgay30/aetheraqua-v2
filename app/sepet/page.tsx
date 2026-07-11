"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatTL } from "@/lib/pricing";

export default function SepetPage() {
  const { lines, removeLine, setQuantity, totalPrice, isLoaded } = useCart();

  if (!isLoaded) return null;

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl text-ink md:text-5xl">Sepetiniz</h1>
        <p className="mt-6 font-body text-base text-ink-muted">
          Sepetiniz şu an boş.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/apollo"
            className="rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-abyss"
          >
            Apollo&apos;yu İncele
          </Link>
          <Link
            href="/helios"
            className="rounded-full border border-abyss-border px-6 py-2.5 font-body text-sm font-semibold text-ink hover:border-aqua hover:text-aqua"
          >
            Helios&apos;u İncele
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink md:text-5xl">Sepetiniz</h1>

      <div className="mt-10 divide-y divide-abyss-border border-y border-abyss-border">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={line.image} alt={line.productName} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-ink">
                {line.productName} — {line.size}cm
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-abyss-border"
                  style={{ backgroundColor: line.colorHex }}
                />
                <span className="font-body text-xs text-ink-muted">{line.colorLabel}</span>
              </div>
              <p className="mt-1 font-body text-xs text-ink-faint">
                Birim fiyat: {formatTL(line.unitPrice)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(line.key, line.quantity - 1)}
                disabled={line.quantity <= 1}
                aria-label="Adedi azalt"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-abyss-border text-ink-muted hover:text-aqua disabled:opacity-30"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-sm text-ink">{line.quantity}</span>
              <button
                onClick={() => setQuantity(line.key, line.quantity + 1)}
                aria-label="Adedi artır"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-abyss-border text-ink-muted hover:text-aqua"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-display text-lg text-ink">
              {formatTL(line.unitPrice * line.quantity)}
            </p>

            <button
              onClick={() => removeLine(line.key)}
              aria-label="Kaldır"
              className="text-ink-faint hover:text-red-400"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="font-body text-lg text-ink">
          Toplam: <span className="font-display text-3xl text-gold">{formatTL(totalPrice)}</span>
        </p>
        <Link
          href="/odeme"
          className="rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.03]"
        >
          Ödemeye Geç
        </Link>
      </div>
    </section>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7h16M9 7V4h6v3m-8 0l1 13h10l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
