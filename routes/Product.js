import express from "express";
import {
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
} from "../controllers/Product.js";

export const router = express.Router();
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.includes("image")) cb(null, "uploads/products/images");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
]);

router.get("/product", getProducts);
router.post("/product", upload, addProduct);
router.get("/product/:id", getProduct);
router.delete("/product/:id", deleteProduct);
router.patch("/product/:id", updateProduct);
