export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export type BoardRole = "member" | "admin" | "owner";

export interface BoardMember {
  board_id: string;
  user_id: string;
  role: BoardRole | string;
  joined_at: Date;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: Date;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority | string;
  due_date: Date | null;
  assignee_id: string | null;
  position: number;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: string;
  board_id: string;
  user_id: string | null;
  action: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}
