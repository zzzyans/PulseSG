// src/lib/psi.ts

export interface PsiInfo {
  descriptor: string;
  color: string; 
}

// official NEA color scheme
export function getPsiInfo(psi: number): PsiInfo {
  if (psi <= 50) {
    return { descriptor: "Good", color: "#28a745" }; // Green
  }
  if (psi <= 100) {
    return { descriptor: "Moderate", color: "#007bff" }; // Blue
  }
  if (psi <= 200) {
    return { descriptor: "Unhealthy", color: "#ffc107" }; // Yellow
  }
  if (psi <= 300) {
    return { descriptor: "Very unhealthy", color: "#fd7e14" }; // Orange
  }
  return { descriptor: "Hazardous", color: "#dc3545" }; // Red
}