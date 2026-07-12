import { createClient } from "@/lib/supabase/client";

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  label: string;
};

export type CouponLookupResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: "not_found" | "inactive" | "expired" | "limit_reached" };

export async function fetchCoupon(code: string): Promise<CouponLookupResult> {
  const normalized = code.trim().toUpperCase();
  const supabase = createClient();

  const { data } = await supabase
    .from("coupons")
    .select("code, type, value, is_active, expires_at, usage_limit, times_used")
    .eq("code", normalized)
    .maybeSingle();

  if (!data) return { ok: false, reason: "not_found" };
  if (!data.is_active) return { ok: false, reason: "inactive" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { ok: false, reason: "expired" };
  }
  if (data.usage_limit !== null && data.times_used >= data.usage_limit) {
    return { ok: false, reason: "limit_reached" };
  }

  const label = data.type === "percent" ? `%${data.value} indirim` : `${data.value} TL indirim`;

  return {
    ok: true,
    coupon: { code: data.code, type: data.type as "percent" | "fixed", value: Number(data.value), label },
  };
}

export function calcCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotal);
}

export async function markCouponUsed(code: string) {
  const supabase = createClient();
  await supabase.rpc("increment_coupon_usage", { coupon_code: code });
}
