const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesOption
} = require("./controllers");

// Create a new category
router.post("/", createCategory);

// Get all categories
router.get("/", getAllCategories);
router.get('/option/:shopId', getAllCategoriesOption)

// Get a category by ID
router.get("/:id", getCategoryById);

// Update a category
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

module.exports = router;
