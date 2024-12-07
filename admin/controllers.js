const Profile = require("../profile/model.js");
const User = require("../user/model.js");
const Shop = require("../shop/model.js");
const Review = require("../review/model.js");
const Category = require("../category/model.js");
const Product = require("../product/model.js");
const Order = require("../order/model.js")

// ****************** SHOPS API **************************
const getAllShop = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const countPromise = await Shop.countDocuments({});
    const shopPromise = await Shop.find({})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .populate("userId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!shopPromise.length) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const result = await Promise.all([countPromise, shopPromise]);
    const count = result[0];
    const shop = result[1];
    return res.status(200).json({
      data: shop,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllShopDropdown = async (req, res) => {
  try {
    const shop = await Shop.find({status:'Approve'})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .exec();

    return res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createShop = async (req, res) => {
  try {
    const newShop = await Shop.create(req.body);
    res.status(201).json(newShop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateShop = async (req, res) => {
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
};

const deleteShop = async (req, res) => {
  try {
    await Shop.findByIdAndDelete(res.shop._id);
    res.json({ message: "Deleted shop" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateShopStatus = async (req, res) => {
  try {
    const { shopId, status } = req.body;
    await Shop.findByIdAndUpdate(shopId, { status: status }, { new: true });
    return res.status(200).json({ message: "Status has been changed!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReviewByShopId = async (req, res) => {
  try {
    const review = await Review.find({ shopId: req.params.id }).populate(
      "userId"
    );

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAverageRating = async (req, res) => {
  const { shopId } = req.params;

  try {
    const reviews = await Review.find({ shopId });

    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });

    const averageRating = (totalRating / reviews.length) * (5 / 10);

    res.json(averageRating);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ****************** MANAGER API **************************
//  @desc   :  Get All Managers
//  @Route  :  GET /api/admin/manager
//  @access :  Public
const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ type: "manager" });

    // Return the found managers
    return res.status(200).json({ data: managers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Register Manager
//  @Route  :  POST /api/admin/manager
//  @access :  Public
const addManager = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      email,
      password,
      type,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        type: user.type,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Update Manager
//  @Route  :  PUT /api/admin/manager
//  @access :  Public
const updateManager = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the email field
    user.email = email;
    await user.save();

    return res.status(200).json({ message: "User email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Delete the Manager
//  @Route  :  DELETE /api/admin/manager/:userId
//  @access :  Public
const deleteManager = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************** Customer API ****************************
//  @desc   :  Get All customers
//  @Route  :  GET /api/admin/customer
//  @access :  Public
const getAllCustomer = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const countPromise = await Profile.countDocuments({});
    const customerPromise = await Profile.find({})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .populate("userId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!customerPromise.length) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const result = await Promise.all([countPromise, customerPromise]);
    const count = result[0];
    const customer = result[1];
    return res.status(200).json({
      data: customer,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Register Customer
//  @Route  :  POST /api/admin/customer
//  @access :  Public
const addCustomer = async (req, res) => {
  try {
    const { email, password, type, name, contact, gender, address } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = await User.create({
      email,
      password,
      type,
    });

    await Profile.create({
      userId: user?._id,
      name,
      number: contact,
      gender,
      address,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        type: user.type,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Update Customer
//  @Route  :  PUT /api/admin/customer
//  @access :  Public
const updateCustomer = async (req, res) => {
  try {
    const { id, body } = req.body;

    // Find the user by ID
    const user = await Profile.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the email field
    user.name = body?.name;
    user.address = body?.address;
    user.contact = body?.contact;
    user.gender = body?.gender;
    await user.save();

    return res.status(200).json({ message: "User email updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  @desc   :  Delete the Customer
//  @Route  :  DELETE /api/admin/customer/:userId
//  @access :  Public
const deleteCustomer = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user
    await Profile.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************** Category API ****************************
const getAllCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const countPromise = await Category.countDocuments({});
    const categoryPromise = await Category.find({})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!categoryPromise.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    const result = await Promise.all([countPromise, categoryPromise]);
    const count = result[0];
    const category = result[1];
    return res.status(200).json({
      data: category,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ******************************** Items API ****************************
const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const countPromise = await Product.countDocuments({});
    const productPromise = await Product.find({})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!productPromise.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await Promise.all([countPromise, productPromise]);
    const count = result[0];
    const product = result[1];
    return res.status(200).json({
      data: product,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ******************************** Order API ****************************
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const countPromise = await Product.countDocuments({});
    const orderPromise = await Order.find({})
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .populate('shopId')
      .populate('customerId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (!orderPromise.length) {
      return res.status(404).json({ message: "Product not found" });
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
    return res.status(500).json({ error: error.message });
  }
};

//  Exporting the routes
module.exports = {
  createShop,
  updateShop,
  deleteShop,
  updateShopStatus,
  getAllShop,
  getAllShopDropdown,
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
  getAllOrders
};
