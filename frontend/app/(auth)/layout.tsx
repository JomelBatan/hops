import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AppLayout {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AppLayout) {
  const token = (await cookies()).get("access_token");

  if (token) {
    redirect("/dashboard");
  }
  return children;
}
