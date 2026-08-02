"use client";
import { LayoutInner } from "@/components/layout/AppLayout";
import { BoardProvider } from "@/context/BoardContext";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/Loading";
import { useRouter } from "next/navigation";

interface AppLayout {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayout) {
  const { user, initializing } = useAuth();
  const router = useRouter();
  if (initializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!user) {
    router.replace("/login");
  }
  return (
    <BoardProvider>
      <LayoutInner>{children}</LayoutInner>
    </BoardProvider>
  );
}
