"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SIZES_CM } from "@/lib/pricing";

type ProductRow = { product_id: string; base_price: number };
type StockRow = { product_id: string; size: number; quantity: number };

const PRODUCT_LABELS: Record<string, string> = { apollo: "Apollo", helios: "Helios" };

export default function ProductStockManager() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [stock, setStock] = useState<StockRow[] | null>(null);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [savingPrice, setSavingPrice] = useState<string | null>(null);
  const [savingStock, setSavingStock] = useState<string | null>(null);

  async function loadAll() {
    const supabase = createClient();
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("products").select("product_id, base_price"),
      supabase.from("stock").select("product_id, size, quantity").order("size"),
    ]);
    setProducts(p ?? []);
    setStock(s ?? []);
    if (p) {
      setPriceDrafts(
        Object.fromEntries(p.map((row) => [row.product_id, String(row.base_price)]))
      );
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function savePrice(productId: string) {
    const value = Number(priceDrafts[productId]);
    if (!value || value <= 0) return;
    setSavingPrice(productId);
    const supabase = createClient();
    await supabase.from("products").update({ base_price: value }).eq("product_id", productId);
    setSavingPrice(null);
    loadAll();
  }

  async function saveStock(productId: string, size: number, quantity: number) {
    const key = `${productId}-${size}`;
    setSavingStock(key);
    const supabase = createClient();
    await supabase
      .from("stock")
      .update({ quantity: Math.max(0, quantity) })
      .eq("product_id", productId)
      .eq("size", size);
    setSavingStock(null);
    loadAll();
  }

  if (products === null || stock === null) return null;

  return (
    <div className="space-y-10">
      {/* Fiyatlar */}
      <div>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Taban Fiyatlar (30cm)
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <div
              key={p.product_id}
              className="flex items-center gap-3 rounded-2xl border border-abyss-border bg-abyss-surface p-4"
            >
              <span className="w-16 flex-shrink-0 font-body text-sm text-ink">
                {PRODUCT_LABELS[p.product_id] ?? p.product_id}
              </span>
              <input
                type="number"
                value={priceDrafts[p.product_id] ?? ""}
                onChange={(e) =>
                  setPriceDrafts((prev) => ({ ...prev, [p.product_id]: e.target.value }))
                }
                className="w-24 rounded-lg border border-abyss-border bg-abyss px-2 py-1.5 font-mono text-sm text-ink outline-none focus-visible:border-aqua"
              />
              <span className="font-body text-xs text-ink-faint">TL</span>
              <button
                onClick={() => savePrice(p.product_id)}
                disabled={savingPrice === p.product_id}
                className="ml-auto rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss disabled:opacity-50"
              >
                {savingPrice === p.product_id ? "..." : "Kaydet"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 font-body text-[11px] text-ink-faint">
          Diğer boyların fiyatı bu taban üzerinden otomatik hesaplanır (her 10cm +1.000 TL,
          kademeli indirimle).
        </p>
      </div>

      {/* Stok */}
      {products.map((p) => (
        <div key={p.product_id}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            {PRODUCT_LABELS[p.product_id] ?? p.product_id} — Stok (Boy Bazında)
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {SIZES_CM.map((size) => {
              const row = stock.find((s) => s.product_id === p.product_id && s.size === size);
              const key = `${p.product_id}-${size}`;
              return (
                <div key={size} className="rounded-xl border border-abyss-border bg-abyss-surface p-3">
                  <p className="font-mono text-[10px] text-ink-faint">{size}cm</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <input
                      type="number"
                      defaultValue={row?.quantity ?? 0}
                      key={row?.quantity}
                      onBlur={(e) => {
                        const newQty = Number(e.target.value);
                        if (newQty !== row?.quantity) saveStock(p.product_id, size, newQty);
                      }}
                      className="w-full rounded-md border border-abyss-border bg-abyss px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:border-aqua"
                    />
                    {savingStock === key && (
                      <span className="font-mono text-[10px] text-aqua">...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
