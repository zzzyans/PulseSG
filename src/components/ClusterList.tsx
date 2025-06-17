// src/components/ClusterList.tsx
"use client";
import React, { useState } from "react";
import { DengueFeature } from "@/types";

const MAX_LENGTH = 45;

// Self-contained component for each list item, with dispatch logic
function ClusterItem({ feature }: { feature: DengueFeature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const location = feature.properties.LOCALITY;
  const caseCount = feature.properties.CASE_SIZE;
  const needsTruncation = location.length > MAX_LENGTH;

  const displayText =
    needsTruncation && !isExpanded
      ? location.substring(0, MAX_LENGTH) + "..."
      : location;

  // API call for dispatch
  const handleDispatchAlert = async () => {
    setIsSending(true);
    setSendStatus("Dispatching alert...");
    try {
      const response = await fetch("/api/dispatch-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: location, cases: caseCount }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setSendStatus(`Success: ${result.message}`);
    } catch (error) {
      setSendStatus("Error: Failed to dispatch alert.");
      console.error("Dispatch failed:", error);
    } finally {
      setIsSending(false);
      // Clear the status message after 4 seconds
      setTimeout(() => setSendStatus(""), 4000);
    }
  };

  return (
    <div className="py-4 border-b border-slate-200 last:border-b-0">
      <div className="flex justify-between items-start gap-4">
        {/* Location and case count section */}
        <div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {displayText}
          </p>
        </div>
        <div
          className={`flex-shrink-0 text-lg font-bold text-right ${
            caseCount >= 10 ? "text-red-600" : "text-orange-500"
          }`}
        >
          {caseCount}
          <span className="block text-xs font-normal text-slate-500">
            cases
          </span>
        </div>
      </div>

      {/* --- NEW SECTION FOR BUTTONS AND STATUS --- */}
      <div className="flex items-center justify-between mt-3">
        <div>
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
        <button
          onClick={handleDispatchAlert}
          disabled={isSending}
          className="bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : "Dispatch Alert"}
        </button>
      </div>
      {sendStatus && (
        <p
          className={`text-xs mt-2 ${
            sendStatus.startsWith("Error")
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {sendStatus}
        </p>
      )}
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