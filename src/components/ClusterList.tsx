// src/components/ClusterList.tsx
"use client";
import { DengueCluster } from "../types";

export default function ClusterList({
  clusters,
}: {
  clusters: DengueCluster[];
}) {
  const sortedClusters = [...clusters].sort(
    (a, b) => b.caseCount - a.caseCount
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-slate-900">
        High-Risk Dengue Clusters
      </h3>
      <ul className="space-y-2">
        {sortedClusters.map((cluster, index) => (
          <li
            key={cluster.id}
            className="flex justify-between items-center text-sm p-2 rounded-md transition-colors hover:bg-slate-100"
          >
            <div className="flex items-center">
              <span className="font-semibold text-slate-500 w-6">
                {index + 1}.
              </span>
              <span className="text-slate-700">{cluster.location}</span>
            </div>
            <span
              className={`font-bold text-sm ${
                cluster.caseCount > 10 ? "text-red-600" : "text-orange-600"
              }`}
            >
              {cluster.caseCount} cases
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}