import { Board } from "@/types";
import React from "react";
import SectionTitle from "./SectionTitle";
import { PieChart } from "lucide-react";
import StatRow from "./StatRow";
import Legend from "./Legend";

interface WorkspaceDonutProps {
  owned: number;
  shared: number;
  boards: Board[];
  className?: string;
}

export default function WorkspaceDonut({
  owned,
  shared,
  boards = [],
  className = "",
}: WorkspaceDonutProps) {
  const total = owned + shared;
  const R = 56;
  const SW = 16;
  const C = 2 * Math.PI * R;
  const ownedLen = total ? (owned / total) * C : 0;
  const sharedLen = total ? (shared / total) * C : 0;

  const totalTasks = boards.reduce((s, b) => s + Number(b.task_count || 0), 0);
  const avg = total ? Math.round(totalTasks / total) : 0;
  const active = boards.filter((b) => Number(b.task_count || 0) > 0).length;
  const busiest = boards.reduce(
    (a, b) => (Number(b.task_count || 0) > Number(a?.task_count || 0) ? b : a),
    null as Board | null, // <-- Cast here
  );

  return (
    <div
      className={`flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-(--shadow-card) ${className}`}
    >
      <SectionTitle icon={PieChart} hint="Owned vs shared">
        Composition
      </SectionTitle>
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke="var(--color-surface-2)"
              strokeWidth={SW}
            />
            {owned > 0 && (
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="#4a4edf"
                strokeWidth={SW}
                strokeDasharray={`${ownedLen} ${C}`}
              />
            )}
            {shared > 0 && (
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="#c7c9fc"
                strokeWidth={SW}
                strokeDasharray={`${sharedLen} ${C}`}
                strokeDashoffset={-ownedLen}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold tabular leading-none">
              {total}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-widest text-faint">
              boards
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <Legend color="#4a4edf" label="Owned" value={owned} />
          <Legend color="#c7c9fc" label="Shared" value={shared} />
        </div>
      </div>

      {/* Workspace at a glance */}
      <div className="mt-6 grid flex-1 content-center gap-3.5 border-t pt-5">
        <StatRow label="Total tasks" value={totalTasks} />
        <StatRow label="Avg per board" value={avg} />
        <StatRow label="Active boards" value={active / total} />
        {busiest && Number(busiest.task_count || 0) > 0 && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted">Busiest board</span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-semibold text-ink">
                {busiest.title}
              </span>
              <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-medium  text-muted">
                {busiest.task_count}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
