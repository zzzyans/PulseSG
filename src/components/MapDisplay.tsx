// src/components/MapDisplay.tsx
"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DengueFeature } from "@/types";
import type { LatLngExpression, Layer } from "leaflet";

// --- UPDATED COLOR LOGIC ---
// This now matches the official Red/Yellow alert system.
function getAlertColor(caseCount: number): string {
  if (caseCount >= 10) {
    return "#D93025"; // Official Red Alert Color
  }
  return "#F29900"; // Official Yellow Alert Color
}

interface MapDisplayProps {
  geoJsonData: GeoJSON.FeatureCollection | null;
}

export default function MapDisplay({ geoJsonData }: MapDisplayProps) {
  const position: LatLngExpression = [1.3521, 103.8198];

  // This function styles each cluster polygon based on its alert level
  const styleFeature = (feature?: DengueFeature) => {
    const caseCount = feature?.properties?.CASE_SIZE || 0;
    return {
      fillColor: getAlertColor(caseCount),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.65, // Slightly adjusted for better map visibility
    };
  };

  // This function adds a popup to each cluster
  const onEachFeature = (feature: DengueFeature, layer: Layer) => {
    if (feature.properties) {
      const { LOCALITY, CASE_SIZE } = feature.properties;
      const alertLevel = CASE_SIZE >= 10 ? "Red Alert" : "Yellow Alert";
      const alertColor = getAlertColor(CASE_SIZE);

      const popupContent = `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <b style="font-size: 14px;">${LOCALITY}</b>
          <hr style="margin: 4px 0; border-top: 1px solid #eee;" />
          Case Count: <strong style="color: ${alertColor};">${CASE_SIZE}</strong>
          <br />
          Alert Level: <strong style="color: ${alertColor};">${alertLevel}</strong>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
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
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={styleFeature as any}
          onEachFeature={onEachFeature as any}
        />
      )}
    </MapContainer>
  );
}