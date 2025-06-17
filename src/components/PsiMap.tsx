// src/components/PsiMap.tsx
"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { CombinedHealthData } from "@/types";

// Helper function to get color based on PSI value
function getPsiColor(psi: number): string {
  if (psi > 100) return "#D93025"; // Red for Unhealthy
  if (psi > 50) return "#F29900"; // Orange for Moderate
  return "#1E8E3E"; // Green for Good
}

interface PsiMapProps {
  summary: CombinedHealthData["psiSummary"] | null;
}

export default function PsiMap({ summary }: PsiMapProps) {
  const position: LatLngExpression = [1.3521, 103.8198];

  if (!summary || !summary.regionMetadata) {
    return (
      <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Map data unavailable.</p>
      </div>
    );
  }

  const drawableRegions = summary.regionMetadata.filter(
    (region) => region.label_location
  );

  const mapKey = JSON.stringify(summary.regions);

  return (
    <MapContainer
      key={mapKey} 
      center={position}
      zoom={11}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {drawableRegions.map((region) => {
        const regionName = region.name as keyof typeof summary.regions;
        const psiValue = summary.regions[regionName];

        if (psiValue === undefined) return null;

        const markerColor = getPsiColor(psiValue);

        return (
          <CircleMarker
            key={region.name}
            center={[
              region.label_location.latitude,
              region.label_location.longitude,
            ]}
            radius={25}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: 0.8,
            }}
          >
            <Tooltip
              permanent
              direction="center"
              className="psi-label"
            >
              <div style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>
                {psiValue}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}