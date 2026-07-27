import express from "express";
import { requireBoardAccess } from "../middleware/boardAccess.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  addMember,
  createBoard,
  deleteBoard,
  getActivity,
  getBoard,
  listBoard,
  removeMember,
  updateBoard,
} from "../controllers/board.controller.js";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/column.controller.js";
import {
  createTask,
  deleteTask,
  listTask,
  moveTask,
  updateTask,
} from "../controllers/task.controller.js";
import {
  breakDownTasks,
  generateTasks,
  summarizeBoard,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listBoard);
router.post("/", createBoard);

router.get("/:boardId", requireBoardAccess, getBoard);
router.patch("/:boardId", requireBoardAccess, updateBoard);
router.delete("/:boardId", requireBoardAccess, deleteBoard);

router.get("/:boardId/activity", requireBoardAccess, getActivity);

router.post("/:boardId/members", requireBoardAccess, addMember);
router.delete("/:boardId/members/:userId", requireBoardAccess, removeMember);

router.post("/:boardId/columns", requireBoardAccess, createColumn);
router.patch("/:boardId/columns/:columnId", requireBoardAccess, updateColumn);
router.delete("/:boardId/columns/:columnId", requireBoardAccess, deleteColumn);

router.get("/:boardId/tasks", requireBoardAccess, listTask);
router.post("/:boardId/tasks", requireBoardAccess, createTask);
router.patch("/:boardId/task/:taskId", requireBoardAccess, updateTask);
router.patch("/:boardId/tasks/:taskId/move", requireBoardAccess, moveTask);
router.delete("/:boardId/tasks/:taskId", requireBoardAccess, deleteTask);

router.post("/:boardId/ai/generate-tasks", requireBoardAccess, generateTasks);
router.post("/:boardId/ai/breakdown", requireBoardAccess, breakDownTasks);
router.post("/:boardId/ai/summary", requireBoardAccess, summarizeBoard);

export default router;
