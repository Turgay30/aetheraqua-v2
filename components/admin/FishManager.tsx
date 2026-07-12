"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { FishSpecies } from "@/lib/fish-data";

export default function FishManager() {
  const [species, setSpecies] = useState<FishSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [incompatibleWith, setIncompatibleWith] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    id: "",
    name: "",
    latinName: "",
    note: "",
    minShoalSize: "6",
    minTankLiters: "45",
    adultSizeCm: "5",
  });

  async function loadSpecies() {
    const supabase = createClient();
    const { data } = await supabase.from("fish_species").select("*").order("name");
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

  function toggleIncompatible(id: string) {
    setIncompatibleWith((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Lütfen bir görsel seçin.");
      return;
    }
    setSaving(true);

    const imageUrl = await uploadImage(file, "fish");
    if (!imageUrl) {
      setSaving(false);
      alert("Görsel yüklenemedi, tekrar deneyin.");
      return;
    }

    const id = slugify(form.name);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("fish_species").insert({
      id,
      name: form.name,
      latin_name: form.latinName,
      image_url: imageUrl,
      note: form.note,
      min_shoal_size: Number(form.minShoalSize),
      min_tank_liters: Number(form.minTankLiters),
      adult_size_cm: Number(form.adultSizeCm),
    });

    if (insertError) {
      setSaving(false);
      alert("Balık eklenirken bir sorun oluştu: " + insertError.message);
      return;
    }

    // Uyumsuzluk ilişkilerini iki yönde de kaydet
    if (incompatibleWith.size > 0) {
      const rows = Array.from(incompatibleWith).flatMap((otherId) => [
        { fish_a: id, fish_b: otherId, compatible: false },
        { fish_a: otherId, fish_b: id, compatible: false },
      ]);
      await supabase.from("fish_compatibility").insert(rows);
    }

    setSaving(false);
    setFormOpen(false);
    setFile(null);
    setIncompatibleWith(new Set());
    setForm({ id: "", name: "", latinName: "", note: "", minShoalSize: "6", minTankLiters: "45", adultSizeCm: "5" });
    loadSpecies();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu balığı silmek istediğinize emin misiniz? Uyumluluk ilişkileri de silinecek.")) return;
    const supabase = createClient();
    await supabase.from("fish_species").delete().eq("id", id);
    loadSpecies();
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Balık Türleri ({species.length})
        </h2>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Balık"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="mt-4 space-y-4 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tür Adı" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Latince Adı" value={form.latinName} onChange={(v) => setForm({ ...form, latinName: v })} />
          </div>
          <Field label="Not" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Min. Sürü" type="number" value={form.minShoalSize} onChange={(v) => setForm({ ...form, minShoalSize: v })} />
            <Field label="Min. Tank (L)" type="number" value={form.minTankLiters} onChange={(v) => setForm({ ...form, minTankLiters: v })} />
            <Field label="Yetişkin Boy (cm)" type="number" value={form.adultSizeCm} onChange={(v) => setForm({ ...form, adultSizeCm: v })} />
          </div>

          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Görsel
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full font-body text-xs text-ink-muted"
              required
            />
          </div>

          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Uyumsuz Olduğu Türler (varsa işaretleyin — işaretlenmeyenler otomatik uyumlu sayılır)
            </span>
            <div className="flex flex-wrap gap-2">
              {species.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleIncompatible(f.id)}
                  className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                    incompatibleWith.has(f.id)
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-abyss-border text-ink-muted hover:border-ink-faint"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Balığı Yayına Al"}
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {species.map((f) => (
          <div key={f.id} className="relative overflow-hidden rounded-xl border border-abyss-border bg-abyss-surface">
            <div className="relative aspect-square">
              <Image src={f.image} alt={f.name} fill className="object-cover" />
            </div>
            <p className="p-2 font-body text-xs text-ink">{f.name}</p>
            <button
              onClick={() => handleDelete(f.id)}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-red-400 hover:bg-red-500 hover:text-white"
              aria-label={`${f.name} sil`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}
