const Order = require("./model.js");
const moment = require("moment");

const salesReport = async (req, res) => {
  const { shopId } = req.params;

  try {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Daily Sales
    const dailySales = await Order.aggregate([
      {
        $match: {
          shopId: shopId,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        },
      },
      {
        $group: {
          _id: null,
          total_amount: { $sum: "$total" },
        },
      },
    ]);

    // Weekly Sales
    const weeklySales = await Order.aggregate([
      {
        $match: {
          shopId: shopId,
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          total_amount: { $sum: "$total" },
        },
      },
    ]);

    // Monthly Sales
    const monthlySales = await Order.aggregate([
      {
        $match: {
          shopId: shopId,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total_amount: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      "Daily Sale": dailySales.length > 0 ? dailySales[0].total_amount : 0,
      "Weekly Sale": weeklySales.length > 0 ? weeklySales[0].total_amount : 0,
      "Monthly Sale": monthlySales.length > 0 ? monthlySales[0].total_amount : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const yearlyReport = async (req, res) => {
  const { shopId } = req.params;
  try {
    const orders = await Order.find({ shopId });

    // Calculate total sales for each month
    const monthlySales = {};
    orders.forEach((order) => {
      const month = moment(order.createdAt).format("MMMM");
      if (!monthlySales[month]) {
        monthlySales[month] = order.total;
      } else {
        monthlySales[month] += order.total;
      }
    });

    // Prepare response object
    const labels = [];
    const data = [];
    const currentMonth = moment().format("MMMM");
    const months = moment.months();
    const currentMonthIndex = months.indexOf(currentMonth);

    for (let i = 0; i <= currentMonthIndex; i++) {
      const month = months[i];
      labels.push(month);
      data.push(monthlySales[month] || 0);
    }

    res.json({ labels, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, shopId } = req.query;
    const countPromise = await Order.countDocuments({ shopId });
    const orderPromise = await Order.find({ shopId })
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .populate("customerId")
      .populate("items")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!orderPromise.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const result = await Promise.all([countPromise, orderPromise]);
    const count = result[0];
    const order = result[1];
    return res.status(200).json({
      data: order,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrderHistory = async (req, res) => {
    try {
      const { page = 1, limit = 10, userId } = req.query;
      const countPromise = await Order.countDocuments({ customerId:userId, isCheckOut:true });
      const orderPromise = await Order.find({ customerId:userId, isCheckOut:true  })
        .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      if (!orderPromise.length) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const result = await Promise.all([countPromise, orderPromise]);
      const count = result[0];
      const order = result[1];
      return res.status(200).json({
        data: order,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

const updateStatus = async (req, res) => {
  const { status, id } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ updation: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Order.find({
      customerId: userId,
      isCheckOut: false,
    }).sort({ createdAt: -1 });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { itemId, quantity, id, total } = req.body;

    await Order.findOneAndUpdate(
      { _id: id, "items.id": itemId },
      { $set: { "items.$.quantity": quantity, 'total': total } },
      { new: true }
    );

    return res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateItem = async (req, res) => {
    try {
      const { items, id, total } = req.body;
  
      await Order.findOneAndUpdate(
        { _id: id },
        { $set: { 'items': items, 'total': total } },
        { new: true }
      );
  
      return res.status(200).json({ message: "Items updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
  
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const orderCheckout = async (req,res)=>{
    try {
        const { isCheckOut, id, paymentMethod } = req.body;
    
        await Order.findOneAndUpdate(
          { _id: id },
          { $set: { 'isCheckOut': isCheckOut, 'paymentMethod': paymentMethod } },
          { new: true }
        );
    
        return res.status(200).json({ message: "Order checkout successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

//  Exporting the routes
module.exports = {
  salesReport,
  yearlyReport,
  getAllOrders,
  getOrderHistory,
  updateStatus,
  addToCart,
  getCartByUserId,
  updateQuantity,
  updateItem,
  deleteOrder,
  orderCheckout
};
