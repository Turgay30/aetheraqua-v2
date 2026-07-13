"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { buildWhatsAppLink } from "@/lib/contact";

export default function ReferralCard({ userId }: { userId: string }) {
  const { showToast } = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setCode(data?.referral_code ?? null));
  }, [userId]);

  if (!code) return null;

  const link = `https://aetheraqua.com/kayit?ref=${code}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Panoya kopyalanamadı.", "error");
    }
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/[0.04] p-5">
      <p className="font-body text-sm text-ink">
        🎁 Arkadaşınızı davet edin — hesap oluşturunca ikinize de{" "}
        <span className="text-gold">%10 indirim kuponu</span> tanımlanır.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-mono text-xs text-ink-muted">
          {link}
        </code>
        <button
          onClick={handleCopy}
          className="rounded-full border border-abyss-border px-4 py-2 font-body text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
        >
          {copied ? "Kopyalandı ✓" : "Linki Kopyala"}
        </button>
        <a
          href={buildWhatsAppLink(`Bana AetherAqua'dan %10 indirimli katıl! ${link}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-abyss-border px-4 py-2 font-body text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
        >
          WhatsApp&apos;tan Gönder
        </a>
      </div>
    </div>
  );
}
