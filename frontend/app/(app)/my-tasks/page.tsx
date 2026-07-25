"use client";
import { EmptyStateTask } from "@/components/ui/EmptyState";
import { useLayout } from "@/components/layout/AppLayout";
import Topbar from "@/components/layout/Topbar";
import { useAuth } from "@/context/AuthContext";
import useWorkspace from "@/hooks/useWorkspace";
import { Task } from "@/types";
import React, { useMemo, useState } from "react";
import { FilterSelect } from "@/components/ui/Input";
import { PRIORITIES } from "@/libs/utils";
import MiniStat from "@/components/task/MiniStat";
import {
  AlertTriangle,
  CalendarClock,
  CheckSquare,
  ListTodo,
} from "lucide-react";
import TaskRow from "@/components/task/TaskRow";

export const isDone = (t: Task) => (t.status || "").toLowerCase() === "done";

export default function MyTask() {
  const { user } = useAuth();
  const { openCreateBoard } = useLayout();
  const { tasks, loading } = useWorkspace();

  const [priority, setPriority] = useState<string>("");
  const [boardId, setBoardId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [now] = useState<number>(() => Date.now());

  const mine = useMemo(
    () =>
      tasks.filter((t: Task) => t.assignee_id && t.assignee_id === user?.id),
    [tasks, user],
  );

  const boardsInPlay = useMemo(() => {
    const map = new Map();
    mine.forEach((t: Task) =>
      map.set(t.board_id, { id: t.board_id, title: t.board_title }),
    );
    return [...map.values()];
  }, [mine]);

  const stats = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    const week = now + 7 * 24 * 60 * 60 * 1000;
    mine.forEach((t: Task) => {
      if (isDone(t) || !t.due_date) return;
      const d = new Date(t.due_date).getTime();
      if (d < now) overdue += 1;
      else if (d <= week) dueSoon += 1;
    });
    return {
      total: mine.length,
      overdue,
      dueSoon,
      done: mine.filter(isDone).length,
    };
  }, [mine, now]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mine.filter((t) => {
      if (priority && t.priority !== priority) return false;
      if (boardId && t.board_id !== boardId) return false;
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !(t.description || "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [mine, priority, boardId, search]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((t) => {
      const arr = map.get(t.board_id) || [];
      arr.push(t);
      map.set(t.board_id, arr);
    });
    return [...map.entries()].map(([id, items]) => ({
      id,
      title: items[0].board_title,
      color: items[0].board_color,
      items,
    }));
  }, [filtered]);

  const hasFilters = priority || boardId || search;

  return (
    <>
      <Topbar
        title="My Tasks"
        subtitle="Everything assigned to you"
        onCreateBoard={openCreateBoard}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] px-6 py-8 md:px-8">
          {/* KPIs */}
          <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat
              icon={ListTodo}
              label="Assigned to you"
              value={stats.total}
              tint="#2f8159"
            />
            <MiniStat
              icon={AlertTriangle}
              label="Overdue"
              value={stats.overdue}
              tint="#e11d48"
            />
            <MiniStat
              icon={CalendarClock}
              label="Due this week"
              value={stats.dueSoon}
              tint="#d97706"
            />
            <MiniStat
              icon={CheckSquare}
              label="Completed"
              value={stats.done}
              tint="#10b981"
            />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your tasks"
              className="h-9 w-56 rounded-full text-black placeholder:text-gray-500 border border-line bg-surface px-4 text-xs shadow-(--shadow-card) outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            />
            <FilterSelect
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All priorities</option>

              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
            >
              <option value="">All boards</option>
              {boardsInPlay.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </FilterSelect>
            {hasFilters && (
              <button
                onClick={() => {
                  setPriority("");
                  setBoardId("");
                  setSearch("");
                }}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:bg-gray-200 hover:text-ink"
              >
                Clear
              </button>
            )}
            <span className="ml-auto rounded-full bg-gray-200 px-3 py-1 text-xs font-medium tabular text-muted">
              {filtered.length} tasks
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-2xl" />
              ))}
            </div>
          ) : mine.length === 0 ? (
            <EmptyStateTask
              title="No tasks assigned to you"
              body="Tasks you’re assigned across all your boards will show up here."
            />
          ) : filtered.length === 0 ? (
            <EmptyStateTask
              title="No matching tasks"
              body="Try clearing your filters."
            />
          ) : (
            <div className="space-y-8">
              {grouped.map((g) => (
                <div key={g.id}>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: g.color || "#2f8159" }}
                    />
                    <h3 className="font-display text-black text-sm font-semibold tracking-tight">
                      {g.title}
                    </h3>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-medium tabular text-gray-200">
                      {g.items.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {g.items.map((t: Task) => (
                      <TaskRow key={t.id} task={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
