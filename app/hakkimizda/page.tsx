import type { Metadata } from "next";
import DecorativeGlow from "@/components/DecorativeGlow";

export const metadata: Metadata = {
  title: "Hakkımızda | AetherAqua",
  description:
    "AetherAqua'nın hikayesi: mitolojiden ilham alan, profesyonel akvaryum aydınlatmaları tasarlıyoruz.",
};

export default function HakkimizdaPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Hakkımızda</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
          Işığın Zanaatı
        </h1>

        <div className="mt-10 space-y-6 font-body text-[15px] leading-relaxed text-ink-muted">
          <p>
            AetherAqua, akvaryum aydınlatmasına mühendislik hassasiyetiyle
            yaklaşan bir tasarım stüdyosu olarak kuruldu. Yola çıkış
            noktamız basitti: piyasadaki çoğu aydınlatma ürünü ya teknik
            olarak yetersiz kalıyor ya da akvaryumun asıl kahramanı olan
            bitki ve balıkları geri planda bırakan kaba bir görünüm
            sunuyordu. Biz ikisi arasında bir denge kurmak istedik.
          </p>
          <p>
            Ürünlerimizin isimlerini Yunan mitolojisinden seçtik çünkü
            ışığın kendisi, insanlık tarihinin en eski anlatılarından
            biri. Apollo, ışığın değişken ve yaratıcı yüzünü; Helios ise
            hiç aksamayan, güvenilir gündüz ışığını temsil ediyor. Bu iki
            karakter, akvaryum sahiplerinin gerçekte ihtiyaç duyduğu iki
            farklı yaklaşımı yansıtıyor: kimi zaman tam kontrol ve
            gösteriş, kimi zaman sade ve tutarlı bir çözüm.
          </p>
          <p>
            Her ürünümüzü CRI, renk sıcaklığı doğruluğu ve su geçirmezlik
            gibi ölçülebilir standartlara göre test ediyoruz. Aynı
            zamanda ücretsiz Akvaryum Asistanı aracımızla, sadece ışık
            satan değil, akvaryumculuk yolculuğunuzun her adımında
            yanınızda olan bir marka olmayı hedefliyoruz.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <ValueCard title="Hassasiyet" text="Her ürün, ölçülebilir teknik standartlara göre test edilir." />
          <ValueCard title="Denge" text="Estetik ve mühendislik arasında bilinçli bir denge kurarız." />
          <ValueCard title="Şeffaflık" text="Fiyatlandırma ve teknik özellikler her zaman açık ve nettir." />
        </div>
      </section>
    </div>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <p className="font-display text-lg text-gold">{title}</p>
      <p className="mt-2 font-body text-sm text-ink-muted">{text}</p>
    </div>
  );
}
