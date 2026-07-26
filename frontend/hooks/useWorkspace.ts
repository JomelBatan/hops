import { useBoards } from "@/context/BoardContext";
import { boardApi } from "@/libs/api";
import { Board, Column, Task, User } from "@/types";
import { useEffect, useState } from "react";

export default function useWorkspace() {
  const { boards, loading: boardsLoading } = useBoards();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Create a stable string key to prevent infinite reference re-render loops
  const boardIds = boards ? boards.map((b) => b.id).join(",") : "";

  useEffect(() => {
    // 1. Guard against running while boards are still loading
    if (boardsLoading) return;

    let cancelled = false;

    // 2. Wrap all processing in Promise.resolve() so state updates
    // run asynchronously in a microtask rather than synchronously during commit
    Promise.resolve()
      .then(async () => {
        if (!boards || boards.length === 0) {
          return { tasks: [], members: [] };
        }

        const results = await Promise.all(
          boards.map((b: Board) => boardApi.get(b.id).catch(() => null)),
        );

        const allTasks: Task[] = [];
        const memberMap = new Map();

        results.forEach((res, i) => {
          if (!res?.data) return;
          const board = res.data.board || boards[i];
          const colTitle: Record<string, string> = {};
          (res.data.columns || []).forEach((c: Column) => {
            colTitle[c.id] = c.title;
          });

          (res.data.tasks || []).forEach((t: Task) =>
            allTasks.push({
              ...t,
              board_id: board.id,
              board_title: board.title,
              board_color: board.color,
              status: colTitle[t.column_id] || "",
            }),
          );

          (res.data.members || []).forEach((m: User) => {
            const existing = memberMap.get(m.id);
            if (existing) {
              if (!existing.boards.includes(board.title)) {
                existing.boards.push(board.title);
              }
            } else {
              memberMap.set(m.id, { ...m, boards: [board.title] });
            }
          });
        });

        return { tasks: allTasks, members: [...memberMap.values()] };
      })
      .then((data) => {
        if (cancelled) return;

        // All state updates happen together in this asynchronous callback
        setTasks(data.tasks);
        setMembers(data.members);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [boardIds, boardsLoading]);

  return { tasks, members, boards, loading: loading || boardsLoading };
}
