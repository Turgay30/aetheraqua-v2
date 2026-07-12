"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MarketingConsentToggle({ userId }: { userId: string }) {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("marketing_consent")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setConsent(data?.marketing_consent ?? false));
  }, [userId]);

  async function toggle() {
    if (consent === null || saving) return;
    setSaving(true);
    const supabase = createClient();
    const next = !consent;
    await supabase.from("profiles").upsert({ id: userId, marketing_consent: next });
    setConsent(next);
    setSaving(false);
  }

  if (consent === null) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-abyss-border bg-abyss-surface p-5">
      <div className="pr-4">
        <p className="font-body text-sm font-semibold text-ink">
          Kampanya ve Fırsat Bildirimleri
        </p>
        <p className="mt-1 font-body text-xs text-ink-muted">
          Yeni ürünler, indirimler ve kampanyalardan e-posta ile haberdar
          olmak istiyorum (KVKK kapsamında ticari elektronik ileti izni).
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={saving}
        aria-pressed={consent}
        aria-label="Pazarlama izni"
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          consent ? "bg-aqua" : "bg-abyss-border"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-abyss transition-transform ${
            consent ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
