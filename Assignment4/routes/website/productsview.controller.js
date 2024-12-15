const express = require('express');
let router = express.Router();
const Product = require("../../models/products.model");

router.get("/:id", async (req, res) => {
  let products = await Product.find({brand:req.params.id});
  res.render('productsPage',{
    products
  });
});
  
module.exports = router;
