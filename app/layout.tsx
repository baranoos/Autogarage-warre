import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ShopChrome from "@/components/ShopChrome";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Autogarage Warre – Professioneel Gereedschap",
  description:
    "Professionele gereedschappen en uitrusting voor de autogaragebranche. Bekijk ons uitgebreide assortiment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`h-full ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased font-sans" suppressHydrationWarning>
        <ShopChrome>{children}</ShopChrome>
      </body>
    </html>
  );
}
