"use client";
import { useEffect, useState } from "react";
import {
  LogOut,
  Command,
  Zap,
  FolderKanban,
  CheckSquare,
  Users,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Metric from "@/components/ui/Metrics";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useLayout } from "@/components/layout/AppLayout";
import useWorkspace from "@/hooks/useWorkspace";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { user, logout } = useAuth();
  const { openCreateBoard } = useLayout();
  const { boards, tasks, members } = useWorkspace();
  const router = useRouter();

  if (!user) return;
  return (
    <>
      <Topbar
        title="Settings"
        subtitle="Profile and preferences"
        onCreateBoard={openCreateBoard}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-5 px-6 py-8 md:px-8">
          {/* Profile */}
          <Card
            title="Profile"
            description="How you appear across your workspace."
          >
            <div className="flex items-center gap-4">
              <Avatar
                name={user.name}
                id={user.id}
                src={user.avatar_url}
                size="lg"
                className="h-16 w-16 text-lg p-8!"
              />
              <div className="min-w-0">
                <p className="font-display text-black text-lg font-semibold tracking-tight">
                  {user?.name}
                </p>
                <p className="truncate text-sm text-muted">{user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Workspace */}
          <Card title="Workspace" description="Your activity at a glance.">
            <div className="grid grid-cols-3 gap-3">
              <Metric
                icon={FolderKanban}
                label="Boards"
                value={boards.length}
                tint="#2f8159"
              />
              <Metric
                icon={CheckSquare}
                label="Tasks"
                value={tasks.length}
                tint="#0ea5e9"
              />
              <Metric
                icon={Users}
                label="People"
                value={members.length}
                tint="#10b981"
              />
            </div>
          </Card>

          {/* Preferences */}
          <Card title="Preferences" description="Saved to this browser.">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Reduce motion</p>
                <p className="mt-0.5 text-xs text-muted">
                  Minimize animations and transitions across the app.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t pt-5">
              <div>
                <p className="text-sm font-medium text-ink">Command menu</p>
                <p className="mt-0.5 text-xs text-muted">
                  Jump anywhere, search boards, create tasks.
                </p>
              </div>
              <kbd className="flex items-center gap-0.5 rounded-md bg-surface-2 px-2 py-1 text-[11px] font-semibold text-muted">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </Card>

          {/* About */}
          <Card title="About">
            <div className="flex items-center gap-3">
              <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl shadow-(--shadow-brand)">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Flowboard</p>
                <p className="text-xs text-muted">
                  AI-powered Kanban · Light theme
                </p>
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card title="Account" description="Manage your session.">
            <button
              className="flex flex-row px-4 py-2 bg-priority-urgent select-none items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all duration-200 ease-spring focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]"
              onClick={() => {
                logout();
                router.replace("/");
              }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
