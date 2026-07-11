export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  label: string;
};

// TODO: Kampanyalarınıza göre bu listeyi güncelleyin/genişletin.
// İleride admin panelinden yönetilecek — şimdilik kod içinde tanımlı.
export const COUPONS: Coupon[] = [
  { code: "HOSGELDIN10", type: "percent", value: 10, label: "%10 indirim" },
  { code: "AETHER500", type: "fixed", value: 500, label: "500 TL indirim" },
];

export function findCoupon(code: string): Coupon | null {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized) ?? null;
}

export function calcCouponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }
  return Math.min(coupon.value, subtotal);
}
