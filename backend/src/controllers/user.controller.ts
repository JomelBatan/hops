import { query } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { emitToBoard, logActivity } from "../realtime/index";
import type { Request, Response } from "express";

export async function searchUser(req: Request, res: Response) {
  const q = ((req.query.q as string) || "").trim();
  if (q.length < 2) return res.json({ users: [] });

  const { rows } = await query(
    `
        SELECT id, name, email, avatar_url
            FROM users
        WHERE name ILIKE $1 OR email ILIKE $1
        ORDER BY name ASC
        LIMIT 10`,
    [`%${q}%`],
  );
  res.json({ users: rows });
}
