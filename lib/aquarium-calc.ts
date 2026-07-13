/**
 * Bir akvaryumun "kutu hacmi" (brüt) — uzunluk × genişlik × yükseklik.
 * Bu, tankın üretici tarafından belirtilen nominal hacmidir ama gerçek
 * su hacmi değildir.
 */
export function calcGrossLitersFromDimensions(
  lengthCm: number,
  widthCm: number,
  heightCm: number
): number {
  return (lengthCm * widthCm * heightCm) / 1000;
}

/**
 * Hiçbir akvaryum ağzına kadar doldurulmaz — ekipman, buharlaşma payı ve
 * sıçrama riski için genelde su seviyesi camın ~%90'ında bırakılır. Stoklama
 * ve ekipman hesaplamaları GERÇEK su hacmine göre yapılmalı, brüt kutu
 * hacmine göre değil; aksi halde tank olduğundan daha ferah gösterilir.
 */
const FILL_LEVEL_FACTOR = 0.9;

export function calcEffectiveLiters(grossLiters: number): number {
  return grossLiters * FILL_LEVEL_FACTOR;
}

/** Geriye dönük uyumluluk için: doğrudan boyuttan gerçek (dolum paylı) su hacmini döndürür. */
export function calcLitersFromDimensions(
  lengthCm: number,
  widthCm: number,
  heightCm: number
): number {
  return calcEffectiveLiters(calcGrossLitersFromDimensions(lengthCm, widthCm, heightCm));
}

export type StockingResult = {
  totalAdultCm: number;
  capacityCm: number;
  percent: number;
  level: "rahat" | "uygun" | "kalabalık";
};

/**
 * Basitleştirilmiş "1 inç balık / galon" kuralının metrik karşılığı
 * (~0.67 cm/L) kullanılarak kaba bir stoklama tahmini yapılır. Bu kesin
 * bir bilimsel ölçüt değildir — filtrasyon, bitki yoğunluğu ve türe özgü
 * ihtiyaçlar da göz önünde bulundurulmalıdır.
 */
export function assessStocking(totalAdultCm: number, liters: number): StockingResult {
  const capacityCm = liters / 1.5;
  const percent = capacityCm > 0 ? (totalAdultCm / capacityCm) * 100 : 0;

  let level: StockingResult["level"] = "rahat";
  if (percent > 100) level = "kalabalık";
  else if (percent >= 70) level = "uygun";

  return { totalAdultCm, capacityCm, percent, level };
}

export type EquipmentRecommendation = {
  filterFlowLph: number;
  heaterWatt: number;
};

export function recommendEquipment(
  liters: number,
  stockingLevel: StockingResult["level"]
): EquipmentRecommendation {
  const turnoverMultiplier = stockingLevel === "kalabalık" ? 6 : 4;
  const filterFlowLph = Math.round((liters * turnoverMultiplier) / 10) * 10;

  const heaterWatt = Math.round((liters * 1.2) / 5) * 5;

  return { filterFlowLph, heaterWatt: Math.max(heaterWatt, 25) };
}
