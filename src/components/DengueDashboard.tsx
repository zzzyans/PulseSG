// src/components/DengueDashboard.tsx
"use client";

import { HealthApiResponse } from "@/types";
import DataCard from "@/components/DataCard";
import ClusterList from "@/components/ClusterList";
import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 rounded-lg" />,
});

export default function DengueDashboard({
  initialData,
}: {
  initialData: HealthApiResponse | null;
}) {
  if (!initialData) {
    return (
      <div className="text-center text-red-500">
        Could not load dengue data. Please try again later.
      </div>
    );
  }

  // Destructure the data for easier use
  const { geoJsonData, summary } = initialData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Dengue Outbreak Dashboard
        </h2>
        <p className="text-slate-500">
          Data sourced from data.gov.sg as of{" "}
          {new Date(initialData.sourceDate || Date.now()).toLocaleDateString()}.
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
          {/* The ClusterList component might need a small update if its props change */}
          <ClusterList geoJsonData={geoJsonData} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          {/* The MapDisplay component now receives the full GeoJSON object */}
          <MapDisplay geoJsonData={geoJsonData} />
        </div>
      </div>
    </div>
  );
}