// src/app/dengue/page.tsx
import { getCombinedHealthData } from "@/lib/data";
import DengueDashboard from "@/components/DengueDashboard";

export default async function DenguePage() {
  const healthData = await getCombinedHealthData();

  // Pass only the relevant parts of the data to the component
  return (
    <DengueDashboard
      geoJsonData={healthData?.geoJsonData || null}
      summary={healthData?.dengueSummary || null}
      sourceDate={healthData?.sourceDate || null}
    />
  );
}