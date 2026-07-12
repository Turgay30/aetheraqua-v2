const STORAGE_KEY = "aetheraqua_recently_viewed";
const MAX_ITEMS = 6;

export type RecentlyViewedItem = {
  id: string;
  name: string;
  image: string;
  href: string;
  price: number;
};

export function trackRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: RecentlyViewedItem[] = raw ? JSON.parse(raw) : [];
    const filtered = items.filter((i) => i.id !== item.id);
    filtered.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage erişilemezse sessizce yok say
  }
}

export function getRecentlyViewed(excludeId?: string): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items: RecentlyViewedItem[] = raw ? JSON.parse(raw) : [];
    return items.filter((i) => i.id !== excludeId);
  } catch {
    return [];
  }
}
