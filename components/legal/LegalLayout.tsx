import { ReactNode } from "react";

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-abyss">
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl text-ink md:text-5xl">{title}</h1>
        <p className="mt-2 font-body text-xs text-ink-faint">Son güncelleme: {lastUpdated}</p>

        <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.04] px-5 py-4">
          <p className="font-body text-xs leading-relaxed text-ink-muted">
            <span className="font-semibold text-gold">Not:</span> Bu sayfa, site
            geliştirme sürecinde hazırlanmış bir taslaktır ve hukuki
            danışmanlık niteliği taşımaz. Yayına almadan önce şirket
            bilgilerinizi (unvan, adres, vergi no vb.) eksiksiz doldurmanız ve
            bir hukuk danışmanına kontrol ettirmeniz önerilir.
          </p>
        </div>

        <div className="prose-legal mt-10 space-y-8">{children}</div>
      </section>
    </div>
  );
}
