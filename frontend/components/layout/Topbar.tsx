"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { useLayout } from "./AppLayout";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Command, LogOut, Plus, Search } from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

interface TopbarProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  onCreateBoard: () => void;
}

export default function Topbar({
  title,
  subtitle,
  actions,
  onCreateBoard,
}: TopbarProps) {
  const { user, logout } = useAuth();
  const { openCommand } = useLayout() || {};
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // e is typed as a native MouseEvent
    const onClick = (e: MouseEvent) => {
      // Node casting is required for .contains() because e.target is typed as EventTarget | null
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <header className="glass sticky top-0 z-20 flex h-18 items-center gap-4 border-b px-6">
      <div className="min-w-0 shrink">
        {title && (
          <h1 className="truncate font-display text-lg font-bold leading-tight tracking-tight text-ink">
            {title}
          </h1>
        )}
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Search → command menu */}
        <button
          onClick={openCommand}
          className="hidden h-10 w-56 items-center gap-2.5 rounded-full border border-line bg-surface px-4 text-sm text-faint shadow-(--shadow-card) transition-all duration-200 hover:border-brand-300 hover:text-muted hover:shadow-(--shadow-soft) md:flex lg:w-64"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search tasks, boards…</span>
          <kbd className="flex items-center gap-0.5 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>

        {actions}
        <button
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-px hover:text-ink hover:shadow-(--shadow-soft) sm:flex"
          title="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        <Button
          size="md"
          onClick={onCreateBoard}
          className="hidden sm:inline-flex"
        >
          <Plus className="h-4 w-4" /> New board
        </Button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 shadow-(--shadow-card) transition-all duration-200 hover:border-brand-300 hover:shadow-(--shadow-soft)"
          >
            {user && (
              <Avatar
                name={user?.name}
                id={user?.id}
                src={user?.avatar_url}
                size="sm"
              />
            )}
            <span className="hidden max-w-28 truncate text-sm font-medium text-ink lg:block">
              {user?.name?.split(" ")[0]}
            </span>

            <ChevronDown className="h-4 w-4 text-faint" />
          </button>

          {menuOpen && (
            <div className="card animate-in absolute right-0 mt-2 w-56 rounded-2xl p-1.5 shadow-(--shadow-lift)">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-ink">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-faint">{user?.email}</p>
              </div>
              <div className="my-1 border-t" />
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-priority-urgent transition-colors hover:bg-surface-2"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
