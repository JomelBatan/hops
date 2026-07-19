"use client";
import { boardApi, useApiClient } from "@/libs/api";
import { Board, BoardPayload } from "@/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface BoardContextType {
  boards: Board[];
  loading: boolean;
  refresh: () => void;
  create: (data: BoardPayload) => Promise<Board>;
  remove: (id: string) => void;
}

const BoardsContext = createContext<BoardContextType | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const api = useApiClient();

  const refresh = useCallback(async () => {
    try {
      const res = await boardApi.list(api);
      if (!res.data) return;
      const boards = res.data.boards;

      setBoards(boards);
      return;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    function refresher() {
      refresh();
    }

    refresher();
  }, [refresh]);

  async function create(data: BoardPayload) {
    try {
      const res = await boardApi.create(api, data);
      if (!res.data) return;

      const board = res.data.board;
      setBoards((prev) => [board, ...prev]);

      return board;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }
  async function remove(id: string) {
    try {
      const res = await boardApi.remove(api, id);
      if (!res.data) return;

      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <BoardsContext.Provider
      value={{ boards, loading, refresh, create, remove }}
    >
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards(): BoardContextType {
  const ctx = useContext(BoardsContext);
  if (!ctx) throw new Error("useBoards must be used within BoardProvider");
  return ctx;
}
