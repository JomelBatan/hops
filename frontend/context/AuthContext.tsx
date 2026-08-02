"use client";
import { authApi } from "@/libs/api";
import { connectSocket, disconnectSocket } from "@/libs/socket";
import { AuthPayload, RegisterPayload, User } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: ({ email, password }: AuthPayload) => void;
  register: ({ name, email, password }: RegisterPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
/*
TODO: 
*/

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  //Restore session on first load if a token is present
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const res = await authApi.me();
        if (!res.data) return;

        setUser(res.data);
        connectSocket();

        return;
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  function handleAuth(user: User) {
    setUser(user);
    connectSocket();
    return user;
  }
  async function login({ email, password }: AuthPayload) {
    try {
      setLoading(true);

      const res = await authApi.login({ email, password });

      if (!res.data) return;
      handleAuth(res.data);
      toast.success("Welcome back!");
      router.replace("/dashboard");
      return user;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error ?? "Something went wrong";

        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  async function register({ name, email, password }: RegisterPayload) {
    try {
      setLoading(true);
      const res = await authApi.register({ name, email, password });
      if (!res.data) return;
      handleAuth(res.data);
      toast.success("Account created!");
      router.replace("/dashboard");
      return user;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error ?? "Something went wrong";

        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    try {
      setLoading(true);
      const res = await authApi.logout();

      toast.success(res.data.message);
      disconnectSocket();
      setUser(null);

      return;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error ?? "Something went wrong";

        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
