const express = require("express");
const router = express.Router();
const controller = require("./controllers.js");

// Importing our controllers
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById
} = controller;

// Defining routes
router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReviewById);
router.delete("/:id", deleteReviewById);

module.exports = router;
