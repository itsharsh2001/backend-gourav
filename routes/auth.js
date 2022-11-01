import express from "express";
import {
  login,
  logout,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  updatePassword,
} from "../controllers/auth.js";

export const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/updatePassword", updatePassword);
