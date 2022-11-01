import express from "express";
import {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/Category.js";
export const router = express.Router();

router.get("/category", getCategories);
router.post("/category", addCategory);
router.delete("/category/:id", deleteCategory);
router.patch("/category/:id", updateCategory);
