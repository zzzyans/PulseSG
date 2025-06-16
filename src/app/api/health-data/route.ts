// src/app/api/health-data/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

/**
 * Processes the real GeoJSON data to create a rich summary.
 * @param geoJsonData The full GeoJSON object from the API.
 * @returns A summary object with key metrics.
 */
const createSummary = (geoJsonData: any) => {
  if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
    return { 
      totalClusters: 0, 
      totalCases: 0,
      topCluster: { locality: "N/A", cases: 0 } 
    };
  }
  
  const features = geoJsonData.features;
  
  // 1. Calculate the total number of clusters
  const totalClusters = features.length;
  
  // 2. Calculate the total number of cases by summing up CASE_SIZE from all features
  const totalCases = features.reduce((sum: number, feature: any) => {
    // Use parseInt to convert the case size string/number to an integer
    return sum + parseInt(feature.properties.CASE_SIZE || '0', 10);
  }, 0);

  // 3. Find the cluster with the highest number of cases
  const topClusterFeature = features.reduce((maxFeature: any, currentFeature: any) => {
    const maxCases = parseInt(maxFeature.properties.CASE_SIZE || '0', 10);
    const currentCases = parseInt(currentFeature.properties.CASE_SIZE || '0', 10);
    return currentCases > maxCases ? currentFeature : maxFeature;
  }, features[0]); // Start with the first feature as the initial max

  const topCluster = {
    locality: topClusterFeature.properties.LOCALITY,
    cases: parseInt(topClusterFeature.properties.CASE_SIZE || '0', 10),
  };

  return { totalClusters, totalCases, topCluster };
};

// --- Simple in-memory cache that resets daily ---
let cache = {
  data: null as any,
  lastFetchDate: '' // Cache key based on the date string YYYY-MM-DD
};

export async function GET(request: Request) {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];

  if (cache.data && cache.lastFetchDate === dateString) {
    console.log("Serving from today's cache...");
    return NextResponse.json(cache.data);
  }

  console.log(`Fetching new data for ${dateString}...`);
  
  const datasetId = "d_dbfabf16158d1b0e1c420627c0819168";
  const pollUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;

  try {
    // STEP 1: Get the download link
    const pollResponse = await axios.get(pollUrl);
    if (pollResponse.data.code !== 0) {
      throw new Error(`API error: ${pollResponse.data.errMsg}`);
    }
    const downloadUrl = pollResponse.data.data.url;

    // STEP 2: Download the actual GeoJSON file
    const geoJsonResponse = await axios.get(downloadUrl);
    const geoJsonData = geoJsonResponse.data;

    // STEP 3: Process the real data to create a rich summary
    const summary = createSummary(geoJsonData);

    // STEP 4: Construct the final data object for the frontend
    const finalData = {
      geoJsonData: geoJsonData, // for the map
      summary: summary,         // for data cards
      sourceDate: dateString,
    };

    // STEP 5: Update the cache
    cache = {
      data: finalData,
      lastFetchDate: dateString,
    };

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json(
      { message: "Failed to fetch or process dengue cluster data." },
      { status: 500 }
    );
  }
}