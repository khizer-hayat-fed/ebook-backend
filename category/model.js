const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    shopId: {
      type: mongoose.Types.ObjectId,
      ref: "Shops",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Categorys", categorySchema);

module.exports = Category;
