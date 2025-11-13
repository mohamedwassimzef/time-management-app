import Day from "../models/days.model.js";
import Task from "../models/task.model.js";

// Get all days
export const getDays = async (req, res) => {
  try {
    const days = await Day.find().populate("tasks");
    res.status(200).json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one day by date
export const getDayByDate = async (req, res) => {
  try {
    const day = await Day.findOne({ date: req.params.date }).populate("tasks");
    if (!day) return res.status(404).json({ message: "Day not found" });
    res.status(200).json(day);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new day
export const createDay = async (req, res) => {
  try {
    const day = new Day(req.body);
    await day.save();
    res.status(201).json(day);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a task to a day
export const addTaskToDay = async (req, res) => {
  try {
    const { taskId } = req.body;
    const day = await Day.findOne({ date: req.params.date });
    if (!day) return res.status(404).json({ message: "Day not found" });

    // Add task if not already present
    if (!day.tasks.includes(taskId)) day.tasks.push(taskId);
    await day.save();

    const populatedDay = await day.populate("tasks");
    res.status(200).json(populatedDay);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Remove a task from a day
export const removeTaskFromDay = async (req, res) => {
  try {
    const { taskId } = req.body;
    const day = await Day.findOne({ date: req.params.date });
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.tasks = day.tasks.filter(id => id.toString() !== taskId);
    await day.save();

    const populatedDay = await day.populate("tasks");
    res.status(200).json(populatedDay);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
