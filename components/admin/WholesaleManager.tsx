"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";

type Inquiry = {
  id: string;
  business_name: string;
  contact_name: string;
  phone: string;
  email: string;
  city: string | null;
  estimated_quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = ["yeni", "görüşülüyor", "tamamlandı", "iptal"];

export default function WholesaleManager() {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("wholesale_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setInquiries((data as Inquiry[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("wholesale_inquiries").update({ status }).eq("id", id);
    setInquiries((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? null);
    showToast("Durum güncellendi", "success");
  }

  if (inquiries === null) return null;

  return (
    <div>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        Toptan Satış Talepleri ({inquiries.length})
      </h2>

      {inquiries.length === 0 ? (
        <p className="mt-4 font-body text-sm text-ink-muted">Henüz talep yok.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-sm font-semibold text-ink">{inq.business_name}</p>
                  <p className="font-body text-xs text-ink-muted">
                    {inq.contact_name} · {inq.phone} · {inq.email}
                  </p>
                  {inq.city && <p className="font-body text-xs text-ink-faint">{inq.city}</p>}
                </div>
                <select
                  value={inq.status}
                  onChange={(e) => updateStatus(inq.id, e.target.value)}
                  className="rounded-lg border border-abyss-border bg-abyss px-2 py-1.5 font-body text-xs text-ink outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {inq.estimated_quantity && (
                <p className="mt-2 font-body text-xs text-ink-muted">
                  Tahmini adet: {inq.estimated_quantity}
                </p>
              )}
              {inq.message && (
                <p className="mt-2 border-t border-abyss-border pt-2 font-body text-xs text-ink-muted">
                  {inq.message}
                </p>
              )}
              <p className="mt-2 font-mono text-[10px] text-ink-faint">
                {new Date(inq.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
