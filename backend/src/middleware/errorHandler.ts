import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../utils/ApiError.js";

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.statusCode ?? 500;

  if (status >= 500) {
    console.error("Server error", err);
  }

  if (err.code === "23505") {
    return res.status(409).json({
      error: "Resource already exist",
    });
  }

  return res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Route Not Found" });
}
