"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { formatTL } from "@/lib/pricing";
import DecorativeGlow from "@/components/DecorativeGlow";
import AddressBook from "@/components/account/AddressBook";
import FavoritesList from "@/components/account/FavoritesList";
import MarketingConsentToggle from "@/components/account/MarketingConsentToggle";
import ProfileEditor from "@/components/account/ProfileEditor";
import { buildTrackingUrl } from "@/lib/shipping";

type OrderItem = {
  id: string;
  product_name: string;
  size: number;
  color_label: string;
  unit_price: number;
  quantity: number;
};

type Order = {
  id: string;
  order_no: string;
  status: string;
  total: number;
  created_at: string;
  tracking_number: string | null;
  shipping_company: string | null;
  order_items: OrderItem[];
};

const statusLabels: Record<string, { label: string; color: string }> = {
  beklemede: { label: "Beklemede", color: "text-ink-muted" },
  onaylandı: { label: "Onaylandı", color: "text-aqua" },
  hazırlanıyor: { label: "Hazırlanıyor", color: "text-gold" },
  kargoya_verildi: { label: "Kargoya Verildi", color: "text-aqua" },
  teslim_edildi: { label: "Teslim Edildi", color: "text-emerald-400" },
  iptal: { label: "İptal", color: "text-red-400" },
};

export default function HesabimPage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/giris");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("id, order_no, status, total, created_at, tracking_number, shipping_company, order_items(id, product_name, size, color_label, unit_price, quantity)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as unknown as Order[]) ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-ink">Hesabım</h1>
            <p className="mt-1 font-body text-sm text-ink-muted">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="font-body text-sm text-ink-faint underline hover:text-red-400"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Profil Bilgileri
          </h2>
          <ProfileEditor userId={user.id} />
        </div>

        <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Siparişlerim
        </h2>

        {ordersLoading ? (
          <p className="mt-4 font-body text-sm text-ink-muted">Yükleniyor...</p>
        ) : !orders || orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-abyss-border bg-abyss-surface p-8 text-center">
            <p className="font-body text-sm text-ink-muted">Henüz siparişiniz yok.</p>
            <Link
              href="/apollo"
              className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-abyss"
            >
              Ürünleri İncele
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => {
              const s = statusLabels[order.status] ?? statusLabels.beklemede;
              return (
                <div key={order.id} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-aqua">{order.order_no}</p>
                    <span className={`font-body text-xs font-semibold ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="mt-1 font-body text-xs text-ink-faint">
                    {new Date(order.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-3 space-y-1 border-t border-abyss-border pt-3">
                    {order.order_items?.map((item) => (
                      <p key={item.id} className="font-body text-sm text-ink-muted">
                        {item.product_name} {item.size}cm ({item.color_label}) × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <p className="mt-3 text-right font-display text-lg text-gold">
                    {formatTL(order.total)}
                  </p>

                  {order.tracking_number && (
                    <div className="mt-3 border-t border-abyss-border pt-3">
                      {buildTrackingUrl(order.shipping_company, order.tracking_number) ? (
                        <a
                          href={buildTrackingUrl(order.shipping_company, order.tracking_number)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-body text-xs text-aqua hover:underline"
                        >
                          {order.shipping_company} ile takip et → {order.tracking_number}
                        </a>
                      ) : (
                        <p className="font-body text-xs text-ink-muted">
                          {order.shipping_company}: {order.tracking_number}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Favorilerim
        </h2>
        <FavoritesList userId={user.id} />

        <div className="mt-12">
          <AddressBook userId={user.id} />
        </div>

        <div className="mt-12">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Gizlilik Tercihleri
          </h2>
          <MarketingConsentToggle userId={user.id} />
        </div>
      </section>
    </div>
  );
}
