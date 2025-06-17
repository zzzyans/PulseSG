// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-[1000] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.293 12.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L10 14.414l-1.293 1.293a1 1 0 01-1.414-1.414l2-2zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1z" />
          </svg>
          <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
            PulseSG
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/" className={navLinkClasses("/")}>
            Overview
          </Link>
          <Link href="/dengue" className={navLinkClasses("/dengue")}>
            Dengue
          </Link>
          <Link href="/psi" className={navLinkClasses("/psi")}>
            PSI
          </Link>
        </nav>
      </div>
    </header>
  );
}