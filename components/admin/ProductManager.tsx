"use client";

import { useToast } from "@/components/ToastProvider";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

type CustomProduct = {
  product_id: string;
  name: string;
  tagline: string;
  accent_color: string;
  images: string[];
  base_price: number;
};

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  basePrice: "5000",
  accentColor: "#C9A227",
  mythologyTitle: "",
};

export default function ProductManager() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [techSpecs, setTechSpecs] = useState<{ label: string; value: string }[]>([{ label: "", value: "" }]);
  const [mythParagraphs, setMythParagraphs] = useState<string[]>([""]);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("product_id, name, tagline, accent_color, images, base_price")
      .eq("is_builtin", false)
      .order("name");
    setProducts((data as CustomProduct[]) ?? []);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      showToast("En az bir görsel ekleyin.", "error");
      return;
    }
    setSaving(true);

    const imageUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, "products");
      if (url) imageUrls.push(url);
    }

    const id = slugify(form.name);
    if (id === "apollo" || id === "helios") {
      setSaving(false);
      showToast("Bu isim ayrılmış, lütfen başka bir isim kullanın.", "error");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      product_id: id,
      is_builtin: false,
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      base_price: Number(form.basePrice),
      accent_color: form.accentColor,
      images: imageUrls,
      features: features.filter((f) => f.trim()),
      tech_specs: techSpecs.filter((t) => t.label.trim() && t.value.trim()),
      mythology_title: form.mythologyTitle,
      mythology_paragraphs: mythParagraphs.filter((p) => p.trim()),
    });

    setSaving(false);

    if (error) {
      showToast("Ürün eklenirken bir sorun oluştu: " + error.message, "error");
      return;
    }

    setFormOpen(false);
    setForm(emptyForm);
    setFiles([]);
    setFeatures([""]);
    setTechSpecs([{ label: "", value: "" }]);
    setMythParagraphs([""]);
    showToast("Ürün yayına alındı", "success");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("product_id", id);
    showToast("Ürün silindi", "success");
    load();
  }

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Ek Ürünler ({products.length})
        </h2>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Ürün"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-5 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ürün Adı" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Slogan" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
          </div>

          <TextAreaField label="Açıklama" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Taban Fiyat (TL, 30cm)" type="number" value={form.basePrice} onChange={(v) => setForm({ ...form, basePrice: v })} />
            <div>
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Ana Renk
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded border border-abyss-border bg-abyss"
                />
                <input
                  type="text"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-28 rounded-lg border border-abyss-border bg-abyss px-2 py-1.5 font-mono text-xs text-ink outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Görseller (ilki kapak fotoğrafı olur)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="w-full font-body text-xs text-ink-muted"
            />
          </div>

          <RepeatableList
            label="Öne Çıkan Özellikler"
            items={features}
            onChange={setFeatures}
            renderItem={(item, i, onChange) => (
              <input
                value={item}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Özellik ${i + 1}`}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              />
            )}
            newItem=""
          />

          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Teknik Özellikler
            </span>
            <div className="space-y-2">
              {techSpecs.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={row.label}
                    onChange={(e) => {
                      const next = [...techSpecs];
                      next[i] = { ...next[i], label: e.target.value };
                      setTechSpecs(next);
                    }}
                    placeholder="Etiket (örn. CRI)"
                    className="w-1/2 rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
                  />
                  <input
                    value={row.value}
                    onChange={(e) => {
                      const next = [...techSpecs];
                      next[i] = { ...next[i], value: e.target.value };
                      setTechSpecs(next);
                    }}
                    placeholder="Değer (örn. >95)"
                    className="w-1/2 rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTechSpecs([...techSpecs, { label: "", value: "" }])}
              className="mt-2 font-body text-xs text-aqua hover:underline"
            >
              + Satır Ekle
            </button>
          </div>

          <Field label="Mitoloji Başlığı" value={form.mythologyTitle} onChange={(v) => setForm({ ...form, mythologyTitle: v })} />

          <RepeatableList
            label="Mitoloji Metni (paragraf paragraf)"
            items={mythParagraphs}
            onChange={setMythParagraphs}
            renderItem={(item, i, onChange) => (
              <textarea
                value={item}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Paragraf ${i + 1}`}
                rows={2}
                className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
              />
            )}
            newItem=""
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Ürünü Yayına Al"}
          </button>
        </form>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((p) => (
          <div key={p.product_id} className="relative overflow-hidden rounded-xl border border-abyss-border bg-abyss-surface">
            <Link href={`/urun/${p.product_id}`} className="block">
              <div className="relative aspect-square">
                {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
              </div>
              <p className="p-2 font-body text-xs text-ink">{p.name}</p>
            </Link>
            <button
              onClick={() => handleDelete(p.product_id)}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-abyss/80 text-red-400 hover:bg-red-500 hover:text-white"
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
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</span>
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

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
      />
    </label>
  );
}

function RepeatableList({
  label,
  items,
  onChange,
  renderItem,
  newItem,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  renderItem: (item: string, index: number, onChange: (v: string) => void) => React.ReactNode;
  newItem: string;
}) {
  return (
    <div>
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</span>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              {renderItem(item, i, (v) => {
                const next = [...items];
                next[i] = v;
                onChange(next);
              })}
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="flex-shrink-0 text-ink-faint hover:text-red-400"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, newItem])}
        className="mt-2 font-body text-xs text-aqua hover:underline"
      >
        + Ekle
      </button>
    </div>
  );
}
