"use client";

import { useToast } from "@/components/ToastProvider";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

const emptyForm = { title: "", excerpt: "", content: "" };

export default function BlogManager() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ş/g, "s")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content });
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
    setSaving(true);
    const supabase = createClient();

    let coverUrl: string | null = null;
    if (file) {
      coverUrl = await uploadImage(file, "blog");
    }

    if (editingId) {
      const payload: Record<string, unknown> = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
      };
      if (coverUrl) payload.cover_image = coverUrl;
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
      setSaving(false);
      if (error) {
        showToast("Güncellenirken bir sorun oluştu: " + error.message, "error");
        return;
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert({
        slug: slugify(form.title),
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: coverUrl,
      });
      setSaving(false);
      if (error) {
        showToast("Yazı eklenirken bir sorun oluştu: " + error.message, "error");
        return;
      }
    }

    showToast(editingId ? "Yazı güncellendi" : "Yazı yayınlandı", "success");
    cancelForm();
    load();
  }

  async function togglePublished(id: string, published: boolean) {
    const supabase = createClient();
    await supabase.from("blog_posts").update({ published: !published }).eq("id", id);
    showToast(published ? "Taslağa alındı" : "Yayına alındı", "success");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    showToast("Yazı silindi", "success");
    load();
  }

  if (posts === null) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Blog Yazıları ({posts.length})
        </h2>
        <button
          onClick={() => (formOpen ? cancelForm() : setFormOpen(true))}
          className="rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-abyss"
        >
          {formOpen ? "İptal" : "+ Yeni Yazı"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-abyss-border bg-abyss-surface p-5">
          {editingId && (
            <p className="rounded-lg bg-aqua/10 px-3 py-2 font-body text-xs text-aqua">
              &quot;{form.title}&quot; düzenleniyor
            </p>
          )}
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Başlık</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Özet (liste sayfasında görünür)
            </span>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              İçerik (paragrafları boş satırla ayırın)
            </span>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              required
              className="w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none"
            />
          </label>
          <div>
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Kapak Görseli {editingId && "(değiştirmek istemiyorsanız boş bırakın)"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full font-body text-xs text-ink-muted"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-abyss disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Yazıyı Oluştur"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-abyss-border bg-abyss-surface p-4">
            <div>
              <p className="font-body text-sm text-ink">{post.title}</p>
              <p className="font-mono text-[11px] text-ink-faint">/blog/{post.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePublished(post.id, post.published)}
                className={`rounded-full px-3 py-1 font-body text-xs ${
                  post.published ? "bg-emerald-400/10 text-emerald-400" : "bg-abyss text-ink-faint"
                }`}
              >
                {post.published ? "Yayında" : "Taslak"}
              </button>
              <button onClick={() => startEdit(post)} className="font-body text-xs text-aqua hover:underline">
                Düzenle
              </button>
              <button onClick={() => handleDelete(post.id)} className="text-ink-faint hover:text-red-400">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
