import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface DengueCluster {
  id: number;
  location: string;
  caseCount: number;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

let cachedData: DengueCluster[] | null = null;

async function processDengueData(): Promise<DengueCluster[]> {
  const jsonDirectory = path.join(process.cwd(), "public", "data");
  const fileContents = await fs.readFile(
    path.join(jsonDirectory, "DengueClusters.geojson"),
    "utf8"
  );
  const geoJsonData = JSON.parse(fileContents);

  const processedData: DengueCluster[] = geoJsonData.features.map(
    (feature: any) => {
      return {
        id: feature.properties.OBJECTID,
        location: feature.properties.LOCALITY,
        caseCount: feature.properties.CASE_SIZE,
        geometry: feature.geometry,
      };
    }
  );

  return processedData;
}

export async function GET(request: Request) {
  if (!cachedData) {
    console.log("Processing and caching dengue data for the first time...");
    cachedData = await processDengueData();
  } else {
    console.log("Serving dengue data from cache.");
  }

  return NextResponse.json(cachedData);
}