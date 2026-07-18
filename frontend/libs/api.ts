import { AuthPayload } from "@/types";
import axios, { AxiosInstance } from "axios";

const TOKEN_KEY = "LEPUS_TOKEN";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL!
    : "http://localhost:5050/api";

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Normalize errors to a readable message; bounce to login on 401.
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const message =
        error.resonse?.data?.error || error.message || "Something went wrong";
      if (error.response?.status === 401 && getToken()) {
        clearToken();
        if (!location.pathname.startsWith("/login")) location.assign("/login");
      }
      return Promise.reject(new Error(message));
    },
  );
  return api;
};

export const useApiClient = (): AxiosInstance => {
  return createApiClient();
};

export const authApi = {
  register: (api: AxiosInstance, data: AuthPayload) =>
    api.post("/auth/register", data),
  login: (api: AxiosInstance, data: AuthPayload) =>
    api.post("/auth/login", data),
  me: (api: AxiosInstance) => api.get("/auth/me"),
};
