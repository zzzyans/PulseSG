// src/components/PsiRegionList.tsx
"use client";

import { CombinedHealthData } from "@/types";
import { getPsiInfo } from "@/lib/psi";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PsiRegionList({
  regions,
}: {
  regions: CombinedHealthData["psiSummary"]["regions"];
}) {
  const regionEntries = Object.entries(regions);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-slate-900">
        PSI by Region
      </h3>
      <ul className="space-y-3">
        {regionEntries.map(([regionName, psiValue]) => {
          const { descriptor, color } = getPsiInfo(psiValue);
          return (
            <li
              key={regionName}
              className="flex justify-between items-center text-sm"
            >
              <span className="font-medium text-slate-700">
                {capitalize(regionName)}
              </span>
              <div className="text-right">
                <span className="font-bold text-base" style={{ color: color }}>
                  {psiValue}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  ({descriptor})
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}