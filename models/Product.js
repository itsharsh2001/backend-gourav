import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  inStock: Number,
  soldItems: Number,
  images: String,
  videos: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model("Product", productSchema);
