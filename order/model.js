const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    orderId:Number,
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shops'
    },
    items: [{}],
    status: String,
    remarks: {type:Boolean, default:false},
    total: Number,
    isCheckOut:{
      type: Boolean,
      default:false
    },
    paymentMethod:{
      type:String,
      default:''
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Orders", OrderSchema);

module.exports = Order;
