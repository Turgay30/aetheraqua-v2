"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatTL } from "@/lib/pricing";

type Summary = {
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<string, number>;
  topSellers: { label: string; quantity: number }[];
};

export default function SalesSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: orders } = await supabase.from("orders").select("status, total").neq("status", "iptal");

      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, size, quantity");

      const totalOrders = orders?.length ?? 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

      const statusCounts: Record<string, number> = {};
      orders?.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
      });

      const sellerMap = new Map<string, number>();
      items?.forEach((item) => {
        const label = `${item.product_name} ${item.size}cm`;
        sellerMap.set(label, (sellerMap.get(label) ?? 0) + item.quantity);
      });
      const topSellers = Array.from(sellerMap.entries())
        .map(([label, quantity]) => ({ label, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setSummary({ totalOrders, totalRevenue, statusCounts, topSellers });
    }
    load();
  }, []);

  if (!summary) return null;

  return (
    <div className="mb-10 space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Toplam Sipariş" value={String(summary.totalOrders)} />
        <StatCard label="Toplam Ciro" value={formatTL(summary.totalRevenue)} accent />
        <StatCard label="Beklemede" value={String(summary.statusCounts["beklemede"] ?? 0)} />
        <StatCard label="Teslim Edildi" value={String(summary.statusCounts["teslim_edildi"] ?? 0)} />
      </div>

      {summary.topSellers.length > 0 && (
        <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            En Çok Satanlar
          </p>
          <div className="mt-3 space-y-2">
            {summary.topSellers.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="font-body text-sm text-ink">{s.label}</span>
                <span className="font-mono text-sm text-aqua">{s.quantity} adet</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</p>
      <p className={`mt-1.5 font-display text-2xl ${accent ? "text-gold" : "text-ink"}`}>{value}</p>
    </div>
  );
}
