"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import StarRating from "@/components/product/StarRating";
import Image from "next/image";

type Theme = "apollo" | "helios";

type Review = {
  id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
};

const themeStyles: Record<Theme, { text: string; muted: string; border: string; accent: string }> = {
  apollo: {
    text: "text-apollo-text",
    muted: "text-apollo-muted",
    border: "border-apollo-gold/15",
    accent: "text-apollo-gold",
  },
  helios: {
    text: "text-ink",
    muted: "text-ink-muted",
    border: "border-helios-bronze/15",
    accent: "text-helios-bronze",
  },
};

export default function ReviewsSection({ productId, theme }: { productId: Theme; theme: Theme }) {
  const { user } = useAuth();
  const s = themeStyles[theme];
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadReviews() {
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const myReview = reviews?.find((r) => r.user_id === user?.id);
  const average = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    let photoUrl = myReview?.photo_url ?? null;
    if (photoFile) {
      const uploaded = await uploadImage(photoFile, "reviews");
      if (uploaded) photoUrl = uploaded;
    }

    const supabase = createClient();
    await supabase.from("reviews").upsert(
      {
        product_id: productId,
        user_id: user.id,
        reviewer_name: (user.user_metadata?.full_name as string) || "Müşteri",
        rating,
        comment: comment.trim() || null,
        photo_url: photoUrl,
      },
      { onConflict: "product_id,user_id" }
    );
    setSaving(false);
    setComment("");
    setRating(5);
    setPhotoFile(null);
    loadReviews();
  }

  if (reviews === null) return null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Değerlendirmeler
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={average} size={14} />
            <span className="font-body text-xs text-ink-faint">
              {average.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="mt-3 font-body text-sm text-ink-muted">
          Henüz değerlendirme yok — ilk yorumu siz yazın.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className={`rounded-2xl border ${s.border} p-4`}>
            <div className="flex items-center justify-between">
              <p className={`font-body text-sm font-semibold ${s.text}`}>{r.reviewer_name}</p>
              <StarRating rating={r.rating} size={13} />
            </div>
            {r.comment && (
              <p className={`mt-2 font-body text-sm ${s.muted}`}>{r.comment}</p>
            )}
            {r.photo_url && (
              <div className="relative mt-3 h-32 w-32 overflow-hidden rounded-lg">
                <Image src={r.photo_url} alt="Müşteri fotoğrafı" fill className="object-cover" />
              </div>
            )}
            <p className="mt-2 font-body text-[11px] text-ink-faint">
              {new Date(r.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className={`mt-6 rounded-2xl border ${s.border} p-5`}>
          <p className={`font-body text-sm font-semibold ${s.text}`}>
            {myReview ? "Değerlendirmenizi güncelleyin" : "Değerlendirme yazın"}
          </p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} yıldız`}
                className="p-0.5"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= rating ? "#C9A227" : "none"}>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    stroke="#C9A227"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deneyiminizi paylaşın (opsiyonel)"
            rows={3}
            className="mt-3 w-full rounded-lg border border-abyss-border bg-abyss px-3 py-2 font-body text-sm text-ink outline-none focus-visible:border-aqua"
          />
          <label className="mt-3 flex items-center gap-2 font-body text-xs text-ink-faint">
            <span>📷 Fotoğraf ekle (opsiyonel):</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="font-body text-xs text-ink-muted"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className={`mt-3 rounded-full px-6 py-2.5 font-body text-xs font-semibold transition-colors disabled:opacity-50 ${
              theme === "apollo" ? "bg-apollo-gold text-apollo-bg" : "bg-helios-bronze text-helios-surface"
            }`}
          >
            {saving ? "Kaydediliyor..." : myReview ? "Güncelle" : "Gönder"}
          </button>
        </form>
      ) : (
        <p className="mt-6 font-body text-sm text-ink-muted">
          Değerlendirme yazmak için{" "}
          <Link href="/giris" className="text-aqua hover:underline">
            giriş yapın
          </Link>
          .
        </p>
      )}
    </div>
  );
}
