import { Board } from "@/types";
import React from "react";
import SectionTitle from "./SectionTitle";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import EmptyHint from "./EmptyHint";

interface TasksByBoardProps {
  boards: Board[];
  className?: string;
}

export default function TasksByBoard({
  boards,
  className = "",
}: TasksByBoardProps) {
  const max = Math.max(1, ...boards.map((b) => Number(b.task_count || 0)));
  const total = boards.reduce((s, b) => s + Number(b.task_count || 0), 0);
  const hasTasks = total > 0;
  return (
    <div
      className={`flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-(--shadow-card) ${className}`}
    >
      <SectionTitle icon={BarChart3} hint="Tasks across your busiest boards">
        Board analytics
      </SectionTitle>

      {hasTasks ? (
        <div className="mt-2 flex flex-1 flex-col gap-6 lg:flex-row">
          {/* bars */}

          <div className="flex h-57.5 flex-1 items-end gap-3">
            {boards.map((b) => {
              const count = Number(b.task_count || 0);
              const pct = count / max;
              const color = b.color || "#2f8159";
              return (
                <Link
                  key={b.id}
                  href={`/board/${b.id}`}
                  title={`${b.title} · ${count} tasks`}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="relative flex w-full max-w-11 flex-1 items-end justify-center">
                    {count > 0 ? (
                      <>
                        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold tabular text-white opacity-0 shadow-(--shadow-soft) transition-opacity duration-200 group-hover:opacity-100">
                          {count}
                        </span>
                        <div
                          className="w-full rounded-full"
                          style={{ backgroundColor: barShade(pct) }}
                        />
                      </>
                    ) : (
                      <div className="hatch h-full w-full rounded-full border border-line" />
                    )}
                  </div>
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg font-display text-[11px] font-bold"
                    style={{ backgroundColor: `${color}22`, color }}
                  >
                    {b.title?.[0]?.toUpperCase() || "B"}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ranked breakdown — decodes the bar initials */}
          <div className="shrink-0 lg:w-75 lg:border-l lg:border-line lg:pl-6">
            <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
              Breakdown
            </p>
            <div className="space-y-3">
              {boards.map((b) => {
                const count = Number(b.task_count || 0);
                const share = total ? Math.round((count / total) * 100) : 0;
                return (
                  <Link
                    key={b.id}
                    href={`/board/${b.id}`}
                    className="group flex items-center gap-2.5"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: b.color || "#2f8159" }}
                    />
                    <span className="flex-1 truncate text-[13px] font-medium text-ink transition-colors group-hover:text-brand-600">
                      {b.title}
                    </span>
                    <span className="text-[13px] font-semibold tabular text-ink">
                      {count}
                    </span>
                    <span className="w-9 text-right text-[11px] tabular text-faint">
                      {share}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <EmptyHint icon={BarChart3}>
          No tasks yet — add some to see the breakdown.
        </EmptyHint>
      )}
    </div>
  );
}
function barShade(pct: number) {
  return pct >= 0.8
    ? "#1d5038"
    : pct >= 0.5
      ? "#2f8159"
      : pct >= 0.25
        ? "#57a47b"
        : "#8bc4a4";
}
