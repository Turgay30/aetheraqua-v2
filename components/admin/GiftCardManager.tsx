"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { formatTL } from "@/lib/pricing";

type GiftCard = {
  id: string;
  code: string;
  amount: number;
  purchaser_name: string;
  purchaser_email: string;
  purchaser_phone: string | null;
  recipient_name: string;
  recipient_email: string;
  message: string | null;
  status: string;
  created_at: string;
};

export default function GiftCardManager() {
  const { showToast } = useToast();
  const [cards, setCards] = useState<GiftCard[] | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("gift_cards")
      .select("*")
      .order("created_at", { ascending: false });
    setCards((data as GiftCard[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApproveAndSend(card: GiftCard) {
    setSendingId(card.id);
    const supabase = createClient();

    // 1) Kuponu oluştur (aktif, tek kullanımlık, hediye kartı tutarında sabit indirim)
    const { error: couponError } = await supabase.from("coupons").insert({
      code: card.code,
      type: "fixed",
      value: card.amount,
      is_active: true,
      usage_limit: 1,
    });

    if (couponError) {
      setSendingId(null);
      showToast("Kupon oluşturulamadı: " + couponError.message, "error");
      return;
    }

    // 2) E-postayı gönder
    const res = await fetch("/api/gift-card/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftCardId: card.id }),
    });

    if (!res.ok) {
      setSendingId(null);
      showToast("Kupon oluşturuldu ama e-posta gönderilemedi, elle iletmeniz gerekebilir.", "error");
      return;
    }

    // 3) Durumu güncelle
    await supabase.from("gift_cards").update({ status: "onaylandı" }).eq("id", card.id);
    setSendingId(null);
    showToast("Hediye kartı onaylandı ve gönderildi ✓", "success");
    load();
  }

  if (cards === null) return null;

  return (
    <div>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        Hediye Kartları ({cards.length})
      </h2>

      {cards.length === 0 ? (
        <p className="mt-4 font-body text-sm text-ink-muted">Henüz talep yok.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-gold">{formatTL(card.amount)}</p>
                  <p className="font-mono text-xs text-ink-faint">{card.code}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-body text-xs ${
                    card.status === "bekliyor"
                      ? "bg-abyss text-ink-faint"
                      : "bg-emerald-400/10 text-emerald-400"
                  }`}
                >
                  {card.status}
                </span>
              </div>

              <div className="mt-3 grid gap-2 border-t border-abyss-border pt-3 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">Satın Alan</p>
                  <p className="font-body text-xs text-ink">{card.purchaser_name}</p>
                  <p className="font-body text-xs text-ink-muted">
                    {card.purchaser_email} {card.purchaser_phone ? `· ${card.purchaser_phone}` : ""}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wide text-ink-faint">Alıcı</p>
                  <p className="font-body text-xs text-ink">{card.recipient_name}</p>
                  <p className="font-body text-xs text-ink-muted">{card.recipient_email}</p>
                </div>
              </div>

              {card.message && (
                <p className="mt-2 border-t border-abyss-border pt-2 font-body text-xs italic text-ink-muted">
                  &quot;{card.message}&quot;
                </p>
              )}

              {card.status === "bekliyor" && (
                <button
                  onClick={() => handleApproveAndSend(card)}
                  disabled={sendingId === card.id}
                  className="mt-3 rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss disabled:opacity-50"
                >
                  {sendingId === card.id ? "Gönderiliyor..." : "Onayla ve Gönder"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
