export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: Date;
};

export interface AuthPayload {
  email: string;
  password: string;
}

export type PriorityValue = "low" | "medium" | "high" | "urgent";
