import express from "express";
import {
  registerUser,
  loginUser,
  bigRegistration,
  updateUserProfile,
  deleteUser
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
//Password123!
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/big", bigRegistration);
router.patch("/update", protect, updateUserProfile);
router.delete("/delete", protect, deleteUser);
export default router;