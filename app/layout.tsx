import type { Metadata } from "next";

import { serif, sans, mono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aswaq — B2B Procurement Marketplace",
    template: "%s — Aswaq",
  },
  description:
    "Aswaq is an AI-powered B2B marketplace for wholesale and industrial procurement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
