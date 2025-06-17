// src/types/index.ts

// This represents the full, combined API response from our backend
export interface CombinedHealthData {
  dengueSummary: {
    totalClusters: number;
    totalCases: number;
    topCluster: {
      locality: string;
      cases: number;
    };
  };
  psiSummary: {
    nationwideAverage: number;
    regions: {
      north: number;
      south: number;
      east: number;
      west: number;
      central: number;
    };
    regionMetadata: {
      name: string;
      label_location: {
        latitude: number;
        longitude: number;
      };
    }[];
  };
  geoJsonData: GeoJSON.FeatureCollection;
  sourceDate: string;
}

// This helper type for a single dengue feature remains useful
export interface DengueFeature extends GeoJSON.Feature {
  properties: {
    OBJECTID: number;
    LOCALITY: string;
    CASE_SIZE: number;
  };
  geometry: GeoJSON.Polygon;
}