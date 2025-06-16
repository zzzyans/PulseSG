// src/components/PsiRegionList.tsx
"use client";

// A simple component to display PSI data
export default function PsiRegionList({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-slate-900">
        PSI by Region
      </h3>
      <ul className="space-y-2">
        {data.map((region) => (
          <li
            key={region.id}
            className="flex justify-between items-center text-sm p-2"
          >
            <span className="text-slate-700">{region.region}</span>
            <span
              className={`font-bold text-sm ${
                region.psi > 50 ? "text-orange-600" : "text-green-600"
              }`}
            >
              {region.psi} ({region.descriptor})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}