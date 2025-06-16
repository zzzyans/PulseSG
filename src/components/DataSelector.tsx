// src/components/DataSelector.tsx
"use client";

// Define the types of datasets we can have
export type DataSet = "dengue" | "psi";

interface DataSelectorProps {
  activeSet: DataSet;
  onSelect: (dataSet: DataSet) => void;
}

export default function DataSelector({
  activeSet,
  onSelect,
}: DataSelectorProps) {
  const commonClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-all";
  const activeClasses = "bg-white text-blue-600 shadow";
  const inactiveClasses = "bg-transparent text-slate-500 hover:bg-white/50";

  return (
    <div className="bg-slate-200 p-1 rounded-lg flex items-center gap-1 self-start">
      <button
        onClick={() => onSelect("dengue")}
        className={`${commonClasses} ${
          activeSet === "dengue" ? activeClasses : inactiveClasses
        }`}
      >
        Dengue Outbreak
      </button>
      <button
        onClick={() => onSelect("psi")}
        className={`${commonClasses} ${
          activeSet === "psi" ? activeClasses : inactiveClasses
        }`}
      >
        Haze (PSI)
      </button>
    </div>
  );
}