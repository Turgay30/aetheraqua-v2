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

export const FISH_SPECIES: FishSpecies[] = [
  {
    id: "neon_tetra",
    name: "Neon Tetra",
    latinName: "Paracheirodon innesi",
    image: "/fish/neon_tetra.jpg",
    note: "Sakin, sürü halinde yaşayan küçük bir tetra.",
    minShoalSize: 6,
    minTankLiters: 40,
    adultSizeCm: 4,
  },
  {
    id: "ember_tetra",
    name: "Ember Tetra",
    latinName: "Hyphessobrycon amandae",
    image: "/fish/ember_tetra.jpg",
    note: "Turuncu-kırmızı tonlarıyla dikkat çeken minik, sakin bir tetra.",
    minShoalSize: 6,
    minTankLiters: 30,
    adultSizeCm: 2,
  },
  {
    id: "harlequin_rasbora",
    name: "Harlequin Rasbora",
    latinName: "Trigonostigma heteromorpha",
    image: "/fish/harlequin_rasbora.jpg",
    note: "Dayanıklı, sürü halinde hareket eden sakin bir tür.",
    minShoalSize: 6,
    minTankLiters: 45,
    adultSizeCm: 4.5,
  },
  {
    id: "zebra_danio",
    name: "Zebra Danio",
    latinName: "Danio rerio",
    image: "/fish/zebra_danio.jpg",
    note: "Hareketli ve hızlı yüzen, dayanıklı bir sürü balığı.",
    minShoalSize: 6,
    minTankLiters: 45,
    adultSizeCm: 5,
  },
  {
    id: "guppy",
    name: "Guppy (Lepistes)",
    latinName: "Poecilia reticulata",
    image: "/fish/guppy.jpg",
    note: "Canlı renkli, kolay bakımlı, doğurgan bir tür.",
    minShoalSize: 3,
    minTankLiters: 40,
    adultSizeCm: 5,
  },
  {
    id: "molly",
    name: "Molly",
    latinName: "Poecilia sphenops",
    image: "/fish/molly.jpg",
    note: "Sağlam yapılı, uyumlu bir yaşayan doğurgan balık.",
    minShoalSize: 3,
    minTankLiters: 75,
    adultSizeCm: 10,
  },
  {
    id: "platy",
    name: "Platy",
    latinName: "Xiphophorus maculatus",
    image: "/fish/platy.jpg",
    note: "Sakin, dayanıklı ve yeni başlayanlar için ideal.",
    minShoalSize: 3,
    minTankLiters: 40,
    adultSizeCm: 6,
  },
  {
    id: "swordtail",
    name: "Kılıç Kuyruk",
    latinName: "Xiphophorus hellerii",
    image: "/fish/swordtail.jpg",
    note: "Kılıç şeklindeki kuyruğuyla tanınan aktif bir tür.",
    minShoalSize: 3,
    minTankLiters: 75,
    adultSizeCm: 12,
  },
  {
    id: "cherry_barb",
    name: "Kiraz Barb",
    latinName: "Puntius titteya",
    image: "/fish/cherry_barb.jpg",
    note: "Barb türleri arasında en sakin olanlardan; iyi bir topluluk balığı.",
    minShoalSize: 6,
    minTankLiters: 60,
    adultSizeCm: 5,
  },
  {
    id: "tiger_barb",
    name: "Kaplan Barb",
    latinName: "Puntigrus tetrazona",
    image: "/fish/tiger_barb.jpg",
    note: "Enerjik ve yarı agresif; yüzgeç ısırma eğilimi olabilir, kalabalık sürü halinde tutulmalı.",
    minShoalSize: 6,
    minTankLiters: 90,
    adultSizeCm: 7,
  },
  {
    id: "corydoras",
    name: "Corydoras",
    latinName: "Corydoras spp.",
    image: "/fish/corydoras.jpg",
    note: "Dip temizleyici, çok sakin ve sosyal bir zırhlı kedi balığı.",
    minShoalSize: 6,
    minTankLiters: 60,
    adultSizeCm: 6,
  },
  {
    id: "kuhli_loach",
    name: "Kuhli Loach",
    latinName: "Pangio kuhlii",
    image: "/fish/kuhli_loach.jpg",
    note: "Yılan gibi hareket eden, gece aktif, çok sakin bir dip balığı.",
    minShoalSize: 3,
    minTankLiters: 60,
    adultSizeCm: 10,
  },
  {
    id: "otocinclus",
    name: "Otocinclus",
    latinName: "Otocinclus spp.",
    image: "/fish/otocinclus.jpg",
    note: "Küçük, zararsız bir alg temizleyicisi.",
    minShoalSize: 3,
    minTankLiters: 40,
    adultSizeCm: 5,
  },
  {
    id: "bristlenose_pleco",
    name: "Bristlenose Pleco",
    latinName: "Ancistrus cirrhosus",
    image: "/fish/bristlenose_pleco.jpg",
    note: "Sakin, gece aktif bir alg temizleyicisi; tek başına tutulabilir.",
    minShoalSize: 1,
    minTankLiters: 75,
    adultSizeCm: 12,
  },
  {
    id: "dwarf_gourami",
    name: "Cüce Gurami",
    latinName: "Trichogaster lalius",
    image: "/fish/dwarf_gourami.jpg",
    note: "Renkli bir labirent balığı; kendi türüyle ve bazı sakin balıklarla dikkatli eşleştirilmeli.",
    minShoalSize: 1,
    minTankLiters: 75,
    adultSizeCm: 8,
  },
  {
    id: "angelfish",
    name: "Melek Balığı",
    latinName: "Pterophyllum scalare",
    image: "/fish/angelfish.jpg",
    note: "Zarif ama yarı agresif; çok küçük balıkları avlayabilir, geniş ve derin tank ister.",
    minShoalSize: 1,
    minTankLiters: 150,
    adultSizeCm: 15,
  },
  {
    id: "betta",
    name: "Betta (Beta Balığı)",
    latinName: "Betta splendens",
    image: "/fish/betta.jpg",
    note: "Yalnız yaşamayı tercih eden, kendi türüne ve yüzgeç ısıran balıklara karşı toleranssız bir tür.",
    minShoalSize: 1,
    minTankLiters: 20,
    adultSizeCm: 6,
  },
];

