const Category = require("./model"); // Assuming your model file is named Category.js

// Create a new category
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, shopId } = req.query;
    const countPromise = await Category.countDocuments({
      shopId
    });
    const categoriesPromise = await Category.find({ shopId })
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const result = await Promise.all([countPromise, categoriesPromise]);
    const count = result[0];
    const categories = result[1];
    res.status(200).json({
      data: categories,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategoriesOption = async (req, res) => {
  try {
    const { shopId } = req.params;

    const categories = await Category.find({ shopId })
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .exec();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getAllCategoriesOption,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
