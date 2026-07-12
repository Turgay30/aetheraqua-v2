"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Coupon, fetchCoupon, calcCouponDiscount } from "@/lib/coupons";

export type CartLine = {
  key: string; // `${productId}-${size}-${colorId}`
  productId: "apollo" | "helios";
  productName: string;
  size: number;
  colorId: string;
  colorLabel: string;
  colorHex: string;
  unitPrice: number;
  quantity: number;
  image: string;
};

type CartContextValue = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  totalPrice: number;
  isLoaded: boolean;
  coupon: Coupon | null;
  couponError: string | null;
  couponApplying: boolean;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aetheraqua_cart";
const COUPON_STORAGE_KEY = "aetheraqua_coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // İlk yüklemede localStorage'dan sepeti ve kuponu oku
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
      const rawCoupon = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (rawCoupon) setCoupon(JSON.parse(rawCoupon));
    } catch {
      // bozuk veri varsa sessizce yok say
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sepet her değiştiğinde localStorage'a yaz
  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // depolama dolu/erişilemez olabilir — sessizce yok say
    }
  }, [lines, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (coupon) {
        window.localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        window.localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // sessizce yok say
    }
  }, [coupon, isLoaded]);

  function addLine(line: Omit<CartLine, "quantity">, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.key === line.key);
      if (existing) {
        return prev.map((l) =>
          l.key === line.key ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { ...line, quantity }];
    });
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  function setQuantity(key: string, quantity: number) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, quantity) } : l))
    );
  }

  function clear() {
    setLines([]);
    setCoupon(null);
    setCouponError(null);
  }

  async function applyCoupon(code: string) {
    setCouponApplying(true);
    const result = await fetchCoupon(code);
    setCouponApplying(false);

    if (!result.ok) {
      setCoupon(null);
      const messages: Record<typeof result.reason, string> = {
        not_found: "Geçersiz kupon kodu.",
        inactive: "Bu kupon artık aktif değil.",
        expired: "Bu kuponun süresi dolmuş.",
        limit_reached: "Bu kuponun kullanım limiti dolmuş.",
      };
      setCouponError(messages[result.reason]);
      return;
    }

    setCoupon(result.coupon);
    setCouponError(null);
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponError(null);
  }

  const totalItems = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [lines]
  );
  const couponDiscount = useMemo(
    () => (coupon ? calcCouponDiscount(coupon, subtotal) : 0),
    [coupon, subtotal]
  );
  const totalPrice = useMemo(() => subtotal - couponDiscount, [subtotal, couponDiscount]);

  return (
    <CartContext.Provider
      value={{
        lines,
        addLine,
        removeLine,
        setQuantity,
        clear,
        totalItems,
        subtotal,
        totalPrice,
        isLoaded,
        coupon,
        couponError,
        couponApplying,
        couponDiscount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
