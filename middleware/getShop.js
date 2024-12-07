const Shop = require("../shop/model"); // Assuming your model file is named Shop.js

async function getShop(req, res, next) {
  let shop;
  try {
    shop = await Shop.findById(req.params.id);
    if (shop == null) {
      return res.status(404).json({ message: "Cannot find shop" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  res.shop = shop;
  next();
}

module.exports = getShop;
