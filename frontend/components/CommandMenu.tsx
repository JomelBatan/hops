import { useBoards } from "@/context/BoardContext";
import {
  Calendar,
  CheckSquare,
  CornerDownLeft,
  LayoutDashboard,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  onCreateBoard: () => void;
}

export default function CommandMenu({
  open,
  onClose,
  onCreateBoard,
}: CommandMenuProps) {
  const { boards } = useBoards();
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [active, setActive] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function setUp() {
      if (open) {
        setQuery("");
        setActive(0);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }

    setUp();
  }, [open]);

  const items = useMemo(() => {
    const actions = [
      {
        id: "create",
        label: "Create new board",
        icon: Plus,
        onSelect: onCreateBoard,
      },
      {
        id: "dashboard",
        label: "Go to dashboard",
        icon: LayoutDashboard,
        onSelect: () => router.push("/dashboard"),
      },
      {
        id: "my-tasks",
        label: "Go to My Tasks",
        icon: CheckSquare,
        onSelect: () => router.push("/my-tasks"),
      },
      {
        id: "calendar",
        label: "Go to Calendar",
        icon: Calendar,
        onSelect: () => router.push("/calendar"),
      },
      {
        id: "team",
        label: "Go to Team",
        icon: Users,
        onSelect: () => router.push("/team"),
      },
      {
        id: "settings",
        label: "Go to Settings",
        icon: Settings,
        onSelect: () => router.push("/settings"),
      },
    ];
    const boardItems = boards.map((b) => ({
      id: `board-${b.id}`,
      label: b.title,
      sub: "Board",
      icon: LayoutGrid,
      color: b.color,
      onSelect: () => router.push(`/board/${b.id}`),
    }));

    const all = [...actions, ...boardItems];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((i) => i.label.toLowerCase().includes(q));
  }, [boards, query, router.push, onCreateBoard]);

  function run(item?: { onSelect?: () => void }) {
    onClose();
    item?.onSelect?.();
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(items[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-60 flex items-start justify-center p-4 pt-[12vh]">
          <div
            className="fixed inset-0 bg-ink/35 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="card relative z-10 w-full max-w-xl overflow-hidden rounded-3xl shadow-(--shadow-lift)">
            <div className="flex items-center gap-3 border-b px-4">
              <Search className="h-4 w-4 text-faint" />

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search boards or run a command…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {items.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-faint">
                  No results
                </p>
              ) : (
                items.map((item, i) => (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors
                      ${
                        active === i
                          ? "bg-primary/20 text-primary/90 "
                          : "text-muted"
                      }`}
                  >
                    <item.icon className="h-4 w-4" />

                    <span className="flex-1 truncate">{item.label}</span>

                    {active === i && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-faint" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
