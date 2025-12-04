import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  
  date: {
    type: Date,
    required: true,
    unique: true, // ensures one document per day
  },
  user :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references User model
    required: true,
  }
});
// ensure one document per user per day

daySchema.index({ date: 1, user: 1 }, { unique: true });


export default mongoose.model("Day", daySchema);
