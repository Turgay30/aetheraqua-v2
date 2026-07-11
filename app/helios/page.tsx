import type { Metadata } from "next";
import ProductGallery from "@/components/product/ProductGallery";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import TechSpecTable from "@/components/product/TechSpecTable";
import MythologySection from "@/components/product/MythologySection";
import WhatsAppButton from "@/components/product/WhatsAppButton";
import DecorativeGlow from "@/components/DecorativeGlow";
import GhostBackground from "@/components/GhostBackground";
import ViewItemTracker from "@/components/analytics/ViewItemTracker";

export const metadata: Metadata = {
  title: "Helios — Ekonomik WRGB Akvaryum Aydınlatması | AetherAqua",
  description:
    "Helios: sabit 8.000K çıkış, manuel kademe kontrolü, zamanlayıcı, CRI >92, IP65 su geçirmezlik. 30–120cm boy seçenekleri, 4.200 TL'den başlıyor.",
  openGraph: {
    images: [{ url: "/images/helios-hero.jpg", width: 1264, height: 843 }],
  },
};

const FEATURES = [
  "Sabit 8.000K çıkış — dengeli gündüz ışığı",
  "Manuel kademe kontrolü",
  "Yerleşik zamanlayıcı",
  "CRI >92 — canlı renk aktarımı",
  "IP65 su geçirmezlik",
  "1 yıl garanti",
];

const SPEC_ROWS = [
  { label: "Renk Sıcaklığı", value: "8.000K (Sabit)" },
  { label: "CRI", value: ">92" },
  { label: "Kontrol Tipi", value: "Manuel Kademe + Zamanlayıcı" },
  { label: "Su Geçirmezlik", value: "IP65" },
  { label: "Garanti", value: "1 Yıl" },
  { label: "Boy Seçenekleri", value: "30–120cm (10 seçenek)" },
];

export default function HeliosPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <GhostBackground opacity={0.08} />
      <ViewItemTracker id="helios" name="Helios" price={4200} />
      <DecorativeGlow />
      <div className="relative z-10">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-helios-bronze">
            Gündüzün Taşıyıcısı
          </p>
          <h1 className="mt-4 font-display text-6xl text-ink md:text-7xl">
            Helios
          </h1>
          <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-ink-muted">
            Her akvaryum için doğru, dengeli ve güvenilir bir gündüz ışığı.
            Helios, gösterişten çok tutarlılığa odaklanır — kurar, ayarlar ve
            her gün aynı netlikte ışık alırsınız.
          </p>
          <div className="mt-7">
            <WhatsAppButton theme="helios" productName="Helios" />
          </div>
        </div>

        <ProductGallery
          images={["/images/helios-hero.jpg"]}
          alt="Helios WRGB akvaryum aydınlatması"
          theme="helios"
        />
      </section>

      {/* Öne çıkan özellikler */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 rounded-xl border border-helios-line bg-helios-surface px-5 py-4"
            >
              <span className="mt-0.5 text-helios-bronze">✦</span>
              <span className="font-body text-sm text-helios-text">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Teknik özellikler + Konfigüratör */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              Teknik Özellikler
            </p>
            <TechSpecTable theme="helios" rows={SPEC_ROWS} />
          </div>
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              Boy & Kasa Rengi Seçin
            </p>
            <ProductConfigurator
              theme="helios"
              basePrice={4200}
              productName="Helios"
              imageSrc="/images/helios-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Mitolojik İlham */}
      <section className="border-t border-helios-bronze/10 px-6 py-24">
        <MythologySection
          theme="helios"
          eyebrow="Mitolojik İlham"
          title="Hiç Aksamayan Güzergah"
          paragraphs={[
            "Antik mitolojide Helios, dört atlı arabasını her sabah doğudan batıya sürerek göğü kat eden Titan'dı — sadakatle, hiç aksamadan, her gün aynı güzergahta.",
            "Helios serisi bu güvenilirliği yansıtır: gösterişten uzak, sabit ve dengeli bir gündüz ışığı sunar. Akvaryumunuzun her köşesine, her gün aynı netlikte ulaşan, hiç yorulmayan bir güneş.",
          ]}
        />
      </section>
      </div>
    </div>
  );
}
