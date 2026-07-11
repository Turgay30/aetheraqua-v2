type Theme = "apollo" | "helios";

const themeStyles: Record<Theme, { text: string; muted: string; accent: string }> = {
  apollo: { text: "text-apollo-text", muted: "text-apollo-muted", accent: "text-apollo-gold" },
  helios: { text: "text-helios-text", muted: "text-helios-muted", accent: "text-helios-bronze" },
};

export default function MythologySection({
  theme,
  eyebrow,
  title,
  paragraphs,
}: {
  theme: Theme;
  eyebrow: string;
  title: string;
  paragraphs: string[];
}) {
  const s = themeStyles[theme];
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${s.accent}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-display text-3xl md:text-4xl ${s.text}`}>{title}</h2>
      <div className="mt-6 space-y-4">
        {paragraphs.map((p, idx) => (
          <p key={idx} className={`font-body text-[15px] leading-relaxed ${s.muted}`}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
