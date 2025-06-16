// src/components/ClusterList.tsx
"use client";
import React, { useState } from "react";
import { DengueFeature } from "@/types";

const MAX_LENGTH = 45; // Max characters to show before truncating

// A new, self-contained component for each list item
function ClusterItem({ feature }: { feature: DengueFeature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = feature.properties.LOCALITY;
  const needsTruncation = location.length > MAX_LENGTH;

  const displayText =
    needsTruncation && !isExpanded
      ? location.substring(0, MAX_LENGTH) + "..."
      : location;

  return (
    <div className="py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {displayText}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-blue-600 hover:underline mt-1"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        <div
          className={`flex-shrink-0 text-lg font-bold text-right ${
            feature.properties.CASE_SIZE >= 10
              ? "text-red-600"
              : "text-orange-500"
          }`}
        >
          {feature.properties.CASE_SIZE}
          <span className="block text-xs font-normal text-slate-500">
            cases
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ClusterList({
  geoJsonData,
}: {
  geoJsonData: GeoJSON.FeatureCollection | null;
}) {
  if (!geoJsonData || !geoJsonData.features) return null;

  const sortedFeatures = [...(geoJsonData.features as DengueFeature[])]
    .sort((a, b) => b.properties.CASE_SIZE - a.properties.CASE_SIZE)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-2 text-slate-900">
        Top 5 Active Clusters
      </h3>
      <div>
        {sortedFeatures.map((feature) => (
          <ClusterItem key={feature.properties.OBJECTID} feature={feature} />
        ))}
      </div>
    </div>
  );
}