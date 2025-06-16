// src/lib/data.ts
import { HealthApiResponse } from "../types";

// This function now fetches the complete data object from our backend API
export async function getDengueData(): Promise<HealthApiResponse | null> {
  try {
    // This URL points to our own backend route, not an external site
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health-data`;

    const res = await fetch(apiUrl, {
      cache: "no-store", // Use 'no-store' for development to always get fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const data: HealthApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getDengueData:", error);
    return null;
  }
}

// We can keep the mock PSI data function for now
export interface PsiData {
  id: number;
  region: string;
  psi: number;
  descriptor: string;
}

export async function getPsiData(): Promise<PsiData[] | null> {
  try {
    const mockPsi = (await import("../../public/mockdata/mock-psi-data.json")).default;
    return mockPsi;
  } catch (error) {
    console.error("Error reading PSI data:", error);
    return null;
  }
}