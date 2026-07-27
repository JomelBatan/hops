import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { searchUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", requireAuth, searchUser);

export default router;
