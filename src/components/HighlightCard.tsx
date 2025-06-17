// src/components/HighlightCard.tsx
import React from "react";

type HighlightCardProps = {
  title: string;
  value: string;
  description: string;
  level: "good" | "moderate" | "high";
  icon: React.ReactNode;
};

export default function HighlightCard({
  title,
  value,
  description,
  level,
  icon,
}: HighlightCardProps) {

  const levelClasses = {
    good: {
      border: "border-green-500",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
    },
    moderate: {
      border: "border-orange-500",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
    },
    high: {
      border: "border-red-600",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconText: "text-red-600",
    },
  };

  const currentLevel = levelClasses[level];

  return (
    <div
      className={`p-5 rounded-lg border-l-4 shadow-sm flex items-start gap-4 transition-all hover:shadow-md hover:border-blue-500 ${currentLevel.border} ${currentLevel.bg}`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${currentLevel.iconBg} ${currentLevel.iconText}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <p className="text-2xl font-bold text-slate-900 my-1">{value}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
