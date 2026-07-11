import type { Metadata } from "next";
import DecorativeGlow from "@/components/DecorativeGlow";
import { CONTACT_EMAIL } from "@/lib/contact";
import WhatsAppButton from "@/components/product/WhatsAppButton";

export const metadata: Metadata = {
  title: "İletişim | AetherAqua",
  description: "Sorularınız için AetherAqua ekibiyle WhatsApp veya e-posta üzerinden iletişime geçin.",
};

export default function IletisimPage() {
  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">İletişim</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Bize Ulaşın</h1>
        <p className="mt-5 font-body text-base text-ink-muted">
          Ürünler, sipariş durumu veya akvaryum kurulumuyla ilgili her
          sorunuz için buradayız.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <WhatsAppButton theme="apollo" productName="AetherAqua ürünleri" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full border border-abyss-border px-5 py-2.5 font-body text-sm text-ink-muted transition-colors hover:border-aqua hover:text-aqua"
          >
            <MailIcon />
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-2">
          <InfoCard title="Çalışma Saatleri" text="Hafta içi 09:00–18:00 arası WhatsApp ve e-posta üzerinden yanıt veriyoruz." />
          <InfoCard title="Sipariş Sorguları" text="Sipariş numaranızla birlikte yazarsanız daha hızlı yardımcı olabiliriz." />
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <p className="font-body text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1.5 font-body text-sm text-ink-muted">{text}</p>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 6h18v12H3V6zm0 0l9 7 9-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
