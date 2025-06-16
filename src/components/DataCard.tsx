// src/components/DataCard.tsx
import React from "react";

type DataCardProps = {
  title: string;
  value: number | string;
  description: string;
};

export default function DataCard({ title, value, description }: DataCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <p className="text-xs font-semibold text-slate-500 mb-1 tracking-wider uppercase">
        {title}
      </p>
      <p className="text-4xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-400 mt-2">{description}</p>
    </div>
  );
}