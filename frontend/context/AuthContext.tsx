"use client";
import {
  authApi,
  clearToken,
  getToken,
  setToken,
  useApiClient,
} from "@/libs/api";
import { connectSocket, disconnectSocket } from "@/libs/socket";
import { AuthPayload, User } from "@/types";
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
  register: ({ email, password }: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
/*
TODO: 
*/

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const api = useApiClient();
  //Restore session on first load if a token is present
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          return;
        }
        const res = await authApi.me(api);
        if (!res.data) return;

        setUser(res.data.user);
        connectSocket();

        return;
      } catch (error) {
        console.log(error);
        clearToken();
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [api]);

  function handleAuth(user: User, token: string) {
    setToken(token);
    setUser(user);
    connectSocket();
    return user;
  }
  async function login({ email, password }: AuthPayload) {
    try {
      setLoading(true);
      console.log("hit");
      const res = await authApi.login(api, { email, password });
      console.log("After LogIN", res);
      if (!res.data) return;
      handleAuth(res.data.user, res.data.token);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }
  async function register({ email, password }: AuthPayload) {
    try {
      setLoading(true);
      const res = await authApi.register(api, { email, password });
      if (!res.data) return;
      handleAuth(res.data.user, res.data.token);

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }
  function logout() {
    clearToken();
    disconnectSocket();
    setUser(null);
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
