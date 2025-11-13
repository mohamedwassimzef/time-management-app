import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const taskSchema = new mongoose.Schema({
  id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: Number,
    min: 0, // highest priority
    default: 5, // lowest priority by default
  },
  deadline: {
    type: Date, // includes date + time
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "done"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Task", taskSchema);

