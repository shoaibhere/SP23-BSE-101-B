const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandImage: {
    type: String,
    required: true, 
  },
  brandName: {
    type: String,
    required: true, 
  }
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
