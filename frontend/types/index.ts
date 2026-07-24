/*-----------------Params-----------------*/
export interface TaskParams {
  priority?: string;
  assignee?: string;
  column?: string;
  q?: string;
}

/*-----------------Payload-----------------*/
export interface AuthPayload {
  email: string;
  password: string;
}
export interface BoardPayload {
  title: string;
  description: string;
  color: string;
}
export interface AddMemberPayload {
  role: BoardRole;
  boardId: string;
  username: string;
}
export interface GenerateTaskPayload {
  goal: string;
  count: number;
  column_id: string;
}
export interface BreakDownTaskPayload {
  title: string;
  description: string;
  count: number;
  taskId: string;
}
export type UpdateBoardPayload = Omit<BoardPayload, "userId">;
export type TaskPayload = Pick<
  Task,
  | "column_id"
  | "title"
  | "description"
  | "due_date"
  | "assignee_id"
  | "priority"
>;
export type CreateColumnPayload = Pick<Column, "title">;
export type UpdateColumnPayload = Pick<Column, "title"> &
  Partial<Pick<Column, "position">>;
export type UpdateTaskPayload = Omit<TaskPayload, "column_id">;
export type MoveTaskPayload = Pick<Task, "column_id" | "position">;
/*-----------------Main Types-----------------*/
export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: Date;
};
export type PriorityValue = "low" | "medium" | "high" | "urgent";
export type Sizes = "xs" | "sm" | "md" | "lg" | "xl";
export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  task_count?: number;
  is_owner?: boolean;
  member_count?: number;
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
export interface Task {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: PriorityValue;
  due_date: Date | null;
  assignee_id: string | null;
  position: number;
  board_title?: string;
  board_color?: string;
  status?: string;
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
