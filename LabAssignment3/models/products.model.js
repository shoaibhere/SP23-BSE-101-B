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
  brand:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage:{
    type: String,
    required: true
  }
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;