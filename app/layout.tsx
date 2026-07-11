import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AetherAqua — Profesyonel Akvaryum Aydınlatması",
  description:
    "Apollo ve Helios: tam spektrum WRGB akvaryum aydınlatmaları. Mitolojiden ilham alan, profesyonel su altı ışığı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-abyss font-body text-ink antialiased">
        <Navbar />
        <main className="pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
