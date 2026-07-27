import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./auth.routes.js";
import boardRoutes from "./board.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

router.use("/auth", authRoutes);
router.use("/boards", boardRoutes);
router.use("/users", userRoutes);

export default router;
