import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Liminal - The Most Aesthetic Journal",
  description:
    "Not everything needs to be shared. Some thoughts are just for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          playfair.variable,
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
