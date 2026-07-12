"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SocialProofBadge() {
  const [stats, setStats] = useState<{ count: number; average: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("rating")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setStats({ count: data.length, average });
      });
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-8 flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= Math.round(stats.average) ? "#C9A227" : "none"}>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="#C9A227"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      <p className="font-body text-sm text-ink-muted">
        {stats.average.toFixed(1)} · {stats.count} değerlendirme
      </p>
    </div>
  );
}
