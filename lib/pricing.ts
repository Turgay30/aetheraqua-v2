export const SIZES_CM = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120] as const;
export type SizeCm = (typeof SIZES_CM)[number];

export type CaseColor = {
  id: string;
  label: string;
  hex: string;
};

export const CASE_COLORS: CaseColor[] = [
  { id: "siyah", label: "Siyah", hex: "#18181B" },
  { id: "beyaz", label: "Beyaz", hex: "#F4F4F5" },
  { id: "gri", label: "Gri", hex: "#71717A" },
  { id: "koyu-mavi", label: "Koyu Mavi", hex: "#1E3A5F" },
  { id: "kahverengi", label: "Kahverengi", hex: "#5C4033" },
  { id: "mat-siyah", label: "Mat Siyah", hex: "#0A0A0B" },
];

/**
 * Fiyatlandırma mantığı:
 * - Her 10cm artışta liste fiyatına +1.000 TL eklenir.
 * - Satış fiyatı, liste fiyatından kümülatif bir indirim düşülerek hesaplanır:
 *   30cm→70cm arası her adımda 100 TL, 70cm→120cm arası her adımda 200 TL indirim.
 *
 * Örnek doğrulama (Apollo, base=7500):
 *   120cm → liste 16.500 TL, satış 15.100 TL
 */
export function getSizeIndex(size: number): number {
  return SIZES_CM.indexOf(size as SizeCm);
}

export function calcListPrice(basePrice: number, size: number): number {
  const i = getSizeIndex(size);
  return basePrice + 1000 * i;
}

export function calcDiscount(size: number): number {
  const i = getSizeIndex(size);
  const lowSteps = Math.min(i, 4); // 30→70cm arası adımlar
  const highSteps = Math.max(0, i - 4); // 70→120cm arası adımlar
  return 100 * lowSteps + 200 * highSteps;
}

export function calcSalePrice(basePrice: number, size: number): number {
  return calcListPrice(basePrice, size) - calcDiscount(size);
}

export function formatTL(amount: number): string {
  return amount.toLocaleString("tr-TR") + " TL";
}
