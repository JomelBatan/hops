"use client";
import { LayoutInner } from "@/components/layout/AppLayout";
import { BoardProvider } from "@/context/BoardContext";
import React from "react";

interface AppLayout {
  children: React.ReactNode;
}
export default function AppLayout({ children }: AppLayout) {
  return (
    <BoardProvider>
      <LayoutInner>{children}</LayoutInner>
    </BoardProvider>
  );
}
