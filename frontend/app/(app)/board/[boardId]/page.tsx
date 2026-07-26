"use client";
import ActivityFeed from "@/components/ActivityFeed";
import AIGenerateModal from "@/components/ai/AIGenerateModal";
import AISummaryModal from "@/components/ai/AISummaryModal";
import KanbanBoard from "@/components/board/KanbanBoard";
import MembersModal from "@/components/board/MembersModal";
import TaskModal from "@/components/board/TaskModal";
import { useLayout } from "@/components/layout/AppLayout";
import Topbar from "@/components/layout/Topbar";
import { AvatarStack } from "@/components/ui/Avatar";
import { ColumnSkeleton } from "@/components/ui/BoardCardSkeleton";
import Button from "@/components/ui/Button";
import { FilterSelect } from "@/components/ui/Input";
import PromptDialog from "@/components/ui/PromptDialog";
import { useBoard } from "@/hooks/useBoard";
import { aiApi } from "@/libs/api";
import { PRIORITIES } from "@/libs/utils";
import { BreakDownTaskRes, Task, User } from "@/types";
import {
  Activity,
  ChevronLeft,
  FileText,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface taskModal {
  open: boolean;
  task: Task | null;
  columnId: string | null;
}

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { openCreateBoard } = useLayout();
  const b = useBoard(boardId);
  const [taskModal, setTaskModal] = useState<taskModal>({
    open: false,
    task: null,
    columnId: null,
  });
  const [aiGen, setAiGen] = useState<{
    open: boolean;
    columnId: string | null;
  }>({ open: false, columnId: null });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [addColumnOpen, setAddColumnOpen] = useState(false);

  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return b.tasks.filter((t) => {
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterAssignee && t.assignee_id !== filterAssignee) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !(t.description || "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [b.tasks, filterPriority, filterAssignee, search]);

  const handleBreakdown = async (task: Task) => {
    try {
      const res = await aiApi.breakDown(boardId, {
        taskId: task.id,
      });
      if (!res.data) return;

      const subtasks: BreakDownTaskRes[] = res.data.subtasks;
      for (const subtask of subtasks) {
        await b.createTask({
          column_id: task.column_id,
          title: subtask.title,
          description: subtask.description,
          priority: subtask.priority,
        });
      }

      toast.success(`Added ${subtasks.length} subtasks`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      toast.error(message);
    }
  };
  const canManage = b.role === "owner" || b.role === "admin";

  if (b.error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold">{`Couldn’t load this board`}</p>
        <p className="text-muted">{b.error}</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    );
  }
  const actions = (
    <div className="flex items-center gap-2">
      {b.presence.length > 0 && (
        <div className="mr-1 hidden items-center gap-2 sm:flex">
          <span className="text-[11px] text-faint">Viewing</span>
          <AvatarStack users={b.presence} size="xs" max={3} />
        </div>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setActivityOpen(true)}
        title="Activity"
      >
        <Activity className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setMembersOpen(true)}
        title="Members"
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={() => setSummaryOpen(true)}>
        <FileText className="h-4 w-4" />{" "}
        <span className="hidden lg:inline">Summary</span>
      </Button>
      <Button
        size="sm"
        onClick={() => setAiGen({ open: true, columnId: b.columns[0].id })}
      >
        <Sparkles className="h-4 w-4" />{" "}
        <span className="hidden lg:inline">AI tasks</span>
      </Button>
    </div>
  );
  return (
    <>
      <Topbar
        title={
          <span className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-faint hover:text-ink md:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            {b.board ? (
              <>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: b.board.color }}
                />
                {b.board.title}
              </>
            ) : (
              "Loading…"
            )}
          </span>
        }
        subtitle={b.board?.description!}
        actions={actions}
        onCreateBoard={openCreateBoard}
      />
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5 px-6 py-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="h-9 w-52 rounded-full text-black placeholder:text-gray-500 border border-line bg-surface pl-9 pr-4 text-xs shadow-(--shadow-card) outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <FilterSelect
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
        >
          <option value="">All assignees</option>
          {b.members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </FilterSelect>
        {(filterPriority || filterAssignee || search) && (
          <button
            onClick={() => {
              setFilterPriority("");
              setFilterAssignee("");
              setSearch("");
            }}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Clear
          </button>
        )}
        <span className="ml-auto rounded-full bg-gray-200 px-3 py-1 text-xs font-medium tabular text-muted">
          {filteredTasks.length} tasks
        </span>
      </div>
      {/* Board */}
      <div className="flex-1 overflow-hidden pt-4">
        {b.loading ? (
          <div className="flex gap-4 px-6">
            {[0, 1, 2, 3].map((i) => (
              <ColumnSkeleton key={i} />
            ))}
          </div>
        ) : (
          <KanbanBoard
            columns={b.columns}
            tasks={filteredTasks}
            actions={b}
            onTaskClick={(task: Task) =>
              setTaskModal({ open: true, task, columnId: task.column_id })
            }
            onAddTask={(columnId: string) =>
              setTaskModal({ open: true, task: null, columnId })
            }
            onAiGenerate={(columnId: string) =>
              setAiGen({ open: true, columnId })
            }
            onAddColumn={() => setAddColumnOpen(true)}
          />
        )}
      </div>
      {/* Modals */}
      <TaskModal
        open={taskModal.open}
        onClose={() =>
          setTaskModal({ open: false, task: null, columnId: null })
        }
        task={taskModal.task}
        defaultColumnId={taskModal.columnId!}
        columns={b.columns}
        members={b.members}
        actions={b}
        onBreakdown={handleBreakdown}
      />
      <AIGenerateModal
        open={aiGen.open}
        onClose={() => setAiGen({ open: false, columnId: null })}
        boardId={boardId}
        columns={b.columns}
        defaultColumnId={aiGen.columnId}
        onCreated={(tasks) => tasks.forEach(b.upsertTask)}
      />
      <AISummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        boardId={boardId}
      />
      <MembersModal
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        boardId={boardId}
        members={b.members}
        setMembers={b.setMembers}
        canManage={canManage}
        ownerId={b.board?.owner_id!}
      />
      <ActivityFeed
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        boardId={boardId}
      />
      <PromptDialog
        open={addColumnOpen}
        onClose={() => setAddColumnOpen(false)}
        title="Add column"
        description="Give your new column a name."
        label="Column name"
        placeholder="e.g. Backlog"
        submitLabel="Add column"
        onSubmit={(title: string) => {
          b.addColumn(title);
          setAddColumnOpen(false);
        }}
      />
    </>
  );
}
