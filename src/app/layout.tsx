import BackgroundOrbs from "@/components/Visuals/BackgroundOrbs";
import CustomCursor from "@/components/Visuals/CustomCursor";
import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "DJ SURREAL · official",
  description:
    "Official website of DJ SURREAL. Electronic, House, and Future Bass tracks and sets.",
  keywords: [
    "DJ Surreal",
    "Electronic Music",
    "House Music",
    "DJ Website",
    "Future Bass",
  ],
  openGraph: {
    title: "DJ SURREAL · official",
    description: "Official website of DJ SURREAL.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${outfit.variable} ${bebasNeue.variable} antialiased bg-black`}>
        <CustomCursor />
        <BackgroundOrbs />
        <div className="noise-overlay" />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
