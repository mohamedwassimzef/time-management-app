import express from "express";
import {
  getDays,
  getDayByDate,
  createDay,
  addTaskToDay,
  removeTaskFromDay,
} from "../controllers/day.controller.js";

const router = express.Router();

// CRUD for days
router.get("/", getDays);
router.get("/:date", getDayByDate);
router.post("/", createDay);

// Manage tasks in a day
router.post("/:date/tasks", addTaskToDay);
router.delete("/:date/tasks", removeTaskFromDay);

export default router;
