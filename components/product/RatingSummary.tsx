"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "@/components/product/StarRating";

export default function RatingSummary({
  productId,
  textClass = "text-ink-muted",
}: {
  productId: "apollo" | "helios";
  textClass?: string;
}) {
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setCount(0);
          return;
        }
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        setAvg(total / data.length);
        setCount(data.length);
      });
  }, [productId]);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={avg ?? 0} size={14} />
      <span className={`font-body text-xs ${textClass}`}>
        {avg?.toFixed(1)} ({count} değerlendirme)
      </span>
    </div>
  );
}
