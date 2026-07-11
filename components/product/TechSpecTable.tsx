type Theme = "apollo" | "helios";

const themeStyles: Record<Theme, { text: string; muted: string; border: string; bg: string }> = {
  apollo: { text: "text-apollo-text", muted: "text-apollo-muted", border: "border-apollo-gold/15", bg: "" },
  helios: { text: "text-helios-text", muted: "text-helios-muted", border: "border-helios-line", bg: "bg-helios-surface" },
};

export default function TechSpecTable({
  theme,
  rows,
}: {
  theme: Theme;
  rows: { label: string; value: string }[];
}) {
  const s = themeStyles[theme];
  return (
    <dl className={`divide-y ${s.border} rounded-2xl border ${s.border} ${s.bg}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between px-6 py-4">
          <dt className={`font-body text-sm ${s.muted}`}>{row.label}</dt>
          <dd className={`font-body text-sm font-medium ${s.text}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
