"use client";

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/libs/api";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (token || user) {
      router.replace("/dashboard");
    }
  }, [user, router, token]);

  if (user) return null;

  return <>{children}</>;
}
