import Task from "../models/task.model.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body); // id is auto-generated
    await task.save();
    res.status(201).json(task);
    console.log("✅ Created task:", task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks (sorted by priority: lowest first)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priority: 1 });
    res.status(200).json(tasks);
    console.log("✅ Retrieved tasks:");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one task by id (UUID)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
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

// Delete a task by id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
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

