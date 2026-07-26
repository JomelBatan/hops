import { formatDueDate } from "@/libs/utils";
import { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { PriorityTag } from "../ui/Badge";
import Avatar from "../ui/Avatar";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: (t: Task) => void;
  overlay?: boolean;
}

export default function TaskCard({
  task,
  onClick,
  overlay = false,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = { transform: CSS.Translate.toString(transform), transition };
  const due = formatDueDate(new Date(task.due_date));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick?.(task)}
      className={`group cursor-grab rounded-2xl border border-line bg-surface p-4 active:cursor-grabbing shadow-(--shadow-card) transition-shadow duration-200 hover:shadow-(--shadow-soft)
        ${isDragging && "opacity-40"}
        ${overlay && "rotate-2 cursor-grabbing shadow-(--shadow-lift)"}`}
    >
      <PriorityTag priority={task.priority} />

      <p className="mt-2.5 text-[15px] font-semibold leading-snug tracking-tight text-ink">
        {task.title}
      </p>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-3.5 flex items-center justify-between border-t border-line/70 pt-3">
        {task.assignee_id ? (
          <div className="flex items-center gap-1.5">
            <Avatar
              name={task.assignee_name}
              id={task.assignee_id}
              src={task.assignee_avatar}
              size="xs"
            />

            <span className="max-w-28 truncate text-[11px] text-muted">
              {task.assignee_name}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-faint">Unassigned</span>
        )}

        {due && (
          <span
            className={` flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular
              ${
                due.overdue
                  ? "bg-priority-urgent/10 text-priority-urgent"
                  : "bg-gray-200 text-muted"
              }`}
          >
            <Calendar className="h-3 w-3" /> {due.label}
          </span>
        )}
      </div>
    </div>
  );
}
