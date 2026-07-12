export type LivestockType = "fish" | "shrimp" | "plant";

export type Livestock = {
  id: string;
  type: LivestockType;
  name: string;
  latinName: string;
  image: string;
  note: string;
  minShoalSize: number;
  minTankLiters: number;
  adultSizeCm: number;
};

export type CompatibilityKey = `${LivestockType}:${string}`;

export function key(type: LivestockType, id: string): CompatibilityKey {
  return `${type}:${id}`;
}

export function parseKey(k: CompatibilityKey): { type: LivestockType; id: string } {
  const [type, ...rest] = k.split(":");
  return { type: type as LivestockType, id: rest.join(":") };
}

/** İki canlının uyumlu olup olmadığını, önceden çekilmiş uyumsuzluk haritasından kontrol eder. */
export function areCompatible(
  a: { type: LivestockType; id: string },
  b: { type: LivestockType; id: string },
  incompatMap: Map<CompatibilityKey, Set<CompatibilityKey>>
): boolean {
  if (a.type === b.type && a.id === b.id) return true;
  return !incompatMap.get(key(a.type, a.id))?.has(key(b.type, b.id));
}
