// src/components/PsiMap.tsx
"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type LatLngExpression, type Layer } from "leaflet";
import { CombinedHealthData } from "@/types";
import { getPsiInfo } from "@/lib/psi";

interface PsiFeatureProperties {
  regionName: string;
  psiValue: number;
}

interface PsiMapProps {
  summary: CombinedHealthData["psiSummary"] | null;
}

export default function PsiMap({ summary }: PsiMapProps) {
  const position: LatLngExpression = [1.3521, 103.8198];

  if (!summary || !summary.regionMetadata) {
    return <div className="w-full h-full bg-slate-200 rounded-lg" />;
  }

  const geoJsonData = {
    type: "FeatureCollection" as const,
    features: summary.regionMetadata
      .filter((region) => region.labelLocation)
      .map((region) => {
        const regionName = region.name as keyof typeof summary.regions;
        const psiValue = summary.regions[regionName];
        return {
          type: "Feature" as const,
          properties: {
            regionName: region.name,
            psiValue: psiValue,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [
              region.labelLocation.longitude,
              region.labelLocation.latitude,
            ],
          },
        };
      }),
  };

  const pointToLayer = (feature: GeoJSON.Feature, latlng: LatLngExpression) => {
    return new L.CircleMarker(latlng, {
      radius: 30,
    });
  };

  const styleFeature = (feature?: GeoJSON.Feature) => {
    const props = feature?.properties as PsiFeatureProperties;
    const psiValue = props?.psiValue || 0;
    const { color } = getPsiInfo(psiValue);
    return {
      color: color,
      fillColor: color,
      fillOpacity: 0.7,
      weight: 2,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as PsiFeatureProperties;
    if (props) {
      const { regionName, psiValue } = props;
      const labelHtml = `
        <div style="color: white; font-weight: bold; text-align: center; text-shadow: 0 0 3px rgba(0,0,0,0.6);">
          <div style="font-size: 12px; line-height: 1;">${
            regionName.charAt(0).toUpperCase() + regionName.slice(1)
          }</div>
          <div style="font-size: 18px; line-height: 1;">${psiValue}</div>
        </div>
      `;
      layer.bindTooltip(labelHtml, {
        permanent: true,
        direction: "center",
        className: "psi-map-label",
      });
    }
  };

  return (
    <>
      <style>{`.psi-map-label { background: transparent; border: none; }`}</style>
      <MapContainer
        center={position}
        zoom={11}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        <GeoJSON
          key={JSON.stringify(geoJsonData)}
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
        />
      </MapContainer>
    </>
  );
}