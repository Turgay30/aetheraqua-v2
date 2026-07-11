"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

export default function ViewItemTracker({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
}) {
  useEffect(() => {
    trackViewItem({ id, name, price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
