import type { Metadata } from "next";
import DecorativeGlow from "@/components/DecorativeGlow";
import GiftCardForm from "@/components/GiftCardForm";

export const metadata: Metadata = {
  title: "Hediye Kartı | AetherAqua",
  description:
    "Akvaryum tutkunu bir arkadaşınıza ya da sevdiğinize AetherAqua hediye kartı gönderin. İstediğiniz tutarda, anında e-posta ile teslim.",
};

export default function HediyeKartiPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">🎁 Hediye Kartı</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
          Akvaryum Tutkununa Hediye Verin
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          Ne hediye alacağınızı bilmiyorsanız, seçimi ona bırakın. AetherAqua hediye kartı
          e-posta ile anında teslim edilir, sitedeki herhangi bir üründe kullanılabilir.
        </p>

        <div className="mt-12 max-w-lg">
          <GiftCardForm />
        </div>
      </section>
    </div>
  );
}
