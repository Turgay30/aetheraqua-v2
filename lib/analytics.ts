declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type ProductForAnalytics = {
  id: string;
  name: string;
  price: number;
};

export function trackViewItem(product: ProductForAnalytics) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "view_item", {
    currency: "TRY",
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  });
  window.fbq?.("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    currency: "TRY",
    value: product.price,
  });
}

export function trackAddToCart(product: ProductForAnalytics, quantity: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "add_to_cart", {
    currency: "TRY",
    value: product.price * quantity,
    items: [
      { item_id: product.id, item_name: product.name, price: product.price, quantity },
    ],
  });
  window.fbq?.("track", "AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    currency: "TRY",
    value: product.price * quantity,
  });
}

export function trackPurchase(orderId: string, totalValue: number, itemCount: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "purchase", {
    transaction_id: orderId,
    currency: "TRY",
    value: totalValue,
  });
  window.fbq?.("track", "Purchase", {
    currency: "TRY",
    value: totalValue,
    num_items: itemCount,
  });
}
