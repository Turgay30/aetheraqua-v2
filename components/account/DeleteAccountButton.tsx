"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch("/api/delete-account", { method: "POST" });

    if (!res.ok) {
      setDeleting(false);
      showToast("Hesap silinirken bir sorun oluştu, lütfen tekrar deneyin.", "error");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="font-body text-xs text-ink-faint underline decoration-red-500/40 underline-offset-4 hover:text-red-400"
      >
        Hesabımı kalıcı olarak sil
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
      <p className="font-body text-sm text-ink">
        Bu işlem geri alınamaz. Hesabınız, favorileriniz, adresleriniz ve profil bilgileriniz kalıcı
        olarak silinecek. Sipariş geçmişiniz yasal saklama yükümlülüğü nedeniyle sistemde kalır ama
        artık hesabınızla ilişkilendirilmez.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full bg-red-500 px-5 py-2 font-body text-xs font-semibold text-white disabled:opacity-50"
        >
          {deleting ? "Siliniyor..." : "Evet, Hesabımı Sil"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-full border border-abyss-border px-5 py-2 font-body text-xs text-ink-muted"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}
