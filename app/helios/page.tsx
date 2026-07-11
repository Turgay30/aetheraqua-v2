import Image from "next/image";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import TechSpecTable from "@/components/product/TechSpecTable";
import MythologySection from "@/components/product/MythologySection";
import WhatsAppButton from "@/components/product/WhatsAppButton";
import DecorativeGlow from "@/components/DecorativeGlow";

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
    <div className="relative overflow-hidden bg-helios-bg">
      <DecorativeGlow colorA="bg-helios-bronze/35" colorB="bg-aqua-dim/30" />
      <div className="relative z-10">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-helios-bronze">
            Gündüzün Taşıyıcısı
          </p>
          <h1 className="mt-4 font-display text-6xl text-helios-text md:text-7xl">
            Helios
          </h1>
          <p className="mt-5 max-w-md font-body text-[15px] leading-relaxed text-helios-muted">
            Her akvaryum için doğru, dengeli ve güvenilir bir gündüz ışığı.
            Helios, gösterişten çok tutarlılığa odaklanır — kurar, ayarlar ve
            her gün aynı netlikte ışık alırsınız.
          </p>
          <div className="mt-7">
            <WhatsAppButton theme="helios" productName="Helios" />
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-helios-line">
          <Image
            src="/images/helios-hero.jpg"
            alt="Helios WRGB akvaryum aydınlatması"
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
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
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-helios-muted">
              Teknik Özellikler
            </p>
            <TechSpecTable theme="helios" rows={SPEC_ROWS} />
          </div>
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-helios-muted">
              Boy & Kasa Rengi Seçin
            </p>
            <ProductConfigurator theme="helios" basePrice={4200} productName="Helios" />
          </div>
        </div>
      </section>

      {/* Mitolojik İlham */}
      <section className="border-t border-helios-line px-6 py-24">
        <MythologySection
          theme="helios"
          eyebrow="Mitolojik İlham"
          title="Hiç Aksamayan Güzergah"
          paragraphs={[
            "Antik Yunan'da Helios, dört atlı arabasını her sabah doğudan batıya sürerek göğü kat eden Titan'dı — sadakatle, hiç aksamadan, her gün aynı güzergahta.",
            "Helios serisi bu güvenilirliği yansıtır: gösterişten uzak, sabit ve dengeli bir gündüz ışığı sunar. Akvaryumunuzun her köşesine, her gün aynı netlikte ulaşan, hiç yorulmayan bir güneş.",
          ]}
        />
      </section>
      </div>
    </div>
  );
}
