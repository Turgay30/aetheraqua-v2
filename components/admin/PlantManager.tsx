"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

type Plant = {
  id: string;
  name: string;
  image_url: string;
  note: string;
  light_level: "düşük" | "orta" | "yüksek";
  co2_required: boolean;
};

const emptyForm = { name: "", note: "", lightLevel: "orta" as Plant["light_level"], co2Required: false };

export default function PlantManager() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("plants").select("*").order("name");
    setPlants((data as Plant[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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

  function startEdit(plant: Plant) {
    setEditingId(plant.id);
    setForm({ name: plant.name, note: plant.note, lightLevel: plant.light_level, co2Required: plant.co2_required });
    setFile(null);
    setFormOpen(true);
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingId(null);
    setFile(null);
    setForm(emptyForm);
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
      imageUrl = await uploadImage(file, "plants");
      if (!imageUrl) {
        setSaving(false);
        alert("Görsel yüklenemedi, tekrar deneyin.");
        return;
      }
    }

    if (isEdit) {
      const payload: Record<string, unknown> = {
        name: form.name,
        note: form.note,
        light_level: form.lightLevel,
        co2_required: form.co2Required,
      };
      if (imageUrl) payload.image_url = imageUrl;
      const { error } = await supabase.from("plants").update(payload).eq("id", editingId);
      setSaving(false);
      if (error) {
        alert("Güncellenirken bir sorun oluştu: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("plants").insert({
        id: slugify(form.name),
        name: form.name,
        image_url: imageUrl,
        note: form.note,
        light_level: form.lightLevel,
        co2_required: form.co2Required,
      });
      setSaving(false);
      if (error) {
        alert("Bitki eklenirken bir sorun oluştu: " + error.message);
        return;
      }
    }

    cancelForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu bitkiyi silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("plants").delete().eq("id", id);
    load();
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Bitkiler ({plants.length})
        </h2>
        <button
          onClick={() => (formOpen ? cancelForm() : setFormOpen(true))}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Bitki"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          {editingId && (
            <p className="rounded-lg bg-aqua/10 px-3 py-2 font-body text-xs text-aqua">
              &quot;{form.name}&quot; düzenleniyor
            </p>
          )}
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Tür Adı</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Not</span>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Işık İhtiyacı</span>
              <select
                value={form.lightLevel}
                onChange={(e) => setForm({ ...form, lightLevel: e.target.value as Plant["light_level"] })}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              >
                <option value="düşük">Düşük</option>
                <option value="orta">Orta</option>
                <option value="yüksek">Yüksek</option>
              </select>
            </label>
            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.co2Required}
                onChange={(e) => setForm({ ...form, co2Required: e.target.checked })}
                className="h-4 w-4 accent-gold"
              />
              <span className="font-body text-sm text-ink-muted">CO2 gerektirir</span>
            </label>
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

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Bitkiyi Yayına Al"}
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {plants.map((p) => (
          <div key={p.id} className="relative overflow-hidden rounded-xl border border-abyss-border bg-abyss-surface">
            <div className="relative aspect-square">
              <Image src={p.image_url} alt={p.name} fill className="object-cover" />
            </div>
            <p className="p-2 font-body text-xs text-ink">{p.name}</p>
            <p className="px-2 pb-2 font-mono text-[10px] text-ink-faint">Işık: {p.light_level}</p>
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              <button
                onClick={() => startEdit(p)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-aqua hover:bg-aqua hover:text-abyss"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-red-400 hover:bg-red-500 hover:text-white"
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
