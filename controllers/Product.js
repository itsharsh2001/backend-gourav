import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const ITEM_PER_PAGE = req.query.page * req.query.limit;
    const skipUsers = (req.query.page - 1) * req.query.limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skipUsers)
      .limit(req.query.limit);
    const totalProducts = await Product.find().count();

    res.status(200).json({
      message: products,
      totalProducts: totalProducts,
      hasNextPage: ITEM_PER_PAGE < totalProducts,
      hasPreviousPage: req.query.page > 1,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ message: "Invalid Id" });
    return res.status(200).json({ message: product });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
      image: req.files.image.fileName,
    });

    return res.status(201).json({ message: newProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: product });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
