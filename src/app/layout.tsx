// src/app/layout.tsx

import "./globals.css"; 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import NotificationSubscriber from "@/components/NotificationSubscriber";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseSG",
  description: "Official dashboard for public health monitoring in Singapore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-100 text-slate-900 antialiased`}
      >
        {process.env.NODE_ENV === "development" && <NotificationSubscriber />}
        <Header />
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}