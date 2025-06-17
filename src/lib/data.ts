// src/lib/data.ts
import { CombinedHealthData } from "../types"; // Use the new combined type

// This is now the ONLY data fetching function we need for our pages.
export async function getCombinedHealthData(): Promise<CombinedHealthData | null> {
  try {
    const apiUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/health-data`;

    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API fetch failed: ${res.statusText}`);
    }

    const data: CombinedHealthData = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getCombinedHealthData:", error);
    return null;
  }
}