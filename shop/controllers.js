const Shop = require("./model.js");
const Review = require("../review/model.js")

const createShop = async (req,res)=>{
    try {
        const newShop = await Shop.create(req.body);
        res.status(201).json(newShop);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

const getShopById = async(req,res)=>{
    res.json(res.shop);
}

const updateShop = async(req,res)=>{
    if (req.body.name != null) {
        res.shop.name = req.body.name;
      }
      if (req.body.description != null) {
        res.shop.description = req.body.description;
      }
      if (req.body.address != null) {
        res.shop.address = req.body.address;
      }
      if (req.body.contact != null) {
        res.shop.contact = req.body.contact;
      }
      if (req.body.email != null) {
        res.shop.email = req.body.email;
      }
      if (req.body.status != null) {
        res.shop.status = req.body.status;
      }
      if (req.body.location != null) {
        res.shop.location = req.body.location;
      }
      if (req.body.blocked != null) {
        res.shop.blocked = req.body.blocked;
      }
      try {
        const updatedShop = await res.shop.save();
        res.json(updatedShop);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

const deleteShop = async(req, res)=>{
    try {
        await res.shop.remove();
        res.json({ message: "Deleted shop" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const getAllShop = async (req, res) => {
  try {
    // Step 1: Fetch all approved shops
    const shops = await Shop.find({ status: 'Approve' });

    // Step 2: Calculate the average rating for each shop
    const shopIds = shops.map(shop => shop._id);
    const ratings = await Review.aggregate([
      { $match: { shopId: { $in: shopIds } } },
      {
        $group: {
          _id: "$shopId",
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    // Create a map of shopId to averageRating
    const ratingsMap = ratings.reduce((acc, curr) => {
      acc[curr._id] = curr.averageRating;
      return acc;
    }, {});

    // Step 3: Merge the average ratings with the corresponding shops
    const shopsWithRatings = shops.map(shop => ({
      ...shop.toObject(),
      averageRating: ratingsMap[shop._id] || 0 // Default to 0 if no ratings found
    }));

    res.json(shopsWithRatings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Exporting the routes
module.exports = {
    createShop,
    getShopById,
    updateShop,
    deleteShop,
    getAllShop
  };