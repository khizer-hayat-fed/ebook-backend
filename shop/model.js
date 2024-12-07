const mongoose = require("mongoose");

const shopSchema = mongoose.Schema(
    {
        name: {
          type: String
        },
        description: {
          type: String
        },
        address: {
          type: String,
        },
        contact: {
          type: String
        },
        email: {
          type: String
        },
        status: {
          type: String,
          default: 'Pending'
        },
        location: {},
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
        },
      },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shops", shopSchema);

module.exports = Shop;
