// src/app/psi/page.tsx
import { getCombinedHealthData } from "@/lib/data";
import PsiDashboard from "@/components/PsiDashboard";

export default async function PsiPage() {
  const healthData = await getCombinedHealthData();

  // Pass only the relevant PSI summary to the component
  return (
    <PsiDashboard
      summary={healthData?.psiSummary || null}
      sourceDate={healthData?.sourceDate || null}
    />
  );
}