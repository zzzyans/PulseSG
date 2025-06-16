// src/lib/data.ts
import { DengueCluster } from "../types";

// This function can be called from any Server Component
export async function getDengueData(): Promise<DengueCluster[] | null> {
  try {
    // Using import() for local JSON is reliable and works on the server
    const mockClusters = (await import("../../public/mockdata/mock-dengue-clusters.json")).default;
    return mockClusters;
  } catch (error) {
    console.error("Error reading dengue data:", error);
    return null;
  }
}

// Define a type for our PSI data for clarity
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