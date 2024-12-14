const express = require("express");
let router = express.Router();
const Product = require("../../models/products.model");
const Brand = require("../../models/brands.model");
router.get("/admin/products", async(req,res)=>{
  let products = await Product.find();
  let brands = await Brand.find();
  return res.render("./admin/products",{
    layout: "adminLayout",
    pageTitle:"Products Management",
    products,
    brands,
  });
});

module.exports = router;