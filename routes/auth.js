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
<<<<<<< HEAD
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
=======
router.get("/verifyOtp", verifyOtp);
router.get("/resendOtp", resendOtp);
router.get("/forgotPassword", forgotPassword);
router.get("/updatePassword", updatePassword);
>>>>>>> 8ff90b7d4dc634b1ff22a02e232cb6dc863c7436
