export default function DecorativeGlow({
  colorA = "bg-aqua/10",
  colorB = "bg-gold/10",
}: {
  /** Sol üstteki leke rengi (Tailwind bg-* sınıfı) */
  colorA?: string;
  /** Sağ alttaki leke rengi (Tailwind bg-* sınıfı) */
  colorB?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute left-[-10%] top-[-10%] h-[600px] w-[700px] animate-glow-slow rounded-full ${colorA} blur-[120px]`}
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className={`absolute bottom-[-15%] right-[-5%] h-[450px] w-[450px] animate-glow rounded-full ${colorB} blur-[100px]`}
        style={{ animationDelay: "0.8s" }}
      />
    </div>
  );
}
