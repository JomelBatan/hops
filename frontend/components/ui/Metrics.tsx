import React from "react";

interface MetricProps {
  icon: React.ElementType;
  label: string;
  value: number;
  tint: string;
}

export default function Metric({
  icon: Icon,
  label,
  value,
  tint,
}: MetricProps) {
  return (
    <div className="rounded-2xl bg-gray-100 p-4">
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}1a`, color: tint }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-2xl font-semibold tracking-tight tabular text-ink">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}