/**
 * Uyumsuzluk çiftleri (yönsüz). Burada listelenmeyen her çift varsayılan
 * olarak uyumlu kabul edilir. Kurallar genel akvaryumculuk pratiğine
 * dayanır (yüzgeç ısırma riski, mizaç çatışması, av/avcı boyut farkı vb.)
 * ve kesin bilimsel garanti taşımaz — özel durumlar için uzman görüşü
 * alınması önerilir.
 */
export const INCOMPATIBLE_PAIRS: [string, string][] = [
  ["betta", "tiger_barb"],
  ["betta", "dwarf_gourami"],
  ["betta", "angelfish"],
  ["betta", "zebra_danio"],
  ["tiger_barb", "angelfish"],
  ["tiger_barb", "dwarf_gourami"],
  ["tiger_barb", "neon_tetra"],
  ["tiger_barb", "ember_tetra"],
  ["tiger_barb", "harlequin_rasbora"],
  ["tiger_barb", "guppy"],
  ["tiger_barb", "swordtail"],
  ["angelfish", "neon_tetra"],
  ["angelfish", "ember_tetra"],
  ["angelfish", "zebra_danio"],
  ["angelfish", "dwarf_gourami"],
  ["dwarf_gourami", "zebra_danio"],
];

const incompatibilityMap: Map<string, Set<string>> = new Map();
for (const [a, b] of INCOMPATIBLE_PAIRS) {
  if (!incompatibilityMap.has(a)) incompatibilityMap.set(a, new Set());
  if (!incompatibilityMap.has(b)) incompatibilityMap.set(b, new Set());
  incompatibilityMap.get(a)!.add(b);
  incompatibilityMap.get(b)!.add(a);
}

export function areCompatible(idA: string, idB: string): boolean {
  if (idA === idB) return true; // aynı tür kendi sürüsüyle uyumlu sayılır
  return !incompatibilityMap.get(idA)?.has(idB);
}

export function getIncompatibleWith(id: string): Set<string> {
  return incompatibilityMap.get(id) ?? new Set();
}
