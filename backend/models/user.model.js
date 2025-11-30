import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
    lastName: {
    type: String,
    required: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  dayKeyList: {
    type: [String],
    default: [],
    },
},{timestamps:true});

//hash password before saving
userSchema.pre("save", async function (next) {
  // only hash if password is modified or new   
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;