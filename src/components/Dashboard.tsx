// src/components/Dashboard.tsx
"use client";

import React, { useState } from "react";
import { CombinedHealthData } from "@/types";
import DataCard from "./DataCard";
import ClusterList from "./ClusterList";
import PsiRegionList from "./PsiRegionList";
import DataSelector, { DataSet } from "./DataSelector";
import dynamic from "next/dynamic";

const DengueMap = dynamic(() => import("./MapDisplay"), {
  ssr: false,
  loading: () => <p>Loading Dengue Map...</p>,
});
const PsiMap = dynamic(() => import("./PsiMap"), {
  ssr: false,
  loading: () => <p>Loading PSI Map...</p>,
});

interface DashboardProps {
  healthData: CombinedHealthData | null;
}

export default function Dashboard({ healthData }: DashboardProps) {
  const [activeSet, setActiveSet] = useState<DataSet>("dengue");

  const dengueSummary = healthData?.dengueSummary;
  const psiSummary = healthData?.psiSummary;
  const dengueGeoJson = healthData?.geoJsonData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <DataSelector activeSet={activeSet} onSelect={setActiveSet} />
      </div>

      {/* DENGUE VIEW */}
      {activeSet === "dengue" && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              National Dengue Situation
            </h2>
            <p className="text-slate-500">
              Live data overview of active dengue clusters in Singapore.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <DataCard
                title="Total Active Cases"
                value={dengueSummary?.totalCases ?? 0}
                description="Sum of cases in all clusters."
              />
              <DataCard
                title="Total Active Clusters"
                value={dengueSummary?.totalClusters ?? 0}
                description="Number of active outbreak areas."
              />
              <ClusterList geoJsonData={dengueGeoJson ?? null} />
            </div>
            <div className="lg:col-span-2 min-h-[500px]">
              <DengueMap geoJsonData={dengueGeoJson ?? null} />
            </div>
          </div>
        </div>
      )}

      {/* PSI VIEW */}
      {activeSet === "psi" && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              National Haze (PSI) Situation
            </h2>
            <p className="text-slate-500">
              Live PSI readings across Singapore.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <DataCard
                title="Average 24-hr PSI"
                value={psiSummary?.nationwideAverage ?? 0}
                description="Nationwide average reading."
              />
              <PsiRegionList regions={psiSummary?.regions || {}} />
            </div>
            <div className="lg:col-span-2 min-h-[500px]">
              <PsiMap summary={psiSummary || null} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
