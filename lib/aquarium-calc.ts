export function calcLitersFromDimensions(
  lengthCm: number,
  widthCm: number,
  heightCm: number
): number {
  return (lengthCm * widthCm * heightCm) / 1000;
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
