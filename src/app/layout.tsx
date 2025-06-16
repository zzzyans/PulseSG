// src/app/layout.tsx

import "./globals.css"; // <-- THIS IS THE CRUCIAL LINE THAT IS LIKELY MISSING
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SG Public Health Command Center",
  description: "Official dashboard for public health monitoring in Singapore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-100 text-slate-900 antialiased`}
      >
        <Header />
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}