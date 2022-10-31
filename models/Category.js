import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  category: String,
  subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
  isApproved: {
    type: "Boolean",
    default: false,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
