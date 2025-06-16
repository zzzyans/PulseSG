// src/components/PsiDashboard.tsx
"use client"; // Mark as a Client Component

import { PsiData } from "@/lib/data"; // Assuming you export this type from lib/data.ts
import DataCard from "@/components/DataCard";
import PsiRegionList from "@/components/PsiRegionList";
import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading Map...</p>
    </div>
  ),
});

export default function PsiDashboard({
  psiData,
}: {
  psiData: PsiData[] | null;
}) {
  const averagePsi = psiData
    ? Math.round(
        psiData.reduce((sum, r) => sum + r.psi, 0) / psiData.length
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Haze (PSI) Dashboard
        </h2>
        <p className="text-slate-500">
          Live Pollutant Standards Index (PSI) readings across Singapore.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <DataCard
            title="Average 24-hr PSI"
            value={averagePsi}
            description="Nationwide average reading."
          />
          <PsiRegionList data={psiData || []} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          <MapDisplay clusters={[]} />
        </div>
      </div>
    </div>
  );
}