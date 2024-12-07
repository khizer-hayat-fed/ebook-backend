const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    shopId:{
      type: mongoose.Types.ObjectId,
      ref: "Shops",
    },
    orderId:{
        type: mongoose.Types.ObjectId,
        ref: "Orders",
      },
    rating: Number,
    remark: String
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
