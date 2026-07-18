"use client";

import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/libs/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (token || user) {
      router.replace("/dashboard");
    }
  }, [user, router, token]);

  if (token || user) return null;

  return <>{children}</>;
}
