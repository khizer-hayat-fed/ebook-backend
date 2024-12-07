const express = require("express");
const router = express.Router();
const controller = require("./controllers.js")

// Importing our controllers
const { 
    salesReport,
    yearlyReport,
    getAllOrders,
    updateStatus,
    addToCart,
    getCartByUserId,
    updateQuantity,
    updateItem,
    deleteOrder,
    orderCheckout,
    getOrderHistory
} = controller;

// making the routes
router.get("/sale/:shopId", salesReport);
router.get("/yearly/:shopId", yearlyReport)
router.get('/cart/:userId', getCartByUserId)
router.get('/', getAllOrders)
router.get('/history', getOrderHistory)
router.put('/status', updateStatus)
router.put('/quantity', updateQuantity)
router.put('/items', updateItem)
router.put('/checkout', orderCheckout)
router.post('/cart', addToCart)
router.delete('/:id', deleteOrder)

module.exports = router;