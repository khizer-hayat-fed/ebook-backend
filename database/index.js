const mongoose = require("mongoose");
const fs = require("fs");

const database = async () => {

  mongoose
    .connect("mongodb+srv://shoaib:shoaibjamil43@cluster0.gxfrpaw.mongodb.net/food-shop?authSource=admin&compressors=zlib&retryWrites=true&w=majority&ssl=true")
    .then(() => console.log("Connected to Mongo...."))
    .catch((error) => {
          console.error("Error connecting to MongoDB:", error.message);
      throw error;

    })
};

module.exports = database;
