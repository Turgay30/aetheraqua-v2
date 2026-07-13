export type LightLevel = "düşük" | "orta" | "yüksek";

export type LightPhase = {
  label: string;
  time: string;
  kelvin: number;
  intensity: number; // %
};

export type LightingSchedule = {
  maxLevel: LightLevel;
  photoperiodHours: number;
  phases: LightPhase[];
  recommendedProduct: "apollo" | "helios";
};

const LEVEL_RANK: Record<LightLevel, number> = { düşük: 1, orta: 2, yüksek: 3 };

export function buildLightingSchedule(levels: LightLevel[]): LightingSchedule | null {
  if (levels.length === 0) return null;

  const maxLevel = levels.reduce((max, l) => (LEVEL_RANK[l] > LEVEL_RANK[max] ? l : max), "düşük" as LightLevel);

  if (maxLevel === "düşük") {
    return {
      maxLevel,
      photoperiodHours: 6,
      recommendedProduct: "helios",
      phases: [
        { label: "Gün Doğumu", time: "08:00–09:00", kelvin: 4000, intensity: 30 },
        { label: "Gündüz", time: "09:00–14:00", kelvin: 6500, intensity: 70 },
        { label: "Gün Batımı", time: "14:00–15:00", kelvin: 3000, intensity: 25 },
        { label: "Gece", time: "15:00–08:00", kelvin: 0, intensity: 0 },
      ],
    };
  }

  if (maxLevel === "orta") {
    return {
      maxLevel,
      photoperiodHours: 8,
      recommendedProduct: "helios",
      phases: [
        { label: "Gün Doğumu", time: "07:30–09:00", kelvin: 4500, intensity: 35 },
        { label: "Gündüz", time: "09:00–15:00", kelvin: 8000, intensity: 90 },
        { label: "Gün Batımı", time: "15:00–16:30", kelvin: 3000, intensity: 25 },
        { label: "Gece", time: "16:30–07:30", kelvin: 0, intensity: 0 },
      ],
    };
  }

  return {
    maxLevel,
    photoperiodHours: 10,
    recommendedProduct: "apollo",
    phases: [
      { label: "Gün Doğumu", time: "07:00–08:30", kelvin: 5000, intensity: 35 },
      { label: "Gündüz", time: "08:30–16:30", kelvin: 10000, intensity: 100 },
      { label: "Öğle Zirvesi", time: "12:00–14:00", kelvin: 14000, intensity: 100 },
      { label: "Gün Batımı", time: "16:30–18:00", kelvin: 3000, intensity: 25 },
      { label: "Gece", time: "18:00–07:00", kelvin: 0, intensity: 0 },
    ],
  };
}
