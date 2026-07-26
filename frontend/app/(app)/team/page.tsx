"use client";
import { useLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import useWorkspace from "@/hooks/useWorkspace";
import { BoardRole, User } from "@/types";
import React, { useMemo, useState } from "react";

const roleTone = (role: BoardRole) =>
  role === "owner"
    ? "bg-brand-50 text-brand-700"
    : role === "admin"
      ? "bg-[#FBF1E2] text-[#c28a3a]"
      : "bg-surface-2 text-muted";

export default function Team() {
  const { user } = useAuth();
  const { openCreateBoard } = useLayout();
  const { members, loading } = useWorkspace();
  const [search, setSearch] = useState("");
  console.log("Member: ", members);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...members].sort((a, b) =>
      (a.name || "").localeCompare(b.name || ""),
    );
    if (!q) return sorted;
    return sorted.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q),
    );
  }, [members, search]);

  //const owners = members.filter((m) => m.role === "owner").length;

  return <div>page</div>;
}
