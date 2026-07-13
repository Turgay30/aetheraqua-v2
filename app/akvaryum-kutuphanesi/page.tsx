import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import DecorativeGlow from "@/components/DecorativeGlow";
import LibraryBrowser from "@/components/library/LibraryBrowser";

export const metadata: Metadata = {
  title: "Akvaryum Kütüphanesi | AetherAqua",
  description:
    "Balık, bitki ve kabuklu türleri hakkında bakım bilgileri — ışık ihtiyacı, minimum tank hacmi, sürü büyüklüğü ve daha fazlası.",
};

export const revalidate = 60;

export default async function AkvaryumKutuphanesiPage() {
  const supabase = await createClient();

  const [fishRes, shrimpRes, plantRes] = await Promise.all([
    supabase.from("fish_species").select("*").order("name"),
    supabase.from("shrimp_species").select("*").order("name"),
    supabase.from("plants").select("*").order("name"),
  ]);

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Kütüphane</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Akvaryum Kütüphanesi</h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          Balık, bitki ve kabuklu türleri hakkında bakım bilgileri. Beğendiğiniz bir tür varsa,
          Akvaryum Asistanı&apos;na dönüp kaldığınız yerden seçime devam edebilirsiniz.
        </p>

        <Suspense fallback={null}>
          <LibraryBrowser
            fish={fishRes.data ?? []}
            shrimp={shrimpRes.data ?? []}
            plants={plantRes.data ?? []}
          />
        </Suspense>
      </section>
    </div>
  );
}
