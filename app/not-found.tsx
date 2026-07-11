import Link from "next/link";
import DecorativeGlow from "@/components/DecorativeGlow";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">404</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
          Bu Sular Bilinmiyor
        </h1>
        <p className="mt-5 font-body text-base text-ink-muted">
          Aradığınız sayfa mevcut değil ya da yerini değiştirmiş olabilir.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.03]"
        >
          Ana Sayfaya Dön
        </Link>
      </section>
    </div>
  );
}
