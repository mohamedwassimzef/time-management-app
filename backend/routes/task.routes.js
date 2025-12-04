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
  getTasksByUser
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
router.delete("/user", protect, deleteTasksByUser);
router.get("/:id", getTaskById);


router.patch("/:id", updateTask);


router.delete("/:id", deleteTask);
router.delete("/", DeleteAll);

export default router;
