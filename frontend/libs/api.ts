import { AuthPayload } from "@/types";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL!
    : "http://localhost:5050/api";

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

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
  logout: (api: AxiosInstance) => api.post("/auth/logout"),
  me: (api: AxiosInstance) => api.get("/auth/me"),
};
