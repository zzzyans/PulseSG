// src/components/PsiDashboard.tsx
"use client";
import { CombinedHealthData } from "@/types";
import DataCard from "@/components/DataCard";
import PsiRegionList from "@/components/PsiRegionList";
import dynamic from "next/dynamic";

const PsiMap = dynamic(() => import("@/components/PsiMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-200 rounded-lg" />,
});

// Add 'sourceDate' to the list of expected props.
interface PsiDashboardProps {
  summary: CombinedHealthData["psiSummary"] | null;
  sourceDate: string | null;
}

export default function PsiDashboard({
  summary,
  sourceDate, 
}: PsiDashboardProps) {
  if (!summary) {
    return <div className="text-center">Loading PSI Data...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Haze (PSI) Dashboard
        </h2>
        {/* Display the date the data was sourced. */}
        <p className="text-slate-500">
          Data sourced from data.gov.sg as of{" "}
          {new Date(sourceDate || Date.now()).toLocaleDateString()}.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <DataCard
            title="Nationwide 24-hr PSI"
            value={summary.nationwideAverage}
            description="Average reading across all regions."
          />
          <PsiRegionList regions={summary.regions} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          <PsiMap summary={summary} />
        </div>
      </div>
    </div>
  );
}