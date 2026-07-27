import type { Server } from "socket.io";
import { query } from "../config/db.js";

let io: Server | null = null;

export const setIo = (instance: Server): void => {
  io = instance;
};

export const boardRoom = (boardId: string): string => `board:${boardId}`;

export const emitToBoard = <T>(
  boardId: string,
  event: string,
  payload: T,
): void => {
  io?.to(boardRoom(boardId)).emit(event, payload);
};

interface LogActivityParams {
  boardId: string;
  userId?: string | null;
  action: string;
  message: string;
  metadata?: Record<string, unknown> | null;
}

interface Activity {
  id: string;
  board_id: string;
  user_id: string | null;
  action: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export const logActivity = async ({
  boardId,
  userId,
  action,
  message,
  metadata,
}: LogActivityParams): Promise<Activity> => {
  const { rows } = await query<Activity>(
    `
      INSERT INTO activities (
        board_id,
        user_id,
        action,
        message,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        board_id,
        user_id,
        action,
        message,
        metadata,
        created_at
    `,
    [
      boardId,
      userId ?? null,
      action,
      message,
      metadata ? JSON.stringify(metadata) : null,
    ],
  );

  const activity = rows[0];

  emitToBoard(boardId, "activity:new", activity);

  return activity!;
};
