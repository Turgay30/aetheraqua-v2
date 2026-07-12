// Balık türleri ve uyumluluk verisi artık Supabase'de tutuluyor
// (fish_species ve fish_compatibility tabloları), admin panelden yönetiliyor.
// Bu dosya sadece ortak tip tanımını barındırır.

export type FishSpecies = {
  id: string;
  name: string;
  latinName: string;
  image: string;
  note: string;
  minShoalSize: number;
  minTankLiters: number;
  adultSizeCm: number;
};
