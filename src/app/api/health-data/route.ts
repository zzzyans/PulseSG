// src/app/api/health-data/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import type { Feature, Geometry, FeatureCollection } from "geojson";

// 1. Types for Dengue Data
interface DengueFeatureProperties {
  CASE_SIZE: string;
  LOCALITY: string;
}
type DengueFeature = Feature<Geometry, DengueFeatureProperties>;
type DengueGeoJson = FeatureCollection<Geometry, DengueFeatureProperties>;

interface DengueSummary {
  totalClusters: number;
  totalCases: number;
  topCluster: { locality: string; cases: number };
}

// 2. Types for PSI Data
interface PsiReadings {
  national: number;
  north: number;
  south: number;
  east: number;
  west: number;
  central: number;
}
interface RegionMetadata {
  name: string;
  labelLocation: { latitude: number; longitude: number };
}
interface PsiApiResponse {
  data: {
    items: { readings: { psi_twenty_four_hourly: PsiReadings } }[];
    regionMetadata: RegionMetadata[];
  };
}
interface PsiSummary {
  nationwideAverage: number;
  regions: PsiReadings;
  regionMetadata: RegionMetadata[];
}

// 3. Types for the Final Combined Data and Cache
interface FinalData {
  dengueSummary: DengueSummary;
  psiSummary: PsiSummary;
  geoJsonData: DengueGeoJson;
  sourceDate: string;
}
interface Cache {
  data: FinalData | null;
  lastFetchDate: string;
}

const processDengueData = (geoJsonData: DengueGeoJson): DengueSummary => {
  if (
    !geoJsonData ||
    !geoJsonData.features ||
    geoJsonData.features.length === 0
  ) {
    return {
      totalClusters: 0,
      totalCases: 0,
      topCluster: { locality: "N/A", cases: 0 },
    };
  }

  const features = geoJsonData.features as DengueFeature[];
  const totalClusters = features.length;

  const totalCases = features.reduce((sum, feature) => {
    return sum + parseInt(feature.properties.CASE_SIZE || "0", 10);
  }, 0);

  const topClusterFeature = features.reduce((maxFeature, currentFeature) => {
    const maxCases = parseInt(maxFeature.properties.CASE_SIZE || "0", 10);
    const currentCases = parseInt(
      currentFeature.properties.CASE_SIZE || "0",
      10,
    );
    return currentCases > maxCases ? currentFeature : maxFeature;
  }, features[0]);

  const topCluster = {
    locality: topClusterFeature.properties.LOCALITY,
    cases: parseInt(topClusterFeature.properties.CASE_SIZE || "0", 10),
  };

  return { totalClusters, totalCases, topCluster };
};

const processPsiData = (psiApiResponse: PsiApiResponse): PsiSummary => {
  const psiData = psiApiResponse?.data;
  const defaultRegions = {
    national: 0,
    north: 0,
    south: 0,
    east: 0,
    west: 0,
    central: 0,
  };

  if (!psiData || !psiData.items || psiData.items.length === 0) {
    return {
      nationwideAverage: 0,
      regions: defaultRegions,
      regionMetadata: [],
    };
  }

  const readings = psiData.items[0]?.readings?.psi_twenty_four_hourly;
  if (!readings) {
    return {
      nationwideAverage: 0,
      regions: defaultRegions,
      regionMetadata: [],
    };
  }

  const regionMetadata = psiData.regionMetadata || [];
  const regionalValues = Object.values(readings).filter(
    (value): value is number => typeof value === "number",
  );
  const nationwideAverage =
    readings.national ||
    (regionalValues.length > 0
      ? Math.round(
          regionalValues.reduce((sum, val) => sum + val, 0) /
            regionalValues.length,
        )
      : 0);

  return {
    nationwideAverage: nationwideAverage,
    regions: { ...defaultRegions, ...readings },
    regionMetadata: regionMetadata,
  };
};

let cache: Cache = {
  data: null,
  lastFetchDate: "",
};

export async function GET() {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];

  if (cache.data && cache.lastFetchDate === dateString) {
    return NextResponse.json(cache.data);
  }

  const dengueDatasetId = "d_dbfabf16158d1b0e1c420627c0819168";
  const denguePollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${dengueDatasetId}/poll-download`;
  const psiUrl = "https://api-open.data.gov.sg/v2/real-time/api/psi";

  try {
    const [denguePollResponse, psiResponse] = await Promise.all([
      axios.get(denguePollUrl),
      axios.get<PsiApiResponse>(psiUrl), 
    ]);

    if (denguePollResponse.data.code !== 0)
      throw new Error(`Dengue API error: ${denguePollResponse.data.errMsg}`);
    const dengueDownloadUrl = denguePollResponse.data.data.url;
    const geoJsonResponse = await axios.get<DengueGeoJson>(dengueDownloadUrl);
    const dengueSummary = processDengueData(geoJsonResponse.data);

    const psiSummary = processPsiData(psiResponse.data);

    const finalData: FinalData = {
      dengueSummary: dengueSummary,
      psiSummary: psiSummary,
      geoJsonData: geoJsonResponse.data,
      sourceDate: dateString,
    };

    cache = {
      data: finalData,
      lastFetchDate: dateString,
    };

    return NextResponse.json(finalData);
  } catch (_error) {
    console.error("Failed to fetch combined data:", _error);
    return NextResponse.json(
      { message: "Failed to fetch or process combined health data." },
      { status: 500 },
    );
  }
}