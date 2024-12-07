const express = require("express");
const router = express.Router();
const controller = require("./controllers.js")
const getShop = require('../middleware/getShop.js')

// Importing our controllers
const { 
    createShop,
    deleteShop,
    getShopById,
    updateShop,
    getAllShop
} = controller;

// making the routes
router.get('/all', getAllShop)
router.get("/:id", getShop, getShopById);
router.post("/", createShop);
router.put("/:id", getShop, updateShop)
router.delete("/:id", getShop, deleteShop)

module.exports = router;