const express = require("express");
const router = express.Router();
const controller = require("./controllers.js")
const {upload} = require("../middleware/multerMiddlewares")

// Importing our controllers
const { 
    createProduct,
    getProductById,
    getProductByShopId,
    updateProduct,
    deleteProduct,
    getAllProductByShopId
} = controller;

// making the routes
router.get("/manager", getProductByShopId);
router.get('/all/:shopId', getAllProductByShopId)
router.get("/:id", getProductById);
router.post("/", upload.single("photo"), createProduct);
router.put("/", upload.single("photo"), updateProduct)
router.delete("/:id", deleteProduct)

module.exports = router;