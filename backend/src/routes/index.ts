import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./auth.routes";
import boardRoutes from "./board.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/users", userRoutes);

export default router;
