"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function FavoriteButton({
  productId,
  className = "",
}: {
  productId: "apollo" | "helios";
  className?: string;
}) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle()
      .then(({ data }) => setIsFavorite(!!data));
  }, [user, productId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;

    setLoading(true);
    const supabase = createClient();

    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
      setIsFavorite(true);
    }
    setLoading(false);
  }

  if (!user) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={isFavorite}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-abyss/70 backdrop-blur-sm transition-colors ${className}`}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#C9A227" : "none"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s-7-4.5-9.5-9C0.5 8 2 4 6 4c2 0 3.5 1.2 4.5 2.5C11.5 5.2 13 4 15 4c4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"
        stroke={filled ? "#C9A227" : "#8B97A6"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
