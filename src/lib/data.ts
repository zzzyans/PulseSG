// src/lib/data.ts
import { CombinedHealthData } from "../types";

export async function getCombinedHealthData(): Promise<CombinedHealthData | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health-data`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`API fetch failed: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error("Error in getCombinedHealthData:", error);
    return null;
  }
}