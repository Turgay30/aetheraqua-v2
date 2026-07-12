"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { hexToRgba } from "@/lib/color-utils";
import { useIsInView } from "@/lib/useIsInView";
import MobileStickyBar from "@/components/product/MobileStickyBar";
import {
  SIZES_CM,
  CASE_COLORS,
  calcListPrice,
  calcSalePrice,
  calcDiscount,
  formatTL,
} from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { trackRecentlyViewed } from "@/lib/recentlyViewed";
import { buildWhatsAppLink } from "@/lib/contact";
import { useAuth } from "@/components/auth/AuthProvider";
import FavoriteButton from "@/components/product/FavoriteButton";
import DecorativeGlow from "@/components/DecorativeGlow";
import GhostBackground from "@/components/GhostBackground";
import StarRating from "@/components/product/StarRating";

export type DynamicProduct = {
  product_id: string;
  name: string;
  tagline: string;
  description: string;
  accent_color: string;
  images: string[];
  features: string[];
  tech_specs: { label: string; value: string }[];
  mythology_title: string;
  mythology_paragraphs: string[];
  base_price: number;
};

export default function DynamicProductView({ product }: { product: DynamicProduct }) {
  const accent = product.accent_color;
  const softBorder = { borderColor: hexToRgba(accent, 0.2) };

  useEffect(() => {
    trackViewItem({ id: product.product_id, name: product.name, price: product.base_price });
    if (product.images[0]) {
      trackRecentlyViewed({
        id: product.product_id,
        name: product.name,
        price: product.base_price,
        image: product.images[0],
        href: `/urun/${product.product_id}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <GhostBackground opacity={0.08} />
      <DecorativeGlow />
      <div className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em]" style={{ color: accent }}>
              {product.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <h1 className="font-display text-6xl text-ink md:text-7xl">{product.name}</h1>
              <FavoriteButton productId={product.product_id as "apollo" | "helios"} className="border border-abyss-border !bg-transparent" />
            </div>
            <div className="mt-2">
              <RatingSummary productId={product.product_id} />
            </div>
            <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-ink-muted">
              {product.description}
            </p>
            <div className="mt-7">
              <a
                href={buildWhatsAppLink(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm transition-colors"
                style={{ ...softBorder, color: accent }}
              >
                WhatsApp&apos;tan Hızlı Bilgi Al
              </a>
            </div>
          </div>

          <Gallery images={product.images} alt={product.name} borderStyle={softBorder} />
        </section>

        {/* Özellikler */}
        {product.features.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border bg-abyss-surface/60 px-5 py-4"
                  style={softBorder}
                >
                  <span className="mt-0.5" style={{ color: accent }}>✦</span>
                  <span className="font-body text-sm text-ink">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Teknik özellikler + Konfigüratör */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-8 md:grid-cols-2">
            {product.tech_specs.length > 0 && (
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
                  Teknik Özellikler
                </p>
                <dl className="divide-y rounded-2xl border" style={softBorder}>
                  {product.tech_specs.map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-6 py-4" style={{ borderColor: hexToRgba(accent, 0.15) }}>
                      <dt className="font-body text-sm text-ink-muted">{row.label}</dt>
                      <dd className="font-body text-sm font-medium text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
                Boy & Kasa Rengi Seçin
              </p>
              <Configurator product={product} accent={accent} />
            </div>
          </div>
        </section>

        {/* Mitolojik İlham */}
        {product.mythology_paragraphs.length > 0 && (
          <section className="border-t px-6 py-24" style={{ borderColor: hexToRgba(accent, 0.1) }}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                Mitolojik İlham
              </p>
              <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                {product.mythology_title}
              </h2>
              <div className="mt-6 space-y-4">
                {product.mythology_paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-[15px] leading-relaxed text-ink-muted">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Değerlendirmeler */}
        <section className="mx-auto max-w-2xl px-6 pb-24">
          <Reviews productId={product.product_id} accent={accent} />
        </section>
      </div>
    </div>
  );
}

function Gallery({
  images,
  alt,
  borderStyle,
}: {
  images: string[];
  alt: string;
  borderStyle: React.CSSProperties;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-abyss-surface" style={borderStyle} />
    );
  }

  return (
    <div>
      <button
        onClick={() => setZoomOpen(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border cursor-zoom-in"
        style={borderStyle}
      >
        <Image src={images[activeIndex]} alt={alt} fill className="object-cover" priority sizes="(min-width: 768px) 50vw, 100vw" />
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${
                i === activeIndex ? "opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoomOpen && (
        <div onClick={() => setZoomOpen(false)} className="fixed inset-0 z-[60] flex items-center justify-center bg-abyss/95 p-6 backdrop-blur-sm">
          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image src={images[activeIndex]} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

function Configurator({ product, accent }: { product: DynamicProduct; accent: string }) {
  const [size, setSize] = useState<number>(SIZES_CM[0]);
  const [colorId, setColorId] = useState<string>(CASE_COLORS[0].id);
  const [justAdded, setJustAdded] = useState(false);
  const [stockQty, setStockQty] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number>(product.base_price);
  const { addLine } = useCart();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const buttonInView = useIsInView(addButtonRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("base_price")
      .eq("product_id", product.product_id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.base_price) setLivePrice(Number(data.base_price));
      });
  }, [product.product_id]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("stock")
      .select("quantity")
      .eq("product_id", product.product_id)
      .eq("size", size)
      .single()
      .then(({ data }) => setStockQty(data ? data.quantity : null));
  }, [product.product_id, size]);

  const listPrice = useMemo(() => calcListPrice(livePrice, size), [livePrice, size]);
  const discount = useMemo(() => calcDiscount(size), [size]);
  const salePrice = useMemo(() => calcSalePrice(livePrice, size), [livePrice, size]);
  const selectedColor = CASE_COLORS.find((c) => c.id === colorId)!;

  function handleAddToCart() {
    addLine({
      key: `${product.product_id}-${size}-${colorId}`,
      productId: product.product_id as "apollo" | "helios",
      productName: product.name,
      size,
      colorId,
      colorLabel: selectedColor.label,
      colorHex: selectedColor.hex,
      unitPrice: salePrice,
      image: product.images[0] ?? "",
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    trackAddToCart({ id: product.product_id, name: product.name, price: salePrice }, 1);
  }

  return (
    <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: hexToRgba(accent, 0.2) }}>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">Boy Seçin</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {SIZES_CM.map((cm) => (
            <button
              key={cm}
              onClick={() => setSize(cm)}
              className="rounded-lg border px-2 py-2 font-body text-sm transition-colors"
              style={
                size === cm
                  ? { borderColor: accent, backgroundColor: hexToRgba(accent, 0.1), color: accent }
                  : { borderColor: hexToRgba(accent, 0.2), color: "#8B97A6" }
              }
            >
              {cm}cm
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
          Kasa Rengi — {selectedColor.label}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {CASE_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setColorId(color.id)}
              aria-label={color.label}
              className="h-9 w-9 rounded-full border-2 transition-all"
              style={{
                backgroundColor: color.hex,
                borderColor: colorId === color.id ? accent : "transparent",
                transform: colorId === color.id ? "scale(1.1)" : undefined,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 border-t pt-6" style={{ borderColor: hexToRgba(accent, 0.2) }}>
        <div className="flex items-end gap-3">
          {discount > 0 && (
            <span className="font-body text-sm text-ink-muted line-through">{formatTL(listPrice)}</span>
          )}
          <span className="font-display text-3xl text-ink">{formatTL(salePrice)}</span>
        </div>
        {discount > 0 && (
          <p className="mt-1 font-body text-xs" style={{ color: accent }}>
            {formatTL(discount)} tasarruf — {size}cm boyda
          </p>
        )}

        {stockQty !== null && (
          <p
            className="mt-3 font-body text-xs font-semibold"
            style={{ color: stockQty === 0 ? "#f87171" : stockQty <= 5 ? "#C9A227" : "#34d399" }}
          >
            {stockQty === 0 ? "Tükendi" : stockQty <= 5 ? `Son ${stockQty} adet` : "Stokta"}
          </p>
        )}

        <button
          ref={addButtonRef}
          onClick={handleAddToCart}
          disabled={stockQty === 0}
          className="mt-5 w-full rounded-full py-3.5 font-body text-sm font-semibold text-abyss transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: accent }}
        >
          {stockQty === 0 ? "Stokta Yok" : justAdded ? "Sepete Eklendi ✓" : `${product.name} ${size}cm — Sepete Ekle`}
        </button>
      </div>

      <MobileStickyBar
        visible={!buttonInView}
        productName={product.name}
        size={size}
        price={salePrice}
        disabled={stockQty === 0}
        justAdded={justAdded}
        onAdd={handleAddToCart}
        accentClass="text-abyss"
        accentStyle={{ backgroundColor: accent }}
      />
    </div>
  );
}

function RatingSummary({ productId }: { productId: string }) {
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setAvg(data.reduce((s, r) => s + r.rating, 0) / data.length);
        setCount(data.length);
      });
  }, [productId]);

  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={avg ?? 0} size={14} />
      <span className="font-body text-xs text-ink-muted">{avg?.toFixed(1)} ({count} değerlendirme)</span>
    </div>
  );
}

function Reviews({ productId, accent }: { productId: string; accent: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<
    { id: string; user_id: string; reviewer_name: string; rating: number; comment: string | null; created_at: string }[] | null
  >(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
    setReviews(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (reviews === null) return null;
  const average = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("reviews").upsert(
      {
        product_id: productId,
        user_id: user.id,
        reviewer_name: (user.user_metadata?.full_name as string) || "Müşteri",
        rating,
        comment: comment.trim() || null,
      },
      { onConflict: "product_id,user_id" }
    );
    setSaving(false);
    setComment("");
    load();
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">Değerlendirmeler</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={average} size={14} />
            <span className="font-body text-xs text-ink-faint">{average.toFixed(1)} ({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border p-4" style={{ borderColor: hexToRgba(accent, 0.15) }}>
            <div className="flex items-center justify-between">
              <p className="font-body text-sm font-semibold text-ink">{r.reviewer_name}</p>
              <StarRating rating={r.rating} size={13} />
            </div>
            {r.comment && <p className="mt-2 font-body text-sm text-ink-muted">{r.comment}</p>}
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border p-5" style={{ borderColor: hexToRgba(accent, 0.15) }}>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className="p-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={n <= rating ? accent : "none"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={accent} strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi paylaşın (opsiyonel)"
            rows={3}
            className="mt-3 w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-full px-6 py-2.5 font-body text-xs font-semibold text-abyss disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {saving ? "Kaydediliyor..." : "Gönder"}
          </button>
        </form>
      ) : (
        <p className="mt-6 font-body text-sm text-ink-muted">Değerlendirme yazmak için giriş yapın.</p>
      )}
    </div>
  );
}
