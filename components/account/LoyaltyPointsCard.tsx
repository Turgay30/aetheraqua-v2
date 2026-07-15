"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";

export default function LoyaltyPointsCard({ userId }: { userId: string }) {
  const { showToast } = useToast();
  const [points, setPoints] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("loyalty_points")
      .eq("id", userId)
      .maybeSingle();
    setPoints(data?.loyalty_points ?? 0);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleRedeem() {
    if (points === null || points < 100) return;
    setRedeeming(true);
    const redeemable = Math.floor(points / 100) * 100;

    const supabase = createClient();
    const { data: coupon, error } = await supabase.rpc("redeem_loyalty_points", {
      p_points: redeemable,
    });
    setRedeeming(false);

    if (error) {
      showToast("Puan kullanılırken bir sorun oluştu.", "error");
      return;
    }

    showToast(`${formatDiscount(redeemable)} TL indirim kuponunuz: ${coupon}`, "success");
    load();
  }

  function formatDiscount(pts: number) {
    return (pts / 100) * 50;
  }

  if (points === null) return null;

  const canRedeem = points >= 100;
  const redeemablePoints = Math.floor(points / 100) * 100;

  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-sm text-ink-muted">Puanınız</p>
          <p className="font-display text-3xl text-gold">{points} puan</p>
        </div>
        <span className="text-3xl">⭐</span>
      </div>
      <p className="mt-2 font-body text-xs text-ink-faint">
        Her 100 TL alışverişe 1 puan kazanırsınız. Her 100 puan = 50 TL indirim kuponu.
      </p>
      {canRedeem ? (
        <button
          onClick={handleRedeem}
          disabled={redeeming}
          className="mt-4 rounded-full bg-gold px-5 py-2 font-body text-xs font-semibold text-abyss disabled:opacity-50"
        >
          {redeeming
            ? "İşleniyor..."
            : `${redeemablePoints} Puanı ${formatDiscount(redeemablePoints)} TL Kupona Çevir`}
        </button>
      ) : (
        <p className="mt-4 font-body text-xs text-ink-faint">
          Kupona çevirmek için en az 100 puan gerekir ({100 - points} puan kaldı).
        </p>
      )}
    </div>
  );
}
