const Review = require("./model.js");
const Order = require('../order/model.js')

// Create a new review
const createReview = async (req, res) => {
  try {
    const { userId, shopId, orderId, rating, remark } = req.body;
    const newReview = new Review({
      userId,
      shopId,
      orderId,
      rating,
      remark,
    });
    const savedReview = await newReview.save();

    await Order.findByIdAndUpdate(
      orderId,
      { 'remarks': true },
      { new: true }
    );
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  const { page = 1, limit = 10, shopId } = req.query;
  try {
    const countPromise = await Review.countDocuments({ shopId });
    const reviewPromise = await Review.find({ shopId })
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!reviewPromise.length) {
      return res.status(404).json({ message: "Review not found" });
    }

    const result = await Promise.all([countPromise, reviewPromise]);
    const count = result[0];
    const reviews = result[1];

    return res.status(200).json({
      data: reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a review by ID
const updateReviewById = async (req, res) => {
  try {
    const { rating, remark } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, remark },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review by ID
const deleteReviewById = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exporting the routes
module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
