// src/types/index.ts
export interface DengueCluster {
  id: number;
  location: string;
  caseCount: number;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}