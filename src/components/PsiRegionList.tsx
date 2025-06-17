// src/components/PsiRegionList.tsx
"use client";

import { CombinedHealthData } from "@/types";

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PsiRegionList({
  regions,
}: {
  regions: CombinedHealthData["psiSummary"]["regions"];
}) {
  // Use Object.entries to convert the regions object into an array to map over
  // e.g., [['north', 50], ['south', 52], ...]
  const regionEntries = Object.entries(regions);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-slate-900">
        PSI by Region
      </h3>
      <ul className="space-y-2">
        {regionEntries.map(([regionName, psiValue]) => (
          <li
            key={regionName}
            className="flex justify-between items-center text-sm p-2 rounded-md"
          >
            <span className="font-medium text-slate-700">
              {capitalize(regionName)}
            </span>
            <span
              className={`font-bold text-sm ${
                psiValue > 50 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {psiValue}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}