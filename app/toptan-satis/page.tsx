import type { Metadata } from "next";
import DecorativeGlow from "@/components/DecorativeGlow";
import WholesaleForm from "@/components/WholesaleForm";

export const metadata: Metadata = {
  title: "Toptan Satış | AetherAqua",
  description:
    "Akvaryum ve petshop işletmeniz için AetherAqua Apollo ve Helios aydınlatmalarında toptan fiyatlandırma. Bize ulaşın, size özel teklif hazırlayalım.",
};

const BENEFITS = [
  { icon: "💰", title: "Toptan Fiyatlandırma", text: "Adet arttıkça birim fiyat düşer, kâr marjınızı koruyun." },
  { icon: "📦", title: "Esnek Sipariş", text: "Minimum sipariş adediyle başlayın, ihtiyacınıza göre büyütün." },
  { icon: "🎓", title: "Ürün Eğitimi", text: "Satış ekibiniz için ürün bilgisi ve satış argümanları desteği." },
  { icon: "🤝", title: "Öncelikli Destek", text: "İş ortaklarımıza özel hızlı iletişim hattı." },
];

export default function ToptanSatisPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">İş Ortaklığı</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Toptan Satış</h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          Akvaryum mağazası, petshop ya da distribütör müsünüz? AetherAqua ürünlerini
          işletmenizde satmak için bize ulaşın, size özel bir teklif hazırlayalım.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-abyss-border bg-abyss-surface p-4">
              <span className="text-2xl">{b.icon}</span>
              <p className="mt-2 font-body text-sm font-semibold text-ink">{b.title}</p>
              <p className="mt-1 font-body text-xs text-ink-muted">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-lg">
          <WholesaleForm />
        </div>
      </section>
    </div>
  );
}
