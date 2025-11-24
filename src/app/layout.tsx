import type { Metadata } from "next";
import { Inconsolata, Kufam } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inconsolata",
});

const kufam = Kufam({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kufam",
});

export const metadata: Metadata = {
  title: "Audiodesc",
  description: "Conversor de Áudio para texto",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={`${inconsolata.variable} ${kufam.variable} font-sans antialiased flex flex-col min-h-screen bg-gradient-to-b from-[#6F6F6F] to-[#141414]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
