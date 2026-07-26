"use client";
import { Column as ColumnType, Task } from "@/types";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DndContext,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { Cpu, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import Column from "./Column";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  actions: any;
  onTaskClick: (t: Task) => void;
  onAddTask: (columnId: string) => void;
  onAiGenerate: (columnId: string) => void;
  onAddColumn: () => void;
}

// Compute a fractional position so a task lands at `index` within `siblings`
// (siblings must already exclude the task being moved, sorted by position).
const positionForIndex = (siblings: readonly Task[], index: number): number => {
  const prev = siblings[index - 1]?.position;
  const next = siblings[index]?.position;

  if (prev !== undefined && next !== undefined) {
    return (prev + next) / 2;
  }

  if (prev !== undefined) {
    return prev + 1000;
  }

  if (next !== undefined) {
    return next / 2;
  }

  return 1000;
};

export default function KanbanBoard({
  columns,
  tasks,
  actions,
  onTaskClick,
  onAddColumn,
  onAddTask,
  onAiGenerate,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const tasksByColumn = useMemo<Record<string, Task[]>>(() => {
    const map: Record<string, Task[]> = {};

    for (const col of columns) {
      map[col.id] = [];
    }

    for (const task of tasks) {
      (map[task.column_id] ??= []).push(task);
    }

    for (const id in map) {
      map[id].sort((a, b) => a.position - b.position);
    }

    return map;
  }, [columns, tasks]);

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;

    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    const overData = over.data.current;

    let targetColumnId: string;

    if (overData?.type === "column") {
      targetColumnId = over.id as string;
    } else if (overData?.type === "task") {
      targetColumnId = overData.task.column_id;
    } else {
      targetColumnId = activeTaskObj.column_id;
    }

    const siblings = (tasksByColumn[targetColumnId] ?? []).filter(
      (t) => t.id !== activeId,
    );

    let index: number;

    if (overData?.type === "task") {
      const overIndex = siblings.findIndex((t) => t.id === over.id);

      index = overIndex === -1 ? siblings.length : overIndex;
    } else {
      index = siblings.length;
    }

    const newPosition = positionForIndex(siblings, index);

    if (
      activeTaskObj.column_id === targetColumnId &&
      activeTaskObj.position === newPosition
    ) {
      return;
    }

    actions.moveTask(activeId, targetColumnId, newPosition);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex h-full gap-5 overflow-x-auto px-6 pb-6">
        {columns.map((col, i) => (
          <Column
            key={col.id}
            column={col}
            index={i}
            tasks={tasksByColumn[col.id] || []}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
            onAiGenerate={onAiGenerate}
            onRename={actions.renameColumn}
            onDelete={actions.deleteColumn}
          />
        ))}

        {/* Add column */}
        <button
          onClick={onAddColumn}
          className="flex h-11 w-75 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line text-sm font-medium text-faint transition-colors hover:border-brand-500/50 hover:bg-surface hover:text-muted"
        >
          <Plus className="h-4 w-4" /> Add column
        </button>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-78.5">
            <TaskCard task={activeTask} overlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
