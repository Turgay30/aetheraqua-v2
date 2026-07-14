import type { Metadata } from "next";
import ProductGallery from "@/components/product/ProductGallery";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductJsonLd from "@/components/ProductJsonLd";
import CrossSell from "@/components/product/CrossSell";
import ReviewsSection from "@/components/product/ReviewsSection";
import AquariumLightPreview from "@/components/product/AquariumLightPreview";
import RatingSummary from "@/components/product/RatingSummary";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import TechSpecTable from "@/components/product/TechSpecTable";
import MythologySection from "@/components/product/MythologySection";
import WhatsAppButton from "@/components/product/WhatsAppButton";
import DecorativeGlow from "@/components/DecorativeGlow";
import GhostBackground from "@/components/GhostBackground";
import ViewItemTracker from "@/components/analytics/ViewItemTracker";

export const metadata: Metadata = {
  title: "Apollo — Profesyonel WRGB Akvaryum Aydınlatması | AetherAqua",
  description:
    "Apollo: 6.500K–18.000K ayarlanabilir renk sıcaklığı, Wi-Fi kontrol, gün doğumu/batımı otomasyonu, CRI >98, IP67 su geçirmezlik. 30–120cm boy seçenekleri.",
  openGraph: {
    images: [{ url: "/images/apollo-hero.jpg", width: 1264, height: 843 }],
  },
};

const FEATURES = [
  "Tam spektrum, 6.500K–18.000K ayarlanabilir renk sıcaklığı",
  "Wi-Fi uygulama kontrolü",
  "Gün doğumu / gün batımı otomasyonu",
  "Bulut efekti simülasyonu",
  "CRI >98 — doğal renk canlılığı",
  "IP67 su geçirmezlik",
];

const SPEC_ROWS = [
  { label: "Renk Sıcaklığı", value: "6.500K–18.000K (Ayarlanabilir)" },
  { label: "CRI", value: ">98" },
  { label: "Kontrol Tipi", value: "Wi-Fi Uygulama + Bluetooth" },
  { label: "Su Geçirmezlik", value: "IP67" },
  { label: "Garanti", value: "2 Yıl" },
  { label: "Boy Seçenekleri", value: "30–120cm (10 seçenek)" },
];

export default function ApolloPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <GhostBackground opacity={0.08} />
      <ViewItemTracker id="apollo" name="Apollo" price={7500} image="/images/apollo-hero.jpg" href="/apollo" />
      <ProductJsonLd
        name="AetherAqua Apollo"
        description="Profesyonel WRGB akvaryum aydınlatması — 6.500K–18.000K ayarlanabilir renk sıcaklığı, Wi-Fi kontrol, CRI >98, IP67."
        image="/images/apollo-hero.jpg"
        price={7500}
        sku="apollo"
      />
      <DecorativeGlow />
      <div className="relative z-10">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-apollo-gold">
            Işığın Efendisi
          </p>
          <div className="mt-4 flex items-center gap-3">
            <h1 className="font-display text-6xl text-apollo-text md:text-7xl">
              Apollo
            </h1>
            <FavoriteButton productId="apollo" className="border border-apollo-gold/20 !bg-transparent" />
          </div>
          <div className="mt-2">
            <RatingSummary productId="apollo" textClass="text-apollo-muted" />
          </div>
          <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-apollo-muted">
            Üst segment akvaryumlar için tasarlanan Apollo, gün ışığının tüm
            tayfını su altına taşır. Gün doğumundan gün batımına, bulutların
            gölgesinden derin gece moduna — akvaryumunuzun ritmini siz
            belirlersiniz.
          </p>
          <div className="mt-7">
            <WhatsAppButton theme="apollo" productName="Apollo" />
          </div>
        </div>

        <ProductGallery
          images={["/images/apollo-hero.jpg"]}
          alt="Apollo WRGB akvaryum aydınlatması"
          theme="apollo"
        />
      </section>

      {/* Öne çıkan özellikler */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 rounded-xl border border-apollo-gold/15 bg-apollo-surface/60 px-5 py-4"
            >
              <span className="mt-0.5 text-apollo-gold">✦</span>
              <span className="font-body text-sm text-apollo-text">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Teknik özellikler + Konfigüratör */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-apollo-muted">
              Teknik Özellikler
            </p>
            <TechSpecTable theme="apollo" rows={SPEC_ROWS} />
          </div>
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-apollo-muted">
              Boy & Kasa Rengi Seçin
            </p>
            <ProductConfigurator
              theme="apollo"
              basePrice={7500}
              productName="Apollo"
              imageSrc="/images/apollo-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Mitolojik İlham */}
      <section className="border-t border-apollo-gold/10 px-6 py-24">
        <MythologySection
          theme="apollo"
          eyebrow="Mitolojik İlham"
          title="Güneşin Günlük Yolculuğu"
          paragraphs={[
            "Antik mitolojide Apollo, ışığı ve düzeni gökyüzüne taşıyan tanrı olarak anılır — her gün aynı titizlikle doğar, gökyüzünü kat eder ve akşamla birlikte yerini alacağı ışığa yol verir.",
            "Apollo serisi, bu döngüyü akvaryumunuza taşımak için tasarlandı: gün doğumunun ilk ışınlarından öğlenin keskin netliğine, alacakaranlığın sıcak tonlarından yıldızlı bir geceye kadar — her an, canlılarınızın doğal ritmine sadık kalır.",
          ]}
        />
      </section>

      {/* Işık Önizleme */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <AquariumLightPreview minKelvin={6500} maxKelvin={18000} accent="#D4A343" />
      </section>

      {/* Değerlendirmeler */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <ReviewsSection productId="apollo" theme="apollo" />
      </section>

      {/* Çapraz Satış */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <CrossSell current="apollo" />
      </section>
      </div>
    </div>
  );
}
