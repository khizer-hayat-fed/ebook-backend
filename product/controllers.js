const Product = require("./model.js");

const createProduct = async (req, res) => {
  try {
    const photo = req.file ? req.file?.filename : null
    const product = new Product({...req.body, photo});
    await product.save();
    res.status(201).json({ data: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductByShopId = async (req, res) => {
  try {
    const { page = 1, limit = 10, shopId } = req.query;
    const countPromise = await Product.countDocuments({ shopId});
    const productPromise = await Product.find({ shopId })
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const result = await Promise.all([countPromise, productPromise]);
    const count = result[0];
    const product = result[1];
    return res
      .status(200)
      .json({
        data: product,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const body = req.body;
  const id = body?.id
  const photo = req.file ? req.file?.filename : null
  try {
    const product = await Product.findByIdAndUpdate(id, {...body, photo}, {
      new: true,
    });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllProductByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;
    const product = await Product.find({ shopId })
      .sort({ createdAt: -1 }) //sorting in descending order i.e. new journey at top
      .exec();

    return res
      .status(200)
      .json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//  Exporting the routes
module.exports = {
  createProduct,
  getProductById,
  getProductByShopId,
  getAllProductByShopId,
  updateProduct,
  deleteProduct,
};
