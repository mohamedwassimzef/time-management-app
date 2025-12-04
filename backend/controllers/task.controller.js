import Task from "../models/task.model.js";
import mongoose from "mongoose";

// Create a new task
export const createTask = async (req, res) => {
  console.log("🔵 CREATE TASK ENDPOINT HIT");
  console.log("📥 Request body:", req.body);
  console.log("📥 Request headers:", req.headers);
  try {
    const task = new Task(req.body); // id is auto-generated
    console.log("🟡 Task object created:", task);
    await task.save();
    console.log("✅ Created task:", task);
    res.status(201).json(task);
  } catch (error) {
    console.log("❌ Error creating task:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks (sorted by priority: lowest first)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priority: -1 });
    res.status(200).json(tasks);
    console.log("✅ Retrieved tasks:");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUserTask = async (req, res) => {
  try {
    console.log("🔵 user ID: " , req.user.userId);
    console.log("🔵 task: : " ,req.body);
    const task = new Task({ ...req.body, user: req.user.userId }); // id is auto-generated
    console.log("🟡 User Task object created:", task);
    await task.save();
    console.log("✅ Created user task:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error retrieving tasks for user:", error);
    res.status(500).json({ message: error.message });
  }
}

export const getTasksByUser = async (req, res) => {
  try {
    console.log("🔵 GET TASKS BY USER ENDPOINT HIT");
    console.log("📥 req.user.userId:", req.user.userId);
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const tasks = await Task.find({ user: userId }).sort({ priority: -1 });
    res.status(200).json(tasks);
    console.log("✅ Retrieved tasks for user:", req.user.userId);

  } catch (error) {
    console.error("❌ Error retrieving tasks for user:", error);
    res.status(500).json({ message: error.message });
  }
};



export const DeleteAll = async (req, res) => {
  try {
    const result = await Task.deleteMany({});
    res.status(200).json({ message: `${result.deletedCount} tasks deleted.` });
    console.log("✅ Deleted all tasks. Count:", result.deletedCount);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const deleteTasksByUser = async (req, res) => {
  try {
    console.log("🔵 DELETE TASKS BY USER ENDPOINT HIT");
    console.log("📥 req.user.userId:", req.user.userId);
    
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const result = await Task.deleteMany({ user: userId });
    
    res.status(200).json({ message: `${result.deletedCount} tasks deleted.` });
    console.log("✅ Deleted", result.deletedCount, "tasks for user:", req.user.userId);
  } catch (error) {
    console.error("❌ Error deleting tasks for user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get one task by id (UUID)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id }).sort({ priority: -1 });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
    console.log("✅ Retrieved task:", task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task by id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
    console.log("✅ Updated task:", task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserTask = async (req, res) => {
  try {
    console.log("🔵 UPDATE USER TASK ENDPOINT HIT");
    const task = await Task.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
    console.log("🟡 Task after update attempt:", task);
    res.status(200).json(task);
    console.log("✅ Updated user task:", task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};
// Delete a task by id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.body.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
    console.log("✅ Deleted task:", task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// routes/taskRoutes.js
export const createBulkTasks = async (req, res) => {
  try {
    const tasks = await Task.insertMany(req.body);
    res.status(201).json(tasks);
    console.log("✅ Created bulk tasks:");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

