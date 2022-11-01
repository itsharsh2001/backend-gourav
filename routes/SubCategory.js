import express from "express";
import {
  getSubCategories,
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "../controllers/SubCategory.js";
export const router = express.Router();

router.get("/subcategory", getSubCategories);
router.post("/subcategory", addSubCategory);
router.delete("/subcategory/:id", deleteSubCategory);
router.patch("/subcategory/:id", updateSubCategory);
