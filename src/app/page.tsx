// src/app/page.tsx
import Link from "next/link";
import { getDengueData, getPsiData } from "@/lib/data";
import HighlightCard from "@/components/HighlightCard";
import { DengueFeature } from "@/types"; // Import the specific feature type

// --- ICONS ---
const BugIcon = () => <span className="text-red-600">🦟</span>;
const CloudIcon = () => <span className="text-orange-500">☁️</span>;

// --- MAIN PAGE COMPONENT ---
export default async function OverviewPage() {
  // Fetch all required data in parallel
  const [dengueApiResponse, psiData] = await Promise.all([
    getDengueData(),
    getPsiData(),
  ]);

  // --- DATA PROCESSING & ANALYSIS ---

  // --- FIX APPLIED HERE ---
  // Add safety checks and access the correct nested array
  const topDengueCluster =
    dengueApiResponse &&
    dengueApiResponse.geoJsonData &&
    dengueApiResponse.geoJsonData.features.length > 0
      ? [...(dengueApiResponse.geoJsonData.features as DengueFeature[])].sort(
          (a, b) => b.properties.CASE_SIZE - a.properties.CASE_SIZE
        )[0]
      : null;

  const topPsiRegion =
    psiData && psiData.length > 0
      ? [...psiData].sort((a, b) => b.psi - a.psi)[0]
      : null;

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
          <Link
            href="/dengue"
            className="block hover:scale-[1.02] transition-transform duration-200"
          >
            <HighlightCard
              level="high"
              icon={<BugIcon />}
              title="Primary Dengue Hotspot"
              value={`${topDengueCluster.properties.CASE_SIZE} cases`}
              description={`in ${topDengueCluster.properties.LOCALITY}. Click for detailed map.`}
            />
          </Link>
        )}

        {topPsiRegion && (
          <Link
            href="/psi"
            className="block hover:scale-[1.02] transition-transform duration-200"
          >
            <HighlightCard
              level={topPsiRegion.psi > 50 ? "moderate" : "good"}
              icon={<CloudIcon />}
              title="Highest PSI Reading"
              value={`${topPsiRegion.psi} PSI`}
              description={`in the ${topPsiRegion.region} region. Click for details.`}
            />
          </Link>
        )}
      </div>
    </div>
  );
}