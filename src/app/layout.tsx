import { Toaster } from "react-hot-toast";
import BackgroundOrbs from "@/components/Visuals/BackgroundOrbs";
import CustomCursor from "@/components/Visuals/CustomCursor";
import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Condensed, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "JACE SURREAL · official",
  description:
    "Official portal of JACE SURREAL. Unreleased sonic artifacts and exclusive archive access.",
  keywords: [
    "Jace Surreal",
    "Electronic Music",
    "The Vault",
    "Sonic Artifacts",
    "Future Bass",
  ],
  openGraph: {
    title: "JACE SURREAL · official",
    description: "The digital portal into the unreleased soundscape.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans dark", geist.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${robotoCondensed.variable} ${bebasNeue.variable} antialiased bg-black font-sans`}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid rgba(255,45,85,0.2)',
              fontFamily: 'var(--font-roboto)',
              borderRadius: '2px',
              fontSize: '14px',
              letterSpacing: '0.05em',
            },
          }}
        />
        <CustomCursor />
        <BackgroundOrbs />
        <div className="noise-overlay" />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
