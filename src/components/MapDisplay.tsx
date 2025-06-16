// src/components/MapDisplay.tsx
"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DengueCluster } from "@/types";
import type { LatLngExpression, Layer } from "leaflet";

// Helper function to determine color based on case count
function getColor(caseCount: number) {
  return caseCount > 20
    ? "#b30000"
    : caseCount > 10
    ? "#e34a33"
    : caseCount > 5
    ? "#fc8d59"
    : "#fef0d9";
}

interface MapDisplayProps {
  clusters?: DengueCluster[]; // Prop is optional
}

// --- THIS IS THE FIX ---
// We set a default value for clusters to be an empty array if it's not provided.
export default function MapDisplay({ clusters = [] }: MapDisplayProps) {
  const position: LatLngExpression = [1.3521, 103.8198];

  const styleFeature = (feature: any) => {
    const caseCount = feature?.properties?.caseCount || 0;
    return {
      fillColor: getColor(caseCount),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: Layer) => {
    if (feature.properties) {
      const { location, caseCount } = feature.properties;
      layer.bindPopup(
        `<div style="font-family: sans-serif;">
           <b style="font-size: 14px;">${location}</b>
           <br />
           Case Count: <strong style="color: #b30000;">${caseCount}</strong>
         </div>`
      );
    }
  };

  // Now that 'clusters' is guaranteed to be an array, this .map() call is safe.
  const geoJsonData = {
    type: "FeatureCollection" as const,
    features: clusters.map((cluster) => ({
      type: "Feature" as const,
      properties: {
        id: cluster.id,
        location: cluster.location,
        caseCount: cluster.caseCount,
      },
      geometry: cluster.geometry,
    })),
  };

  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {/* This conditional check is still good practice */}
      {clusters.length > 0 && (
        <GeoJSON
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}