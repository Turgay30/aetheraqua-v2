import type { Metadata } from "next";
import SepetContent from "@/components/cart/SepetContent";

export const metadata: Metadata = {
  title: "Sepetim — AetherAqua",
  description: "Seçtiğiniz Apollo ve Helios akvaryum aydınlatmalarını gözden geçirin.",
};

export default function SepetPage() {
  return <SepetContent />;
}
