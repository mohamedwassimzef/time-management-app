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
    min: 0, // highest priority (most urgent)
    default: 5, // low priority by default (least urgent)
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references User model
    required: true,
  }
});

export default mongoose.model("Task", taskSchema);

