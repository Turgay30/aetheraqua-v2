"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { CompatibilityKey } from "@/lib/livestock";
import { saveCompatibility, loadIncompatibleWith } from "@/lib/admin-compatibility";
import CompatibilityPicker from "@/components/admin/CompatibilityPicker";
import FormField from "@/components/admin/FormField";

type Shrimp = {
  id: string;
  name: string;
  latinName: string;
  image: string;
  note: string;
  minShoalSize: number;
  minTankLiters: number;
  adultSizeCm: number;
};

export default function ShrimpManager() {
  const [species, setSpecies] = useState<Shrimp[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [incompatibleWith, setIncompatibleWith] = useState<Set<CompatibilityKey>>(new Set());

  const [form, setForm] = useState({
    name: "",
    latinName: "",
    note: "",
    minShoalSize: "5",
    minTankLiters: "20",
    adultSizeCm: "3",
  });

  async function loadSpecies() {
    const supabase = createClient();
    const { data } = await supabase.from("shrimp_species").select("*").order("name");
    setSpecies(
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        latinName: row.latin_name,
        image: row.image_url,
        note: row.note,
        minShoalSize: row.min_shoal_size,
        minTankLiters: row.min_tank_liters,
        adultSizeCm: Number(row.adult_size_cm),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    loadSpecies();
  }, []);

  async function startEdit(shrimp: Shrimp) {
    setEditingId(shrimp.id);
    setForm({
      name: shrimp.name,
      latinName: shrimp.latinName,
      note: shrimp.note,
      minShoalSize: String(shrimp.minShoalSize),
      minTankLiters: String(shrimp.minTankLiters),
      adultSizeCm: String(shrimp.adultSizeCm),
    });
    setFile(null);
    setFormOpen(true);
    setIncompatibleWith(await loadIncompatibleWith("shrimp", shrimp.id));
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingId(null);
    setFile(null);
    setIncompatibleWith(new Set());
    setForm({ name: "", latinName: "", note: "", minShoalSize: "5", minTankLiters: "20", adultSizeCm: "3" });
  }

  function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ş/g, "s")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = !!editingId;

    if (!isEdit && !file) {
      alert("Lütfen bir görsel seçin.");
      return;
    }
    setSaving(true);

    const supabase = createClient();
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await uploadImage(file, "shrimp");
      if (!imageUrl) {
        setSaving(false);
        alert("Görsel yüklenemedi, tekrar deneyin.");
        return;
      }
    }

    const id = isEdit ? editingId! : slugify(form.name);

    if (isEdit) {
      const updatePayload: Record<string, unknown> = {
        name: form.name,
        latin_name: form.latinName,
        note: form.note,
        min_shoal_size: Number(form.minShoalSize),
        min_tank_liters: Number(form.minTankLiters),
        adult_size_cm: Number(form.adultSizeCm),
      };
      if (imageUrl) updatePayload.image_url = imageUrl;

      const { error } = await supabase.from("shrimp_species").update(updatePayload).eq("id", id);
      if (error) {
        setSaving(false);
        alert("Güncellenirken bir sorun oluştu: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("shrimp_species").insert({
        id,
        name: form.name,
        latin_name: form.latinName,
        image_url: imageUrl,
        note: form.note,
        min_shoal_size: Number(form.minShoalSize),
        min_tank_liters: Number(form.minTankLiters),
        adult_size_cm: Number(form.adultSizeCm),
      });
      if (error) {
        setSaving(false);
        alert("Kabuklu eklenirken bir sorun oluştu: " + error.message);
        return;
      }
    }

    await saveCompatibility("shrimp", id, incompatibleWith);

    setSaving(false);
    cancelForm();
    loadSpecies();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu türü silmek istediğinize emin misiniz? Uyumluluk ilişkileri de silinecek.")) return;
    const supabase = createClient();
    await supabase.from("shrimp_species").delete().eq("id", id);
    loadSpecies();
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Kabuklular ({species.length})
        </h2>
        <button
          onClick={() => (formOpen ? cancelForm() : setFormOpen(true))}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Tür"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          {editingId && (
            <p className="rounded-lg bg-aqua/10 px-3 py-2 font-body text-xs text-aqua">
              &quot;{form.name}&quot; düzenleniyor
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tür Adı" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <FormField label="Latince Adı" value={form.latinName} onChange={(v) => setForm({ ...form, latinName: v })} />
          </div>
          <FormField label="Not" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Min. Grup" type="number" value={form.minShoalSize} onChange={(v) => setForm({ ...form, minShoalSize: v })} />
            <FormField label="Min. Tank (L)" type="number" value={form.minTankLiters} onChange={(v) => setForm({ ...form, minTankLiters: v })} />
            <FormField label="Yetişkin Boy (cm)" type="number" value={form.adultSizeCm} onChange={(v) => setForm({ ...form, adultSizeCm: v })} />
          </div>

          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Görsel {editingId && "(değiştirmek istemiyorsanız boş bırakın)"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full font-body text-xs text-ink-muted"
              required={!editingId}
            />
          </div>

          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Uyumsuz Olduğu Canlılar (balık, kabuklu veya bitki — işaretlenmeyenler otomatik uyumlu sayılır)
            </span>
            <CompatibilityPicker
              excludeType="shrimp"
              excludeId={editingId ?? undefined}
              selected={incompatibleWith}
              onChange={setIncompatibleWith}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Türü Yayına Al"}
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {species.map((s) => (
          <div key={s.id} className="relative overflow-hidden rounded-xl border border-abyss-border bg-abyss-surface">
            <div className="relative aspect-square">
              <Image src={s.image} alt={s.name} fill className="object-cover" />
            </div>
            <p className="p-2 font-body text-xs text-ink">{s.name}</p>
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              <button
                onClick={() => startEdit(s)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-aqua hover:bg-aqua hover:text-abyss"
                aria-label={`${s.name} düzenle`}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-red-400 hover:bg-red-500 hover:text-white"
                aria-label={`${s.name} sil`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
