"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { formatTL } from "@/lib/pricing";
import ProductStockManager from "@/components/admin/ProductStockManager";
import ProductManager from "@/components/admin/ProductManager";
import FishManager from "@/components/admin/FishManager";
import CouponManager from "@/components/admin/CouponManager";
import BlogManager from "@/components/admin/BlogManager";
import WholesaleManager from "@/components/admin/WholesaleManager";
import GiftCardManager from "@/components/admin/GiftCardManager";
import SalesSummary from "@/components/admin/SalesSummary";
import PlantManager from "@/components/admin/PlantManager";
import ShrimpManager from "@/components/admin/ShrimpManager";
import TrackingEditor from "@/components/admin/TrackingEditor";

const ADMIN_EMAIL = "turgayturan705@gmail.com";

const STATUS_OPTIONS = [
  "beklemede",
  "onaylandı",
  "hazırlanıyor",
  "kargoya_verildi",
  "teslim_edildi",
  "iptal",
];

type OrderItem = {
  id: string;
  product_name: string;
  size: number;
  color_label: string;
  quantity: number;
};

type Order = {
  id: string;
  order_no: string;
  status: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  created_at: string;
  tracking_number: string | null;
  shipping_company: string | null;
  order_items: OrderItem[];
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tab, setTab] = useState<"orders" | "products" | "fish" | "shrimp" | "plants" | "coupons" | "rehberler" | "toptan" | "hediye">("orders");

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push("/");
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user]);

  async function loadOrders() {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select(
        "id, order_no, status, total, customer_name, customer_phone, customer_email, customer_address, created_at, tracking_number, shipping_company, order_items(id, product_name, size, color_label, quantity)"
      )
      .order("created_at", { ascending: false });
    setOrders((data as unknown as Order[]) ?? []);
  }

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev?.map((o) => (o.id === orderId ? { ...o, status } : o)) ?? null);
  }

  async function updateTracking(orderId: string, company: string, trackingNumber: string) {
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ shipping_company: company || null, tracking_number: trackingNumber || null })
      .eq("id", orderId);
    setOrders(
      (prev) =>
        prev?.map((o) =>
          o.id === orderId
            ? { ...o, shipping_company: company || null, tracking_number: trackingNumber || null }
            : o
        ) ?? null
    );
  }

  if (isLoading || !user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Yönetim Paneli</h1>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab("orders")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "orders" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Siparişler
        </button>
        <button
          onClick={() => setTab("products")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "products" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Ürün & Stok
        </button>
        <button
          onClick={() => setTab("fish")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "fish" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Balıklar
        </button>
        <button
          onClick={() => setTab("plants")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "plants" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Bitkiler
        </button>
        <button
          onClick={() => setTab("shrimp")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "shrimp" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Kabuklular
        </button>
        <button
          onClick={() => setTab("coupons")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "coupons" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Kuponlar
        </button>
        <button
          onClick={() => setTab("rehberler")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "rehberler" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Rehberler
        </button>
        <button
          onClick={() => setTab("toptan")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "toptan" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Toptan
        </button>
        <button
          onClick={() => setTab("hediye")}
          className={`rounded-full px-5 py-2 font-body text-sm transition-colors ${
            tab === "hediye" ? "bg-gold text-abyss" : "border border-abyss-border text-ink-muted"
          }`}
        >
          Hediye Kartları
        </button>
      </div>

      {tab === "orders" ? (
        <>
          <div className="mt-6">
            <SalesSummary />
          </div>
          <p className="font-body text-sm text-ink-muted">
            {orders ? `${orders.length} sipariş` : "Yükleniyor..."}
          </p>

          <div className="mt-4 space-y-4">
            {orders?.map((order) => (
              <div key={order.id} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-aqua">{order.order_no}</p>
                    <p className="mt-0.5 font-body text-xs text-ink-faint">
                      {new Date(order.created_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-lg border border-abyss-border bg-abyss px-3 py-1.5 font-body text-xs text-ink outline-none focus-visible:border-aqua"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 grid gap-1 border-t border-abyss-border pt-3 font-body text-xs text-ink-muted sm:grid-cols-2">
                  <p>{order.customer_name} · {order.customer_phone}</p>
                  <p>{order.customer_email}</p>
                  <p className="sm:col-span-2">{order.customer_address}</p>
                </div>

                <div className="mt-3 space-y-1 border-t border-abyss-border pt-3">
                  {order.order_items?.map((item) => (
                    <p key={item.id} className="font-body text-sm text-ink-muted">
                      {item.product_name} {item.size}cm ({item.color_label}) × {item.quantity}
                    </p>
                  ))}
                </div>

                <p className="mt-3 text-right font-display text-lg text-gold">{formatTL(order.total)}</p>

                <TrackingEditor
                  orderId={order.id}
                  initialCompany={order.shipping_company}
                  initialTrackingNumber={order.tracking_number}
                  onSave={updateTracking}
                />
              </div>
            ))}
          </div>
        </>
      ) : tab === "products" ? (
        <div className="mt-8 space-y-12">
          <ProductManager />
          <ProductStockManager />
        </div>
      ) : tab === "fish" ? (
        <div className="mt-8">
          <FishManager />
        </div>
      ) : tab === "plants" ? (
        <div className="mt-8">
          <PlantManager />
        </div>
      ) : tab === "shrimp" ? (
        <div className="mt-8">
          <ShrimpManager />
        </div>
      ) : tab === "coupons" ? (
        <div className="mt-8">
          <CouponManager />
        </div>
      ) : tab === "rehberler" ? (
        <div className="mt-8">
          <BlogManager />
        </div>
      ) : tab === "toptan" ? (
        <div className="mt-8">
          <WholesaleManager />
        </div>
      ) : (
        <div className="mt-8">
          <GiftCardManager />
        </div>
      )}
    </div>
  );
}
