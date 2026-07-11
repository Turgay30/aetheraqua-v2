import type { Metadata } from "next";
import OdemeContent from "@/components/checkout/OdemeContent";

export const metadata: Metadata = {
  title: "Ödeme — AetherAqua",
  description: "Siparişinizi tamamlamak için teslimat bilgilerinizi girin.",
};

export default function OdemePage() {
  return <OdemeContent />;
}
