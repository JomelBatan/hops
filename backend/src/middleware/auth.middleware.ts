import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import type { NextFunction, Request, Response } from "express";
import type { User, Board } from "../type/index.js";

type UserPayload = Omit<User, "avatar_url" | "created_at" | "password_hash">;
type BoardPayload = { id: string; role: string; owner_id: string };
// Extend Express's Request interface globally
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      board?: BoardPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  console.log("Token: ", token);
  if (!token) throw ApiError.unauthorized("Missing authentication token");

  const decoded = verifyToken(token);
  req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
  next();
}
