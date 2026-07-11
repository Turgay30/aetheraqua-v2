"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

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
  totalPrice: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aetheraqua_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // İlk yüklemede localStorage'dan sepeti oku
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
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
  }

  const totalItems = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const totalPrice = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ lines, addLine, removeLine, setQuantity, clear, totalItems, totalPrice, isLoaded }}
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
