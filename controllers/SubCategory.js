import SubCategory from "../models/SubCategory.js";

export const getSubCategories = async (_, res) => {
  try {
    const subCategories = await SubCategory.find();
    return res.status(200).json({ message: subCategories });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const addSubCategory = async (req, res) => {
  try {
    if (!req.body.category)
      return res.status(400).json({ message: "Category is Required" });

    const isSubCategoryExist = await SubCategory.findOne({
      ...req.body,
    });
    if (isSubCategoryExist)
      return res.status(400).json({ message: "Category Already Exist" });
    const newCategory = await SubCategory.create({
      category: req.body.category,
    });
    return res.status(201).json({ message: newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const category = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json({ message: category });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
