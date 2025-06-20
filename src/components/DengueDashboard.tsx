// src/components/DengueDashboard.tsx
"use client";

import { CombinedHealthData } from "@/types"; 
import DataCard from "@/components/DataCard";
import ClusterList from "@/components/ClusterList";
import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 rounded-lg" />,
});

export default function DengueDashboard({
  geoJsonData,
  summary,
  sourceDate,
}: {
  geoJsonData: GeoJSON.FeatureCollection | null;
  summary: CombinedHealthData["dengueSummary"] | null;
  sourceDate: string | null;
}) {

  if (!summary || !geoJsonData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-10">
        Loading Dengue Data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Dengue Outbreak Dashboard
        </h2>
        <p className="text-slate-500">
          Data sourced from data.gov.sg as of{" "}
          {new Date(sourceDate || Date.now()).toLocaleDateString()}.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <DataCard
            title="Total Active Cases"
            value={summary.totalCases}
            description="Sum of cases in all clusters."
          />
          <DataCard
            title="Active Clusters"
            value={summary.totalClusters}
            description="Number of high-risk areas."
          />
          <ClusterList geoJsonData={geoJsonData} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          <MapDisplay geoJsonData={geoJsonData} />
        </div>
      </div>
    </div>
  );
}
