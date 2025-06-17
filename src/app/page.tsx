// src/app/page.tsx
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { getCombinedHealthData } from "@/lib/data";
import HighlightCard from "@/components/HighlightCard";


// --- ICONS ---
const BugIcon = () => <span className="text-red-600">🦟</span>;
const CloudIcon = () => <span className="text-orange-500">☁️</span>;

export default async function OverviewPage() {
  // Fetch the single, combined data object
  const healthData = await getCombinedHealthData();

  // Use the data from the response, with safety checks
  const topDengueCluster = healthData?.dengueSummary?.topCluster;
  const topPsiValue = healthData?.psiSummary?.nationwideAverage;
  const psiDescriptor = topPsiValue && topPsiValue > 50 ? "Moderate" : "Good";

  return (
    <div className="main-container">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Health Overview</h2>
        <p className="text-lg text-slate-600 mt-1">
          A summary of key public health concerns in Singapore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topDengueCluster && (
          <Link href="/dengue" /* ... */>
            <HighlightCard
              level="high"
              icon={<BugIcon />}
              title="Primary Dengue Hotspot"
              value={`${topDengueCluster.cases} cases`}
              description={`in ${topDengueCluster.locality}. Click for detailed map.`}
            />
          </Link>
        )}
        {topPsiValue !== undefined && (
          <Link href="/psi" /* ... */>
            <HighlightCard
              level={psiDescriptor === "Moderate" ? "moderate" : "good"}
              icon={<CloudIcon />}
              title="National Average PSI"
              value={`${topPsiValue} PSI`}
              description={`Overall air quality is considered ${psiDescriptor}.`}
            />
          </Link>
        )}
      </div>
    </div>
  );
}