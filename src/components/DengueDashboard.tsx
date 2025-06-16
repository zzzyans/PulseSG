// src/components/DengueDashboard.tsx
"use client"; // <-- This is the most important line! It marks this as a Client Component.

import { DengueCluster } from "@/types";
import DataCard from "@/components/DataCard";
import ClusterList from "@/components/ClusterList";
import dynamic from "next/dynamic";

// Now, this dynamic import is happening inside a Client Component, which is allowed.
const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-500">Loading Map...</p>
    </div>
  ),
});

// This component receives the data fetched by the server page as a prop.
export default function DengueDashboard({
  dengueData,
}: {
  dengueData: DengueCluster[] | null;
}) {
  const totalCases = dengueData
    ? dengueData.reduce((sum, c) => sum + c.caseCount, 0)
    : 0;
  const totalClusters = dengueData ? dengueData.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Dengue Outbreak Dashboard
        </h2>
        <p className="text-slate-500">
          Detailed overview of active dengue clusters.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <DataCard
            title="Total Active Cases"
            value={totalCases}
            description="Sum of cases in all clusters."
          />
          <ClusterList clusters={dengueData || []} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          <MapDisplay clusters={dengueData || []} />
        </div>
      </div>
    </div>
  );
}