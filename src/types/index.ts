// src/types/index.ts

// This represents the full API response we get from our backend
export interface HealthApiResponse {
  geoJsonData: GeoJSON.FeatureCollection; // Using standard GeoJSON types
  summary: {
    totalClusters: number;
    totalCases: number;
    topCluster: {
      locality: string;
      cases: number;
    };
  };
  sourceDate: string;
}

// This is a helper type for a single feature within the GeoJSON data
// It's useful for the map component
export interface DengueFeature extends GeoJSON.Feature {
  properties: {
    OBJECTID: number;
    LOCALITY: string;
    CASE_SIZE: number;
    // Add other properties from the GeoJSON if you need them
  };
  geometry: GeoJSON.Polygon;
}