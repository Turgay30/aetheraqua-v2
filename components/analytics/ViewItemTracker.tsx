"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";
import { trackRecentlyViewed } from "@/lib/recentlyViewed";

export default function ViewItemTracker({
  id,
  name,
  price,
  image,
  href,
}: {
  id: string;
  name: string;
  price: number;
  image?: string;
  href?: string;
}) {
  useEffect(() => {
    trackViewItem({ id, name, price });
    if (image && href) {
      trackRecentlyViewed({ id, name, price, image, href });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
