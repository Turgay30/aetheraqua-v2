import { ReactNode } from "react";

export default function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl text-gold">{title}</h2>
      <div className="mt-2.5 space-y-2.5 font-body text-sm leading-relaxed text-ink-muted">
        {children}
      </div>
    </div>
  );
}
