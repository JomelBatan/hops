import { LayoutInner } from "@/components/layout/AppLayout";
import { BoardProvider } from "@/context/BoardContext";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AppLayout {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayout) {
  const token = (await cookies()).get("access_token");

  if (!token) {
    redirect("/login");
  }
  return (
    <BoardProvider>
      <LayoutInner>{children}</LayoutInner>
    </BoardProvider>
  );
}
