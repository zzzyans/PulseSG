// src/app/api/health-data/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// Dengue
const processDengueData = (geoJsonData: any) => {
  if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
    return { 
      totalClusters: 0, 
      totalCases: 0,
      topCluster: { locality: "N/A", cases: 0 } 
    };
  }
  
  const features = geoJsonData.features;
  const totalClusters = features.length;
  
  const totalCases = features.reduce((sum: number, feature: any) => {
    return sum + parseInt(feature.properties.CASE_SIZE || '0', 10);
  }, 0);

  const topClusterFeature = features.reduce((maxFeature: any, currentFeature: any) => {
    const maxCases = parseInt(maxFeature.properties.CASE_SIZE || '0', 10);
    const currentCases = parseInt(currentFeature.properties.CASE_SIZE || '0', 10);
    return currentCases > maxCases ? currentFeature : maxFeature;
  }, features[0]);

  const topCluster = {
    locality: topClusterFeature.properties.LOCALITY,
    cases: parseInt(topClusterFeature.properties.CASE_SIZE || '0', 10),
  };

  return { totalClusters, totalCases, topCluster };
};

// PSI
const processPsiData = (psiApiResponse: any) => {
  const readings = psiApiResponse?.data?.items?.[0]?.readings?.psi_twenty_four_hourly;
  const regionMetadata = psiApiResponse?.data?.region_metadata || [];

  if (!readings) {
    console.error("PSI API Error: 'psi_twenty_four_hourly' object could not be found.");
    return { nationwideAverage: 0, regions: {}, regionMetadata: [] };
  }
  
  // 1. Create an array of the regional PSI numbers.
  const regionalValues = [
    readings.north,
    readings.south,
    readings.east,
    readings.west,
    readings.central,
  ].filter((value): value is number => typeof value === 'number'); // Filter out any undefined/null values

  // 2. Calculate the average only if we have valid numbers.
  const nationwideAverage = regionalValues.length > 0
    ? Math.round(regionalValues.reduce((sum, val) => sum + val, 0) / regionalValues.length)
    : 0;

  console.log("Successfully processed PSI data. Manually Calculated Average:", nationwideAverage);

  return {
    nationwideAverage: nationwideAverage,
    regions: {
      north: readings.north || 0,
      south: readings.south || 0,
      east: readings.east || 0,
      west: readings.west || 0,
      central: readings.central || 0,
    },
    regionMetadata: regionMetadata,
  };
};
let cache = {
  data: null as any,
  lastFetchDate: ''
};

export async function GET(request: Request) {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];

  if (cache.data && cache.lastFetchDate === dateString) {
    console.log("Serving combined data from today's cache...");
    return NextResponse.json(cache.data);
  }

  console.log(`Fetching new dengue and PSI data for ${dateString}...`);
  
  const dengueDatasetId = "d_dbfabf16158d1b0e1c420627c0819168";
  const denguePollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${dengueDatasetId}/poll-download`;
  const psiUrl = "https://api-open.data.gov.sg/v2/real-time/api/psi";

  try {
    // 1. Fetch both primary API endpoints in parallel for efficiency
    const [denguePollResponse, psiResponse] = await Promise.all([
      axios.get(denguePollUrl),
      axios.get(psiUrl)
    ]);

    // 2. Process Dengue Data (requires a second fetch)
    if (denguePollResponse.data.code !== 0) throw new Error(`Dengue API error: ${denguePollResponse.data.errMsg}`);
    const dengueDownloadUrl = denguePollResponse.data.data.url;
    const geoJsonResponse = await axios.get(dengueDownloadUrl);
    const dengueSummary = processDengueData(geoJsonResponse.data);

    // 3. Process PSI Data (already fetched)
    const psiSummary = processPsiData(psiResponse.data);

    // 4. Construct the final combined data object
    const finalData = {
      dengueSummary: dengueSummary,
      psiSummary: psiSummary,
      geoJsonData: geoJsonResponse.data, 
      sourceDate: dateString,
    };

    // 5. Update the cache
    cache = {
      data: finalData,
      lastFetchDate: dateString,
    };

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("Failed to fetch combined data:", error);
    return NextResponse.json(
      { message: "Failed to fetch or process combined health data." },
      { status: 500 }
    );
  }
}