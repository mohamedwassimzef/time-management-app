import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// User registration and authentication controllers
export const registerUser = async (req, res) => {
    console.log("Register user request body:", req.body);
  try {
    const { firstName, lastName, email, password, birthdate } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, email, password, birthdate });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    console.log("✅ Registered user:", newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
    try {
    const { email, password } = req.body;
    //check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    //check if password matches
    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate JWT token
    const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    
    // Get user without password
    const userWithoutPassword = await User.findById(existingUser._id).select("-password");
    res.status(200).json({ token, user: userWithoutPassword });
    console.log("✅ User logged in:", userWithoutPassword);

    
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {

    try {
    const userId = req.user.userId;
    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(existingUser);

    console.log("✅ Retrieved user profile:", existingUser);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
    //get the user id from the middleware
    const userId = req.user.userId;
    //get the updates from the request body
    const updates = req.body;
    //generate hashed password if password is being updated
    if (updates.password) {
        const salt = await bcrypt.genSalt(10);

        updates.password = await bcrypt.hash(updates.password, salt);
    }
    //find the new user data and update 
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
    console.log("✅ Updated user profile:", updatedUser);

    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
    const userId = req.user.userId;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });

    }
    res.status(200).json({ message: "User deleted successfully" });
    console.log("✅ Deleted user:", deletedUser);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};


export const bigRegistration = async (req, res) => {
  console.log("Register user request body:", req.body);

  try {
    const list = req.body.users; 
    const results = [];

    for (const userData of list) {
      const { firstName, lastName, email, password, birthdate } = userData;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        results.push({
          email,
          status: "skipped",
          reason: "User already exists"
        });
        continue;
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        password,       // hashing done in your model
        birthdate
      });

      await newUser.save();

      results.push({
        email,
        status: "created",
        userId: newUser._id
      });
    }

    // Final single response
    res.status(201).json({
      message: "Batch registration completed",
      results
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

