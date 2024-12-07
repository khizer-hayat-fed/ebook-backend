const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    shopId:{
      type: mongoose.Types.ObjectId,
      ref: "Shops",
    },
    name: {
      type: String,
      require: true,
    },
    photo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      require: true,
    },
    price:{
      type: Number,
      require:true
    },
    deliveryTime: {
      type: String,
      require: true,
    },
    category:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
