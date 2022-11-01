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
router.get("/verifyOtp", verifyOtp);
router.get("/resendOtp", resendOtp);
router.get("/forgotPassword", forgotPassword);
router.get("/updatePassword", updatePassword);
