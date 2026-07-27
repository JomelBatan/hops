import type { NextFunction, Request, Response } from "express";
import { query } from "../config/db";
import { ApiError } from "../utils/ApiError";

export async function requireBoardAccess(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const boardId =
      req.params.boardId ||
      req.params.id ||
      req.body.board_id ||
      req.query.board_id;
    const userId = req.user!.id;

    if (!boardId) throw ApiError.badRequest("Board id is required");

    const { rows } = await query(
      `SELECT b.id, b.owner_id, m.role
        FROM boards b
        LEFT JOIN board_members m
        ON m.board_id = b.id AND m.user_id = $2
        WHERE b.id = $1`,
      [boardId, userId],
    );

    const board = rows[0];
    if (!board) throw ApiError.notFound("Board not found");

    const isOwner = board.owner_id === userId;
    if (!isOwner && !board.role) {
      throw ApiError.forbidden("You do not have access to this board");
    }

    req.board = {
      id: board.id,
      owner_id: board.owner_id,
      role: isOwner ? "owner" : board.role,
    };
    next();
  } catch (error) {
    console.error(error);
    _res
      .status(500)
      .json({ error: "Erorr on BoardAccess: [requireBoardAccess]" });
  }
}
