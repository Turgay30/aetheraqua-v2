import Image from "next/image";

export default function GhostBackground({ opacity = 0.16 }: { opacity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity }} aria-hidden="true">
      <Image src="/images/ruins-bg.jpg" alt="" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/40 via-transparent to-abyss" />
    </div>
  );
}
