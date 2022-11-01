import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  category: String,
  subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
  isApproved: {
    type: "Boolean",
    default: false,
  },
});

export default mongoose.model("Category", categorySchema);
