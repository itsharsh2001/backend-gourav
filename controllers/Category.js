import Category from "../models/Category.js";

export const getCategories = async (_, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ message: categories });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    if (!req.body.category)
      return res.status(400).json({ message: "Category is Required" });

    const isCategoryExist = await Category.findOne({
      category: req.body.category,
    });

    if (isCategoryExist)
      return res.status(400).json({ message: "Category Already Exist" });

    const newCategory = await Category.create({ category: req.body.category });
    return res.status(201).json({ message: newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: category });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
