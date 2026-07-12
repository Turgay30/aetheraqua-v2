"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SIZES_CM,
  CASE_COLORS,
  calcListPrice,
  calcSalePrice,
  calcDiscount,
  formatTL,
} from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { trackAddToCart } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { useIsInView } from "@/lib/useIsInView";
import MobileStickyBar from "@/components/product/MobileStickyBar";

type Theme = "apollo" | "helios";

const themeStyles: Record<
  Theme,
  {
    text: string;
    muted: string;
    accent: string;
    chipActive: string;
    chipIdle: string;
    button: string;
    border: string;
    bg: string;
  }
> = {
  apollo: {
    text: "text-apollo-text",
    muted: "text-apollo-muted",
    accent: "text-apollo-gold",
    chipActive: "border-apollo-gold bg-apollo-gold/10 text-apollo-gold",
    chipIdle: "border-apollo-gold/20 text-apollo-muted hover:border-apollo-gold/50",
    button: "bg-apollo-gold text-apollo-bg hover:bg-apollo-gold/90",
    border: "border-apollo-gold/20",
    bg: "",
  },
  helios: {
    text: "text-helios-text",
    muted: "text-helios-muted",
    accent: "text-helios-bronze",
    chipActive: "border-helios-bronze bg-helios-bronze/10 text-helios-bronze",
    chipIdle: "border-helios-line text-helios-muted hover:border-helios-bronze/50",
    button: "bg-helios-bronze text-helios-surface hover:bg-helios-bronze/90",
    border: "border-helios-line",
    bg: "bg-helios-surface",
  },
};

export default function ProductConfigurator({
  theme,
  basePrice,
  productName,
  imageSrc,
}: {
  theme: Theme;
  basePrice: number;
  productName: string;
  imageSrc: string;
}) {
  const [size, setSize] = useState<number>(SIZES_CM[0]);
  const [colorId, setColorId] = useState<string>(CASE_COLORS[0].id);
  const [justAdded, setJustAdded] = useState(false);
  const [stockQty, setStockQty] = useState<number | null>(null);
  const [stockLoading, setStockLoading] = useState(true);
  const [livePrice, setLivePrice] = useState<number>(basePrice);
  const { addLine } = useCart();
  const s = themeStyles[theme];
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const buttonInView = useIsInView(addButtonRef as React.RefObject<HTMLElement>);

  // Fiyatı veritabanından çek — admin panelden güncellenmiş olabilir.
  // Bulunamazsa (henüz şema çalıştırılmadıysa) prop'taki varsayılana düşer.
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("base_price")
      .eq("product_id", theme)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.base_price) setLivePrice(Number(data.base_price));
      });
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    setStockLoading(true);
    const supabase = createClient();
    supabase
      .from("stock")
      .select("quantity")
      .eq("product_id", theme)
      .eq("size", size)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setStockQty(data ? data.quantity : null);
        setStockLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [theme, size]);

  const listPrice = useMemo(() => calcListPrice(livePrice, size), [livePrice, size]);
  const discount = useMemo(() => calcDiscount(size), [size]);
  const salePrice = useMemo(() => calcSalePrice(livePrice, size), [livePrice, size]);
  const selectedColor = CASE_COLORS.find((c) => c.id === colorId)!;

  function handleAddToCart() {
    addLine({
      key: `${theme}-${size}-${colorId}`,
      productId: theme,
      productName,
      size,
      colorId,
      colorLabel: selectedColor.label,
      colorHex: selectedColor.hex,
      unitPrice: salePrice,
      image: imageSrc,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    trackAddToCart({ id: theme, name: productName, price: salePrice }, 1);
  }

  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-6 md:p-8`}>
      {/* Boy seçici */}
      <div>
        <p className={`font-mono text-[11px] uppercase tracking-[0.25em] ${s.muted}`}>
          Boy Seçin
        </p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {SIZES_CM.map((cm) => (
            <button
              key={cm}
              onClick={() => setSize(cm)}
              aria-pressed={size === cm}
              className={`rounded-lg border px-2 py-2 font-body text-sm transition-colors ${
                size === cm ? s.chipActive : s.chipIdle
              }`}
            >
              {cm}cm
            </button>
          ))}
        </div>
      </div>

      {/* Kasa rengi seçici */}
      <div className="mt-7">
        <p className={`font-mono text-[11px] uppercase tracking-[0.25em] ${s.muted}`}>
          Kasa Rengi — {selectedColor.label}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {CASE_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setColorId(color.id)}
              aria-pressed={colorId === color.id}
              aria-label={color.label}
              title={color.label}
              className={`h-9 w-9 rounded-full border-2 transition-all ${
                colorId === color.id
                  ? `${s.accent.replace("text-", "border-")} scale-110`
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Fiyat */}
      <div className={`mt-8 border-t ${s.border} pt-6`}>
        <div className="flex items-end gap-3">
          {discount > 0 && (
            <span className={`font-body text-sm line-through ${s.muted}`}>
              {formatTL(listPrice)}
            </span>
          )}
          <span className={`font-display text-3xl ${s.text}`}>{formatTL(salePrice)}</span>
        </div>
        {discount > 0 && (
          <p className={`mt-1 font-body text-xs ${s.accent}`}>
            {formatTL(discount)} tasarruf — {size}cm boyda
          </p>
        )}

        {!stockLoading && stockQty !== null && (
          <p
            className={`mt-3 font-body text-xs font-semibold ${
              stockQty === 0
                ? "text-red-400"
                : stockQty <= 5
                  ? "text-gold"
                  : "text-emerald-400"
            }`}
          >
            {stockQty === 0
              ? "Tükendi"
              : stockQty <= 5
                ? `Son ${stockQty} adet`
                : "Stokta"}
          </p>
        )}

        <button
          ref={addButtonRef}
          onClick={handleAddToCart}
          disabled={stockQty === 0}
          className={`mt-5 w-full rounded-full py-3.5 font-body text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${s.button}`}
        >
          {stockQty === 0
            ? "Stokta Yok"
            : justAdded
              ? "Sepete Eklendi ✓"
              : `${productName} ${size}cm — Sepete Ekle`}
        </button>
      </div>

      <MobileStickyBar
        visible={!buttonInView}
        productName={productName}
        size={size}
        price={salePrice}
        disabled={stockQty === 0}
        justAdded={justAdded}
        onAdd={handleAddToCart}
        accentClass={s.button}
      />
    </div>
  );
}
