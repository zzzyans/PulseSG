// src/components/PsiRegionList.tsx
"use client";
import React, { useState } from "react";

// Define the type for a single region's data, which is what this component cares about.
interface RegionData {
  region: string;
  psi: number;
  descriptor: string;
}

// The item component now receives a more specific prop type.
function PsiRegionItem({ regionData }: { regionData: RegionData }) {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const { region, psi, descriptor } = regionData;

  const handleDispatchAlert = async () => {
    setIsSending(true);
    setSendStatus("Dispatching alert...");
    try {
      const response = await fetch("/api/psi-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, psi, descriptor }),
      });
      if (!response.ok) throw new Error("Server error");
      const result = await response.json();
      setSendStatus(`Success: ${result.message}`);
    } catch (error) {
      setSendStatus("Error: Failed to dispatch alert.");
    } finally {
      setIsSending(false);
      setTimeout(() => setSendStatus(""), 4000);
    }
  };

  return (
    <div className="py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-800 capitalize">
          {region}
        </p>
        <div
          className={`text-lg font-bold text-right ${
            psi > 50 ? "text-orange-600" : "text-green-600"
          }`}
        >
          {psi}
          <span className="block text-xs font-normal text-slate-500">
            {descriptor}
          </span>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleDispatchAlert}
          disabled={isSending}
          className="bg-red-500 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-orange-600 transition-colors disabled:bg-orange-300"
        >
          {isSending ? "Sending..." : "Dispatch Alert"}
        </button>
      </div>
      {sendStatus && (
        <p
          className={`text-xs text-right mt-2 ${
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

// The main list component now expects the 'regions' object from the API.
export default function PsiRegionList({
  regions,
}: {
  regions: { [key: string]: number };
}) {
  
  // We need to transform the regions object into an array to map over it.
  const regionArray = Object.entries(regions).map(([key, value]) => ({
    id: key, // Use the region name as a key
    region: key,
    psi: value,
    descriptor: value > 100 ? "Unhealthy" : value > 50 ? "Moderate" : "Good",
  }));

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-2 text-slate-900">
        PSI by Region
      </h3>

      <div>
        {regionArray.map((region) => (
          <PsiRegionItem key={region.id} regionData={region} />
        ))}
      </div>

    </div>
  );
}