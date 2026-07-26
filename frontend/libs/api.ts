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

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const useApiClient = () => api;

export const authApi = {
  register: (data: AuthPayload) => api.post("/auth/register", data),
  login: (data: AuthPayload) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};
export const userApi = {
  search: (q: string) => api.get("/users/search", { params: { q } }),
};
export const boardApi = {
  list: () => api.get("/boards"),
  create: (data: BoardPayload) => api.post("/boards", data),
  get: (id: string) => api.get(`/boards/${id}`),
  update: (data: UpdateBoardPayload, id: string) =>
    api.patch(`/boards/${id}`, data),
  remove: (id: string) => api.delete(`/boards/${id}`),
  activity: (id: string, limit = 30) =>
    api.get(`/boards/${id}/activity`, { params: { limit } }),
  addMember: (id: string, data: AddMemberPayload) =>
    api.post(`/boards/${id}/members`, data),
  removeMember: (id: string, userId: string) =>
    api.delete(`/boards/${id}/members/${userId}`),
};
export const columnApi = {
  create: (boardId: string, data: CreateColumnPayload) =>
    api.post(`/boards/${boardId}/columns`, data),
  update: (boardId: string, columnId: string, data: UpdateColumnPayload) =>
    api.patch(`/boards/${boardId}/columns/${columnId}`, data),
  remove: (boardId: string, columnId: string) =>
    api.delete(`/boards/${boardId}/columns/${columnId}`),
};
export const taskApi = {
  list: (boardId: string, params: TaskParams) =>
    api.get(`/boards/${boardId}/tasks`, { params }),
  create: (boardId: string, data: TaskPayload) =>
    api.post(`/boards/${boardId}/tasks`, data),
  update: (boardId: string, taskId: string, data: UpdateTaskPayload) =>
    api.patch(`/boards/${boardId}/tasks/${taskId}`, data),
  move: (boardId: string, taskId: string, data: MoveTaskPayload) =>
    api.patch(`/boards/${boardId}/tasks/${taskId}/move`, data),
  remove: (boardId: string, taskId: string) =>
    api.delete(`/boards/${boardId}/tasks/${taskId}`),
};
export const aiApi = {
  generateTasks: (boardId: string, data: GenerateTaskPayload) =>
    api.post(`/boards/${boardId}/ai/generate-tasks`, data),
  breakDown: (boardId: string, data: BreakDownTaskPayload) =>
    api.post(`/boards/${boardId}/ai/breakdown`, data),
  summary: (boardId: string) => api.post(`/boards/${boardId}/ai/summary`),
};
