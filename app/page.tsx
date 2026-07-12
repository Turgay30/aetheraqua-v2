import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import AssistantBanner from "@/components/AssistantBanner";
import SpecStrip from "@/components/SpecStrip";
import DecorativeGlow from "@/components/DecorativeGlow";
import LightBeam from "@/components/LightBeam";
import GhostBackground from "@/components/GhostBackground";
import MoreProducts from "@/components/MoreProducts";
import SocialProofBadge from "@/components/SocialProofBadge";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-abyss-gradient">
        <GhostBackground />
        <LightBeam />
        <DecorativeGlow />
        <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-aqua">
            Profesyonel Akvaryum Aydınlatması
          </p>
          <h1 className="font-display text-5xl uppercase leading-[1.05] text-ink sm:text-6xl md:text-7xl">
            Tanrıların
            <br />
            <span className="text-gold">elinden çıkmış gibi</span>
          </h1>
          <p className="mt-6 max-w-xl font-body text-base text-ink-muted md:text-lg">
            Apollo ve Helios — tam spektrum WRGB aydınlatma serisi.
            Akvaryumunuz için mitolojiden ilham alan iki farklı karakter, tek
            bir amaç: su altını gerçeğe en yakın haliyle aydınlatmak.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/apollo"
              className="rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.03]"
            >
              Apollo&apos;yu Keşfet
            </Link>
            <Link
              href="/helios"
              className="rounded-full border border-abyss-border px-8 py-3 font-body text-sm font-semibold text-ink transition-colors hover:border-aqua hover:text-aqua"
            >
              Helios&apos;u Keşfet
            </Link>
          </div>

          <SocialProofBadge />
        </section>
      </div>

      <SpecStrip />

      {/* Ürünler */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-ink-faint">
            İki Karakter
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Işığın İki Hali
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductCard
            variant="apollo"
            name="Apollo"
            tagline="Işığın Efendisi"
            specs={["Tam Spektrum", "Wi-Fi Kontrol", "Gün Doğumu/Batımı", "CRI >98"]}
            startingPrice="7.500 TL"
            imageSrc="/images/apollo-hero.jpg"
            href="/apollo"
          />
          <ProductCard
            variant="helios"
            name="Helios"
            tagline="Gündüzün Taşıyıcısı"
            specs={["8.000K Sabit Çıkış", "Manuel Kademe", "Zamanlayıcı", "CRI >92"]}
            startingPrice="4.200 TL"
            imageSrc="/images/helios-hero.jpg"
            href="/helios"
          />
        </div>
      </section>

      <MoreProducts />

      <RecentlyViewed />

      {/* Akvaryum Asistanı */}
      <section className="px-6 pb-24">
        <AssistantBanner />
      </section>
    </div>
  );
}
