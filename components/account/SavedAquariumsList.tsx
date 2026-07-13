"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";

const SESSION_KEY = "aetheraqua_assistant_state";

type SavedAquarium = {
  id: string;
  name: string;
  liters: number;
  mode: string;
  selection: Record<string, number>;
  selected_plant_ids: string[];
  created_at: string;
};

export default function SavedAquariumsList({ userId }: { userId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [aquariums, setAquariums] = useState<SavedAquarium[] | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("saved_aquariums")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setAquariums((data as SavedAquarium[]) ?? []);
  }

  useEffect(() => {
    load();
  }, [userId]);

  function handleLoad(aq: SavedAquarium) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        liters: aq.liters,
        mode: aq.mode,
        selection: aq.selection,
        selectedPlantIds: aq.selected_plant_ids,
      })
    );
    router.push("/akvaryum-asistani");
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kayıtlı akvaryumu silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("saved_aquariums").delete().eq("id", id);
    showToast("Silindi", "success");
    load();
  }

  if (aquariums === null) return null;
  if (aquariums.length === 0) {
    return (
      <p className="font-body text-sm text-ink-muted">
        Henüz kayıtlı bir akvaryum kurulumunuz yok — Akvaryum Asistanı&apos;nda bir seçim yapıp
        &quot;Akvaryumumu Kaydet&quot; ile buraya ekleyebilirsiniz.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {aquariums.map((aq) => (
        <div
          key={aq.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-abyss-border bg-abyss-surface p-4"
        >
          <div>
            <p className="font-body text-sm font-semibold text-ink">{aq.name}</p>
            <p className="font-body text-xs text-ink-faint">
              {aq.liters}L ·{" "}
              {new Date(aq.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLoad(aq)}
              className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
            >
              Yükle
            </button>
            <button
              onClick={() => handleDelete(aq.id)}
              className="text-ink-faint hover:text-red-400"
              aria-label="Sil"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
