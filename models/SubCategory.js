import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema({
  category: String,
  isApproved: {
    type: "Boolean",
    default: false,
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
