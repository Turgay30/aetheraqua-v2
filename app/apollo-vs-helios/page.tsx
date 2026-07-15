import type { Metadata } from "next";
import Link from "next/link";
import DecorativeGlow from "@/components/DecorativeGlow";
import ComparisonQuiz from "@/components/ComparisonQuiz";

export const metadata: Metadata = {
  title: "Apollo mu Helios mu? Karşılaştırma | AetherAqua",
  description:
    "AetherAqua Apollo ve Helios akvaryum aydınlatmalarını karşılaştırın: fiyat, Kelvin aralığı, Wi-Fi kontrol, IP derecesi. 30 saniyelik testle size uygun olanı bulun.",
};

const ROWS: { label: string; apollo: string; helios: string }[] = [
  { label: "Fiyat", apollo: "7.500 TL'den başlıyor", helios: "4.200 TL'den başlıyor" },
  { label: "Renk Sıcaklığı", apollo: "6.500K – 18.000K (ayarlanabilir)", helios: "8.000K (sabit)" },
  { label: "Kontrol", apollo: "Wi-Fi, uygulama üzerinden", helios: "Manuel kademe + zamanlayıcı" },
  { label: "Gün Doğumu/Batımı Otomasyonu", apollo: "Var", helios: "Yok" },
  { label: "CRI (Renk Gerçekliği)", apollo: ">98", helios: ">92" },
  { label: "Su Geçirmezlik", apollo: "IP67", helios: "IP65" },
  { label: "Boy Seçenekleri", apollo: "30–120cm (10 seçenek)", helios: "30–120cm (10 seçenek)" },
  { label: "İdeal Kullanıcı", apollo: "Yoğun bitkili / özenli kurulum", helios: "Pratik, ekonomik çözüm arayan" },
];

export default function ComparisonPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Karşılaştırma</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Apollo mu, Helios mu?</h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          İki karakter, iki farklı ihtiyaç. Aşağıdaki tablodan detaylara bakın ya da 30 saniyelik
          testle size uygun olanı hemen öğrenin.
        </p>

        {/* Karşılaştırma Tablosu */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-abyss-border">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-abyss-border bg-abyss-surface">
                <th className="p-4 text-left font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                  Özellik
                </th>
                <th className="p-4 text-left font-display text-lg text-apollo-gold">Apollo</th>
                <th className="p-4 text-left font-display text-lg text-helios-bronze">Helios</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-abyss-surface/50" : ""}>
                  <td className="p-4 font-body text-sm text-ink-muted">{row.label}</td>
                  <td className="p-4 font-body text-sm text-ink">{row.apollo}</td>
                  <td className="p-4 font-body text-sm text-ink">{row.helios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/apollo"
            className="rounded-full bg-apollo-gold px-6 py-2.5 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.02]"
          >
            Apollo&apos;yu İncele
          </Link>
          <Link
            href="/helios"
            className="rounded-full bg-helios-bronze px-6 py-2.5 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.02]"
          >
            Helios&apos;u İncele
          </Link>
        </div>

        {/* Quiz */}
        <div className="mt-16 max-w-lg">
          <ComparisonQuiz />
        </div>
      </section>
    </div>
  );
}
