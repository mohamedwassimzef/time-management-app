import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // ensures one document per day
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // references Task model
    },
  ],
});

export default mongoose.model("Day", daySchema);
