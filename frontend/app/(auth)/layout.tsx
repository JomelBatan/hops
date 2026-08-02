"use client";
import Loader from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AppLayout {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AppLayout) {
  const { user, initializing } = useAuth();
  const router = useRouter();
  if (initializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (user) {
    router.replace("/dashboard");
  }
  return children;
}
