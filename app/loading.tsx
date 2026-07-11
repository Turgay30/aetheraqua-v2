export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-abyss">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-abyss-border border-t-aqua" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
          Yükleniyor
        </p>
      </div>
    </div>
  );
}
