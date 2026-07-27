import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { searchUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/search", requireAuth, searchUser);

export default router;
