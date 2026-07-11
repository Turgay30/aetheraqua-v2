export default function LightBeam() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[70%] w-[420px] -translate-x-1/2 animate-glow-slow blur-3xl"
      style={{
        background:
          "linear-gradient(to bottom, rgba(240,222,170,0.35), rgba(224,190,76,0.12) 45%, transparent 85%)",
        clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
      }}
      aria-hidden="true"
    />
  );
}
