import React from "react";

interface StatRowProps {
  label?: string;
  value?: number;
}

export default function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold tabular text-ink">{value}</span>
    </div>
  );
}
