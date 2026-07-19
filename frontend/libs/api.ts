import {
  AddMemberPayload,
  AuthPayload,
  BoardPayload,
  BreakDownTaskPayload,
  CreateColumnPayload,
  GenerateTaskPayload,
  MoveTaskPayload,
  TaskParams,
  TaskPayload,
  UpdateBoardPayload,
  UpdateColumnPayload,
  UpdateTaskPayload,
} from "@/types";
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
export const userApi = {
  search: (api: AxiosInstance, q: string) =>
    api.get("/users/search", { params: { q } }),
};

export const boardApi = {
  list: (api: AxiosInstance) => api.get("/boards"),
  create: (api: AxiosInstance, data: BoardPayload) => api.post("/boards", data),
  get: (api: AxiosInstance, id: string) => api.get(`/boards/${id}`),
  update: (api: AxiosInstance, data: UpdateBoardPayload, id: string) =>
    api.patch(`/boards/${id}`, data),
  remove: (api: AxiosInstance, id: string) => api.delete(`/boards/${id}`),
  activity: (api: AxiosInstance, id: string, limit = 30) =>
    api.get(`/boards/${id}/activity`, { params: { limit } }),
  addMember: (api: AxiosInstance, id: string, data: AddMemberPayload) =>
    api.post(`/boards/${id}/members`, data),
  removeMemver: (api: AxiosInstance, id: string, userId: string) =>
    api.delete(`/boards/${id}/members/${userId}`),
};

export const columnApi = {
  create: (api: AxiosInstance, boardId: string, data: CreateColumnPayload) =>
    api.post(`/boards/${boardId}/columns`, data),
  update: (
    api: AxiosInstance,
    boardId: string,
    columnId: string,
    data: UpdateColumnPayload,
  ) => api.patch(`/boards/${boardId}/columns/${columnId}`, data),
  remove: (api: AxiosInstance, boardId: string, columnId: string) =>
    api.delete(`/boards/${boardId}/columns/${columnId}`),
};

export const taskApi = {
  list: (api: AxiosInstance, boardId: string, params: TaskParams) =>
    api.get(`/boards/${boardId}/tasks`, { params }),
  create: (api: AxiosInstance, boardId: string, data: TaskPayload) =>
    api.post(`/boards/${boardId}/tasks`, data),
  update: (
    api: AxiosInstance,
    boardId: string,
    taskId: string,
    data: UpdateTaskPayload,
  ) => api.patch(`/boards/${boardId}/tasks/${taskId}`, data),
  move: (
    api: AxiosInstance,
    boardId: string,
    taskId: string,
    data: MoveTaskPayload,
  ) => api.patch(`/boards/${boardId}/tasks/${taskId}/move`, data),
  remove: (api: AxiosInstance, boardId: string, taskId: string) =>
    api.delete(`/boards/${boardId}/tasks/${taskId}`),
};

export const aiApi = {
  generateTasks: (
    api: AxiosInstance,
    boardId: string,
    data: GenerateTaskPayload,
  ) => api.post(`/boards/${boardId}/ai/generate-tasks`, data),
  breakDown: (
    api: AxiosInstance,
    boardId: string,
    data: BreakDownTaskPayload,
  ) => api.post(`/boards/${boardId}/ai/breakdown`, data),
  summary: (api: AxiosInstance, boardId: string) =>
    api.post(`/boards/${boardId}/ai/summary`),
};
