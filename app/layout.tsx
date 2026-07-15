import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ToastProvider from "@/components/ToastProvider";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";

const siteDescription =
  "Apollo ve Helios: tam spektrum WRGB akvaryum aydınlatmaları. Mitolojiden ilham alan, profesyonel su altı ışığı.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aetheraqua.com"),
  title: "AetherAqua — Profesyonel Akvaryum Aydınlatması",
  description: siteDescription,
  openGraph: {
    title: "AetherAqua — Profesyonel Akvaryum Aydınlatması",
    description: siteDescription,
    siteName: "AetherAqua",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/images/ruins-bg.jpg", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AetherAqua — Profesyonel Akvaryum Aydınlatması",
    description: siteDescription,
    images: ["/images/ruins-bg.jpg"],
  },
  verification: {
    google: "Uuj1_kaGYsYhlTj0akTJk0bgHclUrlvd2kuLxrLf_t4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-abyss font-body text-ink antialiased">
        <OrganizationJsonLd />
        <AnalyticsScripts />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="pt-[73px]">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
