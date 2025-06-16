// src/app/page.tsx
import Link from "next/link";
import { getDengueData, getPsiData } from "@/lib/data";
import HighlightCard from "@/components/HighlightCard";

// Icons
const BugIcon = () => <span className="text-red-600">🦟</span>;
const CloudIcon = () => <span className="text-orange-500">☁️</span>;

export default async function OverviewPage() {
  const [dengueData, psiData] = await Promise.all([
    getDengueData(),
    getPsiData(),
  ]);

  const topDengueCluster = dengueData
    ? [...dengueData].sort((a, b) => b.caseCount - a.caseCount)[0]
    : null;
  const topPsiRegion = psiData
    ? [...psiData].sort((a, b) => b.psi - a.psi)[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              value={`${topDengueCluster.caseCount} cases`}
              description={`in ${topDengueCluster.location}. Click for detailed map.`}
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