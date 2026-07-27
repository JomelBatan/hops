import { isDone } from "@/app/(app)/my-tasks/page";
import { formatDueDate } from "@/libs/utils";
import { Task } from "@/types";
import { ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";
import { PriorityTag } from "../ui/Badge";

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  const due = formatDueDate(new Date(task.due_date));
  const done = isDone(task);
  return (
    <Link
      href={`/board/${task.board_id}`}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-(--shadow-card) transition-shadow duration-200 hover:shadow-(--shadow-soft)"
    >
      <PriorityTag priority={task.priority} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-semibold tracking-tight
            ${done ? "text-faint line-through" : "text-ink"}`}
        >
          {task.title}
        </p>
        {task.status && (
          <p className="mt-0.5 text-[11px] text-faint">{task.status}</p>
        )}
      </div>
      {due && (
        <span
          className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tabular sm:flex
           ${
             due.overdue && !done
               ? "bg-priority-urgent/10 text-priority-urgent"
               : "bg-gray-200 text-muted"
           }`}
        >
          <Calendar className="h-3 w-3" /> {due.label}
        </span>
      )}
      <ArrowUpRight className="h-4 w-4 shrink-0 text-faint opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500 group-hover:opacity-100" />
    </Link>
  );
}
