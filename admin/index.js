const express = require("express");
const router = express.Router();
const controller = require("./controllers.js")
const getShop = require('../middleware/getShop.js')

// Importing our controllers
const {
    createShop,
    updateShop,
    deleteShop,
    getAllShop,
    updateShopStatus,
    getReviewByShopId,
    getAverageRating,
    getAllManagers,
    addManager,
    deleteManager,
    updateManager,
    getAllCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getAllCategory,
    getAllItems,
    getAllOrders,
    getAllShopDropdown
} = controller;

// Routes
router.get('/shop/all', getAllShop)
router.get('/shop/dropdown', getAllShopDropdown)
router.get('/category/all', getAllCategory)
router.get('/items/all', getAllItems)
router.get('/order/all', getAllOrders)
router.get('/shop/review/:id', getReviewByShopId)
router.get('/shop/rating/:shopId', getAverageRating)
router.post("/shop", createShop);
router.put('/shop/status', updateShopStatus)
router.put("/shop/:id", getShop, updateShop)
router.delete("/shop/:id", getShop, deleteShop)
router.get('/manager', getAllManagers);
router.get('/customer', getAllCustomer);
router.post('/manager', addManager);
router.post('/customer', addCustomer);
router.put('/manager', updateManager);
router.put('/customer', updateCustomer);
router.delete('/manager/:userId', deleteManager);
router.delete('/customer/:userId', deleteCustomer);

module.exports = router;