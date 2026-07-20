"use client";
import AIPromo from "@/components/dashboard/AIPromo";
import EmptyState from "@/components/dashboard/EmptyState";
import KpiCard from "@/components/dashboard/KpiCard";
import RecentBoards from "@/components/dashboard/RecentBoards";
import TasksByBoard from "@/components/dashboard/TasksByBoard";
import WorkspaceDonut from "@/components/dashboard/WorkspaceDonut";
import { useLayout } from "@/components/layout/AppLayout";
import Topbar from "@/components/layout/Topbar";
import { BoardCardSkeleton } from "@/components/ui/BoardCardSkeleton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useBoards } from "@/context/BoardContext";
import { relativeTime } from "@/libs/utils";
import {
  ArrowUpRight,
  CheckSquare,
  Crown,
  FolderKanban,
  LayoutGrid,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

export default function DashboardPage() {
  const { boards, loading } = useBoards();
  const { user } = useAuth();
  const { openCreateBoard } = useLayout();

  const stats = useMemo(() => {
    const totalTasks = boards.reduce(
      (sum, b) => sum + Number(b.task_count || 0),
      0,
    );
    const owned = boards.filter((b) => b.is_owner).length;
    const shared = boards.filter((b) => !b.is_owner).length;
    return { total: boards.length, totalTasks, owned, shared };
  }, [boards]);

  const topBoards = useMemo(
    () =>
      [...boards]
        .sort((a, b) => Number(b.task_count || 0) - Number(a.task_count || 0))
        .slice(0, 7),
    [boards],
  );
  const avgPerBoard = stats.total
    ? Math.round(stats.totalTasks / stats.total)
    : 0;
  const ownedPct = stats.total
    ? Math.round((stats.owned / stats.total) * 100)
    : 0;

  // Real per-board task distributions feeding the KPI mini bar charts.
  const trends = useMemo(() => {
    const sizes = boards.map((b) => Number(b.task_count || 0));
    return {
      boards: sizes,
      tasks: [...sizes].sort((a, b) => b - a),
      owned: boards
        .filter((b) => b.is_owner)
        .map((b) => Number(b.task_count || 0)),
      shared: boards
        .filter((b) => !b.is_owner)
        .map((b) => Number(b.task_count || 0)),
    };
  }, [boards]);
  const recentBoards = useMemo(
    () =>
      [...boards]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 4),
    [boards],
  );
  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Your boards and shared projects"
        onCreateBoard={openCreateBoard}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] px-6 py-8 md:px-8">
          {/* Greeting */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Workspace Overview
            </p>
            <h2 className="text-black mt-2 font-display text-[clamp(26px,3vw,34px)] font-semibold leading-tight tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h2>
          </div>

          {/* KPIs */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              featured
              label="Total boards"
              value={stats.total}
              hint="Across your workspace"
              trend={trends.boards}
              icon={FolderKanban}
            />

            <KpiCard
              label="Total tasks"
              value={stats.totalTasks}
              hint={`${avgPerBoard} avg per board`}
              trend={trends.tasks}
              icon={CheckSquare}
            />
            <KpiCard
              label="Owned by you"
              value={stats.owned}
              hint={`${ownedPct}% of workspace`}
              trend={trends.owned}
              icon={Crown}
            />
            <KpiCard
              label="Shared with you"
              value={stats.shared}
              hint="From your teammates"
              trend={trends.shared}
              icon={Share2}
            />
          </div>

          {/* Insights — bento */}
          {loading ? (
            <div className="mb-10 space-y-5">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className="skeleton h-75 rounded-3xl lg:col-span-8" />
                <div className="skeleton h-75 rounded-3xl lg:col-span-4" />
              </div>
            </div>
          ) : boards.length > 0 ? (
            <div className="mb-10 space-y-5">
              <div className="grid gap-5 lg:grid-cols-12">
                <TasksByBoard boards={topBoards} className="lg:col-span-8" />

                <WorkspaceDonut
                  owned={stats.owned}
                  shared={stats.shared}
                  boards={boards}
                  className="lg:col-span-4"
                />
              </div>
              <div className="grid gap-5 lg:grid-cols-12">
                <RecentBoards boards={recentBoards} className="lg:col-span-8" />
                <AIPromo onCreate={openCreateBoard} className="lg:col-span-4" />
              </div>
            </div>
          ) : null}

          <div className="mb-5 flex items-end justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              All boards
            </h3>
            <Button size="sm" onClick={openCreateBoard}>
              <Plus className="h-4 w-4" /> New board
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BoardCardSkeleton key={i} />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <EmptyState onCreate={openCreateBoard} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((b, i) => (
                <div key={b.id}>
                  <Link
                    href={`/board/${b.id}`}
                    className="group relative block h-full overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-(--shadow-card) transition-shadow duration-300 hover:shadow-(--shadow-soft)"
                  >
                    {/* color accent strip */}
                    <span
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ background: b.color || "#2f8159" }}
                    />
                    <div className="mb-3.5 flex items-start justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${b.color || "#2f8159"}1f`,
                          color: b.color || "#2f8159",
                        }}
                      >
                        <LayoutGrid className="h-5 w-5" />
                      </div>
                      <span className="flex items-center gap-1.5 text-faint transition-all duration-200 group-hover:text-brand-500">
                        {!b.is_owner && (
                          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                            Shared
                          </span>
                        )}

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    <h4 className="font-display text-black text-base font-semibold tracking-tight transition-colors group-hover:text-brand-600">
                      {b.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">
                      {b.description || "No description"}
                    </p>
                    <div className="mt-4 flex items-center gap-4 border-t border-faint pt-3.5 text-xs text-faint">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="h-3.5 w-3.5" /> {b.task_count}{" "}
                        tasks
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {b.member_count}
                      </span>
                      <span className="ml-auto">
                        {relativeTime(b.updated_at)}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
