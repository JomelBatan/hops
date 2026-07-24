"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SideBar from "./SideBar";
import { BoardProvider } from "@/context/BoardContext";
import CreateBoardModal from "../board/CreateBoardModal";
import CommandMenu from "../CommandMenu";

type LayoutContextType = {
  openCreateBoard: () => void;
  openCommand: () => void;
};
const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutInner({ children }: { children: ReactNode }) {
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    function init() {
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    }
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  const toggleSideBar = useCallback(
    () =>
      setCollapsed((c) => {
        const next = !c;
        localStorage.setItem("sidebar-collapsed", String(next));
        return next;
      }),
    [],
  );
  const openCreateBoard = useCallback(() => setCreateOpen(true), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <LayoutContext.Provider value={{ openCreateBoard, openCommand }}>
      <div className="h-screen overflow-hidden">
        <SideBar
          collapsed={collapsed}
          onToggle={toggleSideBar}
          onCreateBoard={openCreateBoard}
          onCommand={openCommand}
        />
        <main
          className={`flex h-screen min-w-0 flex-col overflow-hidden transition-[padding] duration-300 ease-spring
            ${collapsed ? "md:pl-23" : "md:pl-70"}`}
        >
          {children}
        </main>
      </div>
      <CreateBoardModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <CommandMenu
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onCreateBoard={() => {
          setCommandOpen(false);
          setCreateOpen(true);
        }}
      />
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextType {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
