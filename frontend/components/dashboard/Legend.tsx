import React from "react";

interface LegendProps {
  color: string;
  label: string;
  value: number;
}

export default function Legend({ color, label, value }: LegendProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted">{label}</span>
      <span className="ml-auto text-sm font-semibold tabular text-ink">
        {value}
      </span>
    </div>
  );
}
