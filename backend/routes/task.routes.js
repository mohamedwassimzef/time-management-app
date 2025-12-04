import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createBulkTasks,
  createUserTask,
  deleteTasksByUser,
  DeleteAll,
  getTasksByUser,
  updateUserTask
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 Task route hit: ${req.method} ${req.path}`);
  next();
});

router.post("/", createTask);
router.post("/bulk", createBulkTasks);
router.post("/user", protect, createUserTask);


router.get("/", getTasks);
router.get("/user", protect, getTasksByUser);
router.get("/:id", getTaskById);

router.patch("/user", protect, updateUserTask);
router.patch("/:id", updateTask);


router.delete("/", DeleteAll);
router.delete("/user", protect, deleteTasksByUser);
router.delete("/:id", deleteTask);

export default router;
