const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type:
  {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;