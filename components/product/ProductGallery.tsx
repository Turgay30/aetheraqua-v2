"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
  theme,
}: {
  images: string[];
  alt: string;
  theme: "apollo" | "helios";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const borderColor = theme === "apollo" ? "border-apollo-gold/15" : "border-helios-line";

  return (
    <div>
      <button
        onClick={() => setZoomOpen(true)}
        aria-label="Görseli büyüt"
        className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border ${borderColor} cursor-zoom-in`}
      >
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-abyss/70 text-ink backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIcon />
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              aria-label={`Görsel ${i + 1}`}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === activeIndex ? "border-aqua" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-abyss/95 p-6 backdrop-blur-sm"
        >
          <button
            onClick={() => setZoomOpen(false)}
            aria-label="Kapat"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-abyss-border text-ink hover:border-aqua hover:text-aqua"
          >
            <CloseIcon />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image src={images[activeIndex]} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

function ZoomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35M11 8v6M8 11h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
