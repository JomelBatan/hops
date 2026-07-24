import { boardApi, columnApi, taskApi } from "@/libs/api";
import { connectSocket } from "@/libs/socket";
import {
  Board,
  BoardMember,
  BoardRole,
  Column,
  Task,
  TaskPayload,
  UpdateTaskPayload,
  User,
} from "@/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [role, setRole] = useState<BoardRole>("member");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presence, setPresence] = useState<User[]>([]);

  const upsertTask = useCallback((task: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id);
      if (idx === -1) return [...prev, task];
      const next = [...prev];
      next[idx] = task;
      return next;
    });
  }, []);

  const removeTaskLocal = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  //Initial Load
  useEffect(() => {
    let alive = true;

    async function loadBoard() {
      try {
        setLoading(true);
        setError(null);

        const res = await boardApi.get(boardId);

        if (!alive || !res.data) return;

        setBoard(res.data.board);
        setColumns(res.data.columns);
        setTasks(res.data.tasks);
        setMembers(res.data.members);
        setRole(res.data.role);
      } catch (error) {
        if (!alive) return;

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadBoard();

    return () => {
      alive = false;
    };
  }, [boardId]);

  // Real-time sync
  useEffect(() => {
    const socket = connectSocket();
    socket.emit("board:join", boardId);

    const onCreated = (t: Task) => upsertTask(t);
    const onUpdated = (t: Task) => upsertTask(t);
    const onMoved = (t: Task) => upsertTask(t);
    const onDeleted = ({ id }: { id: string }) => removeTaskLocal(id);
    const onColCreated = (c: Column) =>
      setColumns((p) => [...p, c].sort((a, b) => a.position - b.position));
    const onColUpdated = (c: Column) =>
      setColumns((p) =>
        p
          .map((x) => (x.id === c.id ? c : x))
          .sort((a, b) => a.position - b.position),
      );
    const onColDeleted = ({ id }: { id: string }) =>
      setColumns((p) => p.filter((x) => x.id !== id));
    const onBoardUpdated = (b: Board) => setBoard(b);
    const onPresenceSync = ({ users }: { users: User[] }) =>
      setPresence(users || []);
    const onPresenceJoin = ({ user }: { user: User }) =>
      setPresence((p) => (p.find((u) => u.id === user.id) ? p : [...p, user]));
    const onPresenceLeave = ({ user }: { user: User }) =>
      setPresence((p) => p.filter((u) => u.id !== user.id));

    socket.on("task:created", onCreated);
    socket.on("task:updated", onUpdated);
    socket.on("task:moved", onMoved);
    socket.on("task:deleted", onDeleted);
    socket.on("column:created", onColCreated);
    socket.on("column:updated", onColUpdated);
    socket.on("column:deleted", onColDeleted);
    socket.on("board:updated", onBoardUpdated);
    socket.on("presence:sync", onPresenceSync);
    socket.on("presence:join", onPresenceJoin);
    socket.on("presence:leave", onPresenceLeave);

    return () => {
      socket.emit("board:leave", boardId);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:moved", onMoved);
      socket.off("task:deleted", onDeleted);
      socket.off("column:created", onColCreated);
      socket.off("column:updated", onColUpdated);
      socket.off("column:deleted", onColDeleted);
      socket.off("board:updated", onBoardUpdated);
      socket.off("presence:sync", onPresenceSync);
      socket.off("presence:join", onPresenceJoin);
      socket.off("presence:leave", onPresenceLeave);
      setPresence([]);
    };
  }, [boardId, upsertTask, removeTaskLocal]);

  /* ----------------------------- mutations ----------------------------- */
  const createTask = useCallback(
    async (data: TaskPayload) => {
      try {
        const res = await taskApi.create(boardId, data);
        const task = res.data.task;
        if (!task) return;
        upsertTask(task);
        return task;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }

        throw error;
      }
    },
    [boardId, upsertTask],
  );

  const updateTask = useCallback(
    async (taskId: string, data: UpdateTaskPayload) => {
      const prev = tasks.find((t) => t.id === taskId);
      if (prev) {
        upsertTask({
          ...prev,
          ...data,
        });
      }
      try {
        const res = await taskApi.update(boardId, taskId, data);
        const task = res.data.task;
        if (!task) return;
        upsertTask(task);
        return task;
      } catch (error) {
        if (error instanceof Error) {
          if (prev) upsertTask(prev);

          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        throw error;
      }
    },
    [boardId, tasks, upsertTask],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const prev = tasks.find((t) => t.id === taskId);
      removeTaskLocal(taskId);

      try {
        await taskApi.remove(boardId, taskId);
        toast.success("Task deleted");
      } catch (error) {
        if (error instanceof Error) {
          if (prev) upsertTask(prev);

          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        throw error;
      }
    },
    [boardId, tasks, removeTaskLocal, upsertTask],
  );

  //Apply a local move immediately, then persist
  const moveTask = useCallback(
    async (taskId: string, columnId: string, position: number) => {
      const prev = tasks.find((t) => t.id === taskId);
      if (!prev) return;
      upsertTask({ ...prev, column_id: columnId, position });
      try {
        await taskApi.move(boardId, taskId, {
          column_id: columnId,
          position,
        });
      } catch (error) {
        if (error instanceof Error) {
          upsertTask(prev);
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    },
    [boardId, tasks, upsertTask],
  );

  const addColumn = useCallback(
    async (title: string) => {
      try {
        const res = await columnApi.create(boardId, { title });
        if (!res.data) return;
        const col = res.data.column;
        setColumns((p) => [...p, col].sort((a, b) => a.position - b.position));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    },
    [boardId],
  );

  const renameColumn = useCallback(
    async (columnId: string, title: string) => {
      setColumns((p) =>
        p.map((c) => (c.id === columnId ? { ...c, title } : c)),
      );
      try {
        await columnApi.update(boardId, columnId, { title });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    },
    [boardId],
  );

  const deleteColumn = useCallback(
    async (columnId: string) => {
      try {
        await columnApi.remove(boardId, columnId);
        setColumns((p) => p.filter((c) => c.id !== columnId));
        setTasks((p) => p.filter((t) => t.column_id !== columnId));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    },
    [boardId],
  );
  return {
    board,
    columns,
    tasks,
    members,
    role,
    loading,
    error,
    presence,
    setBoard,
    setMembers,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    upsertTask,
    addColumn,
    renameColumn,
    deleteColumn,
  };
}
