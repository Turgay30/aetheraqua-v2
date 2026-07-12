"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Result = { type: "ürün" | "blog"; title: string; subtitle: string; href: string };

const STATIC_PRODUCTS: Result[] = [
  { type: "ürün", title: "Apollo", subtitle: "Işığın Efendisi — WRGB akvaryum aydınlatması", href: "/apollo" },
  { type: "ürün", title: "Helios", subtitle: "Gündüzün Taşıyıcısı — WRGB akvaryum aydınlatması", href: "/helios" },
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const q = query.trim();

      const [productsRes, blogRes] = await Promise.all([
        supabase.from("products").select("product_id, name, tagline").eq("is_builtin", false).ilike("name", `%${q}%`),
        supabase.from("blog_posts").select("slug, title, excerpt").eq("published", true).ilike("title", `%${q}%`),
      ]);

      const staticMatches = STATIC_PRODUCTS.filter(
        (p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.subtitle.toLowerCase().includes(q.toLowerCase())
      );

      const productMatches: Result[] = (productsRes.data ?? []).map((p) => ({
        type: "ürün",
        title: p.name,
        subtitle: p.tagline ?? "",
        href: `/urun/${p.product_id}`,
      }));

      const blogMatches: Result[] = (blogRes.data ?? []).map((b) => ({
        type: "blog",
        title: b.title,
        subtitle: b.excerpt ?? "",
        href: `/blog/${b.slug}`,
      }));

      setResults([...staticMatches, ...productMatches, ...blogMatches]);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-abyss/90 px-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-abyss-border bg-abyss-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-abyss-border px-5 py-4">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün veya yazı ara..."
            className="flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button onClick={onClose} className="font-body text-xs text-ink-faint hover:text-ink">
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <p className="px-3 py-6 text-center font-body text-sm text-ink-muted">Aranıyor...</p>
          )}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="px-3 py-6 text-center font-body text-sm text-ink-muted">Sonuç bulunamadı.</p>
          )}
          {!loading &&
            results.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                onClick={onClose}
                className="block rounded-xl px-3 py-3 transition-colors hover:bg-abyss"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-aqua/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-aqua">
                    {r.type}
                  </span>
                  <p className="font-body text-sm text-ink">{r.title}</p>
                </div>
                {r.subtitle && (
                  <p className="mt-0.5 line-clamp-1 font-body text-xs text-ink-faint">{r.subtitle}</p>
                )}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" className="text-ink-faint" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-ink-faint" />
    </svg>
  );
}
