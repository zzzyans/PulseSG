// src/components/Dashboard.tsx
"use client";

import React, { useState, useMemo } from "react";
import { DengueCluster } from "../types";
import DataCard from "./DataCard";
import ClusterList from "./ClusterList";
import PsiRegionList from "./PsiRegionList";
import DataSelector, { DataSet } from "./DataSelector";
import dynamic from "next/dynamic";

// Mock data for PSI
import mockPsiData from "../../public/mockdata/mock-psi-data.json";

const MapDisplay = dynamic(() => import("./MapDisplay"), { ssr: false });

interface DashboardProps {
  initialData: DengueCluster[] | null;
  defaultView: DataSet; // <-- This is the crucial addition
}

export default function Dashboard({
  initialData: initialDengueData,
}: {
  initialData: DengueCluster[] | null;
}) {
  const [activeSet, setActiveSet] = useState<DataSet>("dengue");

  // Memoize calculated values for dengue
  const dengueStats = useMemo(() => {
    if (!initialDengueData) return { totalCases: 0, totalClusters: 0 };
    return {
      totalCases: initialDengueData.reduce(
        (sum, cluster) => sum + cluster.caseCount,
        0
      ),
      totalClusters: initialDengueData.length,
    };
  }, [initialDengueData]);

  // Memoize calculated values for PSI
  const psiStats = useMemo(() => {
    const averagePsi =
      mockPsiData.reduce((sum, region) => sum + region.psi, 0) /
      mockPsiData.length;
    return {
      averagePsi: Math.round(averagePsi),
      regionCount: mockPsiData.length,
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <DataSelector activeSet={activeSet} onSelect={setActiveSet} />
      </div>

      {/* Conditionally render the entire view based on the active tab */}
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
                value={dengueStats.totalCases}
                description="Sum of cases in all clusters."
              />
              <ClusterList clusters={initialDengueData || []} />
            </div>
            <div className="lg:col-span-2">
              <MapDisplay />
            </div>
          </div>
        </div>
      )}

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
                value={psiStats.averagePsi}
                description="Nationwide average reading."
              />
              <PsiRegionList data={mockPsiData} />
            </div>
            <div className="lg:col-span-2">
              <MapDisplay />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}