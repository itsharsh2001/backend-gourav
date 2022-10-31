import express from "express";
import { getAllCategories } from "../controllers/Category.js";
export const router = express.Router();

router.get("/category", getAllCategories);
