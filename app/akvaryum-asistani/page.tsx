import DecorativeGlow from "@/components/DecorativeGlow";
import AquariumAssistant from "@/components/assistant/AquariumAssistant";

export default function AkvaryumAsistaniPage() {
  return (
    <div className="relative overflow-hidden bg-abyss">
      <DecorativeGlow />
      <div className="relative z-10">
        <section className="mx-auto max-w-3xl px-6 pb-14 pt-16 text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-aqua">
            Ücretsiz Araç
          </p>
          <h1 className="font-display text-5xl text-ink md:text-6xl">
            Akvaryum Asistanı
          </h1>
          <p className="mt-6 font-body text-base text-ink-muted">
            Tank ölçünüzü girin, balıklarınızı seçin — uyumluluk, stoklama
            yoğunluğu ve önerilen ekipmanları anında görün.
          </p>
        </section>

        <AquariumAssistant />
      </div>
    </div>
  );
}
